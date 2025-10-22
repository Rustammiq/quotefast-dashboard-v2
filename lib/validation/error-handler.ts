/**
 * Centralized error handling service for QuoteFast Dashboard
 */

import { logger } from '../../utils/helpers/logger'

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  timestamp?: string
  userAgent?: string
  url?: string
  endpoint?: string
  method?: string
  originalError?: string
  validationErrors?: Record<string, string[]>
  additionalData?: Record<string, any>
}

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly context: ErrorContext
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    context: ErrorContext = {},
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.context = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context,
    }
    this.isOperational = isOperational

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

// Predefined error types
export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // API errors
  API_NETWORK_ERROR: 'API_NETWORK_ERROR',
  API_TIMEOUT: 'API_TIMEOUT',
  API_RATE_LIMITED: 'API_RATE_LIMITED',
  API_SERVER_ERROR: 'API_SERVER_ERROR',
  API_VALIDATION_ERROR: 'API_VALIDATION_ERROR',
  
  // Business logic errors
  QUOTE_GENERATION_FAILED: 'QUOTE_GENERATION_FAILED',
  CUSTOMER_NOT_FOUND: 'CUSTOMER_NOT_FOUND',
  INVOICE_CREATION_FAILED: 'INVOICE_CREATION_FAILED',
  PAYMENT_PROCESSING_FAILED: 'PAYMENT_PROCESSING_FAILED',
  
  // System errors
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  EMAIL_SENDING_FAILED: 'EMAIL_SENDING_FAILED',
  
  // Client errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FORM_SUBMISSION_ERROR: 'FORM_SUBMISSION_ERROR',
  FILE_SIZE_TOO_LARGE: 'FILE_SIZE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',

  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorQueue: Array<{ error: Error; context: ErrorContext; severity: ErrorSeverity }> = []
  private maxQueueSize = 100

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Handle and process errors
   */
  public handleError(
    error: Error | AppError,
    context: ErrorContext = {},
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void {
    const errorContext = {
      ...context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    // Log the error
    this.logError(error, errorContext, severity)

    // Add to queue for batch processing
    this.addToQueue(error, errorContext, severity)

    // Handle critical errors immediately
    if (severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(error, errorContext)
    }
  }

  /**
   * Create a standardized error
   */
  public createError(
    message: string,
    code: ErrorCode = ErrorCodes.UNKNOWN_ERROR,
    statusCode: number = 500,
    context: ErrorContext = {},
    isOperational: boolean = true
  ): AppError {
    return new AppError(message, code, statusCode, context, isOperational)
  }

  /**
   * Handle API errors
   */
  public handleApiError(
    error: any,
    endpoint: string,
    method: string = 'GET',
    context: ErrorContext = {}
  ): AppError {
    let code: ErrorCode = ErrorCodes.API_SERVER_ERROR
    let statusCode = 500
    let message = 'An API error occurred'

    if (error.response) {
      statusCode = error.response.status
      message = error.response.data?.message || error.message || message

      switch (statusCode) {
        case 400:
          code = ErrorCodes.API_VALIDATION_ERROR
          break
        case 401:
          code = ErrorCodes.AUTH_REQUIRED
          break
        case 403:
          code = ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS
          break
        case 404:
          code = ErrorCodes.CUSTOMER_NOT_FOUND
          break
        case 429:
          code = ErrorCodes.API_RATE_LIMITED
          break
        case 500:
          code = ErrorCodes.API_SERVER_ERROR
          break
      }
    } else if (error.request) {
      code = ErrorCodes.API_NETWORK_ERROR
      message = 'Network error - please check your connection'
    } else if (error.code === 'ECONNABORTED') {
      code = ErrorCodes.API_TIMEOUT
      message = 'Request timeout - please try again'
    }

    return this.createError(
      message,
      code,
      statusCode,
      {
        ...context,
        endpoint,
        method,
        originalError: error.message,
      }
    )
  }

  /**
   * Handle validation errors
   */
  public handleValidationError(
    errors: Record<string, string[]>,
    context: ErrorContext = {}
  ): AppError {
    const message = 'Validation failed'
    const errorMessages = Object.values(errors).flat()
    
    return this.createError(
      `${message}: ${errorMessages.join(', ')}`,
      ErrorCodes.VALIDATION_ERROR,
      400,
      {
        ...context,
        validationErrors: errors,
      }
    )
  }

  /**
   * Log error with appropriate level
   */
  private logError(error: Error, context: ErrorContext, severity: ErrorSeverity): void {
    const logMessage = `${error.name}: ${error.message}`
    
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        logger.error(logMessage, 'error-handler', { error, context })
        break
      case ErrorSeverity.HIGH:
        logger.error(logMessage, 'error-handler', { error, context })
        break
      case ErrorSeverity.MEDIUM:
        logger.warn(logMessage, 'error-handler', { error, context })
        break
      case ErrorSeverity.LOW:
        logger.info(logMessage, 'error-handler', { error, context })
        break
    }
  }

  /**
   * Add error to queue for batch processing
   */
  private addToQueue(error: Error, context: ErrorContext, severity: ErrorSeverity): void {
    this.errorQueue.push({ error, context, severity })
    
    // Remove oldest errors if queue is full
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }
  }

  /**
   * Handle critical errors immediately
   */
  private handleCriticalError(error: Error, context: ErrorContext): void {
    // Send to error reporting service
    this.reportError(error, context)
    
    // Show user notification
    if (typeof window !== 'undefined') {
      // You can integrate with your notification system here
      console.error('Critical error occurred:', error)
    }
  }

  /**
   * Report error to external service
   */
  private async reportError(error: Error, context: ErrorContext): Promise<void> {
    try {
      // In production, send to error reporting service like Sentry
      if (process.env.NODE_ENV === 'production') {
        // Example: Sentry.captureException(error, { extra: context })
        logger.info('Would send to error reporting service:', 'error-handler', { error, context })
      }
    } catch (reportingError) {
      logger.error('Failed to report error', 'error-handler', { reportingError })
    }
  }

  /**
   * Get error queue for debugging
   */
  public getErrorQueue(): Array<{ error: Error; context: ErrorContext; severity: ErrorSeverity }> {
    return [...this.errorQueue]
  }

  /**
   * Clear error queue
   */
  public clearErrorQueue(): void {
    this.errorQueue = []
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): {
    total: number
    bySeverity: Record<ErrorSeverity, number>
    byCode: Record<string, number>
  } {
    const stats = {
      total: this.errorQueue.length,
      bySeverity: {
        [ErrorSeverity.LOW]: 0,
        [ErrorSeverity.MEDIUM]: 0,
        [ErrorSeverity.HIGH]: 0,
        [ErrorSeverity.CRITICAL]: 0,
      },
      byCode: {} as Record<string, number>,
    }

    this.errorQueue.forEach(({ error, severity }) => {
      stats.bySeverity[severity]++
      
      if (error instanceof AppError) {
        stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1
      }
    })

    return stats
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Utility functions
export const handleAsyncError = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: ErrorContext = {}
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      errorHandler.handleError(error as Error, context, ErrorSeverity.MEDIUM)
      return null
    }
  }
}

export const handleSyncError = <T extends any[], R>(
  fn: (...args: T) => R,
  context: ErrorContext = {}
) => {
  return (...args: T): R | null => {
    try {
      return fn(...args)
    } catch (error) {
      errorHandler.handleError(error as Error, context, ErrorSeverity.MEDIUM)
      return null
    }
  }
}

// React Error Boundary helper
export const createErrorBoundaryHandler = (componentName: string) => {
  return (error: Error, errorInfo: any) => {
    errorHandler.handleError(
      error,
      {
        component: componentName,
        action: 'render',
        additionalData: errorInfo,
      },
      ErrorSeverity.HIGH
    )
  }
}
