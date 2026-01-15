// ============================================
// DATE/TIME UTILITY FUNCTIONS
// ============================================

import { TIME_CONSTANTS } from './time-constants';

/**
 * Calculate the difference in milliseconds between two dates
 */
export const getDateDiff = (date1: Date, date2: Date): number => {
  return date1.getTime() - date2.getTime();
};

/**
 * Calculate difference in minutes between two dates
 */
export const getDiffMinutes = (date1: Date, date2: Date): number => {
  return Math.floor(getDateDiff(date1, date2) / TIME_CONSTANTS.MINUTE);
};

/**
 * Calculate difference in hours between two dates
 */
export const getDiffHours = (date1: Date, date2: Date): number => {
  return Math.floor(getDateDiff(date1, date2) / TIME_CONSTANTS.HOUR);
};

/**
 * Calculate difference in days between two dates
 */
export const getDiffDays = (date1: Date, date2: Date): number => {
  return Math.floor(getDateDiff(date1, date2) / TIME_CONSTANTS.DAY);
};

/**
 * Calculate difference in weeks between two dates
 */
export const getDiffWeeks = (date1: Date, date2: Date): number => {
  return Math.floor(getDateDiff(date1, date2) / TIME_CONSTANTS.WEEK);
};

/**
 * Calculate difference in months between two dates
 */
export const getDiffMonths = (date1: Date, date2: Date): number => {
  return Math.floor(getDateDiff(date1, date2) / TIME_CONSTANTS.MONTH);
};

/**
 * Format a relative time string (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date, baseDate: Date = new Date()): string => {
  const diffMs = getDateDiff(baseDate, date);
  const diffMinutes = Math.floor(diffMs / TIME_CONSTANTS.MINUTE);
  const diffHours = Math.floor(diffMs / TIME_CONSTANTS.HOUR);
  const diffDays = Math.floor(diffMs / TIME_CONSTANTS.DAY);

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  const months = Math.floor(diffDays / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

/**
 * German version of formatRelativeTime
 */
export const formatRelativeTimeDE = (date: Date, baseDate: Date = new Date()): string => {
  const diffMs = getDateDiff(baseDate, date);
  const diffMinutes = Math.floor(diffMs / TIME_CONSTANTS.MINUTE);
  const diffHours = Math.floor(diffMs / TIME_CONSTANTS.HOUR);
  const diffDays = Math.floor(diffMs / TIME_CONSTANTS.DAY);

  if (diffMinutes < 60) {
    return `Vor ${diffMinutes} Minuten`;
  }

  if (diffHours < 24) {
    return `Vor ${diffHours} Stunden`;
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'Vor 1 Woche' : `Vor ${weeks} Wochen`;
  }

  const months = Math.floor(diffDays / 30);
  return months === 1 ? 'Vor 1 Monat' : `Vor ${months} Monaten`;
};

/**
 * Calculate time remaining from a target date (for countdowns)
 */
export const getTimeRemaining = (targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} => {
  const total = getDateDiff(targetDate, new Date());

  return {
    total,
    days: Math.floor(total / TIME_CONSTANTS.DAY),
    hours: Math.floor((total / TIME_CONSTANTS.HOUR) % 24),
    minutes: Math.floor((total / TIME_CONSTANTS.MINUTE) % 60),
    seconds: Math.floor((total / TIME_CONSTANTS.SECOND) % 60),
  };
};

/**
 * Format countdown time values
 */
export const formatCountdown = (days: number, hours: number, minutes: number, seconds: number): string => {
  const pad = (num: number): string => num.toString().padStart(2, '0');
  return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (from: Date, to: Date): number => {
  return Math.ceil((to.getTime() - from.getTime()) / TIME_CONSTANTS.DAY);
};
