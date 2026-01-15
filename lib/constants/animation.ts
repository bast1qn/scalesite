// ============================================
// ANIMATION CONSTANTS
// Centralized animation timing and duration constants
// ============================================

/**
 * Animation durations in seconds
 */
export const ANIMATION_DURATION = {
    INSTANT: 0,
    FAST: 0.15,
    NORMAL: 0.3,
    SLOW: 0.5,
    VERY_SLOW: 0.7
} as const;

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DELAY_MS = {
    INSTANT: 0,
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 700
} as const;

/**
 * Common transition presets
 */
export const TRANSITION_PRESETS = {
    fast: 'all 150ms ease-in-out',
    normal: 'all 300ms ease-in-out',
    slow: 'all 500ms ease-in-out'
} as const;

/**
 * Stagger delays for list animations
 */
export const STAGGER_DELAY = {
    NONE: 0,
    FAST: 0.05,
    NORMAL: 0.1,
    SLOW: 0.2
} as const;

/**
 * Hover transition durations (in Tailwind format)
 */
export const HOVER_DURATION = {
    FAST: 'duration-150',
    NORMAL: 'duration-300',
    SLOW: 'duration-500'
} as const;
