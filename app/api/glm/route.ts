// app/api/glm/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { glmService  } from '../../../lib/ai';
import { logger } from '../../../utils/helpers/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (!glmService.isConfigured()) {
      return NextResponse.json(
        { error: 'GLM service is not configured' },
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
        result = await glmService.generateCode({
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
        result = await glmService.refactorCode({
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
        result = await glmService.explainCode(explainCode, explainLanguage);
        break;

      case 'debug':
        const { code: debugCode, error, language: debugLanguage } = params;
        if (!debugCode || !error) {
          return NextResponse.json(
            { error: 'Code and error are required for debugging' },
            { status: 400 }
          );
        }
        result = await glmService.debugCode(debugCode, error, debugLanguage);
        break;

      case 'optimize':
        const { code: optimizeCode, language: optimizeLanguage } = params;
        if (!optimizeCode) {
          return NextResponse.json(
            { error: 'Code is required for optimization' },
            { status: 400 }
          );
        }
        result = await glmService.optimizeCode(optimizeCode, optimizeLanguage);
        break;

      case 'generate-tests':
        const { code: testCode, language: testLanguage, testFramework } = params;
        if (!testCode) {
          return NextResponse.json(
            { error: 'Code is required for test generation' },
            { status: 400 }
          );
        }
        result = await glmService.generateTests(testCode, testLanguage, testFramework);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: generate, refactor, explain, debug, optimize, generate-tests' },
          { status: 400 }
        );
    }

    console.log(`GLM ${action} request completed successfully`, {
      action,
      language: params.language || 'unknown'
    });

    return NextResponse.json({
      success: true,
      data: result,
      action
    });

  } catch (error) {
    console.error('GLM API request failed:', error);
    
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
    if (!glmService.isConfigured()) {
      return NextResponse.json(
        { 
          configured: false,
          error: 'GLM service is not configured' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      configured: true,
      message: 'GLM service is ready',
      supportedActions: [
        'generate',
        'refactor', 
        'explain',
        'debug',
        'optimize',
        'generate-tests'
      ]
    });

  } catch (error) {
    console.error('GLM status check failed:', error);
    
    return NextResponse.json(
      { 
        configured: false,
        error: error instanceof Error ? error.message : 'Service unavailable'
      },
      { status: 500 }
    );
  }
}