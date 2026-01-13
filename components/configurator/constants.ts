// ============================================
// CONFIGURATOR - Shared Constants
// Reusable className patterns and magic numbers
// ============================================

/**
 * Common button styles for configurator components
 */
export const BUTTON_STYLES = {
    primary: 'px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors',
    secondary: 'px-4 py-2 text-dark-text/60 dark:text-light-text/60 hover:text-red-500 dark:hover:text-red-400 transition-colors',
    icon: 'text-sm text-primary hover:text-primary/80 transition-colors'
} as const;

/**
 * Common input styles
 */
export const INPUT_STYLES = {
    base: 'w-full px-4 py-2 border rounded-md bg-surface dark:bg-dark-surface text-dark-text dark:text-light-text',
    error: 'border-red-500',
    normal: 'border-dark-text/20 dark:border-light-text/20',
    disabled: 'cursor-not-allowed opacity-50'
} as const;

/**
 * Card/container styles
 */
export const CARD_STYLES = {
    base: 'bg-surface dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-dark-text/10 dark:border-light-text/10',
    hover: 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300'
} as const;

/**
 * Text styles
 */
export const TEXT_STYLES = {
    label: 'block text-sm font-medium text-dark-text dark:text-light-text mb-2',
    error: 'text-sm text-red-500',
    hint: 'text-xs text-dark-text/60 dark:text-light-text/60'
} as const;

/**
 * Animation constants
 */
export const ANIMATION_DURATION = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5
} as const;

/**
 * Validation constants
 */
export const VALIDATION_LIMITS = {
    HEADLINE_MIN: 5,
    HEADLINE_MAX: 100,
    SUBHEADLINE_MAX: 200,
    ABOUT_TEXT_MIN: 20,
    ABOUT_TEXT_MAX: 2000
} as const;

/**
 * Auto-save delay in milliseconds
 */
export const AUTO_SAVE_DELAY = 3000;

/**
 * Success message display duration in milliseconds
 */
export const SUCCESS_MESSAGE_DELAY = 3000;
