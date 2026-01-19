// ========================================================================
// SCALEITE DESIGN TOKENS
// ========================================================================
// Reference: Linear, Vercel, Stripe design systems
// Philosophy: Clean, Minimal, Professional
// Focus: Pixel-perfect spacing, harmonious typography, refined interactions
// ========================================================================

// ========================================================================
// SPACING SCALE (Base unit: 4px)
// ========================================================================
// Following 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 scale
// Ensures harmonious spacing across all components
// ========================================================================

export const spacing = {
  // Base spacing (4px unit)
  xs: '0.25rem',   // 4px   - Tight spacing for compact elements
  sm: '0.5rem',    // 8px   - Small gaps, icon padding
  md: '0.75rem',   // 12px  - Medium spacing, button padding
  lg: '1rem',      // 16px  - Standard spacing unit
  xl: '1.25rem',   // 20px  - Large gaps
  '2xl': '1.5rem', // 24px  - Extra large gaps
  '3xl': '2rem',   // 32px  - Section spacing
  '4xl': '2.5rem', // 40px  - Large section spacing
  '5xl': '3rem',   // 48px  - Hero spacing
  '6xl': '4rem',   // 64px  - Major sections
  '7xl': '5rem',   // 80px  - Hero top/bottom
  '8xl': '6rem',   // 96px  - Extra hero spacing
} as const;

// ========================================================================
// TYPOGRAPHY SYSTEM
// ========================================================================
// Font families: Inter (UI), Outfit (Display), Plus Jakarta Sans (Headings)
// Scale: Modular scale with 1.25 ratio for harmonious sizing
// Line heights: Optimized for readability (1.3-1.7 range)
// Letter spacing: Tight for headings (-0.02 to -0.04em)
// ========================================================================

export const typography = {
  // Font sizes (using modular scale)
  fontSize: {
    xxs: '0.625rem',   // 10px  - Tiny labels
    xs: '0.75rem',     // 12px  - Small text, captions
    sm: '0.875rem',    // 14px  - Body small, labels
    base: '1rem',      // 16px  - Body text
    lg: '1.125rem',    // 18px  - Lead text
    xl: '1.25rem',     // 20px  - Large body
    '2xl': '1.5rem',   // 24px  - H4
    '3xl': '1.875rem', // 30px  - H3
    '4xl': '2.25rem',  // 36px  - H2
    '5xl': '3rem',     // 48px  - H1
    '6xl': '3.75rem',  // 60px  - Hero
    '7xl': '4.5rem',   // 72px  - Display
  },

  // Line heights (optimized for readability)
  lineHeight: {
    tight: '1.25',
    snug: '1.3',
    normal: '1.5',
    relaxed: '1.625',
    loose: '1.75',
  },

  // Letter spacing (tracking)
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.04em',
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// ========================================================================
// COLOR SYSTEM
// ========================================================================
// Primary: Blue (#5c6fff) → Secondary: Violet (#8b5cf6)
// Semantic colors: Success (emerald), Warning (amber), Error (rose)
// All colors WCAG AA compliant (4.5:1 contrast minimum)
// ========================================================================

export const colors = {
  // Primary colors
  primary: {
    50: '#f0f4ff',
    100: '#e0eaff',
    200: '#c7d7fe',
    300: '#a4b8fc',
    400: '#7c8ff8',
    500: '#5c6fff', // DEFAULT
    600: '#4b5aed',
    700: '#3e4acc',
    800: '#3640a3',
    900: '#303e87',
    950: '#1f2960',
  },

  // Secondary colors
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // DEFAULT
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Neutral colors
  slate: {
    50: '#fafafa',
    100: '#f5f5f7',
    200: '#e8e8ed',
    300: '#d4d4d9',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#030305',
  },
} as const;

// ========================================================================
// BORDER RADIUS
// ========================================================================
// Scale: 4, 8, 12, 16, 20, 24, 32, 48 pixels
// Consistent rounded corners across all components
// ========================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px   - Small elements
  DEFAULT: '0.5rem', // 8px  - Cards, inputs
  md: '0.75rem',   // 12px  - Medium cards
  lg: '1rem',      // 16px  - Large cards
  xl: '1.25rem',   // 20px  - Extra large cards
  '2xl': '1.5rem', // 24px  - Hero elements
  '3xl': '2rem',   // 32px  - Pills, badges
  full: '9999px',  // Circular elements
} as const;

