/**
 * Color Constants
 * Centralized color-related constants for consistency and maintainability
 */

// RGB Channel Masks
export const RGB_CHANNEL_MASKS = {
  RED: 0xff0000,
  GREEN: 0x00ff00,
  BLUE: 0x0000ff,
} as const;

// RGB Bit Shifts
export const RGB_BIT_SHIFTS = {
  RED: 16,
  GREEN: 8,
  BLUE: 0,
} as const;

// RGB Normalization
export const RGB_NORMALIZATION = 255;

// Luminance Threshold (0-1 range)
export const LUMINANCE_THRESHOLD = 0.5;

// Hex Luminance Threshold for dark/light detection
export const HEX_LUMINANCE_THRESHOLD = 0x7ffff;

// WCAG Contrast Ratios
export const WCAG_CONTRAST_RATIOS = {
  NORMAL_TEXT: 4.5,
  LARGE_TEXT: 3.0,
} as const;

// Linear RGB Threshold
export const LINEAR_RGB_THRESHOLD = 0.03928;

// RGB Linearization Constants
export const RGB_LINEARIZATION = {
  DIVISOR: 12.92,
  ADDEND: 0.055,
  DIVISOR_GAMMA: 1.055,
  GAMMA: 2.4,
} as const;

// Luminance Coefficients (sRGB)
export const LUMINANCE_COEFFICIENTS = {
  RED: 0.2126,
  GREEN: 0.7152,
  BLUE: 0.0722,
} as const;

// Additive Constant for Contrast Ratio
export const CONTRAST_ADDEND = 0.05;

// Accessible Color Values
export const ACCESSIBLE_COLORS = {
  WHITE: '#ffffff',
  BLACK: '#000000',
} as const;

// Screen Reader Timeout (ms)
export const SCREEN_READER_ANNOUNCEMENT_TIMEOUT = 1000;

// Focus Scroll Delay (ms)
export const FOCUS_SCROLL_DELAY = 300;

// ID Generation Length
export const ID_PREFIX_LENGTH = 2;
export const ID_SUFFIX_LENGTH = 11;
