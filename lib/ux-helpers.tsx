/**
 * UX Helper Utilities
 *
 * Collection of reusable UX patterns for consistent micro-interactions,
 * accessibility features, and responsive behavior.
 *
 * @module lib/ux-helpers
 */

import { type ReactNode, type ButtonHTMLAttributes, type MouseEvent } from 'react';

// ==================== MICRO-INTERACTIONS ====================

/**
 * Smooth hover transition configuration (200-300ms ease-out)
 * Consistent across all interactive elements per Linear/Vercel/Stripe patterns
 */
export const SMOOTH_TRANSITION = 'transition-all duration-200 ease-out';

export const SMOOTH_TRANSITION_SLOW = 'transition-all duration-300 ease-out';

/**
 * Interactive hover/active states (2% scale up/down)
 * Consistent micro-interaction per design system
 */
export const INTERACTIVE_HOVER = 'hover:scale-[1.02] active:scale-[0.98]';

/**
 * Focus ring for accessibility (WCAG AA compliant)
 * Visible, beautiful focus indicators
 */
export const FOCUS_RING = 'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900';

/**
 * Enhanced focus ring for buttons (larger, more visible)
 */
export const FOCUS_RING_BUTTON = 'focus:outline-none focus:ring-2 focus:ring-primary-500/70 focus:ring-offset-2 dark:focus:ring-offset-slate-900';

/**
 * Combined interactive state classes
 */
export const INTERACTIVE_STATES = `${SMOOTH_TRANSITION} ${INTERACTIVE_HOVER} ${FOCUS_RING}`;

// ==================== SUCCESS/ERROR FEEDBACK ====================

/**
 * Success feedback animation class
 * Subtle green glow for success states
 */
export const SUCCESS_FEEDBACK = 'animate-success-feedback';

/**
 * Error shake animation class
 * Shake effect for error states
 */
export const ERROR_SHAKE = 'animate-error-shake';

/**
 * Loading shimmer class
 * For skeleton loading states
 */
export const LOADING_SHIMMER = 'animate-loading-shimmer';

// ==================== ACCESSIBILITY HELPERS ====================

/**
 * Generate ARIA label for icon-only buttons
 * @param icon - Icon name or description
 * @param action - Action being performed (e.g., 'open', 'close', 'submit')
 * @returns ARIA label string
 */
export const generateAriaLabel = (icon: string, action: string): string => {
  return `${action} ${icon}`;
};

/**
 * Generate ARIA label for toggle buttons
 * @param feature - Feature being toggled
 * @param isActive - Current state
 * @returns ARIA label string
 */
export const generateToggleAriaLabel = (feature: string, isActive: boolean): string => {
  return `${feature} ${isActive ? 'deaktivieren' : 'aktivieren'}`;
};

/**
 * Screen reader only text wrapper
 * @param text - Text to announce
 * @returns JSX element with sr-only class
 */
export const SrOnlyText = ({ text }: { text: string }) => {
  return <span className="sr-only">{text}</span>;
};

// ==================== RESPONSIVE HELPERS ====================

/**
 * Responsive text sizes for optimal readability
 * Mobile → Tablet → Desktop → Ultra-wide
 */
export const RESPONSIVE_TEXT = {
  hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl',
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  h3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  body: 'text-base sm:text-lg md:text-xl',
  small: 'text-sm sm:text-base md:text-lg',
};

/**
 * Responsive container padding
 * Consistent spacing across breakpoints
 */
export const RESPONSIVE_CONTAINER = 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20';

/**
 * Responsive grid gaps
 */
export const RESPONSIVE_GAP = {
  sm: 'gap-2 sm:gap-3 md:gap-4 lg:gap-6',
  md: 'gap-4 sm:gap-6 md:gap-8 lg:gap-10',
  lg: 'gap-6 sm:gap-8 md:gap-10 lg:gap-12',
};

// ==================== HOVER CARD HELPERS ====================

/**
 * Spotlight card effect handler
 * Tracks mouse position for spotlight effect
 */
