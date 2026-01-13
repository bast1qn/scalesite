/**
 * Date Utility Functions
 * Centralized date formatting and time-related utilities
 */

/**
 * Supported date formats
 */
export type DateFormat = 'short' | 'medium' | 'long' | 'time';

/**
 * Format options for each date format type
 */
const DATE_FORMATS = {
  short: { day: 'numeric', month: 'short' } as const,
  medium: { day: '2-digit', month: '2-digit', year: 'numeric' } as const,
  long: { day: 'numeric', month: 'long', year: 'numeric' } as const,
  time: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  } as const
} as const;

/**
 * Format a date string to German locale format
 *
 * @param dateString - ISO date string to format
 * @param format - Desired output format (default: 'medium')
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-01-15', 'short') // '15. Jan.'
 * formatDate('2024-01-15', 'medium') // '15.01.2024'
 * formatDate('2024-01-15T14:30:00', 'time') // '15.01.2024, 14:30'
 */
export const formatDate = (
  dateString: string,
  format: DateFormat = 'medium'
): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('de-DE', DATE_FORMATS[format]);
};

/**
 * Format a relative time as "time ago" string in German
 *
 * @param dateString - ISO date string to calculate time from
 * @returns Relative time string (e.g., "vor 5 Minuten", "gerade eben")
 *
 * @example
 * formatTimeAgo('2024-01-15T10:00:00') // assumes current time is 10:05:00
 * // Returns: "vor 5 Minuten"
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '-';
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return 'in Kürze';
  if (seconds < 5) return 'gerade eben';
  if (seconds < 60) return `vor ${seconds} Sekunden`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `vor ${weeks} Woche${weeks > 1 ? 'n' : ''}`;
  }

  // For dates older than 4 weeks, show actual date
  return formatDate(dateString, 'short');
};

/**
 * Check if a date is in the past
 *
 * @param dateString - ISO date string to check
 * @returns True if date is in the past
 */
export const isPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.getTime() < Date.now();
};

/**
 * Check if a date is in the future
 *
 * @param dateString - ISO date string to check
 * @returns True if date is in the future
 */
export const isFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.getTime() > Date.now();
};

/**
 * Get the number of days between two dates
 *
 * @param date1 - First date string
 * @param date2 - Second date string (default: now)
 * @returns Number of days between dates (can be negative)
 */
export const daysBetween = (date1: string, date2?: string): number => {
  const d1 = new Date(date1);
  const d2 = date2 ? new Date(date2) : new Date();

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return 0;
  }

  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
