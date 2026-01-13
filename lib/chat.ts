// ============================================
// CHAT TYPES & INTERFACES
// Live Chat System for ScaleSite
// ============================================

/**
 * Chat Conversation
 * Represents a chat conversation between users
 */
export interface ChatConversation {
    id: string;
    type: 'direct' | 'group' | 'support';
    name?: string; // For group chats
    avatar_url?: string; // For group chats
    created_by: string;
    created_at: string;
    updated_at: string;
    last_message_at?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Chat Participant
 * Represents a user in a chat conversation
 */
export interface ChatParticipant {
    id: string;
    conversation_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
    last_read_at?: string;
    is_muted?: boolean;
}

/**
 * Chat Message
 * Represents a message in a chat conversation
 */
export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'system';
    metadata?: {
        file_name?: string;
        file_url?: string;
        file_size?: number;
        reply_to?: string;
        reactions?: MessageReaction[];
    };
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
    is_edited?: boolean;
}

/**
 * Message Reaction
 */
export interface MessageReaction {
    emoji: string;
    user_id: string;
    created_at: string;
}

/**
 * Typing Indicator
 */
export interface TypingIndicator {
    conversation_id: string;
    user_id: string;
    is_typing: boolean;
    timestamp: string;
}

/**
 * Unread Message Count
 */
export interface UnreadCount {
    conversation_id: string;
    count: number;
    last_message_id?: string;
}

/**
 * Chat User Status
 */
export interface ChatUserStatus {
    user_id: string;
    status: 'online' | 'away' | 'offline' | 'busy';
    last_seen: string;
    conversation_id?: string; // Currently active conversation
}

// ============================================
// CHAT DTOS (Data Transfer Objects)
// ============================================

/**
 * Chat Conversation with Participants
 */
export interface ChatConversationWithDetails extends ChatConversation {
    participants: Array<{
        user_id: string;
        role: string;
        profile?: {
            id: string;
            name: string;
            email: string;
            avatar_url?: string;
        };
    }>;
    last_message?: {
        id: string;
        content: string;
        sender_id: string;
        sender_name?: string;
        created_at: string;
    };
    unread_count?: number;
}

/**
 * Chat Message with Sender Details
 */
export interface ChatMessageWithSender extends ChatMessage {
    sender?: {
        id: string;
        name: string;
        avatar_url?: string;
        role?: string;
    };
    is_sender?: boolean; // True if current user sent this message
    read_by?: Array<{
        user_id: string;
        read_at: string;
    }>;
}

// ============================================
// CHAT CREATE/UPDATE DTOs
// ============================================

/**
 * Create Direct Chat DTO
 */
export interface CreateDirectChatDto {
    participant_id: string;
}

/**
 * Create Group Chat DTO
 */
export interface CreateGroupChatDto {
    name: string;
    avatar_url?: string;
    participant_ids: string[];
}

/**
 * Send Message DTO
 */
export interface SendMessageDto {
    conversation_id: string;
    content: string;
    type?: 'text' | 'system';
    reply_to?: string;
}

/**
 * Update Message DTO
 */
export interface UpdateMessageDto {
    message_id: string;
    content: string;
}

/**
 * Mark as Read DTO
 */
export interface MarkAsReadDto {
    conversation_id: string;
    message_id: string;
}

// ============================================
// CHAT SUBSCRIPTION TYPES
// ============================================

/**
 * Chat Subscription Callbacks
 */
export interface ChatSubscriptionCallbacks {
    onNewMessage?: (message: ChatMessageWithSender) => void;
    onMessageUpdate?: (message: ChatMessageWithSender) => void;
    onMessageDelete?: (messageId: string) => void;
    onTypingStart?: (data: { conversation_id: string; user_id: string }) => void;
    onTypingStop?: (data: { conversation_id: string; user_id: string }) => void;
    onUserOnline?: (user_id: string) => void;
    onUserOffline?: (user_id: string) => void;
    onNewParticipant?: (participant: ChatParticipant) => void;
    onParticipantLeave?: (participant: ChatParticipant) => void;
    onConversationUpdate?: (conversation: ChatConversationWithDetails) => void;
    onError?: (error: Error) => void;
}

