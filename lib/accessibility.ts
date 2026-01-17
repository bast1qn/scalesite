/**
 * Accessibility Utilities (WCAG AA Compliant)
 * Helper functions for ARIA labels, focus management, and keyboard navigation
 */

import {
  SCREEN_READER_ANNOUNCEMENT_TIMEOUT,
  FOCUS_SCROLL_DELAY,
  ID_PREFIX_LENGTH,
  ID_SUFFIX_LENGTH,
  HEX_LUMINANCE_THRESHOLD,
  RGB_NORMALIZATION,
  WCAG_CONTRAST_RATIOS,
  LINEAR_RGB_THRESHOLD,
  RGB_LINEARIZATION,
  LUMINANCE_COEFFICIENTS,
  CONTRAST_ADDEND,
  RGB_BIT_SHIFTS,
  ACCESSIBLE_COLORS,
} from './constants/colors';

/**
 * Generate ARIA labels for icon-only buttons
 * @param action - The action the button performs (e.g., "Close", "Open menu")
 * @param context - Optional context (e.g., "dialog", "navigation")
 * @returns Complete ARIA label string
 */
export const getAriaLabel = (action: string, context?: string): string => {
  return context ? `${action} - ${context}` : action;
};

/**
 * Generate description for decorative elements
 * @param description - Visual description for screen readers
 */
export const getAriaDescription = (description: string): string => {
  return description;
};

/**
 * Announce dynamic content changes to screen readers
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive'
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Screen reader only
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, SCREEN_READER_ANNOUNCEMENT_TIMEOUT);
};

/**
 * Focus trap for modals and dialogs
 * @param element - Container element to trap focus within
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    // Shift + Tab
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    }
    // Tab
    else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Manage focus for dynamic content (e.g., after page navigation)
 */
export const restoreFocus = (element: HTMLElement | null): void => {
  if (element) {
    element.focus();
    // Announce to screen readers
    announceToScreenReader(`Navigated to ${element.getAttribute('aria-label') || 'new section'}`);
  }
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Scroll element into view with focus
 */
export const scrollIntoViewWithFocus = (element: HTMLElement): void => {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => element.focus(), FOCUS_SCROLL_DELAY);
};

/**
 * Generate unique IDs for ARIA relationships
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(ID_PREFIX_LENGTH, ID_SUFFIX_LENGTH)}`;
};

/**
 * Check color contrast for WCAG AA compliance
 * @param foreground - Hex color code
 * @param background - Hex color code
 * @returns Contrast ratio (AA: 4.5:1 for normal text, 3:1 for large text)
 */
export const getContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> RGB_BIT_SHIFTS.RED) & 0xff) / RGB_NORMALIZATION;
    const g = ((rgb >> RGB_BIT_SHIFTS.GREEN) & 0xff) / RGB_NORMALIZATION;
    const b = (rgb & 0xff) / RGB_NORMALIZATION;

    const [rLinear, gLinear, bLinear] = [r, g, b].map((channel) => {
      return channel <= LINEAR_RGB_THRESHOLD
        ? channel / RGB_LINEARIZATION.DIVISOR
        : Math.pow((channel + RGB_LINEARIZATION.ADDEND) / RGB_LINEARIZATION.DIVISOR_GAMMA, RGB_LINEARIZATION.GAMMA);
    });

    return LUMINANCE_COEFFICIENTS.RED * rLinear + LUMINANCE_COEFFICIENTS.GREEN * gLinear + LUMINANCE_COEFFICIENTS.BLUE * bLinear;
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + CONTRAST_ADDEND) / (darker + CONTRAST_ADDEND);
};

/**
 * Check if contrast meets WCAG AA standards
 */
export const checkContrastAA = (foreground: string, background: string, largeText: boolean = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  const required = largeText ? WCAG_CONTRAST_RATIOS.LARGE_TEXT : WCAG_CONTRAST_RATIOS.NORMAL_TEXT;
  return ratio >= required;
};

/**
 * Get keyboard navigation hint
 */
export const getKeyboardHint = (action: string): string => {
  const hints: Record<string, string> = {
    'dismiss': 'Press Escape to dismiss',
    'navigate': 'Use Tab to navigate',
    'select': 'Press Enter to select',
    'close': 'Press Escape to close',
  };
  return hints[action] || '';
};

/**
 * Mark element as hidden from screen readers (e.g., loading skeletons)
 */
export const hideFromScreenReaders = (element: HTMLElement): void => {
  element.setAttribute('aria-hidden', 'true');
};

/**
 * Mark element as visible to screen readers only
 */
export const showOnlyToScreenReaders = (element: HTMLElement): void => {
  element.className = 'sr-only';
};

/**
 * Skip to main content link handler
 * FIXED: Return cleanup function to prevent memory leaks
 */
