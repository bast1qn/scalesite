/**
 * UI Patterns & Constants
 * Centralized location for commonly repeated UI patterns to reduce duplication
 */

// ============================================
// BUTTON PATTERNS
// ============================================

/**
 * Common button base styles - reduces className duplication
 * Used for consistent button styling across the application
 */
export const BUTTON_BASE = 'relative inline-flex items-center justify-center transition-all duration-300 rounded-xl focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-11';

/**
 * Primary button gradient pattern
 * Used for main CTAs and primary actions
 */
export const BUTTON_PRIMARY = `${BUTTON_BASE} px-8 py-4 bg-gradient-to-r from-primary-600 to-violet-600 text-white font-semibold hover:shadow-premium hover:scale-[1.02] active:scale-[0.98]`;

/**
 * Secondary button pattern with border
 * Used for secondary actions and alternative options
 */
export const BUTTON_SECONDARY = `${BUTTON_BASE} px-8 py-4 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700/60 hover:border-primary-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]`;

/**
 * Icon button pattern (minimal padding, square aspect)
 * Used for icon-only buttons like toggles and close buttons
 */
export const BUTTON_ICON = `${BUTTON_BASE} p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]`;

// ============================================
// INPUT PATTERNS
// ============================================

/**
 * Base input field styling
 * Used for text inputs, textareas, and select fields
 */
export const INPUT_BASE = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300';

// ============================================
// CARD PATTERNS
// ============================================

/**
 * Standard card container pattern
 * Used for content cards, feature cards, etc.
 */
export const CARD_BASE = 'relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-premium hover:shadow-premium-lg transition-all duration-300';

/**
 * Interactive card pattern with hover effects
 * Used for clickable cards like project cards, feature cards
 */
export const CARD_INTERACTIVE = `${CARD_BASE} cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:border-primary-300/60 dark:hover:border-violet-500/60`;

// ============================================
// NAVIGATION PATTERNS
// ============================================

/**
 * Navigation button pattern (used in header, menus)
 * Consistent styling for navigation elements
 */
export const NAV_BUTTON = 'relative px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-all duration-300 rounded-2xl min-h-11';

/**
 * Active navigation button state
 */
export const NAV_BUTTON_ACTIVE = `${NAV_BUTTON} text-white bg-gradient-to-r from-primary-600 to-violet-600 shadow-premium`;

/**
 * Inactive navigation button state
 */
export const NAV_BUTTON_INACTIVE = `${NAV_BUTTON} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50`;

// ============================================
// HEADER/BACKDROP PATTERNS
// ============================================

/**
 * Scrolled/collapsed header state
 * Used when page is scrolled or menu is open
 */
export const HEADER_SCROLLED = 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-soft py-3';

/**
 * Transparent header state (initial state at top)
 */
export const HEADER_TRANSPARENT = 'bg-transparent border-transparent py-4 md:py-5';

// ============================================
// TEXT GRADIENT PATTERNS
// ============================================

/**
 * Gradient text pattern for headings and highlights
 * Usage: className={TEXT_GRADIENT_PRIMARY}
 */
export const TEXT_GRADIENT_PRIMARY = 'text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600';

/**
 * Gradient text pattern with dark mode support
 * Usage: className={TEXT_GRADIENT_PRIMARY_DARK}
 */
export const TEXT_GRADIENT_PRIMARY_DARK = 'text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400';

// ============================================
// ANIMATION DURATIONS
// ============================================

/**
 * Standard animation timing constants
 * Reduces magic numbers in animations
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 700,
} as const;

/**
 * Transition easing functions
 */
