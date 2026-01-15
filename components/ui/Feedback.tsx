import React, { useEffect, useState } from 'react';

interface FeedbackProps {
  type: 'success' | 'error';
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  type,
  message,
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);

    // Auto-hide after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 400); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 400);
  };

  const baseClasses = 'fixed top-4 right-4 z-[100] max-w-sm px-6 py-4 rounded-2xl shadow-premium-lg flex items-start gap-3 transition-all duration-300';
  const typeClasses = type === 'success'
    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30'
    : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200/50 dark:border-rose-800/30';

  const iconClasses = type === 'success'
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400';

  const animationClass = isVisible
    ? type === 'success'
      ? 'animate-success-pop'
      : 'animate-error-shake'
    : 'opacity-0 scale-95';

  return (
    <div className={`${baseClasses} ${typeClasses} ${animationClass}`} role="alert">
      <div className={`flex-shrink-0 ${iconClasses}`}>
        {type === 'success' ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="flex-grow">
        <p className={`text-sm font-medium ${type === 'success' ? 'text-emerald-900 dark:text-emerald-100' : 'text-rose-900 dark:text-rose-100'}`}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${iconClasses} hover:opacity-70 transition-opacity focus:ring-2 focus:ring-primary-500/50 rounded-lg p-0.5`}
          aria-label="Schließen"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

interface InlineFeedbackProps {
  type: 'success' | 'error' | 'loading';
  message?: string;
}

export const InlineFeedback: React.FC<InlineFeedbackProps> = ({
  type,
  message
}) => {
  const baseClasses = 'flex items-center gap-2 text-sm font-medium';

  if (type === 'loading') {
    return (
      <div className={`${baseClasses} text-slate-500 dark:text-slate-400 animate-success-pulse`}>
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        {message && <span>{message}</span>}
      </div>
    );
  }

  const typeClasses = type === 'success'
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400';

  const animationClass = type === 'success'
    ? 'animate-success-pop'
    : 'animate-error-shake';

  return (
    <div className={`${baseClasses} ${typeClasses} ${animationClass}`}>
      {type === 'success' ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      {message && <span>{message}</span>}
    </div>
  );
};
