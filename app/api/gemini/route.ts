// app/api/gemini/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { geminiService  } from '@/lib/ai';
import { logger } from '@/utils/helpers/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (!geminiService.isConfigured()) {
      return NextResponse.json(
        { error: 'Gemini service is not configured. Please check your GOOGLE_GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    let result;

    switch (action) {
      case 'generate':
        const { prompt, language, context, temperature, maxTokens } = params;
        if (!prompt) {
          return NextResponse.json(
            { error: 'Prompt is required for code generation' },
            { status: 400 }
          );
        }
        result = await geminiService.generateCode({
          prompt,
          language,
          context,
          temperature,
          maxTokens
        });
        break;

      case 'refactor':
        const { code, instructions, language: refactorLanguage } = params;
        if (!code || !instructions) {
          return NextResponse.json(
            { error: 'Code and instructions are required for refactoring' },
            { status: 400 }
          );
        }
        result = await geminiService.refactorCode({
          code,
          instructions,
          language: refactorLanguage
        });
        break;

      case 'explain':
        const { code: explainCode, language: explainLanguage } = params;
        if (!explainCode) {
          return NextResponse.json(
            { error: 'Code is required for explanation' },
            { status: 400 }
          );
        }
        result = await geminiService.explainCode(explainCode, explainLanguage);
        break;

      case 'debug':
        const { code: debugCode, error, language: debugLanguage } = params;
        if (!debugCode || !error) {
          return NextResponse.json(
            { error: 'Code and error are required for debugging' },
            { status: 400 }
          );
        }
        result = await geminiService.debugCode(debugCode, error, debugLanguage);
        break;

      case 'optimize':
        const { code: optimizeCode, language: optimizeLanguage } = params;
        if (!optimizeCode) {
          return NextResponse.json(
            { error: 'Code is required for optimization' },
            { status: 400 }
          );
        }
        result = await geminiService.optimizeCode(optimizeCode, optimizeLanguage);
        break;

      case 'generate-tests':
        const { code: testCode, language: testLanguage, testFramework } = params;
        if (!testCode) {
          return NextResponse.json(
            { error: 'Code is required for test generation' },
            { status: 400 }
          );
        }
        result = await geminiService.generateTests(testCode, testLanguage, testFramework);
        break;

      case 'chat':
        const { messages } = params;
        if (!messages || !Array.isArray(messages)) {
          return NextResponse.json(
            { error: 'Messages array is required for chat' },
            { status: 400 }
          );
        }
        result = await geminiService.chat(messages);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: generate, refactor, explain, debug, optimize, generate-tests, chat' },
          { status: 400 }
        );
    }

    logger.info(`Gemini ${action} request completed successfully`, 'api/gemini', {
      action,
      language: params.language || 'unknown'
    });

    return NextResponse.json({
      success: true,
      data: result,
      action
    });

  } catch (error) {
    logger.error('Gemini API request failed', 'api/gemini', error instanceof Error ? error : new Error(String(error)));

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!geminiService.isConfigured()) {
      return NextResponse.json(
        {
          configured: false,
          error: 'Gemini service is not configured. Please set GOOGLE_GEMINI_API_KEY in your environment variables.',
          availableModels: geminiService.getAvailableModels()
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      configured: true,
      message: 'Gemini service is ready',
      model: 'gemini-2.0-flash-exp',
      supportedActions: [
        'generate',
        'refactor',
        'explain',
        'debug',
        'optimize',
        'generate-tests',
        'chat'
      ],
      availableModels: geminiService.getAvailableModels()
    });

  } catch (error) {
    logger.error('Gemini status check failed', 'api/gemini', error instanceof Error ? error : new Error(String(error)));

    return NextResponse.json(
      {
        configured: false,
        error: error instanceof Error ? error.message : 'Service unavailable',
        availableModels: geminiService.getAvailableModels()
      },
      { status: 500 }
    );
  }
}
