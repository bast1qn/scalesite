/**
 * Reusable Tailwind CSS className patterns
 * Centralized to ensure consistency across the application
 */

/**
 * Base card styling - used for cards, panels, containers
 */
export const cardBase = "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800";

/**
 * Card with hover effect
 */
export const cardHover = "hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300";

/**
 * Text colors for primary content
 */
export const textPrimary = "text-slate-900 dark:text-white";

/**
 * Text colors for secondary content
 */
export const textSecondary = "text-slate-600 dark:text-slate-400";

/**
 * Text colors for muted content
 */
export const textMuted = "text-slate-500 dark:text-slate-500";

/**
 * Input field base styling
 */
export const inputBase = "px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

/**
 * Button primary gradient
 */
export const btnPrimaryGradient = "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-all duration-200";

/**
 * Container with padding
 */
export const containerPadding = "p-6";

/**
 * Section spacing
 */
export const sectionSpacing = "space-y-6";

/**
 * Flex center alignment
 */
export const flexCenter = "flex items-center justify-center";

/**
 * Modal overlay
 */
export const modalOverlay = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm";

/**
 * Modal content container
 */
export const modalContent = "bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden";

/**
 * Helper function to combine class names
 * Filters out falsy values and joins with spaces
 *
 * @param classes - Array of class names or conditional class names
 * @returns Combined class string
 *
 * @example
 * cn('base-class', isActive && 'active-class', null, 'another-class')
 * // Returns: 'base-class active-class another-class'
 */
export function cn(...classes: (string | boolean | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}
