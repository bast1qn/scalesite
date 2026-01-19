import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';

// ============================================
// INPUT VARIANTS - Consistent Design System
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={errorId}
            className={`
              block w-full px-5 py-3 text-base rounded-2xl
              bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
              border transition-all duration-300 ease-out
              placeholder-slate-400 dark:placeholder-slate-500
              text-slate-900 dark:text-slate-100
              min-h-11
              ${leftIcon ? 'pl-10' : 'pl-5'}
              ${rightIcon ? 'pr-10' : 'pr-5'}
              ${
                error
                  ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 dark:focus:border-rose-400 animate-error-shake'
                  : 'border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary-400 dark:focus:border-primary-500 shadow-input-focus'
              }
              focus:outline-none
              hover:-translate-y-px
              focus:-translate-y-px
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-2 text-sm text-rose-500 dark:text-rose-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
