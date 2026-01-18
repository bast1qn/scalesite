
import { Component, ErrorInfo, type ReactNode } from 'react';
import { XCircleIcon, ArrowLeftIcon } from './index';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire app.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Always log errors - both in dev and production
    console.error('Error Boundary caught an error:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    // NOTE: In production, consider sending error to error tracking service (e.g., Sentry)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Reload the page to reset the application state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 * Displays a user-friendly error message with a reset button
 */
const ErrorFallback = ({ error, onReset }: { error: Error | null; onReset: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircleIcon className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Something went wrong
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          An unexpected error occurred. Please try again.
        </p>

        {error && (
          <details className="mb-6 text-left" open>
            <summary className="cursor-pointer text-sm font-mono text-red-500 mb-2">
              Technical Details (Click to expand/collapse)
            </summary>
            <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-auto max-h-32">
              {error.toString()}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-hover transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