export const setupSkipLinks = (): (() => void) => {
  const skipLinks = document.querySelectorAll('[href^="#"][data-skip]');
  const handlers: Array<() => void> = [];

  skipLinks.forEach(link => {
    const handleClick = (e: Event) => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.substring(1);
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          scrollIntoViewWithFocus(target);
        }
      }
    };

    link.addEventListener('click', handleClick);
    handlers.push(() => link.removeEventListener('click', handleClick));
  });

  // Return cleanup function
  return () => {
    handlers.forEach(cleanup => cleanup());
  };
};

/**
 * Reduce motion preference check
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Apply reduced motion to animations
 */
export const withReducedMotion = (
  normalAnimation: () => void,
  reducedAnimation: () => void
): void => {
  if (prefersReducedMotion()) {
    reducedAnimation();
  } else {
    normalAnimation();
  }
};

/**
 * Get accessible color for given background
 */
export const getAccessibleColor = (backgroundColor: string): { light: string; dark: string } => {
  // Simplified version - returns best contrast colors for light/dark backgrounds
  const luminance = parseInt(backgroundColor.replace('#', ''), 16);
  const isDark = luminance < HEX_LUMINANCE_THRESHOLD;

  return {
    light: isDark ? ACCESSIBLE_COLORS.WHITE : ACCESSIBLE_COLORS.BLACK,
    dark: isDark ? ACCESSIBLE_COLORS.WHITE : ACCESSIBLE_COLORS.BLACK,
  };
};

/**
 * ARIA label presets for common ScaleSite UI elements
 */
export const ariaPresets = {
  // Navigation
  menuOpen: 'Open navigation menu',
  menuClose: 'Close navigation menu',
  goToHome: 'Go to home page',
  goToPricing: 'Go to pricing page',
  goToContact: 'Go to contact page',
  goToServices: 'Go to services page',
  goToProjects: 'Go to projects page',

  // Theme
  toggleTheme: 'Toggle dark/light mode',
  themeDark: 'Switch to dark mode',
  themeLight: 'Switch to light mode',

  // Language
  toggleLanguage: 'Switch language between German and English',
  languageDE: 'Switch to German',
  languageEN: 'Switch to English',

  // Currency
  selectCurrency: 'Select currency',
  currencyEUR: 'Select Euro as currency',
  currencyUSD: 'Select US Dollar as currency',

  // Auth
  login: 'Log in to your account',
  logout: 'Log out of your account',
  signup: 'Create a new account',
  dashboard: 'Go to dashboard',
  configurator: 'Open website configurator',

  // Notifications
  notifications: 'View notifications',
  markAllRead: 'Mark all notifications as read',
  notificationBell: 'You have new notifications',

  // Actions
  close: 'Close dialog',
  save: 'Save changes',
  cancel: 'Cancel action',
  delete: 'Delete item',
  edit: 'Edit item',
  submit: 'Submit form',
  back: 'Go back to previous page',
  next: 'Go to next step',
  previous: 'Go to previous step',

  // Media
  play: 'Play video',
  pause: 'Pause video',
  mute: 'Mute audio',
  unmute: 'Unmute audio',
  fullscreen: 'Enter fullscreen mode',
  exitFullscreen: 'Exit fullscreen mode',

  // Content
  scrollToTop: 'Scroll back to top of page',
  share: 'Share this page',
  copy: 'Copy to clipboard',
  print: 'Print this page',
  download: 'Download file',

  // Feedback
  like: 'Like this content',
  dislike: 'Dislike this content',
  helpful: 'Mark as helpful',
  notHelpful: 'Mark as not helpful',

  // Pricing
  selectPackage: 'Select this package',
  viewPricing: 'View pricing details',

  // Form
  requiredField: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidName: 'Please enter your name',
} as const;

/**
 * Helper to apply ARIA attributes to icon buttons
 * ✅ FIXED: Replaced 'any' with proper ARIA attribute types
 */
export const getIconButtonProps = (
  preset: keyof typeof ariaPresets,
  additionalProps?: Record<string, string | boolean | number>
) => {
  return {
    'aria-label': ariaPresets[preset],
    role: 'button',
    ...additionalProps,
  };
};

/**
 * Generate descriptive text for screen readers about component state
 */
export const getStateDescription = (state: {
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  disabled?: boolean;
  loading?: boolean;
}): string => {
  const descriptions: string[] = [];

  if (state.expanded !== undefined) {
    descriptions.push(state.expanded ? 'expanded' : 'collapsed');
  }
  if (state.selected) {
    descriptions.push('selected');
  }
  if (state.checked !== undefined) {
    descriptions.push(state.checked ? 'checked' : 'unchecked');
  }
  if (state.disabled) {
    descriptions.push('disabled');
  }
  if (state.loading) {
    descriptions.push('loading');
  }

  return descriptions.join(', ');
};
