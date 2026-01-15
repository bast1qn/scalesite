// ============================================
// UX POLISH CONSTANTS (Linear/Stripe-inspired)
// Loop 11/Phase 2: Refinement
// ============================================

/**
 * MICRO-INTERACTION CONSTANTS
 * Consistent 200-300ms ease-out transitions
 */
export const MICRO_INTERACTIONS = {
  // Hover transitions (200-300ms ease-out)
  HOVER_DURATION: 250, // ms - sweet spot for responsive but smooth
  HOVER_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)', // ease-out

  // Active/press states (faster for responsiveness)
  ACTIVE_DURATION: 150, // ms - quick feedback
  ACTIVE_EASING: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out

  // Focus transitions (smooth but visible)
  FOCUS_DURATION: 200, // ms
  FOCUS_EASING: 'cubic-bezier(0.4, 0, 0.6, 1)', // ease-in-out

  // Scale transformations (subtle 2% changes)
  SCALE_HOVER: 1.02, // 2% scale up
  SCALE_ACTIVE: 0.98, // 2% scale down
  SCALE_NORMAL: 1.0,
} as const;

/**
 * LOADING STATE CONSTANTS
 * Premium skeleton shimmer (not just pulse)
 */
export const LOADING_STATES = {
  // Shimmer animation (linear, continuous)
  SHIMMER_DURATION: 1500, // ms - fast enough to feel responsive
  SHIMMER_EASING: 'linear',
  SHIMMER_DELAY: 200, // ms - stagger effect

  // Pulse animation (gentle, for infinite loading)
  PULSE_DURATION: 2000, // ms - 2s cycle
  PULSE_EASING: 'cubic-bezier(0.4, 0, 0.6, 1)',
  PULSE_MIN_OPACITY: 0.6,
  PULSE_MAX_OPACITY: 1.0,

  // Progress indicators
  PROGRESS_SMOOTH: true,
  PROGRESS_DURATION: 1000, // ms - smooth transitions
} as const;

/**
 * FEEDBACK ANIMATION CONSTANTS
 * Subtle, non-intrusive success/error feedback
 */
export const FEEDBACK_ANIMATIONS = {
  // Success feedback (subtle glow + scale)
  SUCCESS_DURATION: 600, // ms
  SUCCESS_EASING: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // spring
  SUCCESS_SCALE: 1.02,
  SUCCESS_GLOW_SIZE: 24, // px
  SUCCESS_GLOW_OPACITY: 0.3,
  SUCCESS_COLOR: 'rgba(16, 185, 129, 1)', // emerald-500

  // Error feedback (shake + red pulse)
  ERROR_SHAKE_DURATION: 500, // ms
  ERROR_SHAKE_DISTANCE: 4, // px - subtle
  ERROR_SHAKE_ITERATIONS: 3,
  ERROR_FADE_DURATION: 1500, // ms
  ERROR_COLOR: 'rgba(244, 63, 94, 1)', // rose-500

  // Warning feedback (yellow glow)
  WARNING_GLOW_OPACITY: 0.2,
  WARNING_COLOR: 'rgba(245, 158, 11, 1)', // amber-500

  // Info feedback (blue glow)
  INFO_GLOW_OPACITY: 0.15,
  INFO_COLOR: 'rgba(59, 130, 246, 1)', // blue-500
} as const;

/**
 * TRANSITION CONSTANTS
 * Page/Route transitions (if using framer-motion)
 */
