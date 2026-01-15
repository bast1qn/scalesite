// ============================================
// UI/UX CONSTANTS
// ============================================

export const UI_CONSTANTS = {
  // Dimensions
  HEADER_HEIGHT_DESKTOP: 64,
  HEADER_HEIGHT_MOBILE: 56,
  SIDEBAR_WIDTH: 240,
  SIDEBAR_COLLAPSED_WIDTH: 60,
  CONTAINER_MAX_WIDTH: 1200,
  CONTAINER_PADDING: 16,

  // Spacing
  SPACING_XS: 4,
  SPACING_SM: 8,
  SPACING_MD: 16,
  SPACING_LG: 24,
  SPACING_XL: 32,
  SPACING_2XL: 48,
  SPACING_3XL: 64,

  // Border radius
  RADIUS_SM: 4,
  RADIUS_MD: 8,
  RADIUS_LG: 12,
  RADIUS_XL: 16,
  RADIUS_2XL: 24,
  RADIUS_FULL: 9999,

  // Font sizes (in pixels)
  FONT_SIZE_XS: 12,
  FONT_SIZE_SM: 14,
  FONT_SIZE_BASE: 16,
  FONT_SIZE_LG: 18,
  FONT_SIZE_XL: 20,
  FONT_SIZE_2XL: 24,
  FONT_SIZE_3XL: 30,
  FONT_SIZE_4XL: 36,

  // Z-index layers
  Z_INDEX_BASE: 0,
  Z_INDEX_DROPDOWN: 1000,
  Z_INDEX_STICKY: 1020,
  Z_INDEX_FIXED: 1030,
  Z_INDEX_MODAL_BACKDROP: 1040,
  Z_INDEX_MODAL: 1050,
  Z_INDEX_POPOVER: 1060,
  Z_INDEX_TOOLTIP: 1070,
  Z_INDEX_NOTIFICATION: 1080,

  // Breakpoints (matches Tailwind defaults)
  BREAKPOINT_SM: 640,
  BREAKPOINT_MD: 768,
  BREAKPOINT_LG: 1024,
  BREAKPOINT_XL: 1280,
  BREAKPOINT_2XL: 1536,

  // Animation durations (in milliseconds)
  ANIMATION_FAST: 150,
  ANIMATION_BASE: 200,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
  ANIMATION_SLOWER: 1000,

  // Max values
  MAX_TEXTAREA_HEIGHT: 150,
  MAX_UPLOAD_SIZE: 5242880, // 5MB in bytes
  MAX_FILE_NAME_LENGTH: 255,

  // Grid
  GRID_COLUMNS: 12,
  GRID_GAP_SM: 8,
  GRID_GAP_MD: 16,
  GRID_GAP_LG: 24,

  // Icon sizes
  ICON_SIZE_XS: 16,
  ICON_SIZE_SM: 20,
  ICON_SIZE_MD: 24,
  ICON_SIZE_LG: 32,
  ICON_SIZE_XL: 40,

  // Toast/Notification
  TOAST_DURATION: 3000,
  TOAST_DURATION_LONG: 5000,
  TOAST_MAX_VISIBLE: 3,

  // Debounce/Throttle delays
  DEBOUNCE_DELAY: 300,
  DEBOUNCE_DELAY_LONG: 500,
  THROTTLE_DELAY: 200,

  // Chart dimensions
  CHART_HEIGHT: 300,
  CHART_HEIGHT_SMALL: 200,
  CHART_HEIGHT_LARGE: 400,

  // Pagination
  ITEMS_PER_PAGE_DEFAULT: 10,
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],

  // Tables
  TABLE_ROW_HEIGHT: 48,
  TABLE_HEADER_HEIGHT: 56,
  TABLE_MAX_HEIGHT: 600,

  // Forms
  INPUT_HEIGHT: 40,
  INPUT_HEIGHT_SMALL: 32,
  INPUT_HEIGHT_LARGE: 48,
  LABEL_FONT_SIZE: 14,
  ERROR_FONT_SIZE: 12,

  // Buttons
  BUTTON_HEIGHT: 40,
  BUTTON_HEIGHT_SMALL: 32,
  BUTTON_HEIGHT_LARGE: 48,
  BUTTON_ICON_SIZE: 20,
  BUTTON_BORDER_RADIUS: 8,

  // Skeleton loading
  SKELETON_ANIMATION_DURATION: 1500,
  SKELETON_SHIMMER_DELAY: 200,

  // Modal
  MODAL_MAX_WIDTH: 600,
  MODAL_MAX_WIDTH_LARGE: 800,
  MODAL_PADDING: 24,
  MODAL_HEADER_HEIGHT: 64,
  MODAL_FOOTER_HEIGHT: 72,

  // Cards
  CARD_BORDER_RADIUS: 16,
  CARD_PADDING: 24,
  CARD_SHADOW_OPACITY: 0.1,

  // Lists
  LIST_ITEM_HEIGHT: 56,
  LIST_ITEM_PADDING: 16,
  LIST_ITEM_AVATAR_SIZE: 40,

  // Progress
  PROGRESS_BAR_HEIGHT: 8,
  PROGRESS_BAR_HEIGHT_LARGE: 12,
  PROGRESS_MIN_VALUE: 0,
  PROGRESS_MAX_VALUE: 100,
} as const;

// Color constants for consistent theming
export const COLOR_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
} as const;

// Common animation presets
export const ANIMATION_PRESETS = {
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  SLIDE_UP: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  SLIDE_DOWN: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  SCALE: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
} as const;
