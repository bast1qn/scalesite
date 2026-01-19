/**
 * IconButton - Accessible icon-only button component
 *
 * Provides consistent UX for icon-only buttons with:
 * - Built-in ARIA label generation
 * - Smooth hover/active transitions (200-300ms ease-out)
 * - Enhanced focus ring for keyboard navigation
 * - Loading state support
 * - Multiple variants (primary, secondary, ghost, danger)
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<EditIcon />}
 *   label="Bearbeiten"
 *   variant="secondary"
 *   onClick={handleEdit}
 * />
 *
 * <IconButton
 *   icon={<DeleteIcon />}
 *   label="Löschen"
 *   variant="danger"
 *   confirm
 *   onConfirm={handleDelete}
 * />
 * ```
 */

import { type ReactNode, type ButtonHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to display */
  icon: ReactNode;
  /** ARIA label describing the button's action */
  label: string;
  /** Button style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Additional className for custom styling */
  className?: string;
  /** Show loading state */
  loading?: boolean;
  /** Show confirmation dialog (for destructive actions) */
  confirm?: boolean;
  /** Confirmation message */
  confirmMessage?: string;
  /** Callback when confirmed */
  onConfirm?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const variantClasses: Record<ButtonVariant, { base: string; hover: string }> = {
  primary: {
    base: 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-premium',
    hover: 'hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]',
  },
  secondary: {
    base: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-premium',
    hover: 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:scale-[1.02] active:scale-[0.98]',
  },
  ghost: {
    base: 'bg-transparent text-slate-600 dark:text-slate-400',
    hover: 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:scale-[1.02] active:scale-[0.98]',
  },
  danger: {
    base: 'bg-rose-500 text-white shadow-premium',
    hover: 'hover:bg-rose-600 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]',
  },
};

export const IconButton = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  loading = false,
  confirm = false,
  confirmMessage = 'Möchten Sie diese Aktion wirklich ausführen?',
  onConfirm,
  disabled,
  onClick,
  ...props
}: IconButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;

    if (confirm && !showConfirm) {
      e.preventDefault();
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }

    if (confirm && showConfirm) {
      setShowConfirm(false);
      onConfirm?.();
      return;
    }

    onClick?.(e);
  };

  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-xl',
    'font-medium',
    'transition-all',
    'duration-200',
    'ease-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500/70',
    'focus:ring-offset-2',
    'dark:focus:ring-offset-slate-900',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:hover:scale-100',
    'relative',
    'overflow-hidden',
  ];

  const sizeClass = sizeClasses[size];
  const iconSizeClass = iconSizeClasses[size];
  const { base: variantBase, hover: variantHover } = variantClasses[variant];

  return (
    <motion.button
      className={cn(
        ...baseClasses,
        sizeClass,
        variantBase,
        variantHover,
        className
      )}
      aria-label={showConfirm && confirm ? 'Abbrechen' : label}
      aria-busy={loading}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Loading spinner */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className={cn('animate-spin', iconSizeClass)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon with fade transition */}
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.span
            key="icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={cn('flex items-center justify-center', iconSizeClass)}
            aria-hidden="true"
          >
            {showConfirm && confirm ? (
              // X icon for cancel
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              icon
            )}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Confirmation tooltip */}
      <AnimatePresence>
        {showConfirm && confirm && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg whitespace-nowrap shadow-premium-lg pointer-events-none z-50"
          >
            {confirmMessage}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success/error feedback overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={false}
        animate={{
          boxShadow: showConfirm
            ? '0 0 0 3px rgba(244, 63, 94, 0.3)' // Red ring for confirmation
            : '0 0 0 0px rgba(75, 90, 237, 0)',
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default IconButton;
