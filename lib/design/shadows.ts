// ========================================================================
// PREMIUM SHADOW SYSTEM
// ========================================================================
// Reference: Linear, Vercel, Stripe Design Systems
// Focus: Subtle, layered shadows for depth and hierarchy
// Features: Multiple shadow layers, color overlays, smooth transitions
// Philosophy: Shadows should be subtle, not overpowering
// ========================================================================

/**
 * Shadow Scale - From subtle to dramatic
 * All shadows use multiple layers for depth and richness
 *
 * @example
 * ```tsx
 * <div style={{ boxShadow: shadows.sm }}>
 * <div style={{ boxShadow: shadows.xl }}>
 * ```
 */
export const shadows = {
  /**
   * None - No shadow (flat elements)
   */
  none: 'none',

  /**
   * Extra Small - Subtle elevation (buttons, small cards)
   */
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',

  /**
   * Small - Light elevation (inputs, badges)
   */
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',

  /**
   * Base - Default elevation (cards, dropdowns)
   */
  base: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',

  /**
   * Medium - Moderate elevation (popovers, tooltips)
   */
  md: '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)',

  /**
   * Large - High elevation (modals, panels)
   */
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.06), 0 8px 10px -6px rgb(0 0 0 / 0.06)',

  /**
   * Extra Large - Maximum elevation (drawers, overlays)
   */
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.15)',

  /**
   * Inner - Inset shadow (pressed states)
   */
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.03)',
} as const;

/**
 * Colored Shadows - For brand elements
 * Use sparingly for accent elements only
 */
export const coloredShadows = {
  /**
   * Primary glow - Soft blue glow
   */
  primary: {
    sm: '0 0 16px rgb(75 90 237 / 0.08)',
    md: '0 0 32px rgb(75 90 237 / 0.12)',
    lg: '0 0 48px rgb(75 90 237 / 0.16)',
  },

  /**
   * Secondary glow - Soft violet glow
   */
  secondary: {
    sm: '0 0 16px rgb(139 92 246 / 0.08)',
    md: '0 0 32px rgb(139 92 246 / 0.12)',
    lg: '0 0 48px rgb(139 92 246 / 0.16)',
  },

  /**
   * Success glow - Soft emerald glow
   */
  success: {
    sm: '0 0 16px rgb(16 185 129 / 0.08)',
    md: '0 0 32px rgb(16 185 129 / 0.12)',
    lg: '0 0 48px rgb(16 185 129 / 0.16)',
  },

  /**
   * Error glow - Soft red glow
   */
  error: {
    sm: '0 0 16px rgb(239 68 68 / 0.08)',
    md: '0 0 32px rgb(239 68 68 / 0.12)',
    lg: '0 0 48px rgb(239 68 68 / 0.16)',
  },
} as const;

/**
 * Premium Shadows - Multi-layer shadows for depth
 * Inspired by Linear/Vercel premium design systems
 */
export const premiumShadows = {
  /**
   * Soft - Subtle depth (buttons, inputs)
   */
  soft: '0 2px 16px -4px rgb(0 0 0 / 0.06)',

  /**
   * Soft Large - More depth (cards, panels)
   */
  softLg: '0 8px 32px -8px rgb(0 0 0 / 0.10)',

  /**
   * Premium - Refined depth with colored overlay
   */
  premium: '0 1px 6px rgb(0 0 0 / 0.02), 0 3px 12px rgb(75 90 237 / 0.04)',

  /**
   * Premium Large - Enhanced colored depth
   */
  premiumLg: '0 4px 16px rgb(0 0 0 / 0.04), 0 8px 32px rgb(75 90 237 / 0.08)',

  /**
   * Premium Extra Large - Maximum colored depth
   */
  premiumXl: '0 8px 24px rgb(0 0 0 / 0.06), 0 16px 48px rgb(75 90 237 / 0.10)',

  /**
   * Card - Optimized for cards
   */
  card: '0 1px 2px rgb(0 0 0 / 0.02), 0 2px 8px rgb(75 90 237 / 0.04)',

  /**
   * Card Hover - Elevated card state
   */
  cardHover: '0 4px 16px rgb(0 0 0 / 0.06), 0 8px 32px rgb(75 90 237 / 0.08)',

  /**
   * Button - Optimized for buttons
   */
  button: '0 1px 4px rgb(75 90 237 / 0.12)',

  /**
   * Button Hover - Elevated button state
   */
  buttonHover: '0 4px 12px rgb(75 90 237 / 0.20)',

  /**
   * Input - Subtle input shadow
   */
  input: '0 1px 2px rgb(0 0 0 / 0.02)',

  /**
   * Input Focus - Focus ring shadow
   */
  inputFocus: '0 0 0 4px rgb(75 90 237 / 0.08)',
} as const;

