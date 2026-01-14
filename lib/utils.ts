/**
 * Utility functions for ScaleSite
 * Common helpers used across the application
 */

// Re-export commonly used hooks for convenience
export { useScroll } from './hooks';

// ===== STORAGE HELPERS =====

/**
 * ⚠️ SECURITY: Never store sensitive data in localStorage!
 *
 * ALLOWED: Theme, language, UI preferences (non-sensitive)
 * FORBIDDEN: Auth tokens, user data, session info, passwords, emails
 *
 * localStorage is accessible to any XSS attack - use Supabase's secure storage for auth
 */
const FORBIDDEN_KEYS = ['token', 'auth', 'session', 'password', 'user', 'email', 'secret', 'api_key', 'credential'];

/**
 * Check if a key contains sensitive data
 */
function isSensitiveKey(key: string): boolean {
  const keyLower = key.toLowerCase();
  return FORBIDDEN_KEYS.some(forbidden => keyLower.includes(forbidden));
}

/**
 * Safely get item from localStorage with SSR safety
 */
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;

  // SECURITY: Log sensitive key access attempts
  if (isSensitiveKey(key)) {
    if (import.meta.env.DEV) {
      console.warn('[SECURITY] Attempted to read sensitive key from localStorage:', key);
    }
  }

  try {
    return localStorage.getItem(key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[SECURITY] localStorage read failed:', error);
    }
    return null;
  }
}

/**
 * Safely set item in localStorage with SSR safety
 * SECURITY: Blocks storage of sensitive data
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;

  // SECURITY: Block sensitive data storage
  if (isSensitiveKey(key)) {
    if (import.meta.env.DEV) {
      console.error('[SECURITY] Attempted to store sensitive data in localStorage:', key);
      console.error('[SECURITY] This is a security violation. Use Supabase auth for session data.');
    }
    return false;
  }

  // SECURITY: Limit value size to prevent localStorage quota exhaustion (DoS)
  const MAX_VALUE_SIZE = 10000; // 10KB per item
  if (value.length > MAX_VALUE_SIZE) {
    if (import.meta.env.DEV) {
      console.error('[SECURITY] Value too large for localStorage, possible DoS attempt:', key);
    }
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[SECURITY] localStorage write failed:', error);
    }
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

// ===== GRADIENT UTILITIES =====

/**
 * Common gradient patterns used across the application
 * Reduces duplication of gradient className strings
 */
export const GRADIENTS = {
  /** Primary blue-violet gradient for CTAs and highlights */
  primary: 'bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600',

  /** Hover variant of primary gradient */
  primaryHover: 'hover:from-blue-700 hover:to-violet-700 hover:to-indigo-700',

  /** Subtle violet-blue gradient for backgrounds */
  subtle: 'bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',

  /** Bold gradient for feature cards */
  card: 'bg-gradient-to-br from-blue-600 to-violet-600',

  /** Success gradient (green-emerald) */
  success: 'bg-gradient-to-r from-emerald-500 to-green-500',

  /** Warning gradient (amber-orange) */
  warning: 'bg-gradient-to-r from-amber-500 to-orange-500',

  /** Error gradient (red-rose) */
  error: 'bg-gradient-to-r from-red-500 to-rose-500',
} as const;

/**
 * Get a complete gradient className with hover states
 *
 * @param gradient - Base gradient from GRADIENTS
 * @param includeHover - Whether to include hover variant
 * @returns Combined className string
 *
 * @example
 * gradientClass(GRADIENTS.primary, true)
 * // Returns: 'bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:from-blue-700 hover:to-violet-700 hover:to-indigo-700'
 */
export function gradientClass(gradient: string, includeHover = false): string {
  return includeHover
    ? `${gradient} ${GRADIENTS.primaryHover}`
    : gradient;
}

// ===== TICKET & STATUS HELPERS =====

/**
 * Returns Tailwind CSS classes for ticket status badges
 * Provides consistent styling across the application
 *
 * @param status - The ticket status ('Offen' | 'In Bearbeitung' | 'Wartet auf Antwort' | 'Geschlossen')
 * @returns CSS class string for status styling with dark mode support
 *
 * @example
 * getTicketStatusColor('Offen')
 * // Returns: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
 */
export function getTicketStatusColor(
  status: 'Offen' | 'In Bearbeitung' | 'Wartet auf Antwort' | 'Geschlossen'
): string {
  const colorMap = {
    'Offen': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    'In Bearbeitung': 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    'Wartet auf Antwort': 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
    'Geschlossen': 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
  } as const;

  return colorMap[status] || colorMap['Offen'];
}

/**
 * Returns Tailwind CSS classes for ticket priority badges
 *
 * @param priority - The ticket priority ('Niedrig' | 'Mittel' | 'Hoch')
 * @returns CSS class string for priority styling with dark mode support
 *
 * @example
 * getTicketPriorityColor('Hoch')
 * // Returns: 'bg-red-500/20 text-red-600 dark:text-red-400'
 */
export function getTicketPriorityColor(
  priority: 'Niedrig' | 'Mittel' | 'Hoch'
): string {
  const colorMap = {
    'Niedrig': 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    'Mittel': 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    'Hoch': 'bg-red-500/20 text-red-600 dark:text-red-400',
  } as const;

  return colorMap[priority] || colorMap['Mittel'];
}

/**
 * Returns Tailwind CSS classes for generic status badges
 * Use this for success, error, warning, and info states
 *
 * @param status - The status type
 * @returns CSS class string for status styling
 *
 * @example
 * getStatusBadgeColor('success')
 * // Returns: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
 */
export function getStatusBadgeColor(
  status: 'success' | 'error' | 'warning' | 'info'
): string {
  const colorMap = {
    success: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    error: 'bg-red-500/20 text-red-600 dark:text-red-400',
    warning: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    info: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  } as const;

  return colorMap[status];
}

// ===== TICKET OPTIONS =====

/**
 * Standard ticket priority options for dropdowns/selects
 */
export const TICKET_PRIORITY_OPTIONS = [
  { value: 'Niedrig', label: 'Niedrig' },
  { value: 'Mittel', label: 'Mittel' },
  { value: 'Hoch', label: 'Hoch' }
] as const;

/**
 * Standard ticket status options for dropdowns/selects
 */
export const TICKET_STATUS_OPTIONS = [
  { value: 'Offen', label: 'Offen' },
  { value: 'In Bearbeitung', label: 'In Bearbeitung' },
  { value: 'Wartet auf Antwort', label: 'Wartet auf Antwort' },
  { value: 'Geschlossen', label: 'Geschlossen' }
] as const;