/**
 * Chat Presence State
 */
export interface ChatPresenceState {
    online_users: string[];
    typing_users: Map<string, Set<string>>; // conversation_id -> Set of user_ids
}

// ============================================
// CHAT CONSTANTS
// ============================================

export const CHAT_LIMITS = {
    MAX_MESSAGE_LENGTH: 5000,
    MAX_CONVERSATION_NAME_LENGTH: 100,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    TYPING_DEBOUNCE_MS: 1000,
    PRESENCE_TIMEOUT_MS: 30000, // 30 seconds
} as const;

export const CHAT_EVENTS = {
    NEW_MESSAGE: 'chat:new_message',
    MESSAGE_UPDATE: 'chat:message_update',
    MESSAGE_DELETE: 'chat:message_delete',
    TYPING_START: 'chat:typing_start',
    TYPING_STOP: 'chat:typing_stop',
    USER_ONLINE: 'chat:user_online',
    USER_OFFLINE: 'chat:user_offline',
    CONVERSATION_UPDATE: 'chat:conversation_update',
    PARTICIPANT_JOIN: 'chat:participant_join',
    PARTICIPANT_LEAVE: 'chat:participant_leave',
    MARK_AS_READ: 'chat:mark_read',
} as const;

export const CHAT_CHANNELS = {
    CONVERSATION: (conversationId: string) => `chat:conversation:${conversationId}`,
    USER_PRESENCE: (userId: string) => `chat:presence:${userId}`,
    GLOBAL_TYPING: 'chat:typing:global',
} as const;

// ============================================
// CHAT API FUNCTIONS
// ============================================

import { supabase } from './supabase';

/**
 * Get all conversations for current user
 */
