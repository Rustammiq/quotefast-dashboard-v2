'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and potentially to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Here you could send error to error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-red-500 mb-4">
                    Er is een onverwachte fout opgetreden
                  </h1>
                  <p className="text-gray-300 mb-6">
                    Er is iets misgegaan bij het laden van de applicatie. Probeer de pagina te vernieuwen of neem contact op met de beheerder als het probleem aanhoudt.
                  </p>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mb-6">
                      <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 mb-2">
                        Technische details (alleen zichtbaar in development)
                      </summary>
                      <div className="bg-gray-800/50 rounded p-4 text-xs font-mono text-gray-300 overflow-auto max-h-40">
                        <div className="mb-2">
                          <strong>Error:</strong> {this.state.error.message}
                        </div>
                        {this.state.error.stack && (
                          <div className="mb-2">
                            <strong>Stack:</strong>
                            <pre className="whitespace-pre-wrap mt-1">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        )}
                        {this.state.errorInfo?.componentStack && (
                          <div>
                            <strong>Component Stack:</strong>
                            <pre className="whitespace-pre-wrap mt-1">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={this.handleRetry}
                      className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Opnieuw proberen
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      Pagina vernieuwen
                    </button>
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

export default ErrorBoundary;
