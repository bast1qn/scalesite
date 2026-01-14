/**
 * Responsive Breakpoint Utilities
 * Testing and optimizing for all screen sizes (mobile, tablet, desktop, ultra-wide)
 */

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface BreakpointConfig {
  min: number;
  max: number;
  label: string;
  description: string;
  commonDevice: string;
}

/**
 * Breakpoint definitions matching Tailwind CSS
 */
export const BREAKPOINTS: Record<Breakpoint, BreakpointConfig> = {
  xs: {
    min: 0,
    max: 475,
    label: 'Extra Small',
    description: 'Small phones (landscape)',
    commonDevice: 'iPhone SE (landscape)',
  },
  sm: {
    min: 480,
    max: 640,
    label: 'Small',
    description: 'Small phones, tablets (portrait)',
    commonDevice: 'iPhone 12, Samsung Galaxy S21',
  },
  md: {
    min: 641,
    max: 768,
    label: 'Medium',
    description: 'Tablets (landscape), small laptops',
    commonDevice: 'iPad (landscape), 768px laptops',
  },
  lg: {
    min: 769,
    max: 1024,
    label: 'Large',
    description: 'Desktops, large tablets',
    commonDevice: 'Desktop, iPad Pro',
  },
  xl: {
    min: 1025,
    max: 1280,
    label: 'Extra Large',
    description: 'Large desktops',
    commonDevice: '15-inch laptops, large monitors',
  },
  '2xl': {
    min: 1281,
    max: 1536,
    label: '2X Large',
    description: 'Extra large desktops',
    commonDevice: '27-inch monitors, 1440p displays',
  },
  '3xl': {
    min: 1537,
    max: 99999,
    label: '3X Large',
    description: 'Ultra-wide desktops',
    commonDevice: '32-inch+ monitors, 4K displays',
  },
};

/**
 * Get current breakpoint based on window width
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'lg';

  const width = window.innerWidth;

  for (const [key, config] of Object.entries(BREAKPOINTS)) {
    if (width >= config.min && width <= config.max) {
      return key as Breakpoint;
    }
  }

  return 'lg';
};

/**
 * Check if current breakpoint matches or is larger than target
 */
export const isBreakpointOrLarger = (target: Breakpoint): boolean => {
  const current = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  return breakpointOrder.indexOf(current) >= breakpointOrder.indexOf(target);
};

/**
 * Check if current breakpoint matches or is smaller than target
 */
export const isBreakpointOrSmaller = (target: Breakpoint): boolean => {
  const current = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  return breakpointOrder.indexOf(current) <= breakpointOrder.indexOf(target);
};

/**
 * Get responsive value based on breakpoint
 */
export const getResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T => {
  const current = getCurrentBreakpoint();
  return values[current] ?? defaultValue;
};

/**
 * Test responsive layout (development only)
 */
export const testResponsiveLayout = (): void => {
  if (import.meta.env.DEV) {
    const current = getCurrentBreakpoint();
    const config = BREAKPOINTS[current];
    console.group(`📱 Responsive Test: ${current}`);
    console.log(`Width: ${window.innerWidth}px`);
    console.log(`Label: ${config.label}`);
    console.log(`Description: ${config.description}`);
    console.log(`Common Device: ${config.commonDevice}`);
    console.groupEnd();
  }
};

/**
 * Responsive spacing scale
 */
export const getResponsiveSpacing = (
  mobile: number,
  tablet?: number,
  desktop?: number,
  wide?: number
): string => {
  return `${mobile}px ${tablet ?? mobile}px ${desktop ?? tablet ?? mobile}px ${wide ?? desktop ?? tablet ?? mobile}px`;
};

/**
 * Responsive font size
 */
export const getResponsiveFontSize = (
  mobile: string,
  tablet?: string,
  desktop?: string,
  wide?: string
): string => {
  const current = getCurrentBreakpoint();
  if (isBreakpointOrLarger('3xl') && wide) return wide;
  if (isBreakpointOrLarger('xl') && desktop) return desktop;
  if (isBreakpointOrLarger('md') && tablet) return tablet;
  return mobile;
};

/**
 * Check if device is touch-enabled
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Check if landscape orientation
 */
