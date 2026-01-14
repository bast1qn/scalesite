// ============================================
// CHAT HOOKS
// React Hooks for Chat Functionality
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts';
import {
    getConversations,
    getConversation,
    getMessages,
    sendMessage,
    updateMessage,
    deleteMessage as deleteMessageApi,
    markAsRead,
    setTypingIndicator,
    getTypingUsers,
    createDirectChat,
    createGroupChat,
    leaveConversation,
    type ChatConversationWithDetails,
    type ChatMessageWithSender,
    type CreateDirectChatDto,
    type CreateGroupChatDto,
    type SendMessageDto,
    type UpdateMessageDto
} from './chat';
import {
    subscribeToChatMessages,
    subscribeToTypingIndicators,
    subscribeToConversationUpdates,
    unsubscribe
} from './realtime';
import { getCurrentUser } from './supabase';

// ============================================
// useConversations Hook
// ============================================

export const useConversations = () => {
    const [conversations, setConversations] = useState<ChatConversationWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const { data, error: err } = await getConversations();

        if (err) {
            setError(err as Error);
        } else {
            setConversations(data || []);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchConversations();

        // Subscribe to conversation updates
        const channelName = subscribeToConversationUpdates({
            onConversationUpdate: () => {
                fetchConversations();
            },
            onError: (err) => {
                console.error('Conversation subscription error:', err);
            }
        });

        return () => {
            unsubscribe(channelName);
        };
    }, [fetchConversations]);

    return {
        conversations,
        isLoading,
        error,
        refetch: fetchConversations
    };
};

// ============================================
// useChat Hook
// ============================================

interface UseChatOptions {
    conversationId?: string;
}

export const useChat = (options: UseChatOptions = {}) => {
    const { conversationId } = options;
    const [conversation, setConversation] = useState<ChatConversationWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchConversation = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        const { data, error: err } = await getConversation(id);

        if (err) {
            setError(err as Error);
        } else {
            setConversation(data);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (conversationId) {
            fetchConversation(conversationId);
        } else {
            setConversation(null);
        }
    }, [conversationId, fetchConversation]);

    return {
        conversation,
        isLoading,
        error,
        refetch: (id: string) => fetchConversation(id)
    };
};

// ============================================
// useChatMessages Hook
// ============================================

interface UseChatMessagesOptions {
    conversationId: string;
    limit?: number;
}

export const useChatMessages = (options: UseChatMessagesOptions) => {
    const { conversationId, limit = 50 } = options;
    const [messages, setMessages] = useState<ChatMessageWithSender[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(false);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) return;

        setIsLoading(true);
        setError(null);

        const { data, error: err } = await getMessages(conversationId, limit);

        if (err) {
            setError(err as Error);
        } else {
            setMessages(data || []);
            setHasMore((data?.length || 0) >= limit);
        }

        setIsLoading(false);
    }, [conversationId, limit]);

    const loadMore = useCallback(async () => {
        if (!hasMore || !conversationId || messages.length === 0) return;

        const oldestMessage = messages[0];
        // ✅ BUG FIX: Added null check for oldestMessage.created_at
        if (!oldestMessage?.created_at) {
            console.error('[useChatMessages] Oldest message missing created_at');
            return;
        }

        const { data, error: err } = await getMessages(conversationId, limit, oldestMessage.created_at);

        if (!err && data) {
            setMessages(prev => [...data, ...prev]);
            setHasMore(data.length >= limit);
        }
    }, [conversationId, limit, hasMore, messages]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Subscribe to new messages
    useEffect(() => {
        if (!conversationId) return;

        const messageChannel = subscribeToChatMessages(conversationId, {
            onNewMessage: (message) => {
                setMessages(prev => [...prev, message]);
            },
            onMessageUpdate: (message) => {
                setMessages(prev => prev.map(m => m.id === message.id ? message : m));
            },
            onMessageDelete: (messageId) => {
                setMessages(prev => prev.filter(m => m.id !== messageId));
            }
        });

        return () => {
            unsubscribe(messageChannel);
        };
    }, [conversationId]);

    return {
        messages,
        isLoading,
        error,
        hasMore,
        loadMore,
        refetch: fetchMessages
    };
};

// ============================================
// useTypingIndicator Hook
// ============================================

