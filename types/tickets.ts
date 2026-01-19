// ============================================
// TICKET SYSTEM TYPES
// ============================================

/**
 * User profile information associated with tickets
 */
export interface Profile {
    name: string;
    role: 'team' | 'user' | 'owner';
    company?: string;
    email?: string;
}

/**
 * Ticket message in chat thread
 */
export interface Message {
    id: string;
    user_id: string;
    text: string;
    created_at: string;
    profiles: Profile | null;
}

/**
 * Main ticket entity
 */
export interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    created_at: string;
    last_update: string;
    assigned_to: string | null;
    profiles: Profile | null;
    assignee: Profile | null;
}

/**
 * Available ticket statuses
 */
export type TicketStatus = 'Offen' | 'In Bearbeitung' | 'Geschlossen';

/**
 * Available ticket priority levels
 */
export type TicketPriority = 'Niedrig' | 'Mittel' | 'Hoch';

/**
 * Service available for assignment to tickets
 */
export interface Service {
    id: number | string;
    name: string;
    price: number;
    sale_price?: number;
}

/**
 * Team member added to a ticket
 */
export interface TicketMember {
    id: string;
    name: string;
    email: string;
    role: string;
    added_at: string;
}

/**
 * View mode for ticket interface
 */
export type TicketViewMode = 'list' | 'detail';

/**
 * Filter mode for ticket list
 */
export type TicketFilter = 'active' | 'closed';

/**
 * Props for ticket status badge component
 */
export interface TicketStatusBadgeProps {
    status: TicketStatus;
}

/**
 * Props for ticket priority indicator component
 */
export interface TicketPriorityBadgeProps {
    priority: TicketPriority;
}

/**
 * Form data for creating a new ticket
 */
export interface CreateTicketFormData {
    subject: string;
    priority: TicketPriority;
    message: string;
}
