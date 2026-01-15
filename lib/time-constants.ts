// ============================================
// TIME CONSTANTS
// // ============================================

export const TIME_CONSTANTS = {
  // Milliseconds
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,

  // Time calculations
  MS_IN_MINUTE: 60000,
  MS_IN_HOUR: 3600000,
  MS_IN_DAY: 86400000,
  MS_IN_WEEK: 604800000,
  MS_IN_MONTH: 2592000000,
} as const;

// Common time thresholds
export const TIME_THRESHOLDS = {
  // Relative time
  RECENT_MINUTES: 60,
  RECENT_HOURS: 24,
  RECENT_DAYS: 30,
  RECENT_WEEKS: 4,
  RECENT_MONTHS: 12,

  // UI updates
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 200,
} as const;
