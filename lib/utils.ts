/**
 * Utility functions for ScaleSite
 * Common helpers used across the application
 */

// Re-export commonly used hooks for convenience
export { useScroll } from './hooks';

// ===== STORAGE HELPERS =====

/**
 * Safely get item from localStorage with SSR safety
 */
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely set item in localStorage with SSR safety
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get JSON from localStorage
 */
export function getLocalStorageJSON<T>(key: string, fallback: T): T {
  const item = getLocalStorageItem(key);
  if (!item) return fallback;
  try {
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely set JSON in localStorage
 */
export function setLocalStorageJSON<T>(key: string, value: T): boolean {
  return setLocalStorageItem(key, JSON.stringify(value));
}

// ===== DATE HELPERS =====

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string, locale: string = 'de-DE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to short string
 */
export function formatDateShort(date: Date | string, locale: string = 'de-DE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string, locale: string = 'de'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (locale === 'de') {
    if (diffSecs < 60) return 'gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Minute${diffMins > 1 ? 'n' : ''}`;
    if (diffHours < 24) return `vor ${diffHours} Stunde${diffHours > 1 ? 'n' : ''}`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    return formatDate(d, locale);
  } else {
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(d, locale);
  }
}

// ===== ID GENERATION =====

/**
 * Generate a random ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

// ===== NUMBER HELPERS =====

/**
 * Format number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'de-DE'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ===== DOM HELPERS =====

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Scroll to top of page
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== CLASSNAME UTILITIES =====

/**
 * Combine multiple class names, filtering out falsy values
 * A simplified version of clsx/classnames for conditional className merging
 *
 * @example
 * cn('base-class', isActive && 'active-class', 'another-class')
 * // Returns: 'base-class active-class another-class' (if isActive is true)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create a common text color pattern with dark mode support
 * Reduces duplication of "text-slate-X dark:text-slate-Y" patterns
 *
 * @param light - Tailwind color class for light mode (e.g., 'text-slate-600')
 * @param dark - Tailwind color class for dark mode (e.g., 'dark:text-slate-400')
 * @returns Combined className string
 *
 * @example
 * textColor('text-slate-600', 'dark:text-slate-400')
 * // Returns: 'text-slate-600 dark:text-slate-400'
 */
export function textColor(light: string, dark: string): string {
  return `${light} ${dark}`;
}

/**
 * Create a common background color pattern with dark mode support
 * Reduces duplication of "bg-X dark:bg-Y" patterns
 *
 * @param light - Tailwind bg class for light mode
 * @param dark - Tailwind bg class for dark mode
 * @returns Combined className string
 *
 * @example
 * bgColor('bg-white', 'dark:bg-slate-900')
 * // Returns: 'bg-white dark:bg-slate-900'
 */
export function bgColor(light: string, dark: string): string {
  return `${light} ${dark}`;
}

/**
 * Create a common border color pattern with dark mode support
 * Reduces duplication of "border-X dark:border-Y" patterns
 *
 * @param light - Tailwind border class for light mode
 * @param dark - Tailwind border class for dark mode
 * @returns Combined className string
 *
 * @example
 * borderColor('border-slate-200', 'dark:border-slate-700')
 * // Returns: 'border-slate-200 dark:border-slate-700'
 */
export function borderColor(light: string, dark: string): string {
  return `${light} ${dark}`;
}
