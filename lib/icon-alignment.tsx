/**
 * ICON ALIGNMENT UTILITIES - Phase 2
 * Loop 16/200 | Focus: Visual Perfection
 * Referenz: Linear, Vercel, Stripe
 *
 * CONSISTENT ICON SIZES:
 * - xs: w-3 h-3 (12px) - Tiny icons (status dots, badges)
 * - sm: w-4 h-4 (16px) - Small icons (inline text, compact buttons)
 * - base: w-5 h-5 (20px) - Default icons (buttons, navigation)
 * - md: w-6 h-6 (24px) - Medium icons (cards, headers)
 * - lg: w-7 h-7 (28px) - Large icons (hero, featured)
 * - xl: w-8 h-8 (32px) - Extra large (modal headers, large CTAs)
 */

import { type ReactNode, type HTMLAttributes } from 'react';

// ==================== SIZE CONSTANTS ====================

/**
 * Consistent icon size mapping for pixel-perfect alignment
 * All icons should use these sizes for visual consistency
 */
export const iconSizes = {
  xs: 'w-3 h-3',    // 12px - Tiny
  sm: 'w-4 h-4',    // 16px - Small
  base: 'w-5 h-5',  // 20px - Default (RECOMMENDED for most icons)
  md: 'w-6 h-6',    // 24px - Medium
  lg: 'w-7 h-7',    // 28px - Large
  xl: 'w-8 h-8',    // 32px - Extra large
  '2xl': 'w-10 h-10', // 40px - Hero
  '3xl': 'w-12 h-12', // 48px - Feature
} as const;

export type IconSize = keyof typeof iconSizes;

// ==================== ALIGNMENT UTILITIES ====================

/**
 * Perfect vertical centering for icons with text
 * Usage: className="flex items-center gap-2"
 */
export const iconWithText = {
  base: 'flex items-center gap-2',      // Default spacing
  sm: 'flex items-center gap-1.5',      // Compact
  lg: 'flex items-center gap-3',        // Spacious
} as const;

/**
 * Icon button sizes - consistent touch targets
 * min-h-11 = 44px (WCAG AA minimum touch target)
 */
export const iconButtonSizes = {
  sm: 'w-8 h-8 min-h-8',      // 32px - Small icon buttons
  base: 'w-11 h-11 min-h-11',  // 44px - Default (RECOMMENDED)
  lg: 'w-14 h-14 min-h-14',   // 56px - Large icon buttons
} as const;

// ==================== WRAPPER COMPONENTS ====================

/**
 * IconWrapper - Consistent icon sizing wrapper
 * Ensures all icons are properly aligned and sized
 *
 * @example
 * <IconWrapper size="base" className="text-primary-500">
 *   <SomeIcon />
 * </IconWrapper>
 */
interface IconWrapperProps extends HTMLAttributes<HTMLSpanElement> {
  size?: IconSize;
  children: ReactNode;
  variant?: 'default' | 'button' | 'inline';
}

export const IconWrapper = ({
  size = 'base',
  children,
  variant = 'default',
  className = '',
  ...props
}: IconWrapperProps) => {
  const sizeClasses = iconSizes[size];
  const variantClasses = {
    default: 'inline-flex items-center justify-center',
    button: 'inline-flex items-center justify-center rounded-xl',
    inline: 'inline-flex items-center',
  };

  return (
    <span
      className={`${sizeClasses} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * IconButton - Consistent icon button with proper alignment
 *
 * @example
 * <IconButton size="base" icon={<MenuIcon />} label="Open menu" onClick={handleClick} />
 */
interface IconButtonProps {
  icon: ReactNode;
  label: string;
  size?: keyof typeof iconButtonSizes;
  variant?: 'ghost' | 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton = ({
  icon,
  label,
  size = 'base',
  variant = 'ghost',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: IconButtonProps) => {
  const sizeClasses = iconButtonSizes[size];
  const buttonClasses = {
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  };

  return (
    <button
      type={type}
      aria-label={label}
      disabled={disabled}
      className={`
        ${sizeClasses}
        ${buttonClasses[variant]}
        inline-flex items-center justify-center
        rounded-xl
        transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        focus:ring-2 focus:ring-primary-500/50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `.trim()}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

// ==================== ALIGNMENT HELPERS ====================

/**
 * Get icon size class by usage context
 * Helps maintain consistency across the app
 */
export const getIconSizeForContext = (context: 'nav' | 'button' | 'card' | 'hero' | 'inline'): IconSize => {
  const sizeMap: Record<typeof context, IconSize> = {
    nav: 'base',      // Navigation icons: 20px
    button: 'base',   // Button icons: 20px
    card: 'md',       // Card icons: 24px
    hero: '2xl',      // Hero icons: 40px
    inline: 'sm',     // Inline text icons: 16px
  };
  return sizeMap[context];
};

/**
 * Validation helper - check if icon size is valid
 */
export const isValidIconSize = (size: string): size is IconSize => {
  return Object.keys(iconSizes).includes(size);
};

// ==================== ALIGNMENT VIZUALIZATION ====================

/**
 * Development-only visualizer for icon alignment
 * Shows a grid of all icon sizes for reference
 */
export const IconSizeVisualizer = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xl z-50">
      <p className="text-xs font-semibold text-slate-500 mb-3">Icon Sizes (Phase 2)</p>
      <div className="space-y-2">
        {Object.entries(iconSizes).map(([name, sizeClass]) => (
          <div key={name} className="flex items-center gap-3">
            <div className={`bg-primary-500 rounded ${sizeClass}`}></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {name}: {sizeClass}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
