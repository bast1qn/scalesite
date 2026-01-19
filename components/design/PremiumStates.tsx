// ========================================================================
// PREMIUM LOADING, EMPTY & ERROR STATES
// ========================================================================
// Reference: Linear, Vercel, Stripe design systems
// Philosophy: Beautiful, informative, consistent states
// Features: GPU-accelerated animations, dark mode support, accessibility
// ========================================================================

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// ========================================================================
// LOADING STATES
// ========================================================================

/**
 * PremiumSpinner - Elegant loading spinner with glow effect
 * GPU-accelerated (transform only)
 * Smooth 60fps animation
 */
export const PremiumSpinner = ({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`relative ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {/* Track */}
      <div className="absolute inset-0 rounded-full border-slate-200 dark:border-slate-700" />
      {/* Animated spinner */}
      <motion.div
        className="absolute inset-0 rounded-full border-transparent border-t-primary-500 border-r-primary-600"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      {/* Inner glow */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500/10 to-violet-500/10"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </div>
  );
};

/**
 * SkeletonLoader - Premium skeleton with shimmer effect
 * Vercel-inspired shimmer animation
 * GPU-accelerated (transform only)
 */
export const SkeletonLoader = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'default',
}: {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'default' | 'card' | 'avatar' | 'button';
}) => {
  const variants = {
    default: 'rounded-lg',
    card: 'rounded-2xl',
    avatar: 'rounded-full',
    button: 'rounded-xl',
  };

  return (
    <motion.div
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${variants[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        <div
          className="h-full w-1/2"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

/**
 * DotsLoader - Elegant three-dot loading animation
 * Staggered animation for visual interest
 */
export const DotsLoader = ({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { scale: 1, opacity: 1 },
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizes[size]} rounded-full bg-primary-500`}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

/**
 * PageLoader - Full-page loading state with spinner
 * For route transitions and full-page loads
 */
export const PageLoader = ({
  message = 'Loading...',
  subMessage = 'Bitte warten...',
}: {
  message?: string;
  subMessage?: string;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <motion.div
        className="flex flex-col items-center gap-6 px-4"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <PremiumSpinner size="lg" />
        <div className="text-center">
          <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">{message}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{subMessage}</p>
        </div>
        <DotsLoader size="md" />
      </motion.div>
    </div>
  );
};

// ========================================================================
// EMPTY STATES
// ========================================================================

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

/**
 * EmptyState - Beautiful empty state with optional action
 * Consistent spacing, typography, and icon styling
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Icon */}
      {icon && (
        <div className="w-16 h-16 mb-6 flex items-center justify-center text-slate-300 dark:text-slate-600">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action button */}
      {action && (
        <motion.button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            action.variant === 'secondary'
              ? 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-premium hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

// ========================================================================
// ERROR STATES
// ========================================================================

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * ErrorState - User-friendly error display with retry option
 * Clear visual hierarchy, accessible color contrast
 */
export const ErrorState = ({
  title = 'Something went wrong',
  message,
  onRetry,
  onDismiss,
  className = '',
}: ErrorStateProps) => {
  return (
    <motion.div
      className={`bg-error-50 dark:bg-error-900/10 border border-error-200 dark:border-error-800/50 rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        {/* Error icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center text-error-600 dark:text-error-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Error content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-error-800 dark:text-error-200 mb-1">
            {title}
          </h4>
          <p className="text-sm text-error-600 dark:text-error-400 mb-3">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-error-700 dark:text-error-300 bg-error-100 dark:bg-error-900/30 rounded-lg hover:bg-error-200 dark:hover:bg-error-900/50 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-3 py-1.5 text-sm font-medium text-error-600 dark:text-error-400 hover:text-error-800 dark:hover:text-error-200 transition-colors duration-200"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ========================================================================
// SUCCESS STATES
// ========================================================================

interface SuccessStateProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * SuccessState - Celebratory success feedback
 * Green accent colors, checkmark icon
 */
export const SuccessState = ({
  title = 'Success!',
  message,
  onDismiss,
  className = '',
}: SuccessStateProps) => {
  return (
    <motion.div
      className={`bg-success-50 dark:bg-success-900/10 border border-success-200 dark:border-success-800/50 rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        {/* Success icon */}
        <motion.div
          className="flex-shrink-0 w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center text-success-600 dark:text-success-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 10 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        {/* Success content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-success-800 dark:text-success-200 mb-1">
            {title}
          </h4>
          <p className="text-sm text-success-600 dark:text-success-400">
            {message}
          </p>

          {/* Dismiss action */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="mt-3 px-3 py-1.5 text-sm font-medium text-success-600 dark:text-success-400 hover:text-success-800 dark:hover:text-success-200 transition-colors duration-200"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ========================================================================
// CARD SKELETONS
// ========================================================================

/**
 * CardSkeleton - Skeleton placeholder for card content
 * Matches the visual structure of actual cards
 */
export const CardSkeleton = ({
  className = '',
}: {
  className?: string;
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 ${className}`}
      aria-hidden="true"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonLoader width="3rem" height="3rem" variant="avatar" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader width="60%" height="1rem" />
          <SkeletonLoader width="40%" height="0.75rem" />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2 mb-4">
        <SkeletonLoader width="100%" height="1rem" />
        <SkeletonLoader width="100%" height="1rem" />
        <SkeletonLoader width="80%" height="1rem" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <SkeletonLoader width="30%" height="2rem" variant="button" />
        <SkeletonLoader width="2rem" height="2rem" variant="avatar" />
      </div>
    </div>
  );
};
