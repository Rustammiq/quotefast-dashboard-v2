'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Bug, Home, Mail, Copy, Check } from 'lucide-react';
import { logger } from '../../lib/logger';

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Error context interface
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  severity: ErrorSeverity;
}

// Error boundary props
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, context: ErrorContext) => void;
  severity?: ErrorSeverity;
  component?: string;
  action?: string;
  showDetails?: boolean;
  enableReporting?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
}

// Error boundary state
interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  context?: ErrorContext;
  retryCount: number;
  isReporting: boolean;
  reportSent: boolean;
  copiedToClipboard: boolean;
}

// Enhanced Error Boundary with comprehensive error handling
class ErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0,
      isReporting: false,
      reportSent: false,
      copiedToClipboard: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      context: {
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        severity: 'medium',
      }
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const context: ErrorContext = {
      component: this.props.component || 'Unknown',
      action: this.props.action || 'Unknown',
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      severity: this.props.severity || 'medium',
    };

    // Log error with context
    logger.error('ErrorBoundary caught an error', 'error-boundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context,
    });

    this.setState({
      error,
      errorInfo,
      context,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo, context);
    }

    // Report to external service if enabled
    if (this.props.enableReporting) {
      this.reportError(error, errorInfo, context);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private async reportError(error: Error, errorInfo: ErrorInfo, context: ErrorContext) {
    this.setState({ isReporting: true });

    try {
      // Simulate error reporting to external service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        context,
        timestamp: new Date().toISOString(),
        userId: context.userId,
        sessionId: context.sessionId,
      };

      // In a real application, you would send this to your error reporting service
      // Example: Sentry, LogRocket, Bugsnag, etc.
      console.log('Error report:', errorReport);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.setState({ reportSent: true, isReporting: false });
    } catch (reportError) {
      logger.error('Failed to report error', 'error-boundary', reportError);
      this.setState({ isReporting: false });
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      logger.warn('Maximum retry attempts reached', 'error-boundary', { retryCount });
      return;
    }

    // Clear error state
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      context: undefined,
      retryCount: prevState.retryCount + 1,
    }));

    // Log retry attempt
    logger.info('Error boundary retry attempted', 'error-boundary', {
      retryCount: retryCount + 1,
      maxRetries,
    });
  };

  private handleCopyError = async () => {
    const { error, errorInfo, context } = this.state;
    
    if (!error) return;

    const errorText = `
Error Details:
Message: ${error.message}
Stack: ${error.stack}
Component Stack: ${errorInfo?.componentStack}
Context: ${JSON.stringify(context, null, 2)}
Timestamp: ${new Date().toISOString()}
URL: ${typeof window !== 'undefined' ? window.location.href : 'unknown'}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copiedToClipboard: true });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        this.setState({ copiedToClipboard: false });
      }, 2000);
    } catch (copyError) {
      logger.error('Failed to copy error to clipboard', 'error-boundary', copyError);
    }
  };

  private getSeverityColor(severity: ErrorSeverity): string {
    switch (severity) {
      case 'low': return 'text-yellow-500';
      case 'medium': return 'text-orange-500';
      case 'high': return 'text-red-500';
      case 'critical': return 'text-red-600';
      default: return 'text-red-500';
    }
  }

  private getSeverityBackground(severity: ErrorSeverity): string {
    switch (severity) {
      case 'low': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'medium': return 'bg-orange-500/10 border-orange-500/30';
      case 'high': return 'bg-red-500/10 border-red-500/30';
      case 'critical': return 'bg-red-600/10 border-red-600/30';
      default: return 'bg-red-500/10 border-red-500/30';
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props;
      const { error, errorInfo, context, retryCount, isReporting, reportSent, copiedToClipboard } = this.state;
      const severity = context?.severity || 'medium';

      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default enhanced error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
          <div className="max-w-4xl w-full">
            <div className={`${this.getSeverityBackground(severity)} border rounded-lg p-8 backdrop-blur-sm`}>
              <div className="flex items-start gap-4">
                <AlertCircle className={`h-8 w-8 ${this.getSeverityColor(severity)} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className={`text-2xl font-bold ${this.getSeverityColor(severity)}`}>
                      Er is een onverwachte fout opgetreden
                    </h1>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${this.getSeverityBackground(severity)} ${this.getSeverityColor(severity)}`}>
                      {severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Er is iets misgegaan bij het laden van de applicatie. Probeer de pagina te vernieuwen of neem contact op met de beheerder als het probleem aanhoudt.
                  </p>

                  {/* Error context information */}
                  {context && (
                    <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">Error Context</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                        <div><strong>Component:</strong> {context.component}</div>
                        <div><strong>Action:</strong> {context.action}</div>
                        <div><strong>Timestamp:</strong> {new Date(context.timestamp).toLocaleString()}</div>
                        <div><strong>URL:</strong> {context.url}</div>
                      </div>
                    </div>
                  )}

                  {/* Retry count */}
                  {retryCount > 0 && (
                    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-400 text-sm">
                        Retry attempt {retryCount} of {this.props.maxRetries || 3}
                      </p>
                    </div>
                  )}

                  {/* Error reporting status */}
                  {this.props.enableReporting && (
                    <div className="mb-6">
                      {isReporting && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-blue-400 text-sm flex items-center gap-2">
                            <Bug className="h-4 w-4" />
                            Error wordt gerapporteerd...
                          </p>
                        </div>
                      )}
                      {reportSent && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-green-400 text-sm flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Error succesvol gerapporteerd
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Technical details */}
                  {showDetails && error && (
                    <details className="mb-6">
                      <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 mb-2">
                        Technische details (alleen zichtbaar in development)
                      </summary>
                      <div className="bg-gray-800/50 rounded p-4 text-xs font-mono text-gray-300 overflow-auto max-h-60">
                        <div className="mb-2">
                          <strong>Error:</strong> {error.message}
                        </div>
                        {error.stack && (
                          <div className="mb-2">
                            <strong>Stack:</strong>
                            <pre className="whitespace-pre-wrap mt-1">
                              {error.stack}
                            </pre>
                          </div>
                        )}
                        {errorInfo?.componentStack && (
                          <div>
                            <strong>Component Stack:</strong>
                            <pre className="whitespace-pre-wrap mt-1">
                              {errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    {this.props.enableRetry !== false && retryCount < (this.props.maxRetries || 3) && (
                      <button
                        onClick={this.handleRetry}
                        className={`px-6 py-3 ${this.getSeverityBackground(severity)} hover:opacity-80 ${this.getSeverityColor(severity)} rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center gap-2`}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Opnieuw proberen
                      </button>
                    )}
                    
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Pagina vernieuwen
                    </button>

                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Naar home
                    </button>

                    {showDetails && error && (
                      <button
                        onClick={this.handleCopyError}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-2"
                      >
                        {copiedToClipboard ? (
                          <>
                            <Check className="h-4 w-4" />
                            Gekopieerd
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Kopieer error
                          </>
                        )}
                      </button>
                    )}

                    <a
                      href="mailto:support@quotefast.nl?subject=Error Report&body=Please describe the error you encountered..."
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Rapporteer probleem
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier error boundary usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for error boundary context
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

export default ErrorBoundary;
