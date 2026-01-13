// ============================================
// REALTIME - WebSocket Subscriptions
// Supabase Realtime Integration
// ============================================

import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimePayloadLocal<T> {
    old: T | null;
    new: T | null;
}

interface SubscriptionCallbacks<T = unknown> {
    onInsert?: (payload: RealtimePayloadLocal<T>) => void;
    onUpdate?: (payload: RealtimePayloadLocal<T>) => void;
    onDelete?: (payload: RealtimePayloadLocal<T>) => void;
    onError?: (error: Error) => void;
}

export interface PresenceState {
    user_id: string;
    online_at: string;
    project_id?: string;
}

export interface PresenceEvent {
    key: string;
    presences: PresenceState[];
}

interface NotificationPayload {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    created_at: string;
}

interface ProjectUpdatePayload {
    id: string;
    status: string;
    progress: number;
    updated_at: string;
}

interface TicketUpdatePayload {
    id: string;
    status: string;
    priority: string;
    updated_at: string;
}

interface ChatMessage {
    id: string;
    project_id: string;
    user_id: string;
    message: string;
    created_at: string;
}

interface ChatMessageWithSender {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    updated_at?: string;
    sender?: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    is_sender: boolean;
    read_by: string[];
}

// ============================================
// CHANNEL MANAGEMENT
// ============================================

/**
 * Store all active channels for cleanup
 */
const activeChannels = new Map<string, RealtimeChannel>();

/**
 * Generate a unique channel name
 */
const generateChannelName = (prefix: string, identifier: string): string => {
    return `${prefix}-${identifier}-${Date.now()}`;
};

/**
 * Unsubscribe from a channel and clean up
 * @param channelName - Name of the channel to unsubscribe
 */
export const unsubscribe = (channelName: string): void => {
    const channel = activeChannels.get(channelName);
    if (channel) {
        supabase.removeChannel(channel);
        activeChannels.delete(channelName);
    }
};

/**
 * Unsubscribe from all active channels
 */
export const unsubscribeAll = (): void => {
    activeChannels.forEach((channel) => {
        supabase.removeChannel(channel);
    });
    activeChannels.clear();
};

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * Subscribe to user's notifications
 * @param userId - User ID to subscribe to
 * @param callbacks - Event callbacks
 * @returns Channel name for cleanup
 */
