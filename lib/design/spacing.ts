// ========================================================================
// PREMIUM SPACING SYSTEM
// ========================================================================
// Reference: Linear, Vercel, Stripe Design Systems
// Focus: Pixel-perfect spacing, harmonious proportions, consistent rhythm
// Features: 4px base unit, modular scale, semantic spacing
// ========================================================================

/**
 * Spacing Scale - 4px Base Unit
 * Consistent spacing across all components for visual harmony
 *
 * Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128...
 *
 * @example
 * ```tsx
 * <div style={{ padding: spacing[4] }}> // 16px
 * <div style={{ gap: spacing[6] }}>    // 24px
 * ```
 */
export const spacing = {
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px  (base unit)
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px (touch target)
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

/**
 * Container Padding - Responsive padding for containers
 * Mobile: 16px → Tablet: 24px → Desktop: 32px → Wide: 48px
 */
export const containerPadding = {
  mobile: spacing[4],   // 16px
  tablet: spacing[6],   // 24px
  desktop: spacing[8],  // 32px
  wide: spacing[12],    // 48px
} as const;

/**
 * Section Spacing - Vertical spacing between sections
 * Compact: 64px → Normal: 96px → Spacious: 128px
 */
export const sectionSpacing = {
  compact: spacing[16],  // 64px
  normal: spacing[24],   // 96px
  spacious: spacing[32], // 128px
} as const;

/**
 * Component Spacing - Internal spacing for components
 * Tight: 8px → Normal: 16px → Relaxed: 24px
 */
export const componentSpacing = {
  tight: spacing[2],    // 8px
  normal: spacing[4],   // 16px
  relaxed: spacing[6],  // 24px
} as const;

/**
 * Touch Targets - Minimum touch target sizes (WCAG AA: 44x44px)
 */
export const touchTarget = {
  min: spacing[11],     // 44px (minimum)
  comfortable: spacing[12], // 48px (comfortable)
  spacious: spacing[14],    // 56px (spacious)
} as const;

/**
 * Grid Gap - Consistent grid gaps
 * Tight: 8px → Normal: 16px → Relaxed: 24px → Spacious: 32px
 */
export const gridGap = {
  tight: spacing[2],    // 8px
  normal: spacing[4],   // 16px
  relaxed: spacing[6],  // 24px
  spacious: spacing[8], // 32px
} as const;

/**
 * Content Max Width - Maximum content widths for readability
 * Narrow: 640px → Normal: 768px → Wide: 1024px → Ultra-wide: 1280px
 */
export const contentMaxWidth = {
  narrow: '40rem',     // 640px (optimal reading: 60-75 characters)
  normal: '48rem',     // 768px
  wide: '64rem',       // 1024px
  ultraWide: '80rem',  // 1280px
} as const;

// ========================================================================
// SPACING UTILITIES
// ========================================================================

/**
 * Get spacing value by key
 * @param key - Spacing key (e.g., 4, 6, 8)
 * @returns Spacing value in rem
 */
export const getSpacing = (key: keyof typeof spacing): string => {
  return spacing[key];
};

/**
 * Get responsive spacing
 * @param mobile - Mobile spacing
 * @param tablet - Tablet spacing
 * @param desktop - Desktop spacing
 * @returns Responsive spacing object
 */
export const getResponsiveSpacing = (
  mobile: keyof typeof spacing,
  tablet?: keyof typeof spacing,
  desktop?: keyof typeof spacing
) => {
  return {
    mobile: spacing[mobile],
    tablet: tablet ? spacing[tablet] : spacing[mobile],
    desktop: desktop ? spacing[desktop] : tablet ? spacing[tablet] : spacing[mobile],
  };
};

/**
 * Spacing utilities for common patterns
 */
export const spacingUtils = {
  /**
   * Card padding - consistent padding for cards
   */
  card: {
    sm: spacing[4],   // 16px
    md: spacing[6],   // 24px
    lg: spacing[8],   // 32px
  },

  /**
   * Button padding - consistent padding for buttons
   */
  button: {
    sm: `${spacing[2]} ${spacing[4]}`,   // 8px 16px
    md: `${spacing[3]} ${spacing[6]}`,   // 12px 24px
    lg: `${spacing[4]} ${spacing[8]}`,   // 16px 32px
  },

  /**
   * Input padding - consistent padding for inputs
   */
  input: {
    sm: `${spacing[2.5]} ${spacing[3]}`, // 10px 12px
    md: `${spacing[3]} ${spacing[4]}`,   // 12px 16px
    lg: `${spacing[4]} ${spacing[5]}`,   // 16px 20px
  },

  /**
   * Gap between inline elements
   */
  inline: {
    tight: spacing[2],    // 8px
    normal: spacing[3],   // 12px
    relaxed: spacing[4],  // 16px
  },

  /**
   * Gap between stacked elements
   */
  stack: {
    tight: spacing[3],    // 12px
    normal: spacing[4],   // 16px
    relaxed: spacing[6],  // 24px
    spacious: spacing[8], // 32px
  },
} as const;

// ========================================================================
// SPACING CONSTANTS FOR DESIGN TOKENS
// ========================================================================

/**
 * Design token constants for CSS variables
 */
export const spacingTokens = {
  // Base units
  '--space-0': '0',
  '--space-0-5': '0.125rem',   // 2px
  '--space-1': '0.25rem',      // 4px
  '--space-1-5': '0.375rem',   // 6px
  '--space-2': '0.5rem',       // 8px
  '--space-2-5': '0.625rem',   // 10px
  '--space-3': '0.75rem',      // 12px
  '--space-3-5': '0.875rem',   // 14px
  '--space-4': '1rem',         // 16px
  '--space-5': '1.25rem',      // 20px
  '--space-6': '1.5rem',       // 24px
  '--space-7': '1.75rem',      // 28px
  '--space-8': '2rem',         // 32px
  '--space-10': '2.5rem',      // 40px
  '--space-12': '3rem',        // 48px
  '--space-16': '4rem',        // 64px
  '--space-20': '5rem',        // 80px
  '--space-24': '6rem',        // 96px
  '--space-32': '8rem',        // 128px
} as const;

// ========================================================================
// EXPORT ALL
// ========================================================================

export const spacingSystem = {
  scale: spacing,
  container: containerPadding,
  section: sectionSpacing,
  component: componentSpacing,
  touchTarget,
  gridGap,
  contentMaxWidth,
  utils: spacingUtils,
  tokens: spacingTokens,
} as const;
