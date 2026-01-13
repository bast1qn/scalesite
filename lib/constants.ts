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

// ===== TIMEOUT VALUES =====

/**
 * Request timeout values in milliseconds
 */
export const TIMEOUTS = {
  /** Cache TTL for API responses (5000ms = 5 seconds) */
  cacheTTL: 5000,
  /** HTTP request timeout (60000ms = 60 seconds) */
  request: 60000,
  /** Typing indicator debounce (1000ms = 1 second) */
  typingDebounce: 1000,
  /** Presence timeout for chat (30000ms = 30 seconds) */
  presence: 30000,
  /** Subscription timeout (10000ms = 10 seconds) */
  subscription: 10000,
} as const;

// ===== CHAT CONSTANTS =====

/**
 * Chat-related limits and thresholds
 */
export const CHAT = {
  /** Maximum message length in characters */
  maxMessageLength: 5000,
  /** Maximum conversation name length */
  maxConversationNameLength: 100,
  /** Maximum file size for attachments (10MB in bytes) */
  maxFileSize: 10 * 1024 * 1024,
  /** Default message pagination limit */
  defaultMessageLimit: 50,
  /** Typing indicator duration (3000ms = 3 seconds) */
  typingIndicatorDuration: 3000,
} as const;

// ===== ANALYTICS CONSTANTS =====

/**
 * Analytics tracking thresholds
 */
export const ANALYTICS = {
  /** Scroll depth tracking percentages */
  scrollDepths: [25, 50, 75, 100],
  /** Session timeout in milliseconds (30 minutes) */
  sessionTimeout: 30 * 60 * 1000,
  /** Page view debounce (500ms) */
  pageViewDebounce: 500,
} as const;

// ===== VALIDATION LIMITS =====

/**
 * Validation-related numeric limits
 */
export const LIMITS = {
  /** Maximum email length (RFC 5321) */
  maxEmailLength: 254,
  /** Minimum username length */
  minUsernameLength: 3,
  /** Maximum username length */
  maxUsernameLength: 30,
  /** Maximum URL length */
  maxUrlLength: 2048,
  /** Maximum description length */
  maxDescriptionLength: 500,
  /** Minimum project duration in weeks */
  minProjectWeeks: 1,
  /** Maximum project duration in weeks */
  maxProjectWeeks: 52,
} as const;

// ===== FILE UPLOAD CONSTANTS =====

/**
 * File upload-related limits
 */
export const FILE_UPLOAD = {
  /** Maximum image file size (5MB) */
  maxImageSize: 5 * 1024 * 1024,
  /** Maximum document file size (10MB) */
  maxDocumentSize: 10 * 1024 * 1024,
  /** Allowed image formats */
  allowedImageFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  /** Allowed document formats */
  allowedDocumentFormats: ['application/pdf'],
} as const;

// ===== DATE/TIME CONSTANTS =====

/**
 * Date and time-related constants
 */
export const DATETIME = {
  /** milliseconds in one minute */
  minute: 60 * 1000,
  /** milliseconds in one hour */
  hour: 60 * 60 * 1000,
  /** milliseconds in one day */
  day: 24 * 60 * 60 * 1000,
  /** milliseconds in one week */
  week: 7 * 24 * 60 * 60 * 1000,
  /** Default subscription duration (24 hours in milliseconds) */
  subscriptionDuration: 24 * 60 * 60 * 1000,
  /** Offer expiration in days */
  offerExpirationDays: 7,
} as const;

// ===== ANIMATION VALUES =====

/**
 * Animation distance values in pixels
 */
export const ANIMATION_VALUES = {
  /** Medium bounce animation distance */
  bounceMedium: -100,
  /** Fast bounce animation distance */
  bounceFast: -200,
  /** Slide in distance */
  slideDistance: 20,
  /** Fade in opacity start */
  fadeStart: 0,
  /** Fade in opacity end */
  fadeEnd: 1,
} as const;

// ===== INTERSECTION OBSERVER =====

/**
 * Intersection Observer thresholds for lazy loading
 */
export const INTERSECTION_THRESHOLD = {
  /** Default threshold for triggering element visibility (10%) */
  default: 0.1,
  /** Higher threshold for more precise triggering (50%) */
  high: 0.5,
  /** Lower threshold for earlier triggering (1%) */
  low: 0.01,
} as const;

// ===== IMAGE LAZY LOADING =====

/**
 * Image loading and blur effect constants
 */
export const IMAGE_LOADING = {
  /** Default blur amount for placeholder images in pixels */
  defaultBlurAmount: 20,
  /** Higher blur amount for background images in pixels */
  backgroundBlurAmount: 30,
  /** Scale factor to prevent white borders from blur */
  blurScaleFactor: 1.1,
  /** Transition duration for image loading in milliseconds */
  transitionDuration: 500,
} as const;
