// Notification API Helpers
// Woche 25: Real-time Features - Notifications

import { supabase } from './supabase';
import type { Notification } from './supabase';

// ============================================
// TYPES
// ============================================

export type NotificationType =
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'ticket'
    | 'project'
    | 'billing'
    | 'system'
    | 'team'
    | 'message';

export interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    link?: string;
    related_entity_type?: string;
    related_entity_id?: string;
    expires_at?: string;
}

// ============================================
// CREATE NOTIFICATIONS
// ============================================

/**
 * Create a notification for a user
 */
export const createNotification = async (
    input: CreateNotificationInput
): Promise<{ data: Notification | null; error: any }> => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert({
                user_id: input.userId,
                type: input.type,
                title: input.title,
                message: input.message,
                link: input.link,
                related_entity_type: input.related_entity_type,
                related_entity_id: input.related_entity_id,
                expires_at: input.expires_at,
                read: false,
            })
            .select()
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Create a ticket notification
 */
export const createTicketNotification = async (
    userId: string,
    ticketId: string,
    subject: string,
    action: 'created' | 'updated' | 'message' | 'closed' | 'assigned'
): Promise<void> => {
    const notifications: Record<string, { title: string; message: string; type: NotificationType }> = {
        created: {
            title: 'Neues Ticket erstellt',
            message: `Ticket "${subject}" wurde erfolgreich erstellt`,
            type: 'ticket',
        },
        updated: {
            title: 'Ticket aktualisiert',
            message: `Ticket "${subject}" wurde aktualisiert`,
            type: 'ticket',
        },
        message: {
            title: 'Neue Nachricht',
            message: `Neue Nachricht in Ticket "${subject}"`,
            type: 'message',
        },
        closed: {
            title: 'Ticket geschlossen',
            message: `Ticket "${subject}" wurde geschlossen`,
            type: 'success',
        },
        assigned: {
            title: 'Ticket zugewiesen',
            message: `Ticket "${subject}" wurde dir zugewiesen`,
            type: 'ticket',
        },
    };

    const notif = notifications[action];
    await createNotification({
        userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: `/dashboard?view=ticket-support&ticket=${ticketId}`,
        related_entity_type: 'ticket',
        related_entity_id: ticketId,
    });
};

/**
 * Create a project notification
 */
export const createProjectNotification = async (
    userId: string,
    projectId: string,
    projectName: string,
    action: 'created' | 'updated' | 'milestone' | 'completed' | 'launch'
): Promise<void> => {
    const notifications: Record<string, { title: string; message: string; type: NotificationType }> = {
        created: {
            title: 'Projekt erstellt',
            message: `Projekt "${projectName}" wurde erfolgreich erstellt`,
            type: 'project',
        },
        updated: {
            title: 'Projekt aktualisiert',
            message: `Projekt "${projectName}" wurde aktualisiert`,
            type: 'project',
        },
        milestone: {
            title: 'Meilenstein erreicht',
            message: `Ein Meilenstein in "${projectName}" wurde erreicht`,
            type: 'success',
        },
        completed: {
            title: 'Projekt abgeschlossen',
            message: `Projekt "${projectName}" wurde erfolgreich abgeschlossen`,
            type: 'success',
        },
        launch: {
            title: 'Projekt live!',
            message: `Projekt "${projectName}" ist jetzt online`,
            type: 'success',
        },
    };

    const notif = notifications[action];
    await createNotification({
        userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: `/dashboard?view=projects&project=${projectId}`,
        related_entity_type: 'project',
        related_entity_id: projectId,
    });
};

/**
 * Create a billing notification
 */
