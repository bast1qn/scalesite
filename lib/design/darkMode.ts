// ========================================================================
// DARK MODE DESIGN SYSTEM
// ========================================================================
// Reference: Linear, Vercel, Stripe dark mode implementations
// Philosophy: True black (#0a0a0a), refined contrast, subtle gradients
// Features: WCAG AAA compliance, eye-comfort, premium aesthetics
// ========================================================================

// ========================================================================
// DARK MODE COLOR PALETTE
// ========================================================================
// True black background: #0a0a0a (not #000000 for better OLED longevity)
// Elevated surfaces: #0f0f0f, #141414, #1a1a1a
// Text contrast: 12:1 (AAA), 7:1 (AA), 4.5:1 (AA minimum)
// ========================================================================

export const darkModeColors = {
  // Background colors (true black scale)
  background: {
    DEFAULT: '#0a0a0a',    // True black (slightly softened for OLED)
    elevated: '#0f0f0f',   // Elevated surface
    surface: '#141414',    // Cards, panels
    highlight: '#1a1a1a',  // Hover states
    border: '#262626',     // Borders, dividers
  },

  // Text colors (WCAG AAA compliant)
  text: {
    primary: '#FAFAFA',    // 12:1 contrast on #0a0a0a (AAA)
    secondary: '#A1A1AA',  // 7:1 contrast on #0a0a0a (AAA)
    tertiary: '#71717A',   // 4.5:1 contrast on #0a0a0a (AA)
    muted: '#52525B',      // Subtle text, placeholders
  },

  // Accent colors (optimized for dark mode)
  accent: {
    // Primary blue (slightly desaturated for eye comfort)
    primary: {
      DEFAULT: '#6B7AED',  // Lighter for dark mode
      hover: '#7B8AFD',
      active: '#5B6ADD',
      glow: 'rgba(107, 122, 237, 0.3)',
    },

    // Secondary violet
    secondary: {
      DEFAULT: '#9B7CF6',
      hover: '#AB8DFF',
      active: '#8B6CE6',
      glow: 'rgba(155, 124, 246, 0.3)',
    },

    // Semantic colors (adjusted for dark backgrounds)
    success: {
      DEFAULT: '#34D399',  // Brighter green
      hover: '#4ADE80',
      bg: 'rgba(52, 211, 153, 0.1)',
    },

    warning: {
      DEFAULT: '#FBBF24',
      hover: '#FCC94D',
      bg: 'rgba(251, 191, 36, 0.1)',
    },

    error: {
      DEFAULT: '#F87171',
      hover: '#FCA5A5',
      bg: 'rgba(248, 113, 113, 0.1)',
    },
  },

  // Border colors (subtle, refined)
  border: {
    DEFAULT: '#262626',
    subtle: '#1F1F1F',
    strong: '#2E2E2E',
    focus: '#6B7AED',
  },

  // Shadow colors (colored shadows for depth)
  shadow: {
    primary: 'rgba(107, 122, 237, 0.15)',
    secondary: 'rgba(155, 124, 246, 0.15)',
    ambient: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

// ========================================================================
// DARK MODE GRADIENTS
// ========================================================================
// Subtle, refined gradients for depth and interest
// Not too vibrant to maintain eye comfort

export const darkModeGradients = {
  // Primary gradient (subtle)
  primary: 'linear-gradient(135deg, #6B7AED 0%, #9B7CF6 100%)',

  // Subtle background gradient
  subtle: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)',

  // Glow gradient
  glow: 'radial-gradient(ellipse at center, rgba(107, 122, 237, 0.15) 0%, transparent 70%)',

  // Border gradient
  border: 'linear-gradient(180deg, #262626 0%, #1F1F1F 100%)',

  // Surface gradient
  surface: 'linear-gradient(135deg, #141414 0%, #1a1a1a 100%)',
} as const;

// ========================================================================
// DARK MODE TYPOGRAPHY
// ========================================================================
// Adjusted font weights and colors for optimal readability

export const darkModeTypography = {
  // Font weights (slightly bolder for better contrast)
  fontWeight: {
    light: '300',      // For large text only
    normal: '400',     // Body text
    medium: '500',     // Emphasized text
    semibold: '600',   // Headings
    bold: '700',       // Strong emphasis
  },

  // Text colors by usage
  textColor: {
    heading: darkModeColors.text.primary,
    body: darkModeColors.text.secondary,
    muted: darkModeColors.text.tertiary,
    placeholder: darkModeColors.text.muted,
  },

  // Letter spacing (increased slightly for readability)
  letterSpacing: {
    tight: '-0.01em',   // Headings
    normal: '0',        // Body
    wide: '0.02em',     // Small text
  },
} as const;

// ========================================================================
// DARK MODE SPACING
// ========================================================================
// Slightly increased spacing for dark mode
// Prevents visual crowding on dark backgrounds

export const darkModeSpacing = {
  // Increase spacing by ~6% for dark mode
  multiplier: 1.06,

  // Component-specific adjustments
  cardPadding: '1.6rem',      // 24px (vs 24px in light)
  sectionPadding: '5.3rem',   // 80px (vs 80px in light)
  inputPadding: '0.85rem 1rem', // Slightly more vertical padding
} as const;

// ========================================================================
// DARK MODE SHADOWS
// ========================================================================
// Colored shadows for depth on dark backgrounds
// No pure black shadows (don't work well on dark mode)

export const darkModeShadows = {
  // Subtle shadow (elevated cards)
  sm: `0 1px 2px 0 ${darkModeColors.shadow.ambient}`,

  // Medium shadow (floating elements)
  DEFAULT: `0 4px 6px -1px ${darkModeColors.shadow.ambient}, 0 2px 4px -1px ${darkModeColors.shadow.primary}`,

  // Large shadow (modals, dropdowns)
  lg: `0 10px 15px -3px ${darkModeColors.shadow.ambient}, 0 4px 6px -2px ${darkModeColors.shadow.primary}`,

  // Extra large shadow (tooltips)
  xl: `0 20px 25px -5px ${darkModeColors.shadow.ambient}, 0 10px 10px -5px ${darkModeColors.shadow.secondary}`,

  // Premium shadows (colored glow)
  premium: `0 1px 6px 0 ${darkModeColors.shadow.ambient}, 0 3px 12px -2px ${darkModeColors.shadow.primary}`,
  premiumLg: `0 4px 16px -2px ${darkModeColors.shadow.ambient}, 0 8px 32px -4px ${darkModeColors.shadow.primary}`,
  premiumXl: `0 8px 24px -4px ${darkModeColors.shadow.ambient}, 0 16px 48px -8px ${darkModeColors.shadow.secondary}`,

  // Glow effects
  glow: `0 0 32px ${darkModeColors.accent.primary.glow}`,
  glowSm: `0 0 16px ${darkModeColors.accent.primary.glow}`,
  glowLg: `0 0 48px ${darkModeColors.accent.primary.glow}`,
} as const;

// ========================================================================
// DARK MODE UTILITIES
// ========================================================================

/**
 * Get dark mode color with fallback
 * Returns dark mode color if dark mode is active, otherwise returns light mode color
 */
export const getDarkModeColor = (
  lightColor: string,
  darkColor: string,
  isDark: boolean
): string => {
  return isDark ? darkColor : lightColor;
};

/**
 * Get dark mode gradient with fallback
 */
export const getDarkModeGradient = (
  lightGradient: string,
  darkGradient: string,
  isDark: boolean
): string => {
  return isDark ? darkGradient : lightGradient;
};

/**
 * Optimize color for dark mode
 * Lightens color by specified percentage for better contrast
 */
export const optimizeForDarkMode = (
  hexColor: string,
  lightnessIncrease: number = 20
): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Convert to HSL
  const hsl = rgbToHsl(r, g, b);

  // Increase lightness
  hsl[2] = Math.min(100, hsl[2] + lightnessIncrease);

  // Convert back to RGB
  const [newR, newG, newB] = hslToRgb(hsl[0], hsl[1], hsl[2]);

  // Convert to hex
  return `#${[newR, newG, newB].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};

// Helper functions
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// ========================================================================
// DARK MODE CSS CUSTOM PROPERTIES
// ========================================================================
// CSS variables for easy theming

export const darkModeCSSVars = {
  // Background
  '--bg-primary': darkModeColors.background.DEFAULT,
  '--bg-elevated': darkModeColors.background.elevated,
  '--bg-surface': darkModeColors.background.surface,
  '--bg-highlight': darkModeColors.background.highlight,
  '--bg-border': darkModeColors.background.border,

  // Text
  '--text-primary': darkModeColors.text.primary,
  '--text-secondary': darkModeColors.text.secondary,
  '--text-tertiary': darkModeColors.text.tertiary,
  '--text-muted': darkModeColors.text.muted,

  // Accent
  '--accent-primary': darkModeColors.accent.primary.DEFAULT,
  '--accent-primary-hover': darkModeColors.accent.primary.hover,
  '--accent-primary-glow': darkModeColors.accent.primary.glow,

  '--accent-secondary': darkModeColors.accent.secondary.DEFAULT,
  '--accent-secondary-hover': darkModeColors.accent.secondary.hover,
  '--accent-secondary-glow': darkModeColors.accent.secondary.glow,

  // Semantic
  '--success-default': darkModeColors.accent.success.DEFAULT,
  '--warning-default': darkModeColors.accent.warning.DEFAULT,
  '--error-default': darkModeColors.accent.error.DEFAULT,

  // Border
  '--border-default': darkModeColors.border.DEFAULT,
  '--border-subtle': darkModeColors.border.subtle,
  '--border-strong': darkModeColors.border.strong,
  '--border-focus': darkModeColors.border.focus,
} as const;

// ========================================================================
// EXPORT ALL
// ========================================================================

export const darkMode = {
  colors: darkModeColors,
  gradients: darkModeGradients,
  typography: darkModeTypography,
  spacing: darkModeSpacing,
  shadows: darkModeShadows,
  cssVars: darkModeCSSVars,
  utilities: {
    getDarkModeColor,
    getDarkModeGradient,
    optimizeForDarkMode,
  },
} as const;