/**
 * Dark Mode Shadows - Adjusted for dark backgrounds
 * Dark mode shadows need to be lighter and more subtle
 */
export const darkModeShadows = {
  /**
   * Dark base shadow
   */
  base: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',

  /**
   * Dark soft shadow
   */
  soft: '0 2px 16px -4px rgb(0 0 0 / 0.4)',

  /**
   * Dark premium shadow
   */
  premium: '0 1px 2px rgb(0 0 0 / 0.3), 0 2px 8px rgb(139 92 246 / 0.08)',

  /**
   * Dark premium large
   */
  premiumLg: '0 4px 8px rgb(0 0 0 / 0.4), 0 12px 24px rgb(139 92 246 / 0.12)',

  /**
   * Dark card shadow
   */
  card: '0 1px 2px rgb(0 0 0 / 0.3), 0 2px 8px rgb(139 92 246 / 0.08)',

  /**
   * Dark card hover
   */
  cardHover: '0 4px 16px rgb(0 0 0 / 0.4), 0 8px 32px rgb(139 92 246 / 0.12)',

  /**
   * Dark glow
   */
  glow: '0 0 32px rgb(139 92 246 / 0.16)',
} as const;

// ========================================================================
// SHADOW UTILITIES
// ========================================================================

/**
 * Get shadow by size
 * @param size - Shadow size
 * @param colored - Use colored shadow
 * @returns Shadow CSS value
 */
export const getShadow = (
  size: keyof typeof shadows,
  colored = false
): string => {
  if (colored) {
    return coloredShadows.primary[size as keyof typeof coloredShadows.primary] || shadows[size];
  }
  return shadows[size];
};

/**
 * Get premium shadow
 * @param variant - Premium shadow variant
 * @returns Premium shadow CSS value
 */
export const getPremiumShadow = (
  variant: keyof typeof premiumShadows
): string => {
  return premiumShadows[variant];
};

/**
 * Get dark mode shadow
 * @param variant - Dark mode shadow variant
 * @returns Dark mode shadow CSS value
 */
export const getDarkModeShadow = (
  variant: keyof typeof darkModeShadows
): string => {
  return darkModeShadows[variant];
};

/**
 * Transition shadow utility
 * Smoothly animates shadow changes
 */
export const shadowTransition = {
  transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ========================================================================
// SHADOW TOKENS FOR CSS VARIABLES
// ========================================================================

/**
 * Design token constants for CSS variables
 */
export const shadowTokens = {
  '--shadow-xs': shadows.xs,
  '--shadow-sm': shadows.sm,
  '--shadow-base': shadows.base,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,
  '--shadow-inner': shadows.inner,
  '--shadow-soft': premiumShadows.soft,
  '--shadow-premium': premiumShadows.premium,
  '--shadow-card': premiumShadows.card,
  '--shadow-glow': coloredShadows.primary.md,
} as const;

// ========================================================================
// EXPORT ALL
// ========================================================================

export const shadowSystem = {
  shadows,
  colored: coloredShadows,
  premium: premiumShadows,
  darkMode: darkModeShadows,
  tokens: shadowTokens,
  utils: {
    getShadow,
    getPremiumShadow,
    getDarkModeShadow,
    transition: shadowTransition,
  },
} as const;
