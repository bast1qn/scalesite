/**
 * Date formatting utilities for German locale
 */

const TIME_CONSTANTS = {
    MS_PER_MINUTE: 60000,
    MS_PER_HOUR: 3600000,
    MS_PER_DAY: 86400000,
    DAYS_IN_WEEK: 7,
    DAYS_IN_MONTH: 30,
} as const;

/**
 * Formats a timestamp as a human-readable "time ago" string in German
 * Used across dashboard components for consistent date display
 *
 * @param dateString - ISO date string or Date object
 * @returns Formatted string like "vor 5 Minuten", "vor 2 Stunden", or "Gerade eben"
 *
 * @example
 * formatTimeAgo("2024-01-15T10:30:00Z") // "vor 5 Minuten"
 * formatTimeAgo(new Date()) // "Gerade eben"
 */
export function formatTimeAgo(dateString: string | Date): string {
    if (!dateString) return '';

    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    // Validate date
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Handle future dates
    if (seconds < 0) return 'in Kürze';
    if (seconds < 5) return "gerade eben";
    if (seconds < 60) return `vor ${seconds} Sekunden`;

    let interval = seconds / 31536000;
    if (interval > 1) return `vor ${Math.floor(interval)} Jahren`;

    interval = seconds / 2592000;
    if (interval > 1) return `vor ${Math.floor(interval)} Monaten`;

    interval = seconds / 86400;
    if (interval > 1) return `vor ${Math.floor(interval)} Tagen`;

    interval = seconds / 3600;
    if (interval > 1) return `vor ${Math.floor(interval)} Stunden`;

    interval = seconds / 60;
    if (interval > 1) return `vor ${Math.floor(interval)} Minuten`;

    return "gerade eben";
}

/**
 * Formats a timestamp as a human-readable "time ago" string in German
 * Enhanced version that respects TIME_CONSTANTS
 *
 * @param date - Date object
 * @returns Formatted string like "vor 5 Minuten" or "Gerade eben"
 */
export function getTimeAgo(date: Date): string {
    const now = new Date();

    // Validate date
    if (isNaN(date.getTime())) return '-';

    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / TIME_CONSTANTS.MS_PER_MINUTE);
    const diffHours = Math.floor(diffMs / TIME_CONSTANTS.MS_PER_HOUR);
    const diffDays = Math.floor(diffMs / TIME_CONSTANTS.MS_PER_DAY);

    // Handle future dates
    if (diffMs < 0) return 'in Kürze';
    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Minute${diffMins > 1 ? 'n' : ''}`;
    if (diffHours < 24) return `vor ${diffHours} Stunde${diffHours > 1 ? 'n' : ''}`;
    if (diffDays < TIME_CONSTANTS.DAYS_IN_WEEK) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    if (diffDays < TIME_CONSTANTS.DAYS_IN_MONTH) return `vor ${Math.floor(diffDays / TIME_CONSTANTS.DAYS_IN_WEEK)} Woche${Math.floor(diffDays / TIME_CONSTANTS.DAYS_IN_WEEK) > 1 ? 'n' : ''}`;

    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
}
