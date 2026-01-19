// ============================================
// TICKET SYSTEM HELPER FUNCTIONS
// ============================================

import type { TicketStatus, TicketPriority } from '../types/tickets';
import { TICKET_STATUS_CLASSES, TICKET_PRIORITY_CLASSES, TICKET_ID_DISPLAY_LENGTH, SYSTEM_MESSAGE_PREFIXES } from '../lib/constants/tickets';

/**
 * Returns Tailwind CSS classes for ticket status badges
 * @param status - The ticket status
 * @returns CSS class string for status styling
 */
export function getTicketStatusColor(status: TicketStatus): string {
    return TICKET_STATUS_CLASSES[status];
}

/**
 * Returns CSS classes for ticket priority indicator
 * @param priority - The ticket priority
 * @returns Object with bg and border CSS classes
 */
export function getTicketPriorityClasses(priority: TicketPriority): { bg: string; border: string } {
    return TICKET_PRIORITY_CLASSES[priority];
}

/**
 * Formats a ticket ID for display (first N characters)
 * @param ticketId - The full ticket ID
 * @returns Shortened ticket ID with # prefix
 */
export function formatTicketId(ticketId: string): string {
    return `#${ticketId.slice(0, TICKET_ID_DISPLAY_LENGTH)}`;
}

/**
 * Checks if a message is a system-generated message
 * @param messageText - The message text to check
 * @returns True if message contains system prefixes
 */
export function isSystemMessage(messageText: string): boolean {
    return SYSTEM_MESSAGE_PREFIXES.some(prefix => messageText.includes(prefix));
}

/**
 * Removes system message prefixes from text
 * @param messageText - The message text to clean
 * @returns Cleaned message text without system prefix
 */
export function stripSystemPrefix(messageText: string): string {
    let cleaned = messageText;
    SYSTEM_MESSAGE_PREFIXES.forEach(prefix => {
        cleaned = cleaned.replace(prefix, '');
    });
    return cleaned.trim();
}

/**
 * Determines the author name for display
 * @param profiles - The profile associated with the message
 * @param isSupport - Whether the author is a support team member
 * @param isUser - Whether the author is the current user
 * @returns Formatted author name
 */
export function getTicketAuthorName(
    profiles: { name?: string } | null,
    isSupport: boolean,
    isUser: boolean
): string {
    if (isSupport) {
        return `Support (${profiles?.name || 'Team'})`;
    }
    if (isUser) {
        return 'Sie';
    }
    return profiles?.name || 'Unbekannt';
}

/**
 * Gets message styling classes based on message type and sender
 * @param isUser - Whether message is from current user
 * @param isSystemMessage - Whether message is a system message
 * @returns CSS class string for message bubble
 */
export function getMessageClasses(isUser: boolean, isSystemMessage: boolean): string {
    const baseClasses = 'p-4 max-w-lg rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm';

    if (isUser) {
        return `${baseClasses} bg-blue-600 text-white rounded-tr-none`;
    }

    if (isSystemMessage) {
        return `${baseClasses} bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-slate-900 dark:text-white rounded-tl-none font-mono text-xs`;
    }

    return `${baseClasses} bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none`;
}

/**
 * Gets avatar container classes based on message sender
 * @param isUser - Whether message is from current user
 * @param isSupport - Whether message is from support team
 * @returns CSS class string for avatar container
 */
export function getAvatarClasses(isUser: boolean, isSupport: boolean): string {
    const baseClasses = 'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm';

    if (isUser) {
        return `${baseClasses} bg-blue-600`;
    }

    return `${baseClasses} bg-slate-200 dark:bg-slate-700`;
}

/**
 * Gets flex direction class for message layout
 * @param isUser - Whether message is from current user
 * @returns CSS class for flex direction
 */
export function getMessageFlexDirection(isUser: boolean): string {
    return isUser ? 'flex-row-reverse' : 'flex-row';
}
