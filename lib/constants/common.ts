/**
 * Common constants used across the application
 */

export const CACHE_DURATION = {
  SHORT: 5000, // 5 seconds
  MEDIUM: 30000, // 30 seconds
  LONG: 300000, // 5 minutes
  VERY_LONG: 900000, // 15 minutes
} as const;

export const FILE_SIZE_LIMITS = {
  SMALL: 1024 * 1024, // 1MB
  MEDIUM: 5 * 1024 * 1024, // 5MB
  LARGE: 10 * 1024 * 1024, // 10MB
  VERY_LARGE: 50 * 1024 * 1024, // 50MB
} as const;

export const UI_TIMEOUTS = {
  DEBOUNCE: 300,
  TOAST: 3000,
  MODAL: 200,
  FEEDBACK: 2000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
} as const;

export const CURRENCIES = {
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
  CHF: 'CHF',
} as const;

export type Currency = typeof CURRENCIES[keyof typeof CURRENCIES];
