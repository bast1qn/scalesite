// ============================================
// PREMIUM INPUT SYSTEM
// Reference: Linear, Vercel, Stripe design systems
// Focus: Pixel-perfect inputs, smooth micro-interactions
// ============================================

import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '../../lib/utils';

/* ==================== PREMIUM INPUT VARIANTS ==================== */

export interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
}

/**
 * PremiumInput - Consistent input system with micro-interactions
 *
 * Features:
 * - Perfect pixel alignment
 * - Smooth focus transitions
 * - Consistent spacing (4px scale)
 * - Error states with shake animation
 * - Helper text support
 * - Icon support
 *
 * @example
 * <PremiumInput
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 *   leftIcon={<MailIcon />}
 * />
 */
export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconClick,
    variant = 'default',
    className,
    disabled,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Variant styles
    const variantStyles = {
      default: `
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
        border border-slate-200/80 dark:border-slate-700/80
        placeholder-slate-400 dark:placeholder-slate-500
        text-slate-900 dark:text-slate-100
        transition-all duration-300 ease-out
        will-change: border-color, box-shadow, transform
      `,
      filled: `
        bg-slate-100 dark:bg-slate-900/50
        border-2 border-transparent
        placeholder-slate-400 dark:placeholder-slate-500
        text-slate-900 dark:text-slate-100
        transition-all duration-300 ease-out
      `,
      outlined: `
        bg-transparent dark:bg-transparent
        border-2 border-slate-300 dark:border-slate-700
        placeholder-slate-400 dark:placeholder-slate-500
        text-slate-900 dark:text-slate-100
        transition-all duration-300 ease-out
      `,
    };

    // Focus styles
    const focusStyles = `
      focus:outline-none
      focus:border-primary-400 dark:focus:border-primary-500
      focus:shadow-input-focus
      focus:translate-y-[-1px] focus:scale-[1.005]
    `;

    // Hover styles
    const hoverStyles = `
      hover:border-slate-300 dark:hover:border-slate-600
      hover:translate-y-[-0.5px]
    `;

    // Active styles
    const activeStyles = `
      active:scale-[0.998]
    `;

    // Error styles
    const errorStyles = error
      ? `
        border-red-400 dark:border-red-500
        focus:border-red-500 dark:focus:border-red-400
        focus:shadow-red-500/20
        animate-error-shake
      `
      : '';

    return (
      <div className="relative">
        {/* Label */}
        {label && (
          <label
            className={cn(
              'block text-sm font-medium mb-2 transition-colors duration-200',
              error
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-700 dark:text-slate-300'
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none icon-aligned">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            className={cn(
              // Base styles
              `
                block w-full
                ${leftIcon ? 'pl-12' : 'px-5'}
                ${rightIcon ? 'pr-12' : 'pr-5'}
                py-3
                text-base
                rounded-2xl
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              `,
              variantStyles[variant],
              focusStyles,
              !disabled && !isFocused && hoverStyles,
              activeStyles,
              errorStyles,
              className
            )}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 icon-aligned transition-colors duration-200',
                onRightIconClick
                  ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer'
                  : 'text-slate-400 dark:text-slate-500 pointer-events-none'
              )}
              disabled={disabled}
            >
              {rightIcon}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

/* ==================== PREMIUM TEXTAREA ==================== */

export interface PremiumTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

/**
 * PremiumTextarea - Consistent textarea with same styles as input
 *
 * Features:
 * - Same styling as PremiumInput
 * - Configurable resize behavior
 * - Auto-expand support (coming soon)
 *
 * @example
 * <PremiumTextarea
 *   label="Message"
 *   placeholder="Enter your message"
 *   rows={4}
 * />
 */
export const PremiumTextarea = forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  ({
    label,
    error,
    helperText,
    variant = 'default',
    resize = 'vertical',
    className,
    disabled,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Variant styles (same as input)
    const variantStyles = {
      default: `
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
        border border-slate-200/80 dark:border-slate-700/80
        placeholder-slate-400 dark:placeholder-slate-500
        text-slate-900 dark:text-slate-100
        transition-all duration-300 ease-out
        will-change: border-color, box-shadow, transform
      `,
      filled: `
        bg-slate-100 dark:bg-slate-900/50
        border-2 border-transparent
        placeholder-slate-400 dark:placeholder-slate-500
        text-slate-900 dark:text-slate-100
        transition-all duration-300 ease-out
      `,
      outlined: `
        bg-transparent dark:bg-transparent
        border-2 border-slate-300 dark:border-slate-700
        placeholder-slate-400 dark:placeholder-slate-500
        text-slate-900 dark:text-slate-100
        transition-all duration-300 ease-out
      `,
    };

    // Focus styles
    const focusStyles = `
      focus:outline-none
      focus:border-primary-400 dark:focus:border-primary-500
      focus:shadow-input-focus
      focus:translate-y-[-1px] focus:scale-[1.005]
    `;

    // Hover styles
    const hoverStyles = `
      hover:border-slate-300 dark:hover:border-slate-600
      hover:translate-y-[-0.5px]
    `;

    // Error styles
    const errorStyles = error
      ? `
        border-red-400 dark:border-red-500
        focus:border-red-500 dark:focus:border-red-400
        focus:shadow-red-500/20
        animate-error-shake
      `
      : '';

    return (
      <div className="relative">
        {/* Label */}
        {label && (
          <label
            className={cn(
              'block text-sm font-medium mb-2 transition-colors duration-200',
              error
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-700 dark:text-slate-300'
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          className={cn(
            // Base styles
            `
              block w-full
              px-5 py-3
              text-base
              rounded-2xl
              resize-${resize}
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            `,
            variantStyles[variant],
            focusStyles,
            !disabled && !isFocused && hoverStyles,
            errorStyles,
            className
          )}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PremiumTextarea.displayName = 'PremiumTextarea';
