// Chat Page - Real-time Messaging
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { AuthContext, useLanguage } from '../contexts';
import {
    ChatList,
    ChatWindow,
    MessageInput,
    TypingIndicator
} from '../components/chat';
import {
    useConversations,
    useChatMessages,
    useTypingIndicator,
    useSendMessage,
    useMessageActions,
    useCreateChat
} from '../lib/hooks-chat';
import { getCurrentUser } from '../lib/supabase';
import type { ChatConversationWithDetails } from '../lib/chat';

interface ChatPageProps {
    setCurrentPage: (page: string) => void;
}

export const ChatPage = ({ setCurrentPage }: ChatPageProps) => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [replyTo, setReplyTo] = useState<{
        id: string;
        content: string;
        senderName: string;
    } | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    // Fetch conversations
    const { conversations, isLoading: isLoadingConversations } = useConversations();

    // Fetch active conversation
    const { conversation: activeConversation } = useChat({
        conversationId: activeConversationId || undefined
    });

    // Fetch messages
    const { messages, isLoading: isLoadingMessages } = useChatMessages({
        conversationId: activeConversationId || '',
        limit: 50
    });

    // Typing indicator
    const { typingUsers, setTyping } = useTypingIndicator(activeConversationId || '');

    // Send message
    const { send: sendMessage, isLoading: isSending } = useSendMessage(activeConversationId || '');

    // Message actions
    const { editMessage, deleteMessage, markAsRead } = useMessageActions();

    // Auto-mark as read when viewing conversation
    useEffect(() => {
        if (activeConversationId && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && !lastMessage.is_sender) {
                markAsRead(activeConversationId, lastMessage.id);
            }
        }
    }, [activeConversationId, messages, markAsRead]);

    // Handle send message
    const handleSendMessage = async (content: string) => {
        if (!activeConversationId) return;

        const result = await sendMessage(content, replyTo?.id);
        if (result) {
            setReplyTo(null);
        }
    };

    // Handle edit message
    const handleEditMessage = async (messageId: string, newContent: string) => {
        await editMessage(messageId, newContent);
    };

    // Handle delete message
    const handleDeleteMessage = async (messageId: string) => {
        if (confirm('Möchtest du diese Nachricht wirklich löschen?')) {
            await deleteMessage(messageId);
        }
    };

    // Handle reply to message
    const handleReplyTo = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (message && message.sender) {
            setReplyTo({
                id: messageId,
                content: message.content,
                senderName: message.sender.name || 'Unbekannt'
            });
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">Bitte melde dich an, um den Chat zu nutzen.</p>
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Zum Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-white dark:bg-slate-900 flex">
            {/* Sidebar - Chat List */}
            <div className={`${activeConversationId ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] lg:w-[420px] flex-col border-r border-slate-200 dark:border-slate-700`}>
                <ChatList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={setActiveConversationId}
                    onCreateChat={() => setShowCreateDialog(true)}
                    currentUserId={user.id}
                />
            </div>

            {/* Main Chat Area */}
            <div className={`${!activeConversationId ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveConversationId(null)}
                                    className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>

                                {/* Chat Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                                    {activeConversation.type === 'group'
                                        ? (activeConversation.name?.charAt(0) || 'G')
                                        : getOtherParticipantName(activeConversation, user.id)?.charAt(0) || '?'
                                    }
                                </div>

                                {/* Chat Info */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {activeConversation.type === 'group'
                                            ? activeConversation.name
                                            : getOtherParticipantName(activeConversation, user.id)
                                        }
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {activeConversation.participants.length} Teilnehmer
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <ChatWindow
                            conversation={activeConversation}
                            messages={messages}
                            currentUserId={user.id}
                            onEditMessage={handleEditMessage}
                            onDeleteMessage={handleDeleteMessage}
                            onReplyToMessage={handleReplyTo}
                            isLoading={isLoadingMessages}
                        />

                        {/* Typing Indicator */}
                        {typingUsers.length > 0 && (
                            <div className="px-4 pb-2">
                                <TypingIndicator users={typingUsers} />
                            </div>
                        )}

                        {/* Message Input */}
                        <MessageInput
                            onSendMessage={handleSendMessage}
                            onTypingChange={setTyping}
                            disabled={isSending}
                            placeholder="Schreibe eine Nachricht..."
                            replyTo={replyTo}
                            onCancelReply={() => setReplyTo(null)}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                                <span className="text-3xl">💬</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                Willkommen im Chat
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Wähle einen Chat aus der Liste oder starte eine neue Konversation
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Chat Dialog */}
            <AnimatePresence>
                {showCreateDialog && (
                    <CreateChatDialog
                        onClose={() => setShowCreateDialog(false)}
                        onSelectConversation={(conversationId) => {
                            setActiveConversationId(conversationId);
                            setShowCreateDialog(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper Component: Create Chat Dialog
interface CreateChatDialogProps {
    onClose: () => void;
    onSelectConversation: (conversationId: string) => void;
}

const CreateChatDialog = ({ onClose, onSelectConversation }: CreateChatDialogProps) => {
    const { createDirect, isLoading } = useCreateChat();
    const [selectedUserId, setSelectedUserId] = useState('');

    // Mock user list - in real app, fetch from database
    const mockUsers = [
        { id: 'user1', name: 'Max Mustermann' },
        { id: 'user2', name: 'Anna Schmidt' },
        { id: 'user3', name: 'Thomas Müller' }
    ];

    const handleCreateChat = async () => {
        if (!selectedUserId) return;

        const conversation = await createDirect(selectedUserId);
        if (conversation) {
            onSelectConversation(conversation.id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Neuen Chat starten
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Wähle einen Kontakt aus
                    </p>
                </div>

                <div className="p-4 max-h-80 overflow-y-auto">
                    {mockUsers.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUserId(user.id)}
                            className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors ${
                                selectedUserId === user.id
                                    ? 'bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-500'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {user.name}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleCreateChat}
                        disabled={!selectedUserId || isLoading}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:from-blue-600 hover:to-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Erstelle...' : 'Chat starten'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Helper function
function getOtherParticipantName(conversation: ChatConversationWithDetails, currentUserId: string): string {
    const other = conversation.participants.find(p => p.user_id !== currentUserId);
    return other?.profile?.name || 'Unbekannt';
};
