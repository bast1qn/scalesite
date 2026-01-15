// ============================================
// OVERVIEW COMPONENT CONSTANTS
// Time-related and configuration constants
// ============================================

/**
 * Time-related constants for dashboard operations
 */
export const TIME_CONSTANTS = {
    MS_PER_MINUTE: 60000,
    MS_PER_HOUR: 3600000,
    MS_PER_DAY: 86400000,
    DAYS_IN_WEEK: 7,
    DAYS_IN_MONTH: 30,
    WEEK_IN_MS: 7 * 24 * 60 * 60 * 1000,
    UPDATE_INTERVAL_MS: 3000,
    STORAGE_KEY: 'scalesite_onboarding_draft'
} as const;
