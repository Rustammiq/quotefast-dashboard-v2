// lib/glm-service.ts

import { logger } from './logger';

export interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GLMRequest {
  model: string;
  messages: GLMMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface GLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: GLMMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface CodeGenerationRequest {
  prompt: string;
  language?: string;
  context?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface CodeRefactoringRequest {
  code: string;
  instructions: string;
  language?: string;
}

class GLMService {
  private apiKey: string;
  private baseUrl: string;
  private model = 'glm-4-plus';

  constructor() {
    this.apiKey = process.env.GLM_API_KEY || '';
    this.baseUrl = process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';
    
    if (!this.apiKey) {
      logger.warn('GLM API key not found in environment variables', 'glm-service');
    }
  }

  private async makeRequest(request: GLMRequest): Promise<GLMResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GLM API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data: GLMResponse = await response.json();
      logger.info('GLM API request successful', 'glm-service', { 
        model: data.model, 
        tokens: data.usage.total_tokens 
      });
      
      return data;
    } catch (error) {
      logger.error('GLM API request failed', 'glm-service', error);
      throw error;
    }
  }

  async generateCode(request: CodeGenerationRequest): Promise<string> {
    const { prompt, language = 'javascript', context = '', temperature = 0.3, maxTokens = 2000 } = request;
    
    const systemPrompt = `You are an expert software developer and coding assistant. 
Generate clean, efficient, and well-documented code in ${language}.
Follow best practices and modern coding standards.
Provide only the code without explanations unless specifically asked.
${context ? `Context: ${context}` : ''}`;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const glmRequest: GLMRequest = {
      model: this.model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    try {
      const response = await this.makeRequest(glmRequest);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Code generation failed', 'glm-service', error);
      throw new Error('Failed to generate code');
    }
  }

  async refactorCode(request: CodeRefactoringRequest): Promise<string> {
    const { code, instructions, language = 'javascript' } = request;
    
    const systemPrompt = `You are an expert software developer specializing in code refactoring.
Analyze the provided ${language} code and refactor it according to the instructions.
Maintain the original functionality while improving code quality, readability, and performance.
Provide the refactored code with brief explanations of the changes made.`;

    const userPrompt = `Original code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nRefactoring instructions: ${instructions}`;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const glmRequest: GLMRequest = {
      model: this.model,
      messages,
      temperature: 0.2,
      max_tokens: 3000,
    };

    try {
      const response = await this.makeRequest(glmRequest);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Code refactoring failed', 'glm-service', error);
      throw new Error('Failed to refactor code');
    }
  }

  async explainCode(code: string, language = 'javascript'): Promise<string> {
    const systemPrompt = `You are an expert software developer and educator.
Analyze the provided ${language} code and provide a clear, comprehensive explanation.
Explain what the code does, how it works, and any important patterns or concepts used.
Structure your explanation with bullet points for clarity.`;

    const userPrompt = `Please explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const glmRequest: GLMRequest = {
      model: this.model,
      messages,
      temperature: 0.3,
      max_tokens: 1500,
    };

    try {
      const response = await this.makeRequest(glmRequest);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Code explanation failed', 'glm-service', error);
      throw new Error('Failed to explain code');
    }
  }

  async debugCode(code: string, error: string, language = 'javascript'): Promise<string> {
    const systemPrompt = `You are an expert software developer and debugger.
Analyze the provided ${language} code and error message to identify and fix the issue.
Explain the problem and provide the corrected code with clear comments.`;

    const userPrompt = `Code with error:\n\`\`\`${language}\n${code}\n\`\`\`\n\nError message: ${error}\n\nPlease identify the issue and provide a fix.`;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const glmRequest: GLMRequest = {
      model: this.model,
      messages,
      temperature: 0.2,
      max_tokens: 2000,
    };

    try {
      const response = await this.makeRequest(glmRequest);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Code debugging failed', 'glm-service', error);
      throw new Error('Failed to debug code');
    }
  }

  async optimizeCode(code: string, language = 'javascript'): Promise<string> {
    const systemPrompt = `You are an expert software developer specializing in performance optimization.
Analyze the provided ${language} code and optimize it for better performance, memory usage, and efficiency.
Maintain the original functionality while improving the code.
Provide the optimized code with explanations of the optimizations made.`;

    const userPrompt = `Please optimize this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const glmRequest: GLMRequest = {
      model: this.model,
      messages,
      temperature: 0.2,
      max_tokens: 2500,
    };

    try {
      const response = await this.makeRequest(glmRequest);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Code optimization failed', 'glm-service', error);
      throw new Error('Failed to optimize code');
    }
  }

  async generateTests(code: string, language = 'javascript', testFramework = 'jest'): Promise<string> {
    const systemPrompt = `You are an expert software developer specializing in testing.
Generate comprehensive unit tests for the provided ${language} code using ${testFramework}.
Include test cases for happy paths, edge cases, and error handling.
Ensure tests are well-structured and follow testing best practices.`;

    const userPrompt = `Please generate ${testFramework} tests for this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const glmRequest: GLMRequest = {
      model: this.model,
      messages,
      temperature: 0.3,
      max_tokens: 2000,
    };

    try {
      const response = await this.makeRequest(glmRequest);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Test generation failed', 'glm-service', error);
      throw new Error('Failed to generate tests');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const glmService = new GLMService();

// Export class for testing
export { GLMService };