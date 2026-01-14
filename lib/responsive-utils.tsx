/**
 * Responsive Utilities - Phase 2 UX Refinements
 * Reference: Linear, Vercel, Stripe responsive patterns
 *
 * This file provides utilities for:
 * - Consistent breakpoints
 * - Responsive spacing
 * - Device-specific optimizations
 * - Print styles
 */

// ==================== BREAKPOINT DEFINITIONS ====================

/**
 * Standard breakpoint values (matches Tailwind CSS)
 * Use these for JavaScript-based responsive logic
 */
export const BREAKPOINTS = {
  sm: 640,   // Small tablets (640px)
  md: 768,   // Tablets (768px)
  lg: 1024,  // Laptops (1024px)
  xl: 1280,  // Desktops (1280px)
  '2xl': 1536, // Large desktops (1536px)
} as const;

/**
 * Media query helper functions
 * Use with React hooks or JavaScript
 */
export const mediaQueries = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,

  // Max-width queries
  maxSm: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  maxMd: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  maxLg: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  maxXl: `(max-width: ${BREAKPOINTS.xl - 1}px)`,

  // Orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',

  // Device features
  hover: '(hover: hover)',
  touch: '(hover: none)',
  finePointer: '(pointer: fine)',
  coarsePointer: '(pointer: coarse)',
} as const;

/**
 * Hook to check if screen matches breakpoint
 */
export const useBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia(mediaQueries[breakpoint]);
  return mediaQuery.matches;
};

/**
 * Hook to get current breakpoint
 */
export const useCurrentBreakpoint = (): keyof typeof BREAKPOINTS => {
  if (typeof window === 'undefined') return 'lg';

  const width = window.innerWidth;

  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'sm' as keyof typeof BREAKPOINTS;
};

// ==================== RESPONSIVE SPACING ====================

/**
 * Consistent spacing scale across breakpoints
 * Matches the design system's 4, 6, 8, 12, 16, 20, 24 scale
 */
export const responsiveSpacing = {
  // Container padding
  containerPadding: 'px-4 sm:px-6 lg:px-8 xl:px-12',

  // Section vertical padding
  sectionPadding: 'py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32',

  // Gap spacing
  gapSm: 'gap-2 sm:gap-3 md:gap-4',
  gapMd: 'gap-4 sm:gap-6 md:gap-8 lg:gap-12',
  gapLg: 'gap-6 sm:gap-8 md:gap-12 lg:gap-16',

  // Text sizing
  textBase: 'text-sm sm:text-base md:text-lg lg:text-xl',
  textLead: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  textDisplay: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
} as const;

/**
 * Responsive container max-widths
 */
export const containerMaxWidths = {
  sm: 'max-w-sm',   // 384px
  md: 'max-w-md',   // 448px
  lg: 'max-w-lg',   // 512px
  xl: 'max-w-xl',   // 576px
  '2xl': 'max-w-2xl', // 672px
  '3xl': 'max-w-3xl', // 768px
  '4xl': 'max-w-4xl', // 896px
  '5xl': 'max-w-5xl', // 1024px
  '6xl': 'max-w-6xl', // 1152px
  '7xl': 'max-w-7xl', // 1280px
} as const;

// ==================== DEVICE-SPECIFIC OPTIMIZATIONS ====================

/**
 * Mobile optimizations (< 768px)
 */
export const mobileOptimizations = {
  // Touch targets minimum 44x44px (WCAG AA)
  touchTarget: 'min-h-11 min-w-11',

  // Simplified layout on mobile
  singleColumn: 'grid-cols-1',

  // Hide decorative elements on mobile
  hideDecorative: 'hidden sm:block',

  // Larger tap targets
  largeTapTargets: 'p-4 sm:p-3',

  // Full-width inputs on mobile
  fullWidthInput: 'w-full sm:w-auto',
} as const;

/**
 * Tablet optimizations (768px - 1024px)
 * Often neglected - this is the "md" breakpoint
 */
export const tabletOptimizations = {
  // Two-column grid on tablet
  twoColumnGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',

  // Adjusted padding for tablet
  adjustedPadding: 'px-4 md:px-8 lg:px-12',

  // Optimized text sizes
  tabletText: 'text-base md:text-lg lg:text-xl',

  // Show sidebar on tablet
  showSidebar: 'hidden md:block',

  // Horizontal scroll for tables
  tableScroll: 'overflow-x-auto md:overflow-x-visible',
} as const;

/**
 * Desktop optimizations (> 1024px)
 */
export const desktopOptimizations = {
  // Multi-column layouts
  multiColumn: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',

  // Hover effects only work on desktop
  hoverEffects: 'hover:shadow-lg hover:scale-105',

  // Show decorative elements
  showDecorative: 'hidden lg:block',

  // Fixed positioning
  fixedSidebar: 'fixed lg:sticky top-0',

  // Expandable content
  expandable: 'lg:expanded',
} as const;

/**
 * Ultra-wide desktop optimizations (> 1536px)
 * 2xl breakpoint - often neglected
 */
export const ultraWideOptimizations = {
  // Limit max-width for readability
  limitWidth: 'max-w-7xl mx-auto',

  // Add more columns
  extraColumns: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',

  // Increase spacing
  increaseSpacing: 'gap-4 md:gap-6 lg:gap-8 xl:gap-12 2xl:gap-16',

  // Show additional content
  showExtra: 'hidden 2xl:block',

  // Larger text
  largerText: 'text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
} as const;

// ==================== LANDSCAPE MOBILE ====================

/**
 * Landscape mobile optimizations
 * When phone is rotated (usually < 768px width but tall height)
 */
export const landscapeMobileOptimizations = {
  // Reduce padding in landscape
  reducePadding: 'py-8 md:py-12',

  // Hide non-essential content
  hideNonEssential: 'hidden max-md:landscape',

  // Adjust font sizes
  adjustFont: 'text-sm max-md:landscape:text-xs',

  // Compact layout
  compactLayout: 'grid-cols-2 max-md:landscape:grid-cols-4',
} as const;

// ==================== RESPONSIVE COMPONENTS ====================

/**
 * Responsive grid helper
 * Automatically adjusts columns based on breakpoint
 */
export const responsiveGrid = (columns: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  wide?: number;
}): string => {
  const mobile = columns.mobile || 1;
  const tablet = columns.tablet || 2;
  const desktop = columns.desktop || 3;
  const wide = columns.wide || 4;

  return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} xl:grid-cols-${wide}`;
};

/**
 * Responsive text size
 */
export const responsiveText = (sizes: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const mobile = sizes.mobile || 'text-base';
  const tablet = sizes.tablet || 'text-lg';
  const desktop = sizes.desktop || 'text-xl';

  return `${mobile} md:${tablet} lg:${desktop}`;
};

/**
 * Responsive spacing
 */
export const responsiveGap = (sizes: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const mobile = sizes.mobile || 'gap-4';
  const tablet = sizes.tablet || 'gap-6';
  const desktop = sizes.desktop || 'gap-8';

  return `${mobile} md:${tablet} lg:${desktop}`;
};

// ==================== PRINT UTILITIES ====================

/**
 * Print-specific utilities
 * These ensure content looks good when printed
 */
export const printUtilities = {
  // Hide elements when printing
  hideOnPrint: 'print:hidden',

  // Show only when printing
  showOnPrint: 'hidden print:block',

  // Remove shadows when printing
  noShadowOnPrint: 'print:shadow-none',

  // Ensure text is readable when printing
  readableOnPrint: 'print:text-black print:bg-white',

  // Ensure links are visible when printing
  visibleLinksOnPrint: 'print:underline print:text-blue-600',

  // Page break controls
  avoidBreakInside: 'print:break-inside-avoid',
  avoidBreakAfter: 'print:break-after-avoid',
  breakBefore: 'print:break-before',
} as const;

// ==================== ORIENTATION DETECTION ====================

/**
 * Hook to detect device orientation
 */
export const useOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'portrait';

  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

/**
 * Orientation-specific classes
 */
export const orientationClasses = {
  portrait: 'orientation-portrait',
  landscape: 'orientation-landscape',
} as const;

// ==================== HIGH DPI / RETINA SUPPORT ====================

/**
 * Detect high DPI displays
 */
export const useHighDPI = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(min-resolution: 2dppx)').matches;
};

/**
 * Responsive image sources for different DPIs
 */
export const responsiveImageSources = (baseUrl: string) => ({
  '1x': baseUrl,
  '2x': baseUrl.replace('.', '@2x.'),
  '3x': baseUrl.replace('.', '@3x.'),
});

// ==================== DARK MODE ====================

/**
 * Dark mode detection
 */
export const useDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(prefers-color-scheme: dark)').matches ||
    document.documentElement.classList.contains('dark')
  );
};

/**
 * Theme-aware classes
 */
export const themeClasses = {
  bg: 'bg-white dark:bg-slate-900',
  text: 'text-slate-900 dark:text-slate-100',
  border: 'border-slate-200 dark:border-slate-700',
  shadow: 'shadow-soft dark:shadow-premium',
};

// ==================== REDUCED MOTION ====================

/**
 * Detect reduced motion preference
 */
export const useReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Conditionally apply animations based on motion preference
 */
export const motionPreferences = {
  respectReducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
  reducedMotion: 'prefers-reduced-motion',
};
