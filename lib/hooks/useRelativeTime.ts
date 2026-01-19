/**
 * useRelativeTime Hook
 * Formats timestamps into relative time strings (e.g., "vor 5 Minuten", "vor 2 Stunden")
 * Consolidates duplicate time formatting logic across components
 */

import { DATETIME } from '@/lib/constants';

/**
 * Format a timestamp into a relative time string in German
 * @param timestamp - The timestamp to format (can be string, number, or Date)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: string | number | Date): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;

  // Future timestamps
  if (diff < 0) {
    const futureDiff = Math.abs(diff);
    if (futureDiff < DATETIME.minute) {
      return 'in wenigen Sekunden';
    }
    if (futureDiff < DATETIME.hour) {
      const minutes = Math.floor(futureDiff / DATETIME.minute);
      return `in ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
    }
    if (futureDiff < DATETIME.day) {
      const hours = Math.floor(futureDiff / DATETIME.hour);
      return `in ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;
    }
    const days = Math.floor(futureDiff / DATETIME.day);
    return `in ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  }

  // Past timestamps
  if (diff < DATETIME.minute) {
    return 'gerade eben';
  }
  if (diff < DATETIME.hour) {
    const minutes = Math.floor(diff / DATETIME.minute);
    return `vor ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
  }
  if (diff < DATETIME.day) {
    const hours = Math.floor(diff / DATETIME.hour);
    return `vor ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;
  }
  if (diff < DATETIME.week) {
    const days = Math.floor(diff / DATETIME.day);
    return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  }

  // Fall back to absolute date for older timestamps
  return new Date(timestamp).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a timestamp into a short time string (e.g., "14:30")
 * @param timestamp - The timestamp to format
 * @returns Formatted time string
 */
export function formatShortTime(timestamp: string | number | Date): string {
  return new Date(timestamp).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a timestamp into a date string (e.g., "15.01.2026")
 * @param timestamp - The timestamp to format
 * @returns Formatted date string
 */
export function formatShortDate(timestamp: string | number | Date): string {
  return new Date(timestamp).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Custom hook for relative time formatting
 * @param timestamp - The timestamp to format
 * @returns Object with formatted time strings
 */
export function useRelativeTime(timestamp: string | number | Date) {
  return {
    relative: formatRelativeTime(timestamp),
    time: formatShortTime(timestamp),
    date: formatShortDate(timestamp),
  };
}
