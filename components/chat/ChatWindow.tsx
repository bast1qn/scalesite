// Chat Window Component
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { ChatMessageWithSender, ChatConversationWithDetails } from '../../lib/chat';

interface ChatWindowProps {
    conversation: ChatConversationWithDetails | null;
    messages: ChatMessageWithSender[];
    currentUserId: string;
    onEditMessage?: (messageId: string, content: string) => void;
    onDeleteMessage?: (messageId: string) => void;
    onReplyToMessage?: (messageId: string) => void;
    isLoading?: boolean;
}

export const ChatWindow = ({
    conversation,
    messages,
    currentUserId,
    onEditMessage,
    onDeleteMessage,
    onReplyToMessage,
    isLoading
}: ChatWindowProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Willkommen im Chat
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Wähle einen Chat aus oder starte eine neue Konversation
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {isLoading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-slate-400">Noch keine Nachrichten. Sag hallo! 👋</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {messages.map((message, index) => {
                            const showDate = shouldShowDate(message, messages[index - 1]);
                            return (
                                <div key={message.id}>
                                    {showDate && (
                                        <div className="flex items-center my-4">
                                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                            <span className="px-3 text-xs text-slate-400 font-medium">
                                                {formatDate(message.created_at)}
                                            </span>
                                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                        </div>
                                    )}
                                    <MessageBubble
                                        message={message}
                                        isSender={message.is_sender || message.sender_id === currentUserId}
                                        onEdit={onEditMessage}
                                        onDelete={onDeleteMessage}
                                        onReply={onReplyToMessage}
                                    />
                                </div>
                            );
                        })}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

// Message Bubble Component
interface MessageBubbleProps {
    message: ChatMessageWithSender;
    isSender: boolean;
    onEdit?: (messageId: string, content: string) => void;
    onDelete?: (messageId: string) => void;
    onReply?: (messageId: string) => void;
}

const MessageBubble = ({ message, isSender, onEdit, onDelete, onReply }: MessageBubbleProps) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`flex ${isSender ? 'justify-end' : 'justify-start'} group`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className={`max-w-[75%] ${isSender ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Sender Name (for group chats) */}
                {!isSender && message.type !== 'system' && (
                    <span className="text-xs text-slate-500 mb-1 ml-2">
                        {message.sender?.name || 'Unbekannt'}
                    </span>
                )}

                {/* Message Content */}
                <div className={`relative ${isSender ? 'order-2' : 'order-1'}`}>
                    {/* Action Buttons */}
                    {showActions && (isSender || onReply) && (
                        <div className={`absolute top-0 ${isSender ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex gap-1 px-2`}>
                            {onReply && !isSender && (
                                <button
                                    onClick={() => onReply(message.id)}
                                    className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    title="Antworten"
                                >
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </button>
                            )}
                            {isSender && onEdit && !message.is_edited && (
                                <button
                                    onClick={() => onEdit(message.id, message.content)}
                                    className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    title="Bearbeiten"
                                >
                                    <Edit2 className="w-4 h-4 text-slate-500" />
                                </button>
                            )}
                            {isSender && onDelete && (
                                <button
                                    onClick={() => onDelete(message.id)}
                                    className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                    title="Löschen"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                        message.type === 'system'
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs text-center mx-auto'
                            : isSender
                                ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-br-sm'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                    }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                        </p>
                    </div>

                    {/* Metadata */}
                    {message.type !== 'system' && (
                        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-slate-400">
                                {formatMessageTime(message.created_at)}
                            </span>
                            {isSender && (
                                <ReadReceipt readBy={message.read_by || []} />
                            )}
                            {message.is_edited && (
                                <span className="text-[10px] text-slate-400 italic">(bearbeitet)</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Read Receipt Component
interface ReadReceiptProps {
    readBy: Array<{ user_id: string; read_at: string }>;
}

const ReadReceipt = ({ readBy }: ReadReceiptProps) => {
    if (readBy.length === 0) {
        return <Check className="w-3.5 h-3.5 text-slate-400" />;
    }
    if (readBy.length === 1) {
        return <Check className="w-3.5 h-3.5 text-blue-500" />;
    }
    return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />;
};

// Helper Functions
function shouldShowDate(message: ChatMessageWithSender, previousMessage?: ChatMessageWithSender): boolean {
    if (!previousMessage) return true;

    const currentDate = new Date(message.created_at).toDateString();
    const previousDate = new Date(previousMessage.created_at).toDateString();

    return currentDate !== previousDate;
}

function formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Heute';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Gestern';
    }

    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
