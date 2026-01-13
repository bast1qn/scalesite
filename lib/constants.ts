/**
 * Centralized constants for ScaleSite
 * Reduces duplication and provides single source of truth for commonly used values
 */

// ===== GRADIENTS =====

/**
 * Gradient class strings for Tailwind CSS
 * Usage: className={GRADIENTS.primary}
 */
export const GRADIENTS = {
  /** Primary blue to violet gradient */
  primary: 'from-blue-600 to-violet-600',
  /** Lighter variant of primary gradient */
  primaryLight: 'from-blue-500 to-violet-500',
  /** Premium gradient with deeper blue */
  premium: 'from-primary-600 to-violet-600',
  /** Emerald to teal gradient */
  emerald: 'from-emerald-500 to-teal-400',
  /** Sunset orange to amber gradient */
  sunset: 'from-orange-500 to-amber-500',
  /** Rose to pink gradient */
  rose: 'from-rose-500 to-pink-500',
  /** Blue to cyan gradient */
  blueCyan: 'from-blue-500 to-cyan-500',
  /** Violet to purple gradient */
  violetPurple: 'from-violet-500 to-purple-500',
  /** Indigo to violet gradient */
  indigoViolet: 'from-indigo-600 to-violet-600',
  /** Three-color gradient: blue -> violet -> cyan */
  triColor: 'from-blue-600 via-violet-600 to-cyan-600',
} as const;

// ===== ANIMATION DELAYS =====

/**
 * Standard animation delay values in milliseconds
 */
export const ANIMATION_DELAY = {
  /** Fast stagger for multiple elements */
  staggerFast: 50,
  /** Normal stagger for multiple elements */
  staggerNormal: 100,
  /** Slow stagger for multiple elements */
  staggerSlow: 150,
  /** Offset for blob/particle animations */
  blobOffset: 3000,
} as const;

// ===== BREAKPOINTS =====

/**
 * Screen size breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ===== Z-INDEX LAYERS =====

/**
 * Z-index layers for consistent stacking context
 */
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
