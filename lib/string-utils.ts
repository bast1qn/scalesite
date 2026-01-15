// ============================================
// STRING UTILITY FUNCTIONS
// ============================================

/**
 * Convert string to title case
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert string to slug (URL-friendly)
 */
export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Truncate string to a specific length
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to camelCase
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, char => char.toLowerCase());
};

/**
 * Convert string to kebab-case
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Convert string to snake_case
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

/**
 * Remove all whitespace from string
 */
export const removeWhitespace = (str: string): string => {
  return str.replace(/\s/g, '');
};

/**
 * Remove extra spaces (replace multiple spaces with single space)
 */
export const normalizeSpaces = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Check if string is empty or only whitespace
 */
export const isEmpty = (str: string): boolean => {
  return str.trim().length === 0;
};

/**
 * Reverse a string
 */
export const reverse = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * Count occurrences of a substring in a string
 */
export const countOccurrences = (str: string, substring: string): number => {
  return str.split(substring).length - 1;
};

/**
 * Remove all occurrences of a substring
 */
export const removeAll = (str: string, substring: string): string => {
  return str.split(substring).join('');
};

/**
 * Replace all occurrences of a substring (case-insensitive)
 */
export const replaceAllCaseInsensitive = (
  str: string,
  search: string,
  replacement: string
): string => {
  const regex = new RegExp(search, 'gi');
  return str.replace(regex, replacement);
};

/**
 * Extract initials from a name
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .slice(0, maxInitials)
    .join('');
};

/**
 * Format bytes to human-readable string
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format a number as currency (EUR by default)
 * Note: Duplicates function in math-utils.ts to maintain compatibility
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'de-DE',
  currency: string = 'EUR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format a date to locale string
 */
export const formatDate = (
  date: Date,
  locale: string = 'de-DE',
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Format a date to relative time string
 */
export const formatRelativeTime = (date: Date, locale: string = 'de-DE'): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

/**
 * Pad string with characters
 */
export const pad = (str: string, length: number, char: string = '0', side: 'left' | 'right' = 'left'): string => {
  const padLength = Math.max(0, length - str.length);
  const padding = char.repeat(padLength);
  return side === 'left' ? padding + str : str + padding;
};

/**
 * Generate a random string
 */
export const randomString = (length: number, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * Highlight search terms in text
 */
export const highlightTerms = (text: string, searchTerm: string, highlightClass: string = 'highlight'): string => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};

/**
 * Strip HTML tags from string
 */
export const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Pluralize a word based on count
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  return count === 1 ? singular : plural || singular + 's';
};

/**
 * German pluralization
 */
export const pluralizeDE = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

/**
 * Check if string contains only digits
 */
export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
};

/**
 * Extract numbers from a string
 */
export const extractNumbers = (str: string): number[] => {
  const matches = str.match(/-?\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
};

/**
 * Mask sensitive data (e.g., credit card, email)
 */
export const maskString = (str: string, visibleChars: number = 4, maskChar: string = '*'): string => {
  if (str.length <= visibleChars * 2) return maskChar.repeat(str.length);
  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const middle = maskChar.repeat(str.length - visibleChars * 2);
  return start + middle + end;
};

/**
 * Split string into chunks of specific length
 */
export const chunk = (str: string, chunkSize: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * Check if string is a valid JSON
 */
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Parse JSON string safely
 */
export const safeJsonParse = <T = unknown>(str: string, defaultValue: T): T => {
  try {
    return JSON.parse(str) as T;
  } catch {
    return defaultValue;
  }
};

/**
 * Convert string to base64
 */
export const toBase64 = (str: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return window.btoa(str);
};

/**
 * Convert base64 to string
 */
export const fromBase64 = (base64: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(base64, 'base64').toString();
  }
  return window.atob(base64);
};
