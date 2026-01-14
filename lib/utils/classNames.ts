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
 * Quick action button styling (used in Overview, Settings)
 * @example
 * <button className={quickActionBtn}>Click me</button>
 */
export const quickActionBtn = "group w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-500/50 min-h-11";

/**
 * Quick action button text styling
 */
export const quickActionBtnText = "text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors";

/**
 * Quick action button icon styling
 */
export const quickActionBtnIcon = "w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all";

/**
 * Status badge base styling
 */
export const statusBadgeBase = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm";

/**
 * Status colors for different states
 */
export const statusColors = {
    pending: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40",
    active: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40",
    completed: "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40",
    cancelled: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-800/40",
    open: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    inProgress: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    closed: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
} as const;

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
