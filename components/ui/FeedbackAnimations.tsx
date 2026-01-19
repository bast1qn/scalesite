/**
 * FeedbackAnimations - Subtle success/error feedback animations
 *
 * Provides premium, non-intrusive feedback animations for:
 * - Success states (subtle green glow + scale)
 * - Error states (shake + red highlight)
 * - Loading states (shimmer + pulse)
 *
 * Inspired by Linear, Vercel, Stripe - subtle, professional, consistent
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// ==================== SUCCESS ANIMATIONS ====================

interface SuccessFeedbackProps {
  /** Trigger animation when true */
  trigger: boolean;
  /** Children to wrap */
  children: React.ReactElement;
  /** Custom className */
  className?: string;
}

/**
 * SuccessFeedback - Wraps children with subtle success animation
 *
 * Animation: scale-[1.02] + emerald glow (0.6s ease-out)
 *
 * @example
 * <SuccessFeedback trigger={isSuccess}>
 *   <button>Save</button>
 * </SuccessFeedback>
 */
export const SuccessFeedback = ({ trigger, children, className }: SuccessFeedbackProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={cn(
        'transition-all duration-300',
        isAnimating && 'animate-success-feedback',
        className
      )}
    >
      {children}
    </div>
  );
};

// ==================== ERROR ANIMATIONS ====================

interface ErrorFeedbackProps {
  /** Trigger animation when true */
  trigger: boolean;
  /** Children to wrap */
  children: React.ReactElement;
  /** Custom className */
  className?: string;
}

/**
 * ErrorFeedback - Wraps children with shake error animation
 *
 * Animation: translateX shake (0.5s ease-out)
 *
 * @example
 * <ErrorFeedback trigger={hasError}>
 *   <input type="email" />
 * </ErrorFeedback>
 */
export const ErrorFeedback = ({ trigger, children, className }: ErrorFeedbackProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={cn(
        'transition-all duration-200',
        isAnimating && 'animate-error-feedback',
        trigger && 'border-rose-300 dark:border-rose-700',
        className
      )}
    >
      {children}
    </div>
  );
};

// ==================== LOADING STATES ====================

interface LoadingStateProps {
  /** Show loading state when true */
  isLoading: boolean;
  /** Children to wrap */
  children: React.ReactElement;
  /** Skeleton loader to show during loading */
  skeleton?: React.ReactElement;
  /** Custom className */
  className?: string;
  /** Fade out content when loading starts */
  fadeOut?: boolean;
}

/**
 * LoadingState - Handles loading states with smooth transitions
 *
 * Features:
 * - Smooth fade transition (300ms)
 * - Optional skeleton loader
 * - Fade out content or overlay loading indicator
 *
 * @example
 * <LoadingState isLoading={loading} skeleton={<CardSkeleton />}>
 *   <div>{content}</div>
 * </LoadingState>
 */
export const LoadingState = ({
  isLoading,
  children,
  skeleton,
  className,
  fadeOut = false
}: LoadingStateProps) => {
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (isLoading) {
      // Delay showing skeleton slightly for faster interactions
      const timer = setTimeout(() => setShowContent(false), 200);
      return () => clearTimeout(timer);
    } else {
      setShowContent(true);
    }
  }, [isLoading]);

  if (isLoading && skeleton) {
    return <>{skeleton}</>;
  }

  return (
    <div
      className={cn(
        'transition-opacity duration-300',
        isLoading && fadeOut && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
};

// ==================== STATUS BADGES ====================

interface StatusBadgeProps {
  /** Status type */
  status: 'success' | 'error' | 'warning' | 'info' | 'loading';
  /** Badge text */
  children: string;
  /** Custom className */
  className?: string;
  /** Small variant */
  size?: 'sm' | 'md';
}

/**
 * StatusBadge - Consistent status badges with animations
 *
 * All badges include:
 * - Subtle pulse for loading
 * - Smooth transitions
 * - WCAG AA compliant colors
 *
 * @example
 * <StatusBadge status="success">Saved</StatusBadge>
 * <StatusBadge status="loading">Saving...</StatusBadge>
 */
export const StatusBadge = ({ status, children, className, size = 'md' }: StatusBadgeProps) => {
  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/30',
    error: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/30',
    warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/30',
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30',
    loading: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/30'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-semibold transition-all duration-300',
        styles[status],
        sizeStyles[size],
        status === 'loading' && 'animate-pulse-subtle',
        className
      )}
    >
      {status === 'loading' && (
        <svg
          className="w-3 h-3 animate-spin-slow"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {status === 'success' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {status === 'error' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {status === 'warning' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {status === 'info' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {children}
    </span>
  );
};

// ==================== PROGRESS INDICATOR ====================

interface ProgressIndicatorProps {
  /** Progress value (0-100) */
  progress: number;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning';
}

/**
 * ProgressIndicator - Smooth progress bar with animations
 *
 * Features:
 * - Smooth transition (500ms ease-out)
 * - Shimmer effect during loading
 * - Accessible ARIA attributes
 *
 * @example
 * <ProgressIndicator progress={75} showPercentage />
 */
export const ProgressIndicator = ({
  progress,
  showPercentage = false,
  size = 'md',
  className,
  variant = 'primary'
}: ProgressIndicatorProps) => {
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantColors = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full transition-all duration-300">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantColors[variant],
            sizeStyles[size],
            'shimmer-effect'
          )}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showPercentage && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 text-right font-medium">
          {Math.round(clampedProgress)}%
        </p>
      )}
    </div>
  );
};

// ==================== BUTTON WITH FEEDBACK ====================

interface ButtonWithFeedbackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: React.ReactNode;
  /** Show success state */
  isSuccess?: boolean;
  /** Show error state */
  isError?: boolean;
  /** Show loading state */
  isLoading?: boolean;
  /** Success message to show */
  successMessage?: string;
  /** Error message to show */
  errorMessage?: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost';
}

/**
 * ButtonWithFeedback - Button with built-in feedback states
 *
 * Combines:
 * - Loading spinner
 * - Success animation + message
 * - Error shake animation
 * - Smooth state transitions
 *
 * @example
 * <ButtonWithFeedback
 *   isLoading={isSaving}
 *   isSuccess={isSuccess}
 *   isError={hasError}
 *   successMessage="Saved!"
 *   onClick={handleSave}
 * >
 *   Save
 * </ButtonWithFeedback>
 */
export const ButtonWithFeedback = ({
  children,
  isSuccess = false,
  isError = false,
  isLoading = false,
  successMessage,
  errorMessage,
  variant = 'primary',
  className,
  disabled,
  ...props
}: ButtonWithFeedbackProps) => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (isSuccess || isError) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError]);

  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:shadow-glow',
    secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
  };

  return (
    <SuccessFeedback trigger={isSuccess}>
      <ErrorFeedback trigger={isError}>
        <button
          className={cn(
            'relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300',
            'hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-11',
            variantStyles[variant],
            isError && 'border-rose-400 dark:border-rose-600',
            className
          )}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Loading...</span>
            </>
          ) : showFeedback && isSuccess ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{successMessage || 'Success!'}</span>
            </>
          ) : showFeedback && isError ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage || 'Error'}</span>
            </>
          ) : (
            children
          )}
        </button>
      </ErrorFeedback>
    </SuccessFeedback>
  );
};

export default FeedbackAnimations;
