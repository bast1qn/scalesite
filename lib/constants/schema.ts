export const SCHEMA_CONSTANTS = {
  CACHE_TTL: 5000, // 5 seconds cache TTL
  COPY_FEEDBACK_DURATION: 2000, // 2 seconds for copy feedback
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB max file size
  DEFAULT_CURRENCY: 'EUR' as const,
  DEFAULT_AVAILABILITY: 'https://schema.org/InStock' as const,
  ANIMATION_DELAY: 20, // Animation delay in ms
} as const;

export const FILE_VALIDATION = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/'] as const,
} as const;

export const UI_CONSTANTS = {
  PREVIEW_MAX_HEIGHT: 'max-h-96', // Max height for preview sections
  TEXTAREA_ROWS: 3, // Default textarea rows
} as const;
