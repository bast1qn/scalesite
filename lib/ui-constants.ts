// ============================================
// SHARED UI CONSTANTS
// Reusable className patterns for consistency
// ============================================

/**
 * Border patterns for light/dark theme consistency
 */
export const borderPatterns = {
    /** Standard border for cards and containers */
    default: 'border-slate-200 dark:border-slate-700',

    /** Primary color border for interactive elements */
    primary: 'border-primary-300 dark:border-primary-600',

    /** Subtle border for separators */
    subtle: 'border-slate-100 dark:border-slate-800',
} as const;

/**
 * Background patterns for light/dark theme consistency
 */
export const backgroundPatterns = {
    /** Standard background for cards and containers */
    default: 'bg-white dark:bg-slate-800',

    /** Subtle background for sections */
    subtle: 'bg-slate-50 dark:bg-slate-900/50',

    /** Muted background for disabled states */
    muted: 'bg-slate-100 dark:bg-slate-800/50',

    /** Interactive background for hover states */
    interactive: 'bg-primary-50 dark:bg-primary-900/30',
} as const;

/**
 * Text color patterns for light/dark theme consistency
 */
export const textPatterns = {
    /** Primary text for headings and emphasis */
    primary: 'text-slate-900 dark:text-slate-100',

    /** Secondary text for body content */
    secondary: 'text-slate-600 dark:text-slate-400',

    /** Muted text for descriptions */
    muted: 'text-slate-500 dark:text-slate-500',

    /** Inverse text for dark backgrounds */
    inverse: 'text-white dark:text-white',
} as const;

/**
 * Combined card styles for consistency
 */
export const cardStyles = {
    /** Standard card with border and background */
    default: `${backgroundPatterns.default} ${borderPatterns.default}`,

    /** Interactive card with hover effects */
    interactive: `${backgroundPatterns.default} ${borderPatterns.default} hover:border-primary-300 dark:hover:border-primary-600 transition-colors`,

    /** Subtle card for less emphasis */
    subtle: `${backgroundPatterns.subtle} ${borderPatterns.subtle}`,
} as const;

/**
 * Input field styles for consistency
 */
export const inputStyles = {
    /** Standard input field */
    default: `${backgroundPatterns.default} ${borderPatterns.default} ${textPatterns.primary} focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500`,

    /** Disabled input field */
    disabled: `${backgroundPatterns.muted} ${borderPatterns.subtle} ${textPatterns.muted} cursor-not-allowed`,
} as const;

/**
 * Button variant styles
 */
export const buttonStyles = {
    /** Primary action button */
    primary: 'bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors',

    /** Secondary action button */
    secondary: `${backgroundPatterns.default} ${borderPatterns.default} ${textPatterns.primary} hover:${backgroundPatterns.subtle} transition-colors`,

    /** Ghost button (no background) */
    ghost: `${textPatterns.primary} hover:${backgroundPatterns.subtle} transition-colors`,
} as const;

/**
 * Shadow utilities
 */
export const shadowStyles = {
    /** Soft shadow for elevation */
    soft: 'shadow-sm',

    /** Premium shadow for emphasis */
    premium: 'shadow-lg shadow-primary-500/10',

    /** Subtle shadow for depth */
    subtle: 'shadow-xs',
} as const;

/**
 * Transition utilities
 */
export const transitionStyles = {
    /** Standard transition */
    default: 'transition-all duration-200',

    /** Slow transition for dramatic effects */
    slow: 'transition-all duration-300',

    /** Fast transition for quick interactions */
    fast: 'transition-all duration-150',
} as const;
