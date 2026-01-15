// ============================================
// ACCESSIBILITY UTILITIES (WCAG AA Compliant)
// Loop 11/Phase 2: Accessibility Deep-Dive
// ============================================

/**
 * WCAG AA CONTRAST CHECKER
 * Ensures text meets minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const fgLum = getLuminance(fg);
  const bgLum = getLuminance(bg);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

export function isContrastAACompliant(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const minimum = isLargeText ? 3.0 : 4.5;
  return ratio >= minimum;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * ARIA LABEL GENERATORS
 * Ensures icon buttons have descriptive labels
 */
export function generateAriaLabel(
  iconName: string,
  action: string,
  context?: string
): string {
  const label = context ? `${iconName} ${action}: ${context}` : `${iconName} ${action}`;
  return label;
}

export function getButtonAriaProps(
  label: string,
  isPressed?: boolean,
  isExpanded?: boolean,
  controls?: string
): {
  'aria-label': string;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
} {
  const props: {
    'aria-label': string;
    'aria-pressed'?: boolean;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
  } = {
    'aria-label': label,
  };

  if (isPressed !== undefined) {
    props['aria-pressed'] = isPressed;
  }

  if (isExpanded !== undefined) {
    props['aria-expanded'] = isExpanded;
  }

  if (controls) {
    props['aria-controls'] = controls;
  }

  return props;
}

/**
 * ALT TEXT GENERATORS
 * Ensures all images have meaningful alt text
 */
export function generateImageAltText(
  src: string,
  context?: string,
  isDecorative: boolean = false
): string {
  if (isDecorative) {
    return ''; // Decorative images should have empty alt text
  }

  // Extract filename from src
  const filename = src.split('/').pop()?.split('.')[0] || 'image';

  // Convert kebab-case to readable text
  const readable = filename.replace(/-/g, ' ').replace(/_/g, ' ');

  return context ? `${readable} - ${context}` : readable;
}

export function getImgAriaProps(
  alt: string,
  isDecorative: boolean = false,
  caption?: string
): {
  alt: string;
  role?: 'img';
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
} {
  const props: {
    alt: string;
    role?: 'img';
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
  } = {
    alt: isDecorative ? '' : alt,
  };

  if (!isDecorative) {
    props.role = 'img';
  }

  if (caption) {
    props['aria-describedby'] = caption;
  }

  return props;
}

/**
 * KEYBOARD NAVIGATION UTILITIES
 * Ensures smooth keyboard navigation
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  actions: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: () => void;
  }
): void {
  const { key } = event;

  switch (key) {
    case 'Enter':
      event.preventDefault();
      actions.onEnter?.();
      break;
    case ' ':
      event.preventDefault();
      actions.onSpace?.();
      break;
    case 'Escape':
      event.preventDefault();
      actions.onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      actions.onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      actions.onArrowDown?.();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      actions.onArrowLeft?.();
      break;
    case 'ArrowRight':
      event.preventDefault();
      actions.onArrowRight?.();
      break;
    case 'Tab':
      actions.onTab?.();
      break;
  }
}

export function getKeyboardAriaProps(isDisabled: boolean = false): {
  tabIndex: number;
  'aria-disabled'?: boolean;
} {
  const props: {
    tabIndex: number;
    'aria-disabled'?: boolean;
  } = {
    tabIndex: 0,
  };

  if (isDisabled) {
    props['aria-disabled'] = true;
    props.tabIndex = -1;
  }

  return props;
}

/**
 * FOCUS MANAGEMENT UTILITIES
 * Ensures proper focus management for modals, dialogs, etc.
 */
export function trapFocus(
  containerRef: React.RefObject<HTMLElement>,
  event: KeyboardEvent
): void {
  if (event.key !== 'Tab') return;

  const focusableElements = containerRef.current?.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (!focusableElements || focusableElements.length === 0) return;

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

export function setFocusToElement(
  elementRef: React.RefObject<HTMLElement>,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'nearest' }
): void {
  if (elementRef.current) {
    elementRef.current.focus();
    elementRef.current.scrollIntoView(options);
  }
}

/**
 * SCREEN READER UTILITIES
 * Ensures content is accessible to screen readers
 */
export function getScreenReaderText(text: string, isHidden: boolean = true): {
  children: string;
  className: string;
} {
  return {
    children: text,
    className: isHidden ? 'sr-only' : '',
  };
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * SKIP LINK UTILITIES
 * Helps keyboard users skip navigation
 */
export function createSkipLink(
  href: string,
  label: string
): { href: string; className: string; children: string; onClick: (e: React.MouseEvent) => void } {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.setAttribute('tabindex', '-1');
      (target as HTMLElement).focus();
      (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    href,
    className: 'skip-link',
    children: label,
    onClick: handleClick,
  };
}

/**
 * SEMANTIC HTML HELPERS
 * Ensures proper semantic HTML structure
 */
export function getHeadingLevel(level: 1 | 2 | 3 | 4 | 5 | 6): {
  as: `h${level}`;
  id?: string;
} {
  return {
    as: `h${level}` as const,
  };
}

export function getLandmarkAriaProps(
  role: 'banner' | 'navigation' | 'main' | 'complementary' | 'contentinfo' | 'form' | 'search' | 'region',
  label?: string
): {
  role: string;
  'aria-label'?: string;
} {
  const props: {
    role: string;
    'aria-label'?: string;
  } = {
    role,
  };

  if (label) {
    props['aria-label'] = label;
  }

  return props;
}

/**
 * VALIDATION UTILITIES
 * Ensures form validation is accessible
 */
export function getFieldAriaProps(
  id: string,
  error?: string,
  isRequired: boolean = false,
  description?: string
): {
  id: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-describedby'?: string;
  'aria-describedby-error'?: string;
} {
  const props: {
    id: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    'aria-describedby'?: string;
    'aria-describedby-error'?: string;
  } = {
    id,
  };

  if (error) {
    props['aria-invalid'] = true;
    props['aria-describedby-error'] = `${id}-error`;
  }

  if (isRequired) {
    props['aria-required'] = true;
  }

  if (description) {
    props['aria-describedby'] = `${id}-description`;
  }

  return props;
}

/**
 * REDUCED MOTION UTILITIES
 * Respects user's motion preferences
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getReducedMotionAriaProps(): {
  'data-reduced-motion'?: boolean;
} {
  const reducedMotion = prefersReducedMotion();
  return reducedMotion ? { 'data-reduced-motion': true } : {};
}
