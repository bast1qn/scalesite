// ============================================
// TICKET SYSTEM CONSTANTS
// ============================================

import type { TicketPriority, TicketStatus } from '../../types/tickets';

/**
 * Draft auto-save delay in milliseconds
 */
export const DRAFT_AUTOSAVE_DELAY_MS = 1000;

/**
 * Success message display timeout in milliseconds
 */
export const SUCCESS_MESSAGE_TIMEOUT_MS = 3000;

/**
 * Available priority levels for tickets
 */
export const TICKET_PRIORITIES: readonly { value: TicketPriority; label: string }[] = [
    { value: 'Niedrig', label: 'Niedrig' },
    { value: 'Mittel', label: 'Mittel' },
    { value: 'Hoch', label: 'Hoch' }
] as const;

/**
 * Default ticket priority
 */
export const DEFAULT_TICKET_PRIORITY: TicketPriority = 'Niedrig';

/**
 * Maximum ticket message length
 */
export const MAX_MESSAGE_LENGTH = 5000;

/**
 * Minimum ticket message length
 */
export const MIN_MESSAGE_LENGTH = 1;

/**
 * Ticket ID display length (characters shown)
 */
export const TICKET_ID_DISPLAY_LENGTH = 8;

/**
 * CSS classes for ticket status badges
 */
export const TICKET_STATUS_CLASSES: Record<TicketStatus, string> = {
    'Offen': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    'In Bearbeitung': 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    'Geschlossen': 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
};

/**
 * CSS classes for ticket priority indicators
 */
export const TICKET_PRIORITY_CLASSES: Record<TicketPriority, { bg: string; border: string }> = {
    'Niedrig': { bg: 'bg-slate-400', border: 'border-slate-400' },
    'Mittel': { bg: 'bg-yellow-500', border: 'border-yellow-500' },
    'Hoch': { bg: 'bg-blue-600', border: 'border-blue-600' }
};

/**
 * Message prefixes that indicate system-generated messages
 */
export const SYSTEM_MESSAGE_PREFIXES = ['SYSTEM:', 'AUTOMATISCHE DIENSTANFRAGE'] as const;

/**
 * Number of skeleton cards to show during loading
 */
export const LOADING_SKELETON_COUNT = 5;

/**
 * Chat auto-scroll threshold in pixels
 * Distance from bottom to consider "near bottom" for auto-scroll
 */
export const CHAT_AUTO_SCROLL_THRESHOLD = 100;

/**
 * Chat container fixed height in pixels
 */
export const CHAT_CONTAINER_HEIGHT = 600;
