// ========================================================================
// SCALEITE DESIGN PATTERNS
// ========================================================================
// Reference: Linear, Vercel, Stripe design systems
// Philosophy: Consistent patterns, predictable interactions, pixel-perfect
// ========================================================================

import { tokens } from './tokens';

// ========================================================================
// INTERACTION PATTERNS
// ========================================================================
// Consistent hover, active, and focus states across all components
// All durations: 200ms (fast), 300ms (slow)
// All scales: hover 1.02, active 0.98
// ========================================================================

export const interactionPatterns = {
  // Button interactions
  button: {
    hover: {
      transform: 'scale(1.02)',
      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
    active: {
      transform: 'scale(0.98)',
      transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
    focus: {
      outline: 'none',
      ring: '0 0 0 2px theme(colors.white), 0 0 0 5px theme(colors.primary.500 / 0.7)',
    },
  },

  // Card interactions
  card: {
    hover: {
      transform: 'translateY(-4px) scale(1.02)',
      shadow: '0 12px 24px -8px rgba(0, 0, 0, 0.10)',
      transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
    active: {
      transform: 'translateY(-2px) scale(0.98)',
      transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },

  // Input interactions
  input: {
    hover: {
      borderColor: 'theme(colors.slate.300)',
      transform: 'translateY(-1px)',
      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
    focus: {
      borderColor: 'theme(colors.primary.400)',
      ring: '0 0 0 4px theme(colors.primary.500 / 0.08)',
      transform: 'translateY(-1px) scale(1.005)',
      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },

  // Link interactions
  link: {
    hover: {
      color: 'theme(colors.primary.600)',
      underline: 'translateX(0) scaleX(1)',
      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
} as const;

// ========================================================================
// SPACING PATTERNS
// ========================================================================
// Consistent spacing scale for component layouts
// Uses 4px base unit: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
// ========================================================================

export const spacingPatterns = {
  // Component padding
  padding: {
    compact: '0.5rem',    // 8px   - Tight spacing
    DEFAULT: '1rem',      // 16px  - Standard
    comfortable: '1.5rem', // 24px  - Roomy
    spacious: '2rem',     // 32px  - Extra roomy
  },

  // Component gaps
  gap: {
    xs: '0.5rem',   // 8px   - Tight gaps
    sm: '0.75rem',  // 12px  - Small gaps
    DEFAULT: '1rem', // 16px  - Standard gaps
    md: '1.5rem',   // 24px  - Medium gaps
    lg: '2rem',     // 32px  - Large gaps
    xl: '3rem',     // 48px  - Extra large gaps
  },

  // Section spacing
  section: {
    sm: '3rem',     // 48px  - Small sections
    DEFAULT: '4rem', // 64px  - Standard sections
    md: '5rem',     // 80px  - Medium sections
    lg: '6rem',     // 96px  - Large sections
    xl: '8rem',     // 128px - Extra large sections
  },
} as const;

// ========================================================================
// TYPOGRAPHY PATTERNS
// ========================================================================
// Consistent heading hierarchy and body text styles
// Modular scale: 1.25 ratio
// ========================================================================

export const typographyPatterns = {
  // Heading styles
  heading: {
    hero: {
      fontSize: '3rem',      // 48px mobile
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    h1: {
      fontSize: '2.25rem',   // 36px
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    h2: {
      fontSize: '1.875rem',  // 30px
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
      fontWeight: '600',
    },
    h3: {
      fontSize: '1.5rem',    // 24px
      lineHeight: '1.4',
      letterSpacing: '-0.01em',
      fontWeight: '600',
    },
    h4: {
      fontSize: '1.25rem',   // 20px
      lineHeight: '1.4',
      letterSpacing: '0',
      fontWeight: '600',
    },
  },

  // Body text styles
  body: {
    large: {
      fontSize: '1.125rem',  // 18px
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    DEFAULT: {
      fontSize: '1rem',      // 16px
      lineHeight: '1.625',
      letterSpacing: '0',
    },
    small: {
      fontSize: '0.875rem',  // 14px
      lineHeight: '1.5',
      letterSpacing: '0.01em',
    },
    tiny: {
      fontSize: '0.75rem',   // 12px
      lineHeight: '1.4',
      letterSpacing: '0.02em',
    },
  },

  // Text colors (semantic)
  textColor: {
    DEFAULT: 'theme(colors.slate.900)',
    muted: 'theme(colors.slate.600)',
    subtle: 'theme(colors.slate.500)',
    inverted: 'theme(colors.white)',
  },
} as const;

// ========================================================================
// LAYOUT PATTERNS
// ========================================================================
// Consistent container, grid, and spacing patterns
// ========================================================================

export const layoutPatterns = {
  // Container max-widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container padding (responsive)
  containerPadding: {
    mobile: '1rem',      // 16px
    tablet: '1.5rem',    // 24px
    desktop: '2rem',     // 32px
    wide: '2.5rem',      // 40px
  },

  // Grid gaps
  gridGap: {
    sm: '1rem',      // 16px
    DEFAULT: '1.5rem', // 24px
    md: '2rem',      // 32px
    lg: '2.5rem',    // 40px
    xl: '3rem',      // 48px
  },

  // Card grid
  cardGrid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4,
    },
  },
} as const;

// ========================================================================
// COLOR PATTERNS
// ========================================================================
// Consistent color usage for semantic meaning
// ========================================================================

export const colorPatterns = {
  // Background colors
  background: {
    DEFAULT: 'theme(colors.white)',
    muted: 'theme(colors.slate.50)',
    subtle: 'theme(colors.slate.100)',
    inverted: 'theme(colors.slate.900)',
  },

  // Border colors
  border: {
    DEFAULT: 'theme(colors.slate.200)',
    muted: 'theme(colors.slate.100)',
    strong: 'theme(colors.slate.300)',
    focus: 'theme(colors.primary.500)',
  },

  // Text gradients (for headings)
  gradient: {
    primary: 'linear-gradient(135deg, theme(colors.primary.600) 0%, theme(colors.secondary.500) 100%)',
    subtle: 'linear-gradient(135deg, theme(colors.slate.700) 0%, theme(colors.slate.500) 100%)',
  },
} as const;

// ========================================================================
// ANIMATION PATTERNS
// ========================================================================
// Consistent animation timings and easings
// GPU-accelerated only (transform, opacity)
// ========================================================================

export const animationPatterns = {
  // Fade animations
  fade: {
    in: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 0.2,
      ease: 'easeOut',
    },
    out: {
      from: { opacity: 1 },
      to: { opacity: 0 },
      duration: 0.15,
      ease: 'easeIn',
    },
  },

  // Slide animations
  slide: {
    up: {
      from: { opacity: 0, y: 20 },
      to: { opacity: 1, y: 0 },
      duration: 0.3,
      ease: 'easeOut',
    },
    down: {
      from: { opacity: 0, y: -20 },
      to: { opacity: 1, y: 0 },
      duration: 0.3,
      ease: 'easeOut',
    },
  },

  // Scale animations
  scale: {
    in: {
      from: { opacity: 0, scale: 0.96 },
      to: { opacity: 1, scale: 1 },
      duration: 0.2,
      ease: 'easeOut',
    },
  },

  // Stagger delay (for list animations)
  stagger: {
    fast: 50,   // ms
    normal: 100, // ms
    slow: 150,  // ms
  },
} as const;

// ========================================================================
// COMPONENT STATE PATTERNS
// ========================================================================
// Consistent styling for different component states
// ========================================================================

export const statePatterns = {
  // Loading state
  loading: {
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
    shimmerDark: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  // Empty state
  empty: {
    iconSize: '4rem',     // 64px
    iconColor: 'theme(colors.slate.300)',
    textColor: 'theme(colors.slate.500)',
    textFontSize: '0.875rem', // 14px
  },

  // Error state
  error: {
    iconColor: 'theme(colors.error.500)',
    textColor: 'theme(colors.error.600)',
    borderColor: 'theme(colors.error.200)',
    backgroundColor: 'theme(colors.error.50)',
  },

  // Success state
  success: {
    iconColor: 'theme(colors.success.500)',
    textColor: 'theme(colors.success.600)',
    borderColor: 'theme(colors.success.200)',
    backgroundColor: 'theme(colors.success.50)',
  },
} as const;

// ========================================================================
// RESPONSIVE PATTERNS
// ========================================================================
// Consistent breakpoints and responsive adjustments
// ========================================================================

export const responsivePatterns = {
  // Text scaling (responsive font sizes)
  textScale: {
    heading: {
      mobile: '2rem',      // 32px
      tablet: '2.5rem',    // 40px
      desktop: '3rem',     // 48px
      wide: '3.5rem',      // 56px
    },
    subheading: {
      mobile: '1.125rem',  // 18px
      tablet: '1.25rem',   // 20px
      desktop: '1.5rem',   // 24px
    },
    body: {
      mobile: '0.875rem',  // 14px
      tablet: '0.9375rem', // 15px
      desktop: '1rem',     // 16px
    },
  },

  // Touch targets (responsive sizing)
  touchTarget: {
    mobile: '44px',  // WCAG minimum
    desktop: '36px', // Smaller on desktop with precise input
  },

  // Grid adjustments
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
} as const;

// ========================================================================
// UTILITY CLASSES GENERATOR
// ========================================================================
// Generates consistent Tailwind utility class combinations
// ========================================================================

export const utilityClasses = {
  // Base button styles
  button: (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none';
    const interactive = 'hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/70';
    const variants = {
      primary: 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-premium hover:shadow-glow',
      secondary: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800',
      ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200',
    };
    return `${base} ${interactive} ${variants[variant]}`;
  },

  // Base input styles
  input: () => {
    return 'w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/8 hover:border-slate-300 dark:hover:border-slate-600';
  },

  // Base card styles
  card: () => {
    return 'bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-premium transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]';
  },

  // Container styles
  container: (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'xl') => {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    };
    return `mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]}`;
  },
} as const;

// ========================================================================
// EXPORT ALL PATTERNS
// ========================================================================

export const patterns = {
  interaction: interactionPatterns,
  spacing: spacingPatterns,
  typography: typographyPatterns,
  layout: layoutPatterns,
  color: colorPatterns,
  animation: animationPatterns,
  state: statePatterns,
  responsive: responsivePatterns,
  utility: utilityClasses,
} as const;