export const PAGE_TRANSITIONS = {
  // Fade transition (subtle, professional)
  FADE_DURATION: 400, // ms
  FADE_EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Slide transition (smooth, directional)
  SLIDE_DURATION: 350, // ms
  SLIDE_DISTANCE: 20, // px - subtle
  SLIDE_EASING: 'cubic-bezier(0.25, 0.4, 0.25, 1)',

  // Scale transition (subtle zoom)
  SCALE_DURATION: 300, // ms
  SCALE_START: 0.98,
  SCALE_END: 1.0,
  SCALE_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/**
 * ACCESSIBILITY CONSTANTS
 * WCAG AA compliant focus indicators
 */
export const ACCESSIBILITY = {
  // Focus ring (visible, beautiful)
  FOCUS_RING_WIDTH: 2, // px
  FOCUS_RING_OFFSET: 2, // px
  FOCUS_RING_OPACITY: 0.5, // 50% opacity
  FOCUS_RING_COLOR: 'primary-500',

  // Focus ring for buttons (larger, more visible)
  BUTTON_FOCUS_WIDTH: 5, // px
  BUTTON_FOCUS_OPACITY: 0.7,

  // Focus transform (subtle lift)
  FOCUS_SCALE: 1.02,

  // Skip link (keyboard navigation)
  SKIP_LINK_TOP: 8, // px
  SKIP_LINK_LEFT: 8, // px
  SKIP_LINK_Z_INDEX: 9999,

  // Screen reader delay
  SCREEN_READER_DELAY: 100, // ms
} as const;

/**
 * RESPONSIVE BREAKPOINTS
 * All breakpoints tested and optimized
 */
export const RESPONSIVE = {
  // Mobile (portrait)
  MOBILE_MAX: 767, // px

  // Tablet (landscape + portrait)
  TABLET_MIN: 768, // px
  TABLET_MAX: 1023, // px

  // Desktop
  DESKTOP_MIN: 1024, // px
  DESKTOP_MAX: 1535, // px

  // Ultra-wide (2xl+)
  ULTRA_WIDE_MIN: 1536, // px
  ULTRA_WIDE_MAX: 1920, // px

  // Extra ultra-wide (2xl++)
  EXTRA_ULTRA_WIDE_MIN: 1921, // px

  // Landscape mobile optimization
  LANDSCAPE_MOBILE_HEIGHT: 500, // px
} as const;

/**
 * VISUAL CONSISTENCY CONSTANTS
 * Button, input, card, shadow styles
 */
export const VISUAL_CONSISTENCY = {
  // Button variants (consistent across all buttons)
  BUTTON_PRIMARY: {
    gradient: 'from-primary-600 to-violet-600',
    hoverGlow: true,
    hoverScale: 1.02,
    activeScale: 0.98,
    shadow: 'btn',
    shadowHover: 'btn-hover',
  },

  BUTTON_SECONDARY: {
    border: 'border-slate-200 dark:border-slate-700',
    hoverBorder: 'hover:border-primary-400 dark:hover:border-violet-500',
    hoverBg: 'hover:bg-slate-50 dark:hover:bg-slate-800',
    hoverScale: 1.02,
    activeScale: 0.98,
  },

  BUTTON_GHOST: {
    bg: 'transparent',
    hoverBg: 'hover:bg-slate-100 dark:hover:bg-slate-800',
    hoverScale: 1.02,
    activeScale: 0.98,
  },

  // Input styles (consistent across all inputs)
  INPUT: {
    radius: 'rounded-2xl',
    padding: 'px-5 py-3',
    bg: 'bg-white/80 dark:bg-slate-800/80',
    backdrop: 'backdrop-blur-sm',
    border: 'border-slate-200/80 dark:border-slate-700/80',
    focusBorder: 'focus:border-primary-400 dark:focus:border-primary-500',
    focusShadow: 'shadow-input-focus',
    focusScale: 'scale-[1.005]',
    hoverBorder: 'hover:border-slate-300 dark:hover:border-slate-600',
    hoverTransform: 'translateY(-0.5px)',
    activeTransform: 'scale-[0.998]',
  },

  // Card styles (consistent across all cards)
  CARD: {
    radius: 'rounded-3xl',
    bg: 'bg-white/90 dark:bg-slate-800/90',
    backdrop: 'backdrop-blur-xl',
    border: 'border-slate-200/60 dark:border-slate-700/60',
    shadow: 'shadow-card',
    shadowHover: 'shadow-card-hover',
    hoverScale: 'hover:scale-[1.02]',
    activeScale: 'active:scale-[0.98]',
  },

  // Shadow styles (consistent elevation)
  SHADOW_SOFT: 'shadow-soft',
  SHADOW_SOFT_LG: 'shadow-soft-lg',
  SHADOW_GLOW: 'shadow-glow',
  SHADOW_GLOW_SM: 'shadow-glow-sm',
  SHADOW_GLOW_LG: 'shadow-glow-lg',
  SHADOW_PREMIUM: 'shadow-premium',
  SHADOW_PREMIUM_LG: 'shadow-premium-lg',
  SHADOW_CARD: 'shadow-card',
  SHADOW_CARD_HOVER: 'shadow-card-hover',
  SHADOW_BTN: 'shadow-btn',
  SHADOW_BTN_HOVER: 'shadow-btn-hover',
  SHADOW_INPUT: 'shadow-input',
  SHADOW_INPUT_FOCUS: 'shadow-input-focus',
} as const;

/**
 * UTILITY CLASSES
 * Predefined class combinations for consistency
 */
export const UTILITY_CLASSES = {
  // Smooth hover transition
  HOVER_SMOOTH: 'transition-all duration-250 ease-out hover:scale-[1.02]',

  // Smooth active transition
  ACTIVE_SMOOTH: 'active:scale-[0.98] transition-all duration-150 ease-in-out',

  // Focus ring (WCAG AA compliant)
  FOCUS_RING: 'focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 outline-none',

  // Premium card
  CARD_PREMIUM: 'card-premium transition-all duration-300',

  // Premium button
  BUTTON_PREMIUM: 'btn-primary transition-all duration-300',

  // Premium input
  INPUT_PREMIUM: 'input-premium transition-all duration-300',
} as const;

/**
 * ANIMATION CLASS NAMES
 * For use with data attributes or state
 */
export const ANIMATION_CLASSES = {
  SUCCESS: 'animate-success-feedback',
  SUCCESS_POP: 'animate-success-pop',
  SUCCESS_PULSE: 'animate-success-pulse',
  ERROR_SHAKE: 'animate-error-shake',
  ERROR_FEEDBACK: 'animate-error-feedback',
  ERROR_FADE: 'animate-error-fade',
  LOADING_SHIMMER: 'animate-loading-shimmer',
  FADE_IN: 'animate-fade-in',
  FADE_UP: 'animate-fade-up',
  SCALE_IN: 'animate-scale-in',
  SLIDE_UP: 'animate-slide-up',
  FLOAT: 'animate-float',
  SHIMMER: 'animate-shimmer',
  BLOB: 'animate-blob',
} as const;
