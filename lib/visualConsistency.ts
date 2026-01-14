/**
 * Visual Consistency Checklist
 * Ensures design system compliance across all components (Linear/Vercel/Stripe reference)
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';
export type CardVariant = 'default' | 'elevated' | 'flat';
export type ShadowVariant = 'soft' | 'medium' | 'strong' | 'glow';

/**
 * @deprecated Import BUTTON_PRIMARY, BUTTON_SECONDARY from lib/ui-patterns.ts instead
 * Button Style Variants (consistent across app)
 */
export const buttonVariants: Record<ButtonVariant, string> = {
  /** @deprecated Use BUTTON_PRIMARY from lib/ui-patterns.ts */
  primary:
    'relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-violet-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-11',
  /** @deprecated Use BUTTON_SECONDARY from lib/ui-patterns.ts */
  secondary:
    'px-8 py-4 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-11',
  /** @deprecated Consider adding BUTTON_GHOST to lib/ui-patterns.ts */
  ghost:
    'px-6 py-3 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
  /** @deprecated Consider adding BUTTON_DANGER to lib/ui-patterns.ts */
  danger:
    'px-8 py-4 text-white font-semibold rounded-2xl bg-rose-500 hover:bg-rose-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-11',
};

/**
 * Button Size Variants
 */
export const buttonSizes: Record<ButtonSize, { padding: string; fontSize: string; minHeight: string }> = {
  sm: {
    padding: 'px-4 py-2',
    fontSize: 'text-sm',
    minHeight: 'min-h-9',
  },
  md: {
    padding: 'px-6 py-3',
    fontSize: 'text-base',
    minHeight: 'min-h-11',
  },
  lg: {
    padding: 'px-8 py-4',
    fontSize: 'text-lg',
    minHeight: 'min-h-12',
  },
};

/**
 * Input Style Variants
 */
export const inputVariants: Record<InputVariant, string> = {
  default:
    'block w-full px-5 py-3 text-base rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 transition-all duration-300 focus:border-primary-400 dark:focus:border-primary-500 focus:shadow-input-focus hover:border-slate-300 dark:hover:border-slate-600 min-h-11',
  error:
    'block w-full px-5 py-3 text-base rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-rose-300 dark:border-rose-700 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 transition-all duration-300 focus:border-rose-400 dark:focus:border-rose-500 focus:shadow-input-focus min-h-11',
  success:
    'block w-full px-5 py-3 text-base rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-300 dark:border-emerald-700 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 transition-all duration-300 focus:border-emerald-400 dark:focus:border-emerald-500 focus:shadow-input-focus min-h-11',
};

/**
 * Card Style Variants
 */
export const cardVariants: Record<CardVariant, string> = {
  default:
    'relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]',
  elevated:
    'relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-premium-lg overflow-hidden transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]',
  flat:
    'relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-100/50 dark:border-slate-800/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
};

/**
 * Shadow Style Variants
 */
export const shadowVariants: Record<ShadowVariant, string> = {
  soft: 'shadow-soft',
  medium: 'shadow-premium',
  strong: 'shadow-premium-lg',
  glow: 'shadow-glow',
};

/**
 * Spacing Scale (4px base unit)
 */
export const spacingScale = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px
};

/**
 * Border Radius Scale
 */
export const borderRadiusScale = {
  none: 'rounded-none',
  sm: 'rounded-lg', // 8px
  md: 'rounded-xl', // 12px
  lg: 'rounded-2xl', // 16px
  xl: 'rounded-3xl', // 24px
  full: 'rounded-full',
};

/**
 * Typography Scale
 */
export const typographyScale = {
  xs: 'text-xs', // 12px
  sm: 'text-sm', // 14px
  base: 'text-base', // 16px
  lg: 'text-lg', // 18px
  xl: 'text-xl', // 20px
  '2xl': 'text-2xl', // 24px
  '3xl': 'text-3xl', // 30px
  '4xl': 'text-4xl', // 36px
  '5xl': 'text-5xl', // 48px
  '6xl': 'text-6xl', // 60px
};

