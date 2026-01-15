// ============================================
// TIMING CONSTANTS
// Centralized timing and interval constants
// ============================================

/**
 * Time intervals in milliseconds
 */
export const TIME_MS = {
    SECOND: 1000,
    MINUTE: 60000,
    HOUR: 3600000,
    DAY: 86400000,
    WEEK: 604800000
} as const;

/**
 * Auto-save delays in milliseconds
 */
export const AUTOSAVE_DELAY = {
    FAST: 1000,
    NORMAL: 2000,
    SLOW: 3000
} as const;

/**
 * Toast/Notification durations in milliseconds
 */
export const NOTIFICATION_DURATION = {
    SHORT: 2000,
    NORMAL: 3000,
    LONG: 5000
} as const;

/**
 * Debounce delays in milliseconds
 */
export const DEBOUNCE_DELAY = {
    FAST: 300,
    NORMAL: 500,
    SLOW: 1000
} as const;

/**
 * Polling intervals in milliseconds
 */
export const POLLING_INTERVAL = {
    FAST: 1000,
    NORMAL: 3000,
    SLOW: 5000,
    VERY_SLOW: 10000
} as const;

/**
 * Typing delay in milliseconds for search inputs
 */
export const TYPING_DELAY = 300;

/**
 * Session timeout in milliseconds
 */
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
