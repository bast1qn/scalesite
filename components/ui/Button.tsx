import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ============================================
// BUTTON VARIANTS - Consistent Design System
// ============================================

const buttonVariants = cva(
  // Base styles - consistent min-h-11, duration-300, ease-out transitions
  'inline-flex items-center justify-center min-h-11 font-semibold rounded-2xl transition-all duration-300 ease-out focus:ring-2 focus:ring-primary-500/70 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
  {
    variants: {
      variant: {
        primary: 'relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]',
        ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        sm: 'px-4 py-2 text-sm min-h-9',
        md: 'px-6 py-3 text-sm min-h-11',
        lg: 'px-8 py-4 text-base min-h-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// ============================================
// BUTTON COMPONENT - Unified interface
// ============================================

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`${buttonVariants({ variant, size })} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
