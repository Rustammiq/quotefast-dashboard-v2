// lib/gemini-service.ts

import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { logger } from '../../utils/helpers/logger';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface GeminiRequest {
  model: string;
  contents: Array<{
    role: 'user' | 'model';
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
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

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private apiKey: string;
  private modelName = 'gemini-1.5-pro'; // Using Gemini 1.5 Pro (most capable available model)

  constructor() {
    this.apiKey = process.env.GOOGLE_GEMINI_API_KEY || '';

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
      logger.info('Gemini service initialized', 'gemini-service', { model: this.modelName });
    } else {
      logger.warn('Gemini API key not found in environment variables', 'gemini-service');
    }
  }

  private async makeRequest(prompt: string, config?: any): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini service not initialized. Please check your API key.');
    }

    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config?.temperature || 0.3,
          maxOutputTokens: config?.maxTokens || 2000,
          topP: config?.topP || 0.8,
          topK: config?.topK || 40,
        },
      });

      const response = result.response;
      const text = response.text();

      logger.info('Gemini API request successful', 'gemini-service', {
        model: this.modelName,
        tokensUsed: response.usageMetadata?.totalTokenCount || 'unknown'
      });

      return text;
    } catch (error) {
      logger.error('Gemini API request failed', 'gemini-service', error);
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

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    try {
      return await this.makeRequest(fullPrompt, { temperature, maxTokens });
    } catch (error) {
      logger.error('Code generation failed', 'gemini-service', error);
      throw new Error('Failed to generate code');
    }
  }

  async refactorCode(request: CodeRefactoringRequest): Promise<string> {
    const { code, instructions, language = 'javascript' } = request;

    const systemPrompt = `You are an expert software developer specializing in code refactoring.
Analyze the provided ${language} code and refactor it according to the instructions.
Maintain the original functionality while improving code quality, readability, and performance.
Provide the refactored code with brief explanations of the changes made.`;

    const userPrompt = `Original code:
\`\`\`${language}
${code}
\`\`\`

Refactoring instructions: ${instructions}

Please provide the refactored code with explanations.`;

    try {
      return await this.makeRequest(userPrompt, {
        temperature: 0.2,
        maxTokens: 3000
      });
    } catch (error) {
      logger.error('Code refactoring failed', 'gemini-service', error);
      throw new Error('Failed to refactor code');
    }
  }

  async explainCode(code: string, language = 'javascript'): Promise<string> {
    const systemPrompt = `You are an expert software developer and educator.
Analyze the provided ${language} code and provide a clear, comprehensive explanation.
Explain what the code does, how it works, and any important patterns or concepts used.
Structure your explanation with bullet points for clarity.`;

    const userPrompt = `Please explain this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide a detailed explanation of the code structure, functionality, and best practices demonstrated.`;

    try {
      return await this.makeRequest(userPrompt, {
        temperature: 0.3,
        maxTokens: 1500
      });
    } catch (error) {
      logger.error('Code explanation failed', 'gemini-service', error);
      throw new Error('Failed to explain code');
    }
  }

  async debugCode(code: string, error: string, language = 'javascript'): Promise<string> {
    const systemPrompt = `You are an expert software developer and debugger.
Analyze the provided ${language} code and error message to identify and fix the issue.
Explain the problem and provide the corrected code with clear comments.`;

    const userPrompt = `Code with error:
\`\`\`${language}
${code}
\`\`\`

Error message: ${error}

Please identify the issue, explain the problem, and provide a corrected version of the code.`;

    try {
      return await this.makeRequest(userPrompt, {
        temperature: 0.2,
        maxTokens: 2000
      });
    } catch (error) {
      logger.error('Code debugging failed', 'gemini-service', error);
      throw new Error('Failed to debug code');
    }
  }

  async optimizeCode(code: string, language = 'javascript'): Promise<string> {
    const systemPrompt = `You are an expert software developer specializing in performance optimization.
Analyze the provided ${language} code and optimize it for better performance, memory usage, and efficiency.
Maintain the original functionality while improving the code.
Provide the optimized code with explanations of the optimizations made.`;

    const userPrompt = `Please optimize this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Identify performance bottlenecks and provide an optimized version with explanations.`;

    try {
      return await this.makeRequest(userPrompt, {
        temperature: 0.2,
        maxTokens: 2500
      });
    } catch (error) {
      logger.error('Code optimization failed', 'gemini-service', error);
      throw new Error('Failed to optimize code');
    }
  }

  async generateTests(code: string, language = 'javascript', testFramework = 'jest'): Promise<string> {
    const systemPrompt = `You are an expert software developer specializing in testing.
Generate comprehensive unit tests for the provided ${language} code using ${testFramework}.
Include test cases for happy paths, edge cases, and error handling.
Ensure tests are well-structured and follow testing best practices.`;

    const userPrompt = `Please generate ${testFramework} tests for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide comprehensive test coverage including:
- Happy path scenarios
- Edge cases
- Error handling
- Mock setup if needed
- Clear test descriptions`;

    try {
      return await this.makeRequest(userPrompt, {
        temperature: 0.3,
        maxTokens: 2000
      });
    } catch (error) {
      logger.error('Test generation failed', 'gemini-service', error);
      throw new Error('Failed to generate tests');
    }
  }

  async chat(messages: Array<{role: 'user' | 'model', content: string}>): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini service not initialized. Please check your API key.');
    }

    try {
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }))
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response.text();

      return response;
    } catch (error) {
      logger.error('Chat request failed', 'gemini-service', error);
      throw new Error('Failed to process chat message');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.genAI;
  }

  getAvailableModels(): string[] {
    return [
      'gemini-1.5-pro',        // Most capable model available
      'gemini-1.5-flash',      // Fast and efficient
      'gemini-2.0-flash-exp',  // Experimental 2.0 model
      'gemini-pro'             // Legacy model
    ];
  }

  // Method to switch to a different model
  setModel(modelName: string): boolean {
    if (!this.genAI) {
      logger.error('Cannot set model: Gemini service not initialized', 'gemini-service');
      return false;
    }

    const availableModels = this.getAvailableModels();
    if (!availableModels.includes(modelName)) {
      logger.error(`Model ${modelName} not in available models list`, 'gemini-service');
      return false;
    }

    try {
      this.model = this.genAI.getGenerativeModel({ model: modelName });
      this.modelName = modelName;
      logger.info('Gemini model switched successfully', 'gemini-service', { model: modelName });
      return true;
    } catch (error) {
      logger.error('Failed to switch Gemini model', 'gemini-service', error);
      return false;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export class for testing
export { GeminiService };