export const createBillingNotification = async (
    userId: string,
    invoiceId: string,
    amount: number,
    action: 'created' | 'due' | 'overdue' | 'paid'
): Promise<void> => {
    const notifications: Record<string, { title: string; message: string; type: NotificationType }> = {
        created: {
            title: 'Neue Rechnung verfügbar',
            message: `Eine neue Rechnung über ${amount.toFixed(2)}€ ist verfügbar`,
            type: 'billing',
        },
        due: {
            title: 'Rechnung fällig',
            message: `Eine Rechnung über ${amount.toFixed(2)}€ ist bald fällig`,
            type: 'warning',
        },
        overdue: {
            title: 'Rechnung überfällig',
            message: `Eine Rechnung über ${amount.toFixed(2)}€ ist überfällig`,
            type: 'error',
        },
        paid: {
            title: 'Rechnung bezahlt',
            message: `Die Rechnung über ${amount.toFixed(2)}€ wurde erfolgreich bezahlt`,
            type: 'success',
        },
    };

    const notif = notifications[action];
    await createNotification({
        userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: `/dashboard?view=transaktionen`,
        related_entity_type: 'invoice',
        related_entity_id: invoiceId,
    });
};

/**
 * Create a team notification
 */
export const createTeamNotification = async (
    userId: string,
    teamName: string,
    action: 'invited' | 'joined' | 'removed'
): Promise<void> => {
    const notifications: Record<string, { title: string; message: string; type: NotificationType }> = {
        invited: {
            title: 'Team-Einladung',
            message: `Du wurdest zum Team "${teamName}" eingeladen`,
            type: 'team',
        },
        joined: {
            title: 'Team beigetreten',
            message: `Du bist dem Team "${teamName}" beigetreten`,
            type: 'team',
        },
        removed: {
            title: 'Aus Team entfernt',
            message: `Du wurdest aus dem Team "${teamName}" entfernt`,
            type: 'warning',
        },
    };

    const notif = notifications[action];
    await createNotification({
        userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: `/dashboard?view=team`,
        related_entity_type: 'team',
    });
};

/**
 * Create a system notification
 */
export const createSystemNotification = async (
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'info',
    link?: string
): Promise<void> => {
    await createNotification({
        userId,
        type,
        title,
        message,
        link,
    });
};

// ============================================
// BROADCAST NOTIFICATIONS
// ============================================

/**
 * Send a broadcast notification to all users (admin only)
 */
export const broadcastNotification = async (
    title: string,
    message: string,
    type: NotificationType = 'info',
    link?: string
): Promise<{ data: Notification[] | null; error: any }> => {
    try {
        // Get all user IDs
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id');

        if (profilesError) throw profilesError;

        if (!profiles || profiles.length === 0) {
            return { data: null, error: 'No users found' };
        }

        // Create notifications for all users
        const notifications = profiles.map((profile) => ({
            user_id: profile.id,
            type,
            title,
            message,
            link,
            read: false,
        }));

        const { data, error } = await supabase
            .from('notifications')
            .insert(notifications)
            .select();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Send notification to specific users
 */
export const sendBulkNotification = async (
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType = 'info',
    link?: string
): Promise<{ data: Notification[] | null; error: any }> => {
    try {
        const notifications = userIds.map((userId) => ({
            user_id: userId,
            type,
            title,
            message,
            link,
            read: false,
        }));

        const { data, error } = await supabase
            .from('notifications')
            .insert(notifications)
            .select();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

// ============================================
// CLEANUP
// ============================================

/**
 * Delete expired notifications
 */
export const deleteExpiredNotifications = async (): Promise<void> => {
    await supabase
        .from('notifications')
        .delete()
        .lt('expires_at', new Date().toISOString());
};

/**
 * Delete old read notifications (older than 30 days)
 */
export const deleteOldReadNotifications = async (userId: string): Promise<void> => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true)
        .lt('created_at', thirtyDaysAgo.toISOString());
};

// ============================================
// ANALYTICS
// ============================================

/**
 * Get notification statistics for a user
 */
export const getNotificationStats = async (userId: string) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('type, read, created_at')
        .eq('user_id', userId);

    if (error || !data) {
        return { error, stats: null };
    }

    const stats = {
        total: data.length,
        unread: data.filter(n => !n.read).length,
        byType: {} as Record<string, number>,
        thisWeek: data.filter(n => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(n.created_at) > weekAgo;
        }).length,
    };

    data.forEach(n => {
        stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    });

    return { error: null, stats };
};
