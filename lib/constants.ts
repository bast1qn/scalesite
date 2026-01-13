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

// ===== TIMING VALUES =====

/**
 * Standard timing values in milliseconds
 */
export const TIMING = {
  /** Fast UI transition (150ms) */
  uiFast: 150,
  /** Normal UI transition (300ms) */
  uiNormal: 300,
  /** Slow UI transition (500ms) */
  uiSlow: 500,
  /** Stagger delay for animations (50ms) */
  staggerFast: 50,
  /** Stagger delay for animations (100ms) */
  staggerNormal: 100,
  /** Stagger delay for animations (150ms) */
  staggerSlow: 150,
  /** Loading timeout before showing reset button (8000ms) */
  loadingTimeout: 8000,
  /** Default request timeout (30000ms) */
  requestTimeout: 30000,
  /** Toast notification duration (3000ms) */
  toastDuration: 3000,
  /** Days for offer countdown (7) */
  offerDays: 7,
  /** Success message auto-hide duration (3000ms) */
  successMessageDuration: 3000,
  /** Theme transition duration (300ms) */
  themeTransitionDuration: 300,
  /** Initial render flash prevention delay (100ms) */
  initialRenderDelay: 100,
  /** Password strength indicator segments (3) */
  passwordStrengthSegments: 3,
} as const;

// ===== API & CACHE VALUES =====

/**
 * API and caching-related constants
 */
export const API = {
  /** Cache TTL for API responses (5000ms) */
  cacheTTL: 5000,
  /** Default pagination limit (50) */
  defaultLimit: 50,
  /** Invoice number padding (6 digits) */
  invoiceNumberPadding: 6,
  /** Invoice due date default (14 days) */
  invoiceDueDays: 14,
  /** Default project milestones count (5) */
  defaultMilestonesCount: 5,
} as const;

// ===== VALIDATION THRESHOLDS =====

/**
 * Validation and form-related thresholds
 */
export const VALIDATION = {
  /** Minimum password length (8) */
  minPasswordLength: 8,
  /** Maximum password length (128) */
  maxPasswordLength: 128,
  /** Minimum name length (2) */
  minNameLength: 2,
  /** Maximum name length (100) */
  maxNameLength: 100,
  /** Default project duration in weeks (12) */
  defaultProjectWeeks: 12,
} as const;

// ===== CLASSNAME PATTERNS =====

/**
 * Common button styles for consistency
 */
export const BUTTON_STYLES = {
  /** Primary gradient button with hover effects */
  primary: 'relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-violet-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
  /** Secondary outline button */
  secondary: 'px-8 py-4 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
  /** Small icon button */
  icon: 'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary-500/50',
} as const;

/**
 * Common text styles for consistency
 */
export const TEXT_STYLES = {
  /** Primary gradient text */
  gradientPrimary: 'text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600',
  /** Blue gradient text */
  gradientBlue: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600',
  /** Premium gradient text */
  gradientPremium: 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600',
} as const;

/**
 * Common card styles
 */
export const CARD_STYLES = {
  /** Interactive card with hover effects */
  interactive: 'group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-premium overflow-hidden border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400/60 dark:hover:border-violet-500/60 hover:shadow-premium-lg hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2',
  /** Simple card */
  simple: 'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300',
} as const;

/**
 * Common transition patterns
 */
export const TRANSITION_STYLES = {
  /** Fast scale on hover */
  hoverScale: 'transition-all duration-300 hover:scale-105 active:scale-95',
  /** Smooth fade and slide */
  fadeSlide: 'transition-all duration-300',
  /** Default interactive transition */
  interactive: 'transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary-500/50',
} as const;