export const subscribeToNotifications = (
    userId: string,
    callbacks: SubscriptionCallbacks<NotificationPayload>
): string => {
    const channelName = generateChannelName('notifications', userId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.({ old: null, new: newRecord as NotificationPayload });
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.({
                            old: oldRecord as NotificationPayload,
                            new: newRecord as NotificationPayload
                        });
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.({ old: oldRecord as NotificationPayload, new: null });
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to notifications'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe only to unread notifications
 * @param userId - User ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToUnreadNotifications = (
    userId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('unread-notifications', userId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}&read=eq.false`
            },
            (payload) => {
                callbacks.onInsert?.(payload.new as NotificationPayload);
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}&read=eq.true`
            },
            (payload) => {
                callbacks.onUpdate?.({
                    old: payload.old,
                    new: payload.new
                });
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to unread notifications'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// PROJECTS
// ============================================

/**
 * Subscribe to project updates
 * @param projectId - Project ID to watch
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToProjectUpdates = (
    projectId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('project', projectId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'projects',
                filter: `id=eq.${projectId}`
            },
            (payload) => {
                callbacks.onUpdate?.(payload.new as ProjectUpdatePayload);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to project updates'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to all user projects
 * @param userId - User ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToUserProjects = (
    userId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('user-projects', userId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'projects',
                filter: `user_id=eq.${userId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to user projects'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to project milestones
 * @param projectId - Project ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToProjectMilestones = (
    projectId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('milestones', projectId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'project_milestones',
                filter: `project_id=eq.${projectId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to project milestones'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// TICKETS
// ============================================

/**
 * Subscribe to ticket updates
 * @param ticketId - Ticket ID to watch
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToTicketUpdates = (
    ticketId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('ticket', ticketId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'tickets',
                filter: `id=eq.${ticketId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord as TicketUpdatePayload);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to ticket updates'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to all user tickets
 * @param userId - User ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToUserTickets = (
    userId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('user-tickets', userId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'tickets',
                filter: `user_id=eq.${userId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to user tickets'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// TEAM COLLABORATION
// ============================================

/**
 * Subscribe to team member changes
 * @param teamId - Team owner/user ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToTeamMembers = (
    teamId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('team', teamId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'team_members',
                filter: `team_id=eq.${teamId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to team members'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to team invitations
 * @param memberId - Member ID (your user ID)
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToTeamInvitations = (
    memberId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('invitations', memberId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'team_members',
                filter: `member_id=eq.${memberId}`
            },
            (payload) => {
                const { eventType, new: newRecord } = payload;

                if (eventType === 'INSERT') {
                    callbacks.onInsert?.(newRecord);
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to team invitations'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// BILLING
// ============================================

/**
 * Subscribe to invoice updates
 * @param userId - User ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToInvoices = (
    userId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('invoices', userId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'invoices',
                filter: `user_id=eq.${userId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to invoices'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// ANALYTICS
// ============================================

/**
 * Subscribe to analytics events for a project
 * @param projectId - Project ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToAnalyticsEvents = (
    projectId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('analytics', projectId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'analytics_events',
                filter: `project_id=eq.${projectId}`
            },
            (payload) => {
                callbacks.onInsert?.(payload.new);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to analytics events'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// PRESENCE
// ============================================

/**
 * Track user presence in a project
 * @param projectId - Project ID
 * @param userId - User ID
 * @param callbacks - Event callbacks for presence changes
 * @returns Channel name
 */
export const trackPresence = (
    projectId: string,
    userId: string,
    callbacks: {
        onJoin?: (presence: { key: string; presences: PresenceState[] }) => void;
        onLeave?: (presence: { key: string; presences: PresenceState[] }) => void;
        onSync?: (presences: Record<string, PresenceState[]>) => void;
    }
): string => {
    const channelName = generateChannelName('presence', projectId);

    const channel = supabase
        .channel(channelName, {
            config: {
                presence: {
                    key: userId
                }
            }
        })
        .on('presence', { event: 'sync' }, () => {
            const presenceState = channel.presenceState();
            callbacks.onSync?.(presenceState);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            callbacks.onJoin?.({ key, presences: newPresences });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            callbacks.onLeave?.({ key, presences: leftPresences });
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                // Track user's online status
                await channel.track({
                    online_at: new Date().toISOString(),
                    user_id: userId,
                    project_id: projectId
                });
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// BROADCAST
// ============================================

/**
 * Send a broadcast message to a channel
 * @param channelName - Channel name
 * @param event - Event name
 * @param payload - Data to broadcast
 */
export const broadcast = async (
    channelName: string,
    event: string,
    payload: Record<string, unknown>
): Promise<void> => {
    const channel = activeChannels.get(channelName);
    if (channel) {
        await channel.send({
            type: 'broadcast',
            event,
            payload
        });
    }
};

/**
 * Listen to broadcast messages
 * @param channelName - Channel name
 * @param event - Event name to listen for
 * @param callback - Callback function
 * @returns Channel name
 */
export const listenToBroadcasts = (
    channelName: string,
    event: string,
    callback: (payload: Record<string, unknown>) => void
): string => {
    const channel = supabase
        .channel(channelName)
        .on('broadcast', { event }, (payload) => {
            callback(payload.payload);
        })
        .subscribe();

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// TICKET MESSAGES (Woche 16 - Enhanced Notifications)
// ============================================

/**
 * Subscribe to ticket messages (real-time chat)
 * @param ticketId - Ticket ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToTicketMessages = (
    ticketId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('ticket-messages', ticketId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'ticket_messages',
                filter: `ticket_id=eq.${ticketId}`
            },
            (payload) => {
                callbacks.onInsert?.(payload.new as TicketMessage);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to ticket messages'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to ticket member assignments
 * @param ticketId - Ticket ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToTicketMembers = (
    ticketId: string,
    callbacks: SubscriptionCallbacks
): string => {
    const channelName = generateChannelName('ticket-members', ticketId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'ticket_members',
                filter: `ticket_id=eq.${ticketId}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to ticket members'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

// ============================================
// BROWSER NOTIFICATIONS (Woche 16)
// ============================================

/**
 * Request browser notification permission
 * @returns Permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
        console.warn('Browser notifications not supported');
        return 'denied';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
};

/**
 * Check if notifications are supported and permission is granted
 */
export const canShowNotifications = (): boolean => {
    return 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Show a browser notification
 * @param title - Notification title
 * @param options - Notification options
 */
export const showBrowserNotification = (
    title: string,
    options?: NotificationOptions
): void => {
    if (canShowNotifications()) {
        new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options
        });
    }
};

/**
 * Create a notification helper for ticket updates
 * @param ticketSubject - Ticket subject line
 * @param updateType - Type of update (message, status, assignment)
 * @param data - Additional data
 */
export const showTicketNotification = (
    ticketSubject: string,
    updateType: 'message' | 'status' | 'assignment' | 'priority',
    data?: {
        message?: string;
        status?: string;
        assignedTo?: string;
        priority?: string;
    }
): void => {
    let title = '';
    let body = '';

    switch (updateType) {
        case 'message':
            title = 'Neue Nachricht im Ticket';
            body = `"${ticketSubject}"\n${data?.message || 'Neue Nachricht erhalten'}`;
            break;
        case 'status':
            title = 'Ticket-Status aktualisiert';
            body = `"${ticketSubject}" ist jetzt ${data?.status || 'aktualisiert'}`;
            break;
        case 'assignment':
            title = 'Ticket zugewiesen';
            body = `"${ticketSubject}" wurde dir zugewiesen`;
            break;
        case 'priority':
            title = 'Ticket-Priorität geändert';
            body = `"${ticketSubject}" hat jetzt Priorität ${data?.priority || 'geändert'}`;
            break;
    }

    showBrowserNotification(title, {
        body,
        tag: `ticket-${updateType}`,
        requireInteraction: updateType === 'assignment',
        data
    });
};

// ============================================
// CLEANUP HELPERS
// ============================================

/**
 * Get count of active subscriptions
 */
export const getActiveSubscriptionCount = (): number => {
    return activeChannels.size;
};

/**
 * List all active channel names
 */
export const getActiveChannels = (): string[] => {
    return Array.from(activeChannels.keys());
};

/**
 * Unsubscribe from multiple channels
 * @param channelNames - Array of channel names to unsubscribe
 */
export const unsubscribeMultiple = (channelNames: string[]): void => {
    channelNames.forEach((name) => {
        unsubscribe(name);
    });
};

/**
 * Auto-unsubscribe on component unmount (React hook helper)
 * @returns Cleanup function
 */
export const useCleanupOnUnmount = () => {
    return (channelNames: string[]) => {
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                unsubscribeMultiple(channelNames);
            });
        }
    };
};

// ============================================
// CHAT REALTIME SUBSCRIPTIONS (Woche 26)
// ============================================

import type {
    ChatMessageWithSender,
    ChatConversationWithDetails,
    ChatParticipant,
    ChatSubscriptionCallbacks,
    ChatUserStatus
} from './chat';

/**
 * Subscribe to chat conversation messages
 * @param conversationId - Conversation ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToChatMessages = (
    conversationId: string,
    callbacks: ChatSubscriptionCallbacks
): string => {
    const channelName = `chat-messages-${conversationId}-${Date.now()}`;

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `conversation_id=eq.${conversationId}`
            },
            async (payload) => {
                const message = payload.new as ChatMessageWithSender;
                // Fetch sender details
                const { data: sender } = await supabase
                    .from('profiles')
                    .select('id,name,avatar_url')
                    .eq('id', message.sender_id)
                    .single();

                const enrichedMessage: ChatMessageWithSender = {
                    ...message,
                    sender: sender || undefined,
                    is_sender: false, // Will be set by caller
                    read_by: []
                };

                callbacks.onNewMessage?.(enrichedMessage);
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'chat_messages',
                filter: `conversation_id=eq.${conversationId}`
            },
            async (payload) => {
                const message = payload.new as ChatMessageWithSender;
                const { data: sender } = await supabase
                    .from('profiles')
                    .select('id,name,avatar_url')
                    .eq('id', message.sender_id)
                    .single();

                const enrichedMessage: ChatMessageWithSender = {
                    ...message,
                    sender: sender || undefined,
                    is_sender: false,
                    read_by: []
                };

                callbacks.onMessageUpdate?.(enrichedMessage);
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_messages',
                filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
                callbacks.onMessageDelete?.(payload.old.id);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to chat messages'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to chat typing indicators
 * @param conversationId - Conversation ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToTypingIndicators = (
    conversationId: string,
    callbacks: ChatSubscriptionCallbacks
): string => {
    const channelName = `chat-typing-${conversationId}-${Date.now()}`;

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_typing_indicators',
                filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
                const indicator = payload.new as { conversation_id: string; user_id: string; created_at: string };
                callbacks.onTypingStart?.({
                    conversation_id: indicator.conversation_id,
                    user_id: indicator.user_id
                });
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_typing_indicators',
                filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
                const indicator = payload.old as { conversation_id: string; user_id: string; created_at: string };
                callbacks.onTypingStop?.({
                    conversation_id: indicator.conversation_id,
                    user_id: indicator.user_id
                });
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to typing indicators'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to conversation updates
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToConversationUpdates = (
    callbacks: ChatSubscriptionCallbacks
): string => {
    const channelName = `chat-conversations-${Date.now()}`;

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'chat_conversations'
            },
            () => {
                callbacks.onConversationUpdate?.({} as ChatConversationWithDetails);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to conversation updates'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Subscribe to participant changes
 * @param conversationId - Conversation ID
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToParticipantChanges = (
    conversationId: string,
    callbacks: ChatSubscriptionCallbacks
): string => {
    const channelName = `chat-participants-${conversationId}-${Date.now()}`;

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_participants',
                filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
                callbacks.onNewParticipant?.(payload.new as ChatParticipant);
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_participants',
                filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
                callbacks.onParticipantLeave?.(payload.old as ChatParticipant);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                callbacks.onError?.(new Error('Failed to subscribe to participant changes'));
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Broadcast typing status via Supabase Broadcast
 * @param conversationId - Conversation ID
 * @param isTyping - Whether user is typing
 */
export const broadcastTypingStatus = async (
    conversationId: string,
    isTyping: boolean
): Promise<void> => {
    const channel = activeChannels.get(`chat-typing-${conversationId}`);
    if (channel) {
        await channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { conversation_id: conversationId, is_typing: isTyping }
        });
    }
};

/**
 * Subscribe to typing broadcasts
 * @param conversationId - Conversation ID
 * @param onTypingChange - Callback when typing status changes
 * @returns Channel name
 */
export const subscribeToTypingBroadcasts = (
    conversationId: string,
    onTypingChange: (userId: string, isTyping: boolean) => void
): string => {
    const channelName = `chat-broadcast-typing-${conversationId}-${Date.now()}`;

    const channel = supabase
        .channel(channelName)
        .on('broadcast', { event: 'typing' }, (payload) => {
            const { data } = payload;
            if (data.conversation_id === conversationId) {
                onTypingChange(data.user_id, data.is_typing);
            }
        })
        .subscribe();

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Track user presence in chat
 * @param userId - User ID
 * @param callbacks - Presence callbacks
 * @returns Channel name
 */
export const trackChatPresence = (
    userId: string,
    callbacks: {
        onJoin?: (userId: string) => void;
        onLeave?: (userId: string) => void;
    }
): string => {
    const channelName = `chat-presence-${userId}-${Date.now()}`;

    const channel = supabase
        .channel(channelName, {
            config: {
                presence: {
                    key: userId
                }
            }
        })
        .on('presence', { event: 'sync' }, () => {
            const presenceState = channel.presenceState();
            // Handle sync
        })
        .on('presence', { event: 'join' }, ({ key }) => {
            callbacks.onJoin?.(key);
        })
        .on('presence', { event: 'leave' }, ({ key }) => {
            callbacks.onLeave?.(key);
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({
                    online_at: new Date().toISOString(),
                    user_id: userId
                });
            }
        });

    activeChannels.set(channelName, channel);
    return channelName;
};

/**
 * Send message read receipt via broadcast
 * @param conversationId - Conversation ID
 * @param messageId - Message ID that was read
 */
export const broadcastReadReceipt = async (
    conversationId: string,
    messageId: string
): Promise<void> => {
    const channelName = `chat-read-${conversationId}`;
    const channel = activeChannels.get(channelName);

    if (channel) {
        await channel.send({
            type: 'broadcast',
            event: 'read_receipt',
            payload: { conversation_id: conversationId, message_id: messageId }
        });
    }
};

/**
 * Subscribe to read receipts
 * @param conversationId - Conversation ID
 * @param onRead - Callback when message is read
 * @returns Channel name
 */
export const subscribeToReadReceipts = (
    conversationId: string,
    onRead: (messageId: string, userId: string) => void
): string => {
    const channelName = `chat-read-${conversationId}-${Date.now()}`;

    const channel = supabase
        .channel(channelName)
        .on('broadcast', { event: 'read_receipt' }, (payload) => {
            const { data } = payload;
            if (data.conversation_id === conversationId) {
                onRead(data.message_id, data.user_id);
            }
        })
        .subscribe();

    activeChannels.set(channelName, channel);
    return channelName;
};
