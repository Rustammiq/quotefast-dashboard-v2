/**
 * Centralized Error Handler
 * Provides consistent error handling across the application
 */

export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType
  message: string
  code?: string
  details?: unknown
  timestamp: Date
}

export class ApplicationError extends Error {
  public readonly type: ErrorType
  public readonly code?: string
  public readonly details?: unknown
  public readonly timestamp: Date

  constructor(type: ErrorType, message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApplicationError'
    this.type = type
    this.code = code
    this.details = details
    this.timestamp = new Date()

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError)
    }
  }
}

/**
 * Error handler utility functions
 */
export const errorHandler = {
  /**
   * Handle authentication errors
   */
  auth: (message: string, code?: string, details?: unknown): ApplicationError => {
    return new ApplicationError(ErrorType.AUTHENTICATION, message, code, details)
  },

  /**
   * Handle authorization errors
   */
  authorization: (message: string, code?: string, details?: unknown): ApplicationError => {
    return new ApplicationError(ErrorType.AUTHORIZATION, message, code, details)
  },

  /**
   * Handle validation errors
   */
  validation: (message: string, code?: string, details?: unknown): ApplicationError => {
    return new ApplicationError(ErrorType.VALIDATION, message, code, details)
  },

  /**
   * Handle network errors
   */
  network: (message: string, code?: string, details?: unknown): ApplicationError => {
    return new ApplicationError(ErrorType.NETWORK, message, code, details)
  },

  /**
   * Handle server errors
   */
  server: (message: string, code?: string, details?: unknown): ApplicationError => {
    return new ApplicationError(ErrorType.SERVER, message, code, details)
  },

  /**
   * Log error to console (in development) or external service (in production)
   */
  log: (error: Error | ApplicationError, context?: Record<string, unknown>): void => {
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
      console.error('Error occurred:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
        ...(error instanceof ApplicationError && {
          type: error.type,
          code: error.code,
          details: error.details,
          timestamp: error.timestamp,
        }),
      })
    } else {
      // In production, send to error tracking service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(error, { contexts: { custom: context } })
      console.error('Production error:', error.message)
    }
  },

  /**
   * Get user-friendly error message
   */
  getUserMessage: (error: Error | ApplicationError): string => {
    if (error instanceof ApplicationError) {
      return error.message
    }

    // Default messages for common errors
    if (error.message.includes('fetch')) {
      return 'Er is een verbindingsprobleem. Controleer je internetverbinding.'
    }

    if (error.message.includes('timeout')) {
      return 'De aanvraag duurde te lang. Probeer het opnieuw.'
    }

    return 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.'
  },
}

/**
 * Error boundary helper for React components
 */
export const handleComponentError = (
  error: Error,
  errorInfo: React.ErrorInfo,
  componentName: string
): void => {
  errorHandler.log(error, {
    component: componentName,
    errorInfo: errorInfo.componentStack,
  })
}