export const useTypingIndicator = (conversationId: string) => {
    const [typingUsers, setTypingUsers] = useState<Array<{ id: string; name: string }>>([]);
    const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    useEffect(() => {
        if (!conversationId) return;

        // ✅ FIX: Clear previous timeouts when conversationId changes to prevent memory leaks
        typingTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
        typingTimeoutRef.current.clear();

        // Subscribe to typing indicators from database
        const channelName = subscribeToTypingIndicators(conversationId, {
            onTypingStart: async ({ user_id }) => {
                const { user } = await getCurrentUser();
                if (user && user_id !== user.id) {
                    // Fetch user profile to get name
                    // In a real app, you'd cache this or include it in the subscription
                    setTypingUsers(prev => {
                        if (prev.some(u => u.id === user_id)) return prev;
                        return [...prev, { id: user_id, name: 'Jemand' }];
                    });

                    // Clear existing timeout for this user
                    if (typingTimeoutRef.current.has(user_id)) {
                        clearTimeout(typingTimeoutRef.current.get(user_id)!);
                    }

                    // Set new timeout to remove typing indicator
                    const timeout = setTimeout(() => {
                        setTypingUsers(prev => prev.filter(u => u.id !== user_id));
                    }, 3000);

                    typingTimeoutRef.current.set(user_id, timeout);
                }
            },
            onTypingStop: ({ user_id }) => {
                if (typingTimeoutRef.current.has(user_id)) {
                    clearTimeout(typingTimeoutRef.current.get(user_id)!);
                }
                setTypingUsers(prev => prev.filter(u => u.id !== user_id));
            }
        });

        return () => {
            // Clear all timeouts
            typingTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
            typingTimeoutRef.current.clear();
            unsubscribe(channelName);
        };
    }, [conversationId]);

    const setTyping = useCallback(async (isTyping: boolean) => {
        if (!conversationId) return;
        await setTypingIndicator(conversationId, isTyping);
    }, [conversationId]);

    return {
        typingUsers,
        setTyping
    };
};

// ============================================
// useSendMessage Hook
// ============================================

export const useSendMessage = (conversationId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const send = useCallback(async (content: string, replyTo?: string) => {
        if (!conversationId) {
            setError(new Error('No conversation selected'));
            return null;
        }

        setIsLoading(true);
        setError(null);

        const dto: SendMessageDto = {
            conversation_id: conversationId,
            content,
            reply_to: replyTo
        };

        const { data, error: err } = await sendMessage(dto);

        if (err) {
            setError(err as Error);
            setIsLoading(false);
            return null;
        }

        setIsLoading(false);
        return data;
    }, [conversationId]);

    return {
        send,
        isLoading,
        error
    };
};

// ============================================
// useMessageActions Hook
// ============================================

export const useMessageActions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const editMessage = useCallback(async (messageId: string, content: string) => {
        setIsLoading(true);
        setError(null);

        const { error: err } = await updateMessage({ message_id: messageId, content });

        if (err) {
            setError(err as Error);
        }

        setIsLoading(false);
        return !err;
    }, []);

    const deleteMessage = useCallback(async (messageId: string) => {
        setIsLoading(true);
        setError(null);

        const { error: err } = await deleteMessageApi(messageId);

        if (err) {
            setError(err as Error);
        }

        setIsLoading(false);
        return !err;
    }, []);

    const markAsReadFn = useCallback(async (conversationId: string, messageId: string) => {
        const { error } = await markAsRead(conversationId, messageId);
        return !error;
    }, []);

    return {
        editMessage,
        deleteMessage,
        markAsRead: markAsReadFn,
        isLoading,
        error
    };
};

// ============================================
// useCreateChat Hook
// ============================================

export const useCreateChat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createDirect = useCallback(async (participantId: string) => {
        setIsLoading(true);
        setError(null);

        const { data, error: err } = await createDirectChat(participantId);

        if (err) {
            setError(err as Error);
            setIsLoading(false);
            return null;
        }

        setIsLoading(false);
        return data;
    }, []);

    const createGroup = useCallback(async (dto: CreateGroupChatDto) => {
        setIsLoading(true);
        setError(null);

        const { data, error: err } = await createGroupChat(dto);

        if (err) {
            setError(err as Error);
            setIsLoading(false);
            return null;
        }

        setIsLoading(false);
        return data;
    }, []);

    return {
        createDirect,
        createGroup,
        isLoading,
        error
    };
};

// ============================================
// useChatActions Hook
// ============================================

export const useChatActions = () => {
    const leave = useCallback(async (conversationId: string) => {
        const { error } = await leaveConversation(conversationId);
        return !error;
    }, []);

    return {
        leave
    };
};
