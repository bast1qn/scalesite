// Message Input Component
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Send from 'lucide-react/dist/esm/icons/send';
import Paperclip from 'lucide-react/dist/esm/icons/paperclip';
import Smile from 'lucide-react/dist/esm/icons/smile';
import X from 'lucide-react/dist/esm/icons/x';

interface MessageInputProps {
    onSendMessage: (content: string) => Promise<void>;
    onTypingChange?: (isTyping: boolean) => void;
    disabled?: boolean;
    placeholder?: string;
    replyTo?: {
        id: string;
        content: string;
        senderName: string;
    } | null;
    onCancelReply?: () => void;
}

export const MessageInput = ({
    onSendMessage,
    onTypingChange,
    disabled = false,
    placeholder = 'Schreibe eine Nachricht...',
    replyTo,
    onCancelReply
}: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [message]);

    // Handle typing indicator
    useEffect(() => {
        if (message.trim()) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            onTypingChange?.(true);
            typingTimeoutRef.current = setTimeout(() => {
                onTypingChange?.(false);
            }, 1000);
        } else {
            onTypingChange?.(false);
        }

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [message, onTypingChange]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = message.trim();
        if (!trimmed || isSending || disabled) return;

        setIsSending(true);
        onTypingChange?.(false);

        try {
            await onSendMessage(trimmed);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
            textareaRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4">
            {/* Reply Preview */}
            <AnimatePresence>
                {replyTo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3 flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                Antwort an {replyTo.senderName}
                            </p>
                            <p className="text-sm text-slate-900 dark:text-white truncate">
                                {replyTo.content}
                            </p>
                        </div>
                        <button
                            onClick={onCancelReply}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
                {/* Attachment Button */}
                <button
                    type="button"
                    disabled={disabled}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Anhang hinzufügen (in Kürze verfügbar)"
                >
                    <Paperclip className="w-5 h-5 text-slate-400" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled || isSending}
                        rows={1}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed max-h-[150px]"
                        style={{ minHeight: '44px' }}
                    />
                </div>

                {/* Emoji Button */}
                <button
                    type="button"
                    disabled={disabled}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Emojis (in Kürze verfügbar)"
                >
                    <Smile className="w-5 h-5 text-slate-400" />
                </button>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={disabled || isSending || !message.trim()}
                    className="p-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-violet-500 shadow-sm hover:shadow-md active:scale-[0.98]"
                    title={message.trim() ? 'Nachricht senden (Enter)' : 'Nachricht senden'}
                >
                    {isSending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </form>

            {/* Character Count */}
            <div className="flex justify-end mt-1.5 px-1">
                <span className={`text-[10px] ${
                    message.length > 4500
                        ? 'text-red-500'
                        : message.length > 4000
                            ? 'text-yellow-500'
                            : 'text-slate-400'
                }`}>
                    {message.length}/5000
                </span>
            </div>
        </div>
    );
};