// ========================================================================
// SHADOWS
// ========================================================================
// Subtle, refined shadows inspired by Vercel/Linear
// Multiple layers for depth (ambient + direct light)
// Dark mode shadows adjusted for contrast
// ========================================================================

export const shadows = {
  // Light mode shadows
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Premium shadows with color
  premium: '0 1px 6px rgba(0, 0, 0, 0.02), 0 3px 12px rgba(75, 90, 237, 0.04)',
  premiumLg: '0 4px 16px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(75, 90, 237, 0.08)',
  premiumXl: '0 8px 24px rgba(0, 0, 0, 0.06), 0 16px 48px rgba(75, 90, 237, 0.10)',

  // Glow effects
  glow: '0 0 32px rgba(75, 90, 237, 0.12)',
  glowSm: '0 0 16px rgba(75, 90, 237, 0.08)',
  glowLg: '0 0 48px rgba(75, 90, 237, 0.16)',

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// ========================================================================
// ANIMATIONS
// ========================================================================
// Duration: 150-500ms for interactions
// Easing: Custom bezier curves for natural feel
// GPU-accelerated properties only (transform, opacity)
// ========================================================================

export const animations = {
  // Duration (milliseconds)
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '500ms',
  },

  // Easing functions (custom bezier curves)
  easing: {
    // Linear/Vercel-inspired ease-out
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',

    // Smooth spring-like ease
    easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

    // Standard ease-in-out
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Sharp, snappy transitions
    easeSharp: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  // Transforms
  scale: {
    hover: '1.02',   // 2% scale on hover
    active: '0.98',  // 2% scale on click
  },

  // Standard transitions
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  transitionSlow: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

// ========================================================================
// Z-INDEX SCALE
// ========================================================================
// Organized by layer, not by arbitrary numbers
// Prevents z-index wars and ensures proper stacking
// ========================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
  max: 9999,
} as const;

// ========================================================================
// BREAKPOINTS
// ========================================================================
// Mobile-first approach
// Consistent with Tailwind defaults
// ========================================================================

export const breakpoints = {
  sm: '640px',   // Small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
} as const;

// ========================================================================
// COMPONENT-SPECIFIC TOKENS
// ========================================================================

export const components = {
  // Button tokens
  button: {
    padding: {
      sm: '0.5rem 1rem',
      DEFAULT: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
    height: {
      sm: '2.25rem',  // 36px
      DEFAULT: '2.75rem', // 44px
      lg: '3rem',     // 48px
    },
    borderRadius: borderRadius.lg,
    fontWeight: typography.fontWeight.semibold,
    transition: animations.duration.fast,
  },

  // Input tokens
  input: {
    padding: '0.75rem 1rem',
    height: '2.75rem', // 44px - touch-friendly minimum
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.base,
    transition: animations.duration.normal,
  },

  // Card tokens
  card: {
    padding: '1.5rem',
    borderRadius: borderRadius.xl,
    shadow: shadows.premium,
    shadowHover: shadows.premiumLg,
    transition: animations.duration.slow,
  },
} as const;

// ========================================================================
// ACCESSIBILITY TOKENS
// ========================================================================

export const a11y = {
  // Minimum touch target size (WCAG 2.5.5)
  touchTarget: '44px',

  // Focus ring
  focusRing: '0 0 0 2px theme(colors.white), 0 0 0 4px theme(colors.primary.500 / 0.5)',
  focusRingDark: '0 0 0 2px theme(colors.slate.900), 0 0 0 4px theme(colors.primary.500 / 0.5)',

  // Reduced motion
  reducedMotion: 'prefers-reduced-motion: reduce',
} as const;

// ========================================================================
// EXPORT ALL TOKENS
// ========================================================================

export const tokens = {
  spacing,
  typography,
  colors,
  borderRadius,
  shadows,
  animations,
  zIndex,
  breakpoints,
  components,
  a11y,
} as const;
