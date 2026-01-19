/**
 * ADVANCED STATES - Phase 2
 * Loop 24/200 | Focus: Design Excellence
 * Referenz: Linear, Vercel, Stripe
 *
 * FEATURES:
 * - Beautiful loading states with smooth animations
 * - Friendly empty states with illustrations
 * - User-friendly error states with recovery actions
 * - GPU-accelerated animations
 * - Accessibility (WCAG AA compliant)
 * - Responsive design
 */

import { type ReactNode, type SVGProps } from 'react';
import { SmoothReveal } from './SmoothReveal';

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * EnhancedSpinner - Premium loading spinner with easing
 */
export const EnhancedSpinner = ({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
      {/* Animated ring */}
      <div
        className="absolute inset-0 border-4 border-transparent border-t-primary-500 border-r-secondary-500 rounded-full animate-spin"
        style={{ animationDuration: '1s' }}
      />
      {/* Inner glow */}
      <div className="absolute inset-2 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full animate-pulse" />
    </div>
  );
};

/**
 * ShimmerSkeleton - Skeleton with shimmer effect
 * GPU-accelerated animation
 */
export const ShimmerSkeleton = ({
  width = '100%',
  height = '100%',
  className = '',
  rounded = 'lg',
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 shimmer-effect"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-effect {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * SkeletonCard - Complete card skeleton with multiple elements
 */
export const SkeletonCard = ({
  className = '',
}: {
  className?: string;
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <ShimmerSkeleton width={48} height={48} rounded="full" />
        <div className="flex-1 space-y-2">
          <ShimmerSkeleton width="60%" height={16} rounded="sm" />
          <ShimmerSkeleton width="40%" height={14} rounded="sm" />
        </div>
      </div>
      {/* Body */}
      <div className="space-y-3">
        <ShimmerSkeleton width="100%" height={14} rounded="sm" />
        <ShimmerSkeleton width="90%" height={14} rounded="sm" />
        <ShimmerSkeleton width="80%" height={14} rounded="sm" />
      </div>
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <ShimmerSkeleton width="40%" height={32} rounded="lg" />
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY STATES
// ============================================================================

/**
 * EmptyStateIllustration - Beautiful SVG illustration
 */
const EmptyStateIllustration = (props: SVGProps<SVGSVGElement>) => (
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
 * EnhancedEmptyState - Friendly empty state with illustration
 */
export const EnhancedEmptyState = ({
  title = 'Nichts gefunden',
  message = 'Es gibt hier nichts zu sehen. Wähle eine andere Option oder erstelle etwas Neues.',
  illustration,
  action,
  className = '',
}: {
  title?: string;
  message?: string;
  illustration?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      {/* Illustration with animation */}
      <SmoothReveal direction="scale" delay={0} duration={0.6}>
        <div className="w-24 h-24 mb-8 text-slate-300 dark:text-slate-600">
          {illustration || <EmptyStateIllustration className="w-full h-full" />}
        </div>
      </SmoothReveal>

      {/* Title */}
      <SmoothReveal direction="up" delay={0.1} duration={0.5}>
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
          {title}
        </h3>
      </SmoothReveal>

      {/* Message */}
      <SmoothReveal direction="up" delay={0.2} duration={0.5}>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
          {message}
        </p>
      </SmoothReveal>

      {/* Action button */}
      {action && (
        <SmoothReveal direction="up" delay={0.3} duration={0.5}>
          <button
            onClick={action.onClick}
            className={`
              inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold
              transition-all duration-300 ease-out
              hover:scale-[1.02] active:scale-[0.98]
              focus:ring-2 focus:ring-primary-500/50 focus:outline-none
              min-h-12
              ${
                action.variant === 'secondary'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  : 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:shadow-glow'
              }
            `}
          >
            {action.label}
          </button>
        </SmoothReveal>
      )}
    </div>
  );
};

// ============================================================================
// ERROR STATES
// ============================================================================

/**
 * ErrorStateIllustration - Error SVG illustration
 */
const ErrorStateIllustration = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

/**
 * EnhancedErrorState - User-friendly error state with recovery actions
 */
export const EnhancedErrorState = ({
  title = 'Etwas ist schiefgelaufen',
  message = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.',
  details,
  illustration,
  actions = [],
  className = '',
}: {
  title?: string;
  message?: string;
  details?: string;
  illustration?: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      {/* Illustration with animation */}
      <SmoothReveal direction="scale" delay={0} duration={0.6}>
        <div className="w-24 h-24 mb-8 text-red-400 dark:text-red-600">
          {illustration || <ErrorStateIllustration className="w-full h-full" />}
        </div>
      </SmoothReveal>

      {/* Title */}
      <SmoothReveal direction="up" delay={0.1} duration={0.5}>
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
          {title}
        </h3>
      </SmoothReveal>

      {/* Message */}
      <SmoothReveal direction="up" delay={0.2} duration={0.5}>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mb-4 leading-relaxed">
          {message}
        </p>
      </SmoothReveal>

      {/* Error details (if provided) */}
      {details && (
        <SmoothReveal direction="up" delay={0.25} duration={0.5}>
          <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono text-left">
              {details}
            </p>
          </div>
        </SmoothReveal>
      )}

      {/* Action buttons */}
      {actions.length > 0 && (
        <SmoothReveal direction="up" delay={0.3} duration={0.5}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  transition-all duration-300 ease-out
                  hover:scale-[1.02] active:scale-[0.98]
                  focus:ring-2 focus:ring-primary-500/50 focus:outline-none
                  min-h-11
                  ${
                    action.variant === 'primary'
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:shadow-glow'
                      : action.variant === 'ghost'
                      ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </SmoothReveal>
      )}
    </div>
  );
};

// ============================================================================
// SUCCESS STATES
// ============================================================================

/**
 * SuccessStateIllustration - Success SVG illustration
 */
const SuccessStateIllustration = (props: SVGProps<SVGSVGElement>) => (
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
 * EnhancedSuccessState - Celebratory success state
 */
export const EnhancedSuccessState = ({
  title = 'Erfolgreich!',
  message = 'Deine Änderungen wurden gespeichert.',
  illustration,
  action,
  className = '',
}: {
  title?: string;
  message?: string;
  illustration?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      {/* Illustration with animation */}
      <SmoothReveal direction="scale" delay={0} duration={0.6}>
        <div className="w-24 h-24 mb-8 text-emerald-500 dark:text-emerald-400">
          {illustration || <SuccessStateIllustration className="w-full h-full" />}
        </div>
      </SmoothReveal>

      {/* Title */}
      <SmoothReveal direction="up" delay={0.1} duration={0.5}>
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
          {title}
        </h3>
      </SmoothReveal>

      {/* Message */}
      <SmoothReveal direction="up" delay={0.2} duration={0.5}>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
          {message}
        </p>
      </SmoothReveal>

      {/* Action button */}
      {action && (
        <SmoothReveal direction="up" delay={0.3} duration={0.5}>
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 focus:outline-none min-h-12"
          >
            {action.label}
          </button>
        </SmoothReveal>
      )}
    </div>
  );
};
