/**
 * Analytics Demo Data Constants
 * Magic numbers extracted for demo data generation in analytics components
 */

// Bounce Rate Demo Constants
export const BOUNCE_RATE = {
  MIN: 42,
  MAX: 50,
  VARIANCE: 5,
} as const;

// Page Views Demo Constants
export const PAGE_VIEWS = {
  BASE_MIN: 500,
  BASE_MAX: 1000,
  MULTIPLIER_MIN: 0.5,
  MULTIPLIER_MAX: 1.5,
  TOP_PAGES_COUNT: 5,
} as const;

// Referrer Visits Demo Constants
export const REFERRER_VISITS = {
  BASE_MIN: 200,
  BASE_MAX: 500,
  MULTIPLIER_MIN: 0.3,
  MULTIPLIER_MAX: 1.3,
} as const;

// Animation Delays for Analytics Components
export const ANALYTICS_DELAYS = {
  TOP_PAGES_DELAY: 0.2,
  TOP_REFERRERS_DELAY: 0.3,
  ITEM_DELAY: 0.1,
  BAR_DURATION: 0.5,
} as const;

// Session Duration Demo Constants (in seconds)
export const SESSION_DURATION = {
  MIN_SECONDS: 120,
  MAX_SECONDS: 360,
} as const;
