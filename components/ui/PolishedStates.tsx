/**
 * POLISHED STATES - Phase 2
 * Loop 16/200 | Focus: Loading/Empty/Error Perfection
 * Referenz: Linear, Vercel, Stripe
 *
 * POLISHED LOADING STATES:
 * - Skeleton shimmer with smooth gradients
 * - Spinner with easing
 * - Progress indicators
 * - Pulsing placeholders
 *
 * POLISHED EMPTY STATES:
 * - Illustrations
 * - Clear messaging
 * - Actionable CTAs
 * - Friendly tone
 *
 * POLISHED ERROR STATES:
 * - User-friendly messaging
 * - Recovery actions
 * - Contact support option
 * - Non-blaming language
 */

import { type ReactNode, type SVGProps } from 'react';

// ==================== LOADING STATES ====================

/**
 * PolishedSpinner - Smooth loading spinner with easing
 *
 * @example
 * <PolishedSpinner size="md" />
 */
interface PolishedSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PolishedSpinner = ({ size = 'md', className = '' }: PolishedSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * PolishedDots - Animated dots for loading
 *
 * @example
 * <PolishedDots size="md" />
 */
interface PolishedDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PolishedDots = ({ size = 'md', className = '' }: PolishedDotsProps) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-primary-500 rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

/**
 * PolishedProgressBar - Smooth progress indicator
 *
 * @example
 * <PolishedProgressBar progress={75} />
 */
interface PolishedProgressBarProps {
  progress: number;        // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PolishedProgressBar = ({ progress, className = '', showLabel = false, size = 'md' }: PolishedProgressBarProps) => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`.trim()}>
      <div className={`${heightClasses[size]} bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{progress}%</p>
      )}
    </div>
  );
};

// ==================== EMPTY STATES ====================

/**
 * EmptyStateIcon - Empty state illustration
 */
const EmptyStateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    />
  </svg>
);

/**
 * PolishedEmptyState - Friendly empty state with illustration
 *
 * @example
 * <PolishedEmptyState
 *   title="No projects yet"
 *   message="Create your first project to get started"
 *   action={{ label: 'Create Project', onClick: handleClick }}
 * />
 */
interface PolishedEmptyStateProps {
  title: string;
  message: string;
  illustration?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export const PolishedEmptyState = ({
  title,
  message,
  illustration,
  action,
  className = '',
}: PolishedEmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`.trim()}>
      {/* Illustration */}
      <div className="w-24 h-24 mb-6 text-slate-300 dark:text-slate-600">
        {illustration || <EmptyStateIcon className="w-full h-full" />}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {message}
      </p>

      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all duration-300
            hover:scale-[1.02] active:scale-[0.98]
            focus:ring-2 focus:ring-primary-500/50
            ${
              action.variant === 'secondary'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                : 'bg-gradient-to-r from-primary-600 to-violet-500 text-white hover:shadow-glow'
            }
          `.trim()}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// ==================== ERROR STATES ====================

/**
 * ErrorStateIcon - Error state illustration
 */
const ErrorStateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

/**
 * PolishedErrorState - User-friendly error state
 *
 * @example
 * <PolishedErrorState
 *   title="Something went wrong"
 *   message="We couldn't load your data. Please try again."
 *   actions={[
 *     { label: 'Try Again', onClick: retry },
 *     { label: 'Contact Support', onClick: contact }
 *   ]}
 * />
 */
interface PolishedErrorStateProps {
  title: string;
  message: string;
  illustration?: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  className?: string;
}

export const PolishedErrorState = ({
  title,
  message,
  illustration,
  actions = [],
  className = '',
}: PolishedErrorStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`.trim()}>
      {/* Illustration */}
      <div className="w-24 h-24 mb-6 text-red-300 dark:text-red-700">
        {illustration || <ErrorStateIcon className="w-full h-full" />}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {message}
      </p>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98]
                focus:ring-2 focus:ring-primary-500/50
                ${
                  action.variant === 'primary'
                    ? 'bg-gradient-to-r from-primary-600 to-violet-500 text-white hover:shadow-glow'
                    : action.variant === 'ghost'
                    ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }
              `.trim()}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== SUCCESS STATES ====================

/**
 * SuccessStateIcon - Success state illustration
 */
const SuccessStateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/**
 * PolishedSuccessState - Celebratory success state
 *
 * @example
 * <PolishedSuccessState
 *   title="Success!"
 *   message="Your changes have been saved."
 *   action={{ label: 'Continue', onClick: handleContinue }}
 * />
 */
interface PolishedSuccessStateProps {
  title: string;
  message: string;
  illustration?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const PolishedSuccessState = ({
  title,
  message,
  illustration,
  action,
  className = '',
}: PolishedSuccessStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`.trim()}>
      {/* Illustration */}
      <div className="w-24 h-24 mb-6 text-emerald-500 dark:text-emerald-400">
        {illustration || <SuccessStateIcon className="w-full h-full" />}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {message}
      </p>

      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary-600 to-violet-500 text-white hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// ==================== STATE CONTAINER ====================

/**
 * StateContainer - Wrapper for different states
 * Automatically shows loading, error, empty, or children
 *
 * @example
 * <StateContainer
 *   loading={isLoading}
 *   error={error}
 *   empty={data.length === 0}
 *   loadingComponent={<PolishedSpinner />}
 *   errorComponent={<PolishedErrorState {...} />}
 *   emptyComponent={<PolishedEmptyState {...} />}
 * >
 *   {data.map(item => <Item key={item.id} {...item} />)}
 * </StateContainer>
 */
interface StateContainerProps {
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  children: ReactNode;
}

export const StateContainer = ({
  loading = false,
  error = null,
  empty = false,
  loadingComponent = <PolishedSpinner />,
  errorComponent,
  emptyComponent,
  children,
}: StateContainerProps) => {
  if (loading) {
    return <>{loadingComponent}</>;
  }

  if (error) {
    return (
      <>
        {errorComponent || (
          <PolishedErrorState
            title="Something went wrong"
            message={error.message || 'An unexpected error occurred'}
            actions={[
              {
                label: 'Try Again',
                onClick: () => window.location.reload(),
              },
            ]}
          />
        )}
      </>
    );
  }

  if (empty) {
    return (
      <>
        {emptyComponent || (
          <PolishedEmptyState
            title="No data found"
            message="There's nothing to show here yet."
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};