export const getConversations = async (): Promise<{
    data: ChatConversationWithDetails[] | null;
    error: Error | null;
}> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
            *,
            participants:chat_participants(
                user_id,
                role,
                profile:profiles(id,name,email,avatar_url)
            ),
            last_message:chat_messages(id,content,sender_id,created_at)
        `)
        .gte('last_message_at', '0') // Filter to show only conversations with messages
        .order('last_message_at', { ascending: false });

    if (error) return { data: null, error };

    // Get unread counts
    const conversations = data as ChatConversationWithDetails[];
    const conversationIds = conversations.map(c => c.id);

    const { data: unreadData } = await supabase
        .from('chat_participants')
        .select('conversation_id, last_read_at')
        .eq('user_id', user.id)
        .in('conversation_id', conversationIds);

    // Calculate unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
        conversations.map(async (conv) => {
            const participant = unreadData?.find(p => p.conversation_id === conv.id);
            const lastReadAt = participant?.last_read_at;

            let unreadCount = 0;
            if (lastReadAt) {
                const { count } = await supabase
                    .from('chat_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('conversation_id', conv.id)
                    .gt('created_at', lastReadAt)
                    .neq('sender_id', user.id);
                unreadCount = count || 0;
            } else {
                const { count } = await supabase
                    .from('chat_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('conversation_id', conv.id)
                    .neq('sender_id', user.id);
                unreadCount = count || 0;
            }

            return {
                ...conv,
                unread_count: unreadCount,
                last_message: conv.last_message ? {
                    ...conv.last_message,
                    sender_name: conv.participants?.find((p) => p.user_id === conv.last_message.sender_id)?.profile?.name
                } : undefined
            };
        })
    );

    return { data: conversationsWithUnread, error: null };
};

/**
 * Get a single conversation with details
 */
export const getConversation = async (
    conversationId: string
): Promise<{ data: ChatConversationWithDetails | null; error: any }> => {
    const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
            *,
            participants:chat_participants(
                user_id,
                role,
                profile:profiles(id,name,email,avatar_url)
            )
        `)
        .eq('id', conversationId)
        .single();

    if (error) return { data: null, error };

    // Get last message
    const { data: lastMsg } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    return {
        data: {
            ...data,
            last_message: lastMsg
        } as ChatConversationWithDetails,
        error: null
    };
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (
    conversationId: string,
    limit: number = 50,
    before?: string
): Promise<{ data: ChatMessageWithSender[] | null; error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: new Error('Not authenticated') };
    }

    let query = supabase
        .from('chat_messages')
        .select(`
            *,
            sender:profiles(id,name,avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (before) {
        query = query.lt('created_at', before);
    }

    const { data, error } = await query;

    if (error) return { data: null, error };

    // Add is_sender flag and get read receipts
    const messagesWithSender = await Promise.all(
        (data || []).map(async (msg: ChatMessage & { sender?: unknown }) => {
            // Get read receipts for this message
            const { data: readData } = await supabase
                .from('chat_participants')
                .select('user_id, last_read_at')
                .eq('conversation_id', conversationId)
                .gte('last_read_at', msg.created_at);

            return {
                ...msg,
                sender: msg.sender,
                is_sender: msg.sender_id === user.id,
                read_by: readData?.map(r => ({
                    user_id: r.user_id,
                    read_at: r.last_read_at
                })) || []
            };
        })
    );

    return { data: messagesWithSender.reverse(), error: null };
};

/**
 * Create a direct chat conversation
 */
export const createDirectChat = async (
    participantId: string
): Promise<{ data: ChatConversationWithDetails | null; error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: new Error('Not authenticated') };
    }

    // Check if conversation already exists
    const { data: existing } = await supabase
        .from('chat_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    if (existing) {
        const conversationIds = existing.map(e => e.conversation_id);
        const { data: existingConv } = await supabase
            .from('chat_participants')
            .select('conversation_id')
            .eq('user_id', participantId)
            .in('conversation_id', conversationIds)
            .limit(1)
            .single();

        if (existingConv) {
            return getConversation(existingConv.conversation_id);
        }
    }

    // Create new conversation
    const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
            type: 'direct',
            created_by: user.id
        })
        .select()
        .single();

    if (convError) return { data: null, error: convError };

    // Add participants
    const { error: participantError } = await supabase
        .from('chat_participants')
        .insert([
            { conversation_id: newConv.id, user_id: user.id, role: 'owner' },
            { conversation_id: newConv.id, user_id: participantId, role: 'member' }
        ]);

    if (participantError) return { data: null, error: participantError };

    return getConversation(newConv.id);
};

/**
 * Create a group chat conversation
 */
export const createGroupChat = async (
    dto: CreateGroupChatDto
): Promise<{ data: ChatConversationWithDetails | null; error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: new Error('Not authenticated') };
    }

    // Create conversation
    const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
            type: 'group',
            name: dto.name,
            avatar_url: dto.avatar_url,
            created_by: user.id
        })
        .select()
        .single();

    if (convError) return { data: null, error: convError };

    // Add participants
    const participants = [
        { conversation_id: newConv.id, user_id: user.id, role: 'owner' },
        ...dto.participant_ids.map(pid => ({
            conversation_id: newConv.id,
            user_id: pid,
            role: 'member'
        }))
    ];

    const { error: participantError } = await supabase
        .from('chat_participants')
        .insert(participants);

    if (participantError) return { data: null, error: participantError };

    return getConversation(newConv.id);
};

/**
 * Send a message
 */
export const sendMessage = async (
    dto: SendMessageDto
): Promise<{ data: ChatMessageWithSender | null; error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: new Error('Not authenticated') };
    }

    // Validate message length
    if (dto.content.length > 5000) {
        return { data: null, error: new Error('Message too long') };
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            conversation_id: dto.conversation_id,
            sender_id: user.id,
            content: dto.content.trim(),
            type: dto.type || 'text',
            metadata: dto.reply_to ? { reply_to: dto.reply_to } : undefined
        })
        .select(`
            *,
            sender:profiles(id,name,avatar_url)
        `)
        .single();

    if (error) return { data: null, error };

    // Update conversation's last_message_at
    await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', dto.conversation_id);

    return {
        data: {
            ...data,
            is_sender: true,
            read_by: []
        } as ChatMessageWithSender,
        error: null
    };
};

/**
 * Update a message
 */
export const updateMessage = async (
    dto: UpdateMessageDto
): Promise<{ data: ChatMessageWithSender | null; error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: new Error('Not authenticated') };
    }

    // Check if user owns the message
    const { data: existing } = await supabase
        .from('chat_messages')
        .select('sender_id')
        .eq('id', dto.message_id)
        .single();

    if (!existing || existing.sender_id !== user.id) {
        return { data: null, error: new Error('Unauthorized') };
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .update({
            content: dto.content.trim(),
            is_edited: true,
            updated_at: new Date().toISOString()
        })
        .eq('id', dto.message_id)
        .select(`
            *,
            sender:profiles(id,name,avatar_url)
        `)
        .single();

    if (error) return { data: null, error };

    return {
        data: {
            ...data,
            is_sender: true
        } as ChatMessageWithSender,
        error: null
    };
};

/**
 * Delete a message (soft delete)
 */
export const deleteMessage = async (
    messageId: string
): Promise<{ error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: new Error('Not authenticated') };
    }

    // Check if user owns the message
    const { data: existing } = await supabase
        .from('chat_messages')
        .select('sender_id')
        .eq('id', messageId)
        .single();

    if (!existing || existing.sender_id !== user.id) {
        return { error: new Error('Unauthorized') };
    }

    const { error } = await supabase
        .from('chat_messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId);

    return { error };
};

/**
 * Mark conversation as read
 */
export const markAsRead = async (
    conversationId: string,
    messageId: string
): Promise<{ error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

    return { error };
};

/**
 * Get typing users in a conversation
 */
export const getTypingUsers = async (
    conversationId: string
): Promise<{ data: string[] | null; error: any }> => {
    const now = new Date();
    const timeout = new Date(now.getTime() - 5000); // 5 seconds ago

    const { data, error } = await supabase
        .from('chat_typing_indicators')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .gt('timestamp', timeout.toISOString());

    return {
        data: data?.map(d => d.user_id) || [],
        error
    };
};

/**
 * Set typing indicator
 */
export const setTypingIndicator = async (
    conversationId: string,
    isTyping: boolean
): Promise<{ error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: new Error('Not authenticated') };
    }

    if (isTyping) {
        // Upsert typing indicator
        const { error } = await supabase
            .from('chat_typing_indicators')
            .upsert({
                conversation_id: conversationId,
                user_id: user.id,
                is_typing: true,
                timestamp: new Date().toISOString()
            }, {
                onConflict: 'conversation_id,user_id'
            });

        return { error };
    } else {
        // Remove typing indicator
        const { error } = await supabase
            .from('chat_typing_indicators')
            .delete()
            .eq('conversation_id', conversationId)
            .eq('user_id', user.id);

        return { error };
    }
};

/**
 * Add participant to conversation
 */
export const addParticipant = async (
    conversationId: string,
    userId: string,
    role: 'member' | 'admin' = 'member'
): Promise<{ error: any }> => {
    const { error } = await supabase
        .from('chat_participants')
        .insert({
            conversation_id: conversationId,
            user_id: userId,
            role
        });

    return { error };
};

/**
 * Remove participant from conversation
 */
export const removeParticipant = async (
    conversationId: string,
    userId: string
): Promise<{ error: any }> => {
    const { error } = await supabase
        .from('chat_participants')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

    return { error };
};

/**
 * Leave conversation
 */
export const leaveConversation = async (
    conversationId: string
): Promise<{ error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
        .from('chat_participants')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

    return { error };
};
