/**
 * ScaleSite UI/UX Utilities
 * Phase 2: Foundation - Interactive States
 * Referenz: Linear, Vercel, Stripe
 *
 * CONSISTENT INTERACTIVE STATES:
 * - Hover: scale-[1.02]
 * - Active: scale-[0.98]
 * - Focus: ring-2 ring-primary-500/50
 * - Disabled: opacity-50 cursor-not-allowed
 * - Duration: 300ms
 */

/**
 * Base interactive states for ALL clickable elements
 * Usage: className={`${interactiveStates} px-6 py-3 bg-primary-600`}
 */
export const interactiveStates = `
  transition-all duration-300
  hover:scale-[1.02]
  active:scale-[0.98]
  focus:ring-2
  focus:ring-primary-500/50
  disabled:opacity-50
  disabled:cursor-not-allowed
`;

/**
 * Button states with additional shadow on hover
 * Usage: className={`${buttonStates} px-8 py-4 bg-primary-600 text-white`}
 */
export const buttonStates = `
  ${interactiveStates}
  hover:shadow-glow
`;

/**
 * Card hover states with subtle lift
 * Usage: className={`${cardStates} p-6 bg-white rounded-2xl`}
 */
export const cardStates = `
  transition-all duration-300
  hover:scale-[1.02]
  hover:shadow-card-hover
  active:scale-[0.98]
  focus:ring-2
  focus:ring-primary-500/50
`;

/**
 * Link states with underline animation
 * Usage: className={`${linkStates} text-slate-600 dark:text-slate-400`}
 */
export const linkStates = `
  transition-all duration-200
  hover:text-primary-600
  dark:hover:text-primary-400
  focus:ring-2
  focus:ring-primary-500/50
  rounded
`;

/**
 * Input focus states
 * Usage: className={`${inputStates} px-4 py-3 border border-slate-200 rounded-xl`}
 */
export const inputStates = `
  transition-all duration-200
  focus:border-primary-400
  dark:focus:border-primary-500
  focus:ring-2
  focus:ring-primary-500/50
  disabled:opacity-50
  disabled:cursor-not-allowed
`;

/**
 * SPACING UTILITIES
 * Consistent spacing scale: 4, 6, 8, 12, 16, 20, 24
 */

/**
 * Mobile padding scale
 */
export const spacing = {
  xs: 'p-4',      // 1rem - Mobile tight
  sm: 'p-6',      // 1.5rem - Mobile comfortable
  md: 'p-8',      // 2rem - Desktop base
  lg: 'p-12',     // 3rem - Desktop spacious
  xl: 'p-16',     // 4rem - Desktop extra spacious
  xxl: 'p-20',    // 5rem - Desktop hero
} as const;

/**
 * Gap scale for flex/grid layouts
 */
export const gap = {
  xs: 'gap-4',      // 1rem - Tight
  sm: 'gap-6',      // 1.5rem - Comfortable
  md: 'gap-8',      // 2rem - Spacious
  lg: 'gap-12',     // 3rem - Extra spacious
  xl: 'gap-16',     // 4rem - Hero spacing
} as const;

/**
 * TYPOGRAPHY HIERARCHY
 * Mobile → Desktop responsive patterns
 */

/**
 * Hero text hierarchy
 */
export const textHero = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight';

/**
 * H1 text hierarchy
 */
export const textH1 = 'text-3xl sm:text-4xl md:text-5xl font-bold leading-snug tracking-tight';

/**
 * H2 text hierarchy
 */
export const textH2 = 'text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight';

/**
 * H3 text hierarchy
 */
export const textH3 = 'text-xl sm:text-2xl md:text-3xl font-semibold leading-snug tracking-tight';

/**
 * H4 text hierarchy
 */
export const textH4 = 'text-lg sm:text-xl md:text-2xl font-semibold leading-snug';

/**
 * Body text hierarchy
 */
export const textBody = 'text-base sm:text-lg leading-relaxed';

/**
 * Small text hierarchy
 */
export const textSmall = 'text-sm sm:text-base leading-relaxed';

/**
 * RESPONSIVE CONTAINER UTILITIES
 */

/**
 * Standard container with mobile → desktop padding
 */
export const containerResponsive = 'px-4 sm:px-6 lg:px-8';

/**
 * Section spacing with mobile → desktop scale
 */
export const sectionSpacing = 'py-12 sm:py-16 lg:py-20 xl:py-24';

/**
 * COLOR CONSISTENCY UTILITIES
 */

/**
 * Primary color - ALWAYS use primary-600 for primary actions
 */
export const colorPrimary = {
  bg: 'bg-primary-600 dark:bg-primary-700',
  bgHover: 'hover:bg-primary-700 dark:hover:bg-primary-800',
  text: 'text-primary-600 dark:text-primary-400',
  border: 'border-primary-600 dark:border-primary-500',
  gradient: 'bg-gradient-to-r from-primary-600 to-violet-600',
} as const;

/**
 * Secondary color - use violet-600 for accents
 */
export const colorSecondary = {
  bg: 'bg-violet-600 dark:bg-violet-700',
  bgHover: 'hover:bg-violet-700 dark:hover:bg-violet-800',
  text: 'text-violet-600 dark:text-violet-400',
  border: 'border-violet-600 dark:border-violet-500',
  gradient: 'bg-gradient-to-r from-primary-600 to-violet-600',
} as const;

/**
 * TOUCH TARGET UTILITIES
 */

/**
 * Minimum touch target (44px - iOS standard)
 */
export const touchTarget = 'min-h-11 min-w-11';

/**
 * Button touch target with comfortable padding
 */
export const buttonTouchTarget = 'min-h-12 px-6 py-3';

/**
 * Link/button with icon touch target
 */
export const iconButtonTarget = 'min-h-11 min-w-11 flex items-center justify-center';

/**
 * VALIDATION UTILITIES
 */

/**
 * Check if spacing value is valid (4, 6, 8, 12, 16, 20, 24)
 */
export function isValidSpacing(value: number): boolean {
  return [4, 6, 8, 12, 16, 20, 24].includes(value);
}

/**
 * Validate and correct spacing value
 */
export function validateSpacing(value: number): number {
  const validValues = [4, 6, 8, 12, 16, 20, 24];
  if (validValues.includes(value)) {
    return value;
  }
  // Round to nearest valid value
  return validValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * DARK MODE UTILITIES
 */

/**
 * Standard dark mode text color
 */
export const darkModeText = 'text-slate-900 dark:text-slate-100';

/**
 * Standard dark mode background
 */
export const darkModeBg = 'bg-white dark:bg-slate-900';

/**
 * Standard dark mode border
 */
export const darkModeBorder = 'border-slate-200 dark:border-slate-700';

/**
 * Standard dark mode surface
 */
export const darkModeSurface = 'bg-slate-50 dark:bg-slate-800';

/**
 * ANIMATION DURATIONS
 */

export const duration = {
  fast: 'duration-200',      // 0.2s - Fast transitions
  normal: 'duration-300',    // 0.3s - Standard transitions
  slow: 'duration-400',      // 0.4s - Slow transitions
  slower: 'duration-500',    // 0.5s - Very slow transitions
} as const;

/**
 * EASING FUNCTIONS
 */

export const easing = {
  out: 'ease-out',
  inOut: 'ease-in-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;
