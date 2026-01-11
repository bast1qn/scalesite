
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { PaperAirplaneIcon } from '../Icons';
import { api } from '../../lib/api';

interface ChatMessage {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: {
        name: string;
        role: string;
    };
}

const TeamChat: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldScroll, setShouldScroll] = useState(true);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    const fetchMessages = async (isPolling = false) => { 
        if (!isPolling) setLoading(true);
        try {
            const { data } = await api.get('/team_chat');
            if (data) {
                setMessages(data);
            }
        } catch (err) {
             console.error(err);
        } finally {
             if (!isPolling) setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        
        const interval = setInterval(() => {
            // Optimization: Only poll if tab is visible
            if (document.visibilityState === 'visible') {
                fetchMessages(true);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user]);

    // Scroll logic: Only scroll if user was near bottom or if new messages arrived and user was near bottom
    useEffect(() => {
        if (messages.length > lastMessageCount) {
             if (shouldScroll) {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
             }
             setLastMessageCount(messages.length);
        }
    }, [messages, shouldScroll, lastMessageCount]);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            // Check if we are near bottom (within 100px)
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShouldScroll(isNearBottom);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const content = newMessage;
        setNewMessage('');
        try {
            await api.post('/team_chat', { content });
            setShouldScroll(true); // Force scroll on own message
            fetchMessages(true);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Team Chat</h1>
            </div>
            
            <div 
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-950/30"
                ref={containerRef}
                onScroll={handleScroll}
            >
                {loading && messages.length === 0 ? (
                    <div className="flex justify-center py-10">
                         <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.user_id === user?.id;
                        const isConsecutive = idx > 0 && messages[idx - 1].user_id === msg.user_id;
                        
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
                                {!isMe && !isConsecutive && (
                                    <span className="text-xs text-slate-500 mb-1 ml-1">{msg.profiles?.name}</span>
                                )}
                                <div className={`px-4 py-2 max-w-[85%] rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    isMe 
                                    ? 'bg-primary text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nachricht..."
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 shadow-md">
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default TeamChat;
