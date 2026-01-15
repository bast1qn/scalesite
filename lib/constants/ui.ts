/**
 * UI-related constants
 * Timeouts, delays, and threshold values for UI interactions
 */

// ============================================
// VALIDATION & DEBOUNCE CONSTANTS
// ============================================

/**
 * Standard debounce timeout values in milliseconds
 */
export const DEBOUNCE_MS = {
    /** Fast debounce for search/filter inputs */
    FAST: 150,
    /** Normal debounce for form inputs */
    NORMAL: 300,
    /** Slow debounce for heavy operations */
    SLOW: 500,
    /** Very slow debounce for expensive operations */
    VERY_SLOW: 1000,
} as const;

/**
 * Validation timeout values in milliseconds
 */
export const VALIDATION_TIMEOUT_MS = {
    /** Immediate validation feedback */
    IMMEDIATE: 0,
    /** Fast validation for simple checks */
    FAST: 200,
    /** Normal validation for complex checks */
    NORMAL: 500,
    /** Slow validation for API-based checks */
    SLOW: 1000,
} as const;

// ============================================
// ANIMATION CONSTANTS
// ============================================

/**
 * Animation duration values in milliseconds
 */
export const ANIMATION_DURATION_MS = {
    /** Instant transition */
    INSTANT: 100,
    /** Fast transition */
    FAST: 200,
    /** Normal transition */
    NORMAL: 300,
    /** Slow transition */
    SLOW: 500,
    /** Very slow transition */
    VERY_SLOW: 700,
} as const;

/**
 * Stagger delay values for animated lists in milliseconds
 */
export const STAGGER_DELAY_MS = {
    /** Minimal stagger */
    MINIMAL: 30,
    /** Fast stagger */
    FAST: 50,
    /** Normal stagger */
    NORMAL: 100,
    /** Slow stagger */
    SLOW: 150,
} as const;

// ============================================
// LOCALSTORAGE KEYS
// ============================================

/**
 * Standardized localStorage key prefixes
 */
export const STORAGE_KEYS = {
    /** User preferences */
    PREFERENCES: 'scalesite_preferences',
    /** Auth tokens */
    AUTH: 'scalesite_auth',
    /** Cache data */
    CACHE: 'scalesite_cache',
    /** Session data */
    SESSION: 'scalesite_session',
} as const;

/**
 * Specific localStorage keys
 */
export const STORAGE_KEY = {
    /** Applied discount code */
    DISCOUNT_CODE: 'appliedDiscountCode',
    /** Theme preference */
    THEME: 'theme',
    /** Language preference */
    LANGUAGE: 'language',
    /** Sidebar state */
    SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const;

// ============================================
// CACHE CONSTANTS
// ============================================

/**
 * Cache TTL values in milliseconds
 */
export const CACHE_TTL_MS = {
    /** Very short cache (5 seconds) */
    VERY_SHORT: 5000,
    /** Short cache (15 seconds) */
    SHORT: 15000,
    /** Normal cache (1 minute) */
    NORMAL: 60000,
    /** Long cache (5 minutes) */
    LONG: 300000,
    /** Very long cache (15 minutes) */
    VERY_LONG: 900000,
} as const;

// ============================================
// UI THRESHOLDS
// ============================================

/**
 * Character count thresholds for UI feedback
 */
export const CHAR_LIMITS = {
    /** Minimum search length */
    MIN_SEARCH: 2,
    /** Short text limit */
    SHORT: 50,
    /** Medium text limit */
    MEDIUM: 200,
    /** Long text limit */
    LONG: 500,
    /** Maximum text length */
    MAX: 1000,
} as const;

/**
 * Screen size breakpoints in pixels (matching Tailwind)
 */
export const BREAKPOINTS = {
    /** Mobile devices */
    SM: 640,
    /** Tablets */
    MD: 768,
    /** Small laptops */
    LG: 1024,
    /** Desktops */
    XL: 1280,
    /** Large desktops */
    XXL: 1536,
} as const;