export const isLandscape = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
};

/**
 * Safe area insets (for notched devices)
 */
export const getSafeAreaInsets = (): { top: string; right: string; bottom: string; left: string } => {
  return {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  };
};

/**
 * Test print styles
 */
export const testPrintStyles = (): void => {
  if (import.meta.env.DEV) {
    const before = window.onbeforeprint;
    const after = window.onafterprint;

    window.onbeforeprint = () => console.log('🖨️ Print preview opened');
    window.onafterprint = () => console.log('🖨️ Print preview closed');
  }
};

/**
 * Responsive container widths (max-width)
 */
export const CONTAINER_WIDTHS: Record<Breakpoint, string> = {
  xs: '100%',
  sm: '100%',
  md: '640px',
  lg: '768px',
  xl: '1024px',
  '2xl': '1280px',
  '3xl': '1536px',
};

/**
 * Get container max-width for current breakpoint
 */
export const getContainerMaxWidth = (): string => {
  const current = getCurrentBreakpoint();
  return CONTAINER_WIDTHS[current];
};

/**
 * Responsive grid columns
 */
export const getGridColumns = (
  mobile: number,
  tablet?: number,
  desktop?: number,
  wide?: number
): number => {
  const current = getCurrentBreakpoint();
  if (isBreakpointOrLarger('3xl') && wide) return wide;
  if (isBreakpointOrLarger('xl') && desktop) return desktop;
  if (isBreakpointOrLarger('md') && tablet) return tablet;
  return mobile;
};

/**
 * Generate responsive classes (development helper)
 */
export const generateResponsiveClass = (
  property: string,
  mobile: string,
  tablet?: string,
  desktop?: string,
  wide?: string
): string => {
  let classes = `${property}-${mobile}`;

  if (tablet) classes += ` ${property}-${tablet}-md`;
  if (desktop) classes += ` ${property}-${desktop}-lg`;
  if (wide) classes += ` ${property}-${wide}-xl`;

  return classes;
};

/**
 * Test common viewport sizes
 */
export const testCommonViewports = (): Array<{ width: number; height: number; label: string }> => {
  return [
    { width: 375, height: 667, label: 'iPhone SE (small)' },
    { width: 390, height: 844, label: 'iPhone 12/13 (standard)' },
    { width: 428, height: 926, label: 'iPhone 14 Pro Max (large)' },
    { width: 768, height: 1024, label: 'iPad (portrait)' },
    { width: 1024, height: 768, label: 'iPad (landscape)' },
    { width: 1366, height: 768, label: 'Laptop (13-inch)' },
    { width: 1440, height: 900, label: 'Desktop (27-inch)' },
    { width: 1920, height: 1080, label: 'Full HD (1080p)' },
    { width: 2560, height: 1440, label: '2K/QHD (1440p)' },
    { width: 3840, height: 2160, label: '4K/UHD (2160p)' },
  ];
};

/**
 * Optimized mobile touch targets (WCAG AA: 44x44px minimum)
 */
export const getTouchTargetSize = (size: 'small' | 'medium' | 'large' = 'medium'): { width: string; height: string; minHeight: string } => {
  const sizes = {
    small: { width: '44px', height: '44px', minHeight: '44px' },
    medium: { width: '48px', height: '48px', minHeight: '48px' },
    large: { width: '52px', height: '52px', minHeight: '52px' },
  };
  return sizes[size];
};

/**
 * Check if viewport should use hamburger menu
 */
export const shouldUseHamburgerMenu = (): boolean => {
  return isBreakpointOrSmaller('md');
};

/**
 * Optimize images for current viewport
 */
export const getOptimalImageWidth = (): number => {
  const current = getCurrentBreakpoint();
  const widths: Record<Breakpoint, number> = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,
  };
  return widths[current];
};

/**
 * Responsive line clamp (text truncation)
 */
export const getLineClamp = (
  mobile: number,
  tablet?: number,
  desktop?: number
): number => {
  const current = getCurrentBreakpoint();
  if (isBreakpointOrLarger('lg') && desktop) return desktop;
  if (isBreakpointOrLarger('md') && tablet) return tablet;
  return mobile;
};
