// ============================================
// PREMIUM BUTTON SYSTEM
// Reference: Linear, Vercel, Stripe design systems
// Focus: Pixel-perfect interactions, consistent states
// ============================================

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

/* ==================== PREMIUM BUTTON VARIANTS ==================== */

export interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * PremiumButton - Consistent button system with micro-interactions
 *
 * Features:
 * - Perfect pixel alignment
 * - Consistent hover states (scale-[1.02])
 * - Consistent active states (scale-[0.98])
 * - GPU-accelerated transitions
 * - Accessible focus states
 * - Loading state with spinner
 *
 * @example
 * <PremiumButton variant="primary" size="md" leftIcon={<Icon />}>
 *   Click me
 * </PremiumButton>
 */
export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    // Variant styles
    const variantStyles = {
      primary: `
        relative inline-flex items-center justify-center
        bg-gradient-to-r from-primary-600 to-secondary-500
        text-white font-semibold
        hover:shadow-glow hover:shadow-premium-lg
        before:content-[''] before:absolute before:inset-0
        before:bg-gradient-to-r before:from-secondary-500 before:to-primary-600
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      `,
      secondary: `
        text-slate-700 dark:text-slate-300 font-semibold
        border border-slate-200 dark:border-slate-700
        hover:border-primary-400 dark:hover:border-primary-500
        hover:bg-slate-50 dark:hover:bg-slate-800
      `,
      ghost: `
        text-slate-600 dark:text-slate-400 font-medium
        hover:bg-slate-100 dark:hover:bg-slate-800
        hover:text-slate-900 dark:hover:text-slate-200
      `,
      danger: `
        bg-red-500 text-white font-semibold
        hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20
      `,
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-5 py-2.5 text-sm rounded-xl gap-2 min-h-9',
      md: 'px-8 py-4 text-base rounded-2xl gap-2 min-h-11',
      lg: 'px-10 py-5 text-lg rounded-3xl gap-3 min-h-14',
    };

    // Base styles - consistent across all variants
    const baseStyles = `
      inline-flex items-center justify-center
      transition-all duration-300 ease-out
      hover:scale-[1.02] active:scale-[0.98]
      focus:ring-2 focus:ring-primary-500/50 focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      will-change: transform
      ${fullWidth ? 'w-full' : ''}
    `;

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Content wrapper for z-index stacking with gradient overlay */}
        <span className="relative z-10 flex items-center gap-2">
          {/* Left icon */}
          {leftIcon && !isLoading && (
            <span className="icon-aligned flex-shrink-0">
              {leftIcon}
            </span>
          )}

          {/* Loading spinner */}
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {/* Button text */}
          <span className="truncate">
            {children}
          </span>

          {/* Right icon */}
          {rightIcon && !isLoading && (
            <span className="icon-aligned flex-shrink-0">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

/* ==================== PREMIUM ICON BUTTON ==================== */

export interface PremiumIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon: ReactNode;
  ariaLabel: string;
}

/**
 * PremiumIconButton - Perfect square icon button
 *
 * Features:
 * - Consistent sizing (44px minimum for touch targets)
 * - Perfect icon centering
 * - Smooth micro-interactions
 *
 * @example
 * <PremiumIconButton icon={<Icon />} ariaLabel="Close" />
 */
export const PremiumIconButton = forwardRef<HTMLButtonElement, PremiumIconButtonProps>(
  ({
    variant = 'ghost',
    size = 'md',
    isLoading = false,
    icon,
    ariaLabel,
    className,
    disabled,
    ...props
  }, ref) => {
    // Variant styles
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-primary-600 to-secondary-500
        text-white hover:shadow-glow
      `,
      secondary: `
        text-slate-700 dark:text-slate-300
        border border-slate-200 dark:border-slate-700
        hover:bg-slate-50 dark:hover:bg-slate-800
      `,
      ghost: `
        text-slate-600 dark:text-slate-400
        hover:bg-slate-100 dark:hover:bg-slate-800
        hover:text-slate-900 dark:hover:text-slate-200
      `,
    };

    // Size styles
    const sizeStyles = {
      sm: 'p-2 rounded-lg min-w-9 min-h-9',
      md: 'p-3 rounded-xl min-w-11 min-h-11',
      lg: 'p-4 rounded-2xl min-w-14 min-h-14',
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          `
            inline-flex items-center justify-center
            transition-all duration-300 ease-out
            hover:scale-[1.02] active:scale-[0.98]
            focus:ring-2 focus:ring-primary-500/50 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            will-change: transform
          `,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <span className="icon-aligned">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

PremiumIconButton.displayName = 'PremiumIconButton';
