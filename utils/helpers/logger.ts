// Logger utility for API routes

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    };
  }

  private log(level: LogLevel, message: string, context?: string, data?: any): void {
    const logEntry = this.formatMessage(level, message, context, data);
    
    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      const prefix = `[${logEntry.timestamp}] ${level.toUpperCase()}`;
      const contextStr = context ? ` [${context}]` : '';
      
      switch (level) {
        case 'error':
          console.error(`${prefix}${contextStr}: ${message}`, data || '');
          break;
        case 'warn':
          console.warn(`${prefix}${contextStr}: ${message}`, data || '');
          break;
        case 'debug':
          if (this.isDevelopment) {
            console.debug(`${prefix}${contextStr}: ${message}`, data || '');
          }
          break;
        default:
          if (this.isDevelopment) {
            console.log(`${prefix}${contextStr}: ${message}`, data || '');
          }
      }
    }
    
    // In production, you could send logs to a service like Sentry, LogRocket, etc.
    this.sendToLogService(logEntry);
  }

  private sendToLogService(logEntry: LogEntry): void {
    // In production, implement actual logging service integration
    if (!this.isDevelopment) {
      // Example: Send to external logging service
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) });
    }
  }

  info(message: string, context?: string, data?: any): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, data?: any): void {
    this.log('error', message, context, data);
  }

  debug(message: string, context?: string, data?: any): void {
    this.log('debug', message, context, data);
  }
}

export const logger = new Logger();