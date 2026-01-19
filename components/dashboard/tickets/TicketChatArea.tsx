// ============================================
// TICKET CHAT AREA COMPONENT
// Displays the chat interface for a ticket
// ============================================

import React, { useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { Message, Ticket } from '../../../types/tickets';
import { getTicketStatusColor, formatTicketId } from '../../../lib/ticket-utils';
import { useChatScroll } from '../../../lib/hooks';
import { CHAT_AUTO_SCROLL_THRESHOLD, CHAT_CONTAINER_HEIGHT } from '../../../lib/constants/tickets';
import { TicketMessageBubble } from './TicketMessageBubble';

interface TicketChatAreaProps {
    ticket: Ticket;
    messages: Message[];
    currentUserId: string | undefined;
    reply: string;
    onReplyChange: (reply: string) => void;
    onSubmitReply: (e: React.FormEvent) => void;
    actionLoading: boolean;
}

export const TicketChatArea: React.FC<TicketChatAreaProps> = ({
    ticket,
    messages,
    currentUserId,
    reply,
    onReplyChange,
    onSubmitReply,
    actionLoading
}) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { messagesEndRef, handleScroll, forceScroll } = useChatScroll(
        chatContainerRef,
        messages,
        true
    );

    const isClosedForUser = ticket.status === 'Geschlossen';

    return (
        <div
            className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col"
            style={{ height: `${CHAT_CONTAINER_HEIGHT}px` }}
        >
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white break-words">
                    {ticket.subject}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getTicketStatusColor(ticket.status)}`}>
                        {ticket.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {formatTicketId(ticket.id)}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4"
            >
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <TicketMessageBubble
                            key={msg.id}
                            message={msg}
                            currentUserId={currentUserId}
                        />
                    ))
                ) : (
                    <p className="text-center text-slate-500 font-medium">Keine Nachrichten.</p>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Form */}
            <form
                onSubmit={onSubmitReply}
                className={`mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 ${
                    isClosedForUser ? 'hidden' : ''
                }`}
            >
                <textarea
                    value={reply}
                    onChange={(e) => onReplyChange(e.target.value)}
                    placeholder="Ihre Antwort..."
                    rows={2}
                    className="flex-1 block w-full px-4 py-3 text-sm rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                    type="submit"
                    className="group p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-500 disabled:cursor-not-allowed self-end shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                    disabled={!reply.trim() || actionLoading}
                >
                    <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </form>
        </div>
    );
};
