/**
 * InteractiveButton - Reusable button with consistent animations
 *
 * Provides a standardized button with:
 * - Subtle scale animation on hover/active
 * - Multiple variants (primary, secondary, icon)
 * - Dark mode support
 * - Focus ring for accessibility
 *
 * @example
 * ```tsx
 * <InteractiveButton variant="primary" onClick={handleClick}>
 *   Click me
 * </InteractiveButton>
 *
 * <InteractiveButton variant="icon" icon={<Icon />}>
 *   Icon Button
 * </InteractiveButton>
 * ```
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BUTTON_STYLES, INTERACTIVE_STATES, TRANSITION_STYLES } from '@/lib/constants';

type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'ghost';

interface InteractiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content or children */
  children?: ReactNode;
  /** Button style variant */
  variant?: ButtonVariant;
  /** Additional className for custom styling */
  className?: string;
  /** Icon to display (for icon variant) */
  icon?: ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export const InteractiveButton = ({
  children,
  variant = 'primary',
  className,
  icon,
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    TRANSITION_STYLES.smooth,
    'focus:ring-2',
    'focus:ring-primary-500/50',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = BUTTON_STYLES.primary;
      break;
    case 'secondary':
      variantClasses = BUTTON_STYLES.secondary;
      break;
    case 'icon':
      variantClasses = BUTTON_STYLES.icon;
      break;
    case 'ghost':
      variantClasses = cn(
        INTERACTIVE_STATES.hoverScale,
        'px-4 py-2',
        'bg-transparent',
        'hover:bg-slate-100 dark:hover:bg-slate-800'
      );
      break;
  }

  return (
    <button
      className={cn(...baseClasses, variantClasses, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
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
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default InteractiveButton;