/**
 * Font Weight Scale
 */
export const fontWeightScale = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/**
 * Z-Index Scale
 */
export const zIndexScale = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modalBackdrop: 'z-40',
  modal: 'z-50',
  popover: 'z-50',
  tooltip: 'z-[60]',
  notification: 'z-[100]',
};

/**
 * Transition Duration Scale
 */
export const transitionDurationScale = {
  instant: 'duration-75',
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500',
};

/**
 * Transition Easing Scale
 */
export const transitionEasingScale = {
  linear: 'ease-linear',
  in: 'ease-in',
  out: 'ease-out',
  'in-out': 'ease-in-out',
  smooth: 'ease-[0.25,0.4,0.25,1]',
  spring: 'ease-[0.34,1.56,0.64,1]',
};

/**
 * Check component compliance
 */
export const checkComponentCompliance = (componentName: string, classes: string): {
  isCompliant: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  // Check for min-h-11 (44px) on interactive elements
  if (classes.includes('button') || classes.includes('input')) {
    if (!classes.includes('min-h-')) {
      issues.push(`${componentName}: Missing min-h-11 (44px touch target)`);
    }
  }

  // Check for transition duration
  if (classes.includes('hover:') && !classes.includes('duration-')) {
    issues.push(`${componentName}: Missing transition duration on hover state`);
  }

  // Check for focus ring
  if (classes.includes('button') || classes.includes('input')) {
    if (!classes.includes('focus:ring-')) {
      issues.push(`${componentName}: Missing focus ring for accessibility`);
    }
  }

  // Check for dark mode variants
  if (!classes.includes('dark:')) {
    issues.push(`${componentName}: Missing dark mode variants`);
  }

  return {
    isCompliant: issues.length === 0,
    issues,
  };
};

/**
 * Get consistent button classes
 */
export const getButtonClasses = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string => {
  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  return `${variantClasses} ${sizeClasses.padding} ${sizeClasses.fontSize} ${sizeClasses.minHeight}`;
};

/**
 * Get consistent input classes
 */
export const getInputClasses = (variant: InputVariant = 'default'): string => {
  return inputVariants[variant];
};

/**
 * Get consistent card classes
 */
export const getCardClasses = (variant: CardVariant = 'default'): string => {
  return cardVariants[variant];
};

/**
 * Get consistent shadow classes
 */
export const getShadowClasses = (variant: ShadowVariant = 'medium'): string => {
  return shadowVariants[variant];
};

/**
 * Visual consistency checklist for QA
 */
export const visualConsistencyChecklist = {
  buttons: [
    'All buttons have min-h-11 (44px)',
    'All buttons have transition duration',
    'All buttons have hover:scale-[1.02]',
    'All buttons have active:scale-[0.98]',
    'All buttons have focus:ring-2',
    'All buttons have dark mode variants',
    'All disabled buttons have opacity-50',
  ],
  inputs: [
    'All inputs have min-h-11',
    'All inputs have focus:border',
    'All inputs have focus:shadow',
    'All inputs have placeholder styling',
    'All inputs have dark mode variants',
  ],
  cards: [
    'All cards have rounded-3xl',
    'All cards have border',
    'All cards have shadow',
    'All cards have hover:scale-[1.02]',
    'All cards have transition duration',
    'All cards have dark mode variants',
  ],
  spacing: [
    'Consistent padding scale (4, 6, 8, 12, 16)',
    'Consistent margin scale',
    'Consistent gap scale',
  ],
  typography: [
    'Consistent font sizes',
    'Consistent font weights',
    'Consistent line heights',
    'Consistent letter spacing',
  ],
  colors: [
    'Consistent primary colors',
    'Consistent secondary colors',
    'Consistent semantic colors',
    'Consistent dark mode colors',
  ],
};