export const handleSpotlightMove = (
  e: MouseEvent<HTMLDivElement>,
  cardRef: React.RefObject<HTMLDivElement>,
  callback: (x: number, y: number) => void
) => {
  if (!cardRef.current) return;
  const rect = cardRef.current.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  callback(x, y);
};

// ==================== LOADING STATE HELPERS ====================

/**
 * Loading button with spinner
 * Shows spinner during loading state
 */
export const LoadingButton = ({
  children,
  isLoading,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean; children: ReactNode }) => {
  return (
    <button
      className={`${SMOOTH_TRANSITION} ${INTERACTIVE_HOVER} ${FOCUS_RING_BUTTON} disabled:opacity-50 disabled:cursor-not-allowed relative inline-flex items-center justify-center ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// ==================== KEYBOARD NAVIGATION HELPERS ====================

/**
 * Handle keyboard navigation for interactive elements
 * @param e - Keyboard event
 * @param actions - Actions for different keys
 */
export const handleKeyboardNavigation = (
  e: React.KeyboardEvent,
  actions: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
  }
) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      actions.onEnter?.();
      break;
    case 'Escape':
      actions.onEscape?.();
      break;
    case 'ArrowUp':
      e.preventDefault();
      actions.onArrowUp?.();
      break;
    case 'ArrowDown':
      e.preventDefault();
      actions.onArrowDown?.();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      actions.onArrowLeft?.();
      break;
    case 'ArrowRight':
      e.preventDefault();
      actions.onArrowRight?.();
      break;
    case 'Home':
      e.preventDefault();
      actions.onHome?.();
      break;
    case 'End':
      e.preventDefault();
      actions.onEnd?.();
      break;
  }
};

// ==================== CONTRAST HELPERS ====================

/**
 * Check if color meets WCAG AA contrast ratio (4.5:1 for normal text)
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns Whether contrast ratio meets WCAG AA
 */
export const checkWCAGAAContrast = (foreground: string, background: string): boolean => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;
    const [rLin, gLin, bLin] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    );
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  return ratio >= 4.5;
};

// ==================== PRINT HELPERS ====================

/**
 * Add print-only content
 * Content only visible when printing
 */
export const PrintOnly = ({ children }: { children: ReactNode }) => {
  return <div className="print-only">{children}</div>;
};

/**
 * Hide content from print
 */
export const NoPrint = ({ children }: { children: ReactNode }) => {
  return <div className="no-print">{children}</div>;
};

// ==================== TRANSITION HELPERS ====================

/**
 * Stagger children animation delays
 * @param index - Child index
 * @param baseDelay - Base delay in ms (default: 50ms)
 * @returns Animation delay style
 */
export const getStaggerDelay = (index: number, baseDelay: number = 50): string => {
  return `${index * baseDelay}ms`;
};

/**
 * Stagger children animation classes
 */
export const STAGGER_CHILDREN = 'stagger-children > *';

// ==================== EXPORT ALL ====================

export const uxHelpers = {
  // Micro-interactions
  SMOOTH_TRANSITION,
  SMOOTH_TRANSITION_SLOW,
  INTERACTIVE_HOVER,
  FOCUS_RING,
  FOCUS_RING_BUTTON,
  INTERACTIVE_STATES,

  // Feedback
  SUCCESS_FEEDBACK,
  ERROR_SHAKE,
  LOADING_SHIMMER,

  // Accessibility
  generateAriaLabel,
  generateToggleAriaLabel,
  SrOnlyText,

  // Responsive
  RESPONSIVE_TEXT,
  RESPONSIVE_CONTAINER,
  RESPONSIVE_GAP,

  // Interaction handlers
  handleSpotlightMove,
  handleKeyboardNavigation,

  // Contrast
  checkWCAGAAContrast,

  // Print
  PrintOnly,
  NoPrint,

  // Transitions
  getStaggerDelay,
  STAGGER_CHILDREN,

  // Components
  LoadingButton,
};