export const ANIMATION_EASING = {
  SMOOTH: 'ease-smooth',
  IN_OUT: 'ease-in-out',
  OUT: 'ease-out',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// ============================================
// SPACING & SIZES
// ============================================

/**
 * Standard spacing constants
 * Used for consistent margins, padding, and gaps
 */
export const SPACING = {
  XS: '0.5rem',   // 8px
  SM: '0.75rem',  // 12px
  MD: '1rem',     // 16px
  LG: '1.5rem',   // 24px
  XL: '2rem',     // 32px
  XXL: '3rem',    // 48px
} as const;

/**
 * Border radius constants
 */
export const RADIUS = {
  SM: '0.5rem',   // 8px
  MD: '0.75rem',  // 12px
  LG: '1rem',     // 16px
  XL: '1.5rem',   // 24px
  FULL: '9999px', // Fully rounded
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================

/**
 * Z-index layer constants
 * Ensures consistent layering across the application
 */
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 50,
  STICKY: 100,
  FIXED: 500,
  MODAL_BACKDROP: 1000,
  MODAL: 1050,
  TOOLTIP: 1100,
} as const;

// ============================================
// BREAKPOINTS (for reference)
// ============================================

/**
 * Tailwind breakpoint values
 * Reference for programmatic breakpoint usage
 */
export const BREAKPOINTS = {
  SM: 640,   // 640px
  MD: 768,   // 768px
  LG: 1024,  // 1024px
  XL: 1280,  // 1280px
  XXL: 1536, // 1536px
} as const;

// ============================================
// COMMON COLOR COMBINATIONS
// ============================================

/**
 * Text color combinations with dark mode
 * Reduces repetition of text-slate-X dark:text-slate-Y patterns
 */
export const TEXT_COLORS = {
  primary: 'text-slate-900 dark:text-white',
  secondary: 'text-slate-600 dark:text-slate-400',
  muted: 'text-slate-500 dark:text-slate-500',
  light: 'text-slate-400 dark:text-slate-600',
} as const;

/**
 * Background color combinations with dark mode
 */
export const BG_COLORS = {
  primary: 'bg-white dark:bg-slate-900',
  secondary: 'bg-slate-50 dark:bg-slate-800',
  muted: 'bg-slate-100/60 dark:bg-slate-800/60',
  transparent: 'bg-transparent',
} as const;

/**
 * Border color combinations with dark mode
 */
export const BORDER_COLORS = {
  default: 'border-slate-200 dark:border-slate-700',
  subtle: 'border-slate-200/60 dark:border-slate-700/60',
  strong: 'border-slate-300 dark:border-slate-600',
} as const;

// ============================================
// GRADIENT PATTERNS
// ============================================

/**
 * Pre-defined gradient patterns
 * Replaces lib/utils.ts GRADIENTS with more comprehensive options
 */
export const GRADIENTS = {
  /** Primary blue-violet gradient for CTAs and highlights */
  primary: 'bg-gradient-to-r from-primary-600 to-violet-600',

  /** Subtle background gradient */
  subtle: 'bg-gradient-to-br from-slate-50 via-white to-primary-50/20 dark:from-[#030305] dark:via-slate-950 dark:to-violet-950/10',

  /** Card hover gradient */
  card: 'bg-gradient-to-br from-primary-500/5 to-violet-500/5',

  /** Success gradient (green-emerald) */
  success: 'bg-gradient-to-r from-emerald-500 to-green-500',

  /** Warning gradient (amber-orange) */
  warning: 'bg-gradient-to-r from-amber-500 to-orange-500',

  /** Error gradient (red-rose) */
  error: 'bg-gradient-to-r from-red-500 to-rose-500',
} as const;

// ============================================
// SHADOW PATTERNS
// ============================================

/**
 * Shadow combinations for consistent elevation
 */
export const SHADOWS = {
  soft: 'shadow-soft',
  premium: 'shadow-premium',
  premiumLg: 'shadow-premium-lg',
  glow: 'shadow-glow',
  none: 'shadow-none',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Combine multiple class names with proper filtering
 * Re-exports from utils.ts for convenience
 */
export { cn } from './utils';

/**
 * Get transition classes with consistent timing
 * @param duration - Animation duration key
 * @param easing - Animation easing key
 * @returns Combined transition className
 */
export function transition(
  duration: keyof typeof ANIMATION_DURATION = 'NORMAL',
  easing: keyof typeof ANIMATION_EASING = 'IN_OUT'
): string {
  return `transition-all duration-${ANIMATION_DURATION[duration]} ${ANIMATION_EASING[easing]}`;
}

/**
 * Get responsive size classes
 * @param base - Base size class
 * @param sm - Small breakpoint size (optional)
 * @param md - Medium breakpoint size (optional)
 * @returns Combined responsive className
 */
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string
): string {
  let classes = base;
  if (sm) classes += ` ${sm}`;
  if (md) classes += ` ${md}`;
  if (lg) classes += ` ${lg}`;
  return classes;
}
