/**
 * Accessibility Utilities (WCAG AA Compliant)
 * Helper functions for ARIA labels, focus management, and keyboard navigation
 */

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
  }, 1000);
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
  setTimeout(() => element.focus(), 300);
};

/**
 * Generate unique IDs for ARIA relationships
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
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
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rLinear, gLinear, bLinear] = [r, g, b].map((channel) => {
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast meets WCAG AA standards
 */
export const checkContrastAA = (foreground: string, background: string, largeText: boolean = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  const required = largeText ? 3.0 : 4.5;
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
 */
export const setupSkipLinks = (): void => {
  const skipLinks = document.querySelectorAll('[href^="#"][data-skip]');
  skipLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.substring(1);
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          scrollIntoViewWithFocus(target);
        }
      }
    });
  });
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
  const isDark = luminance < 0x7ffff;

  return {
    light: isDark ? '#ffffff' : '#000000',
    dark: isDark ? '#ffffff' : '#000000',
  };
};
