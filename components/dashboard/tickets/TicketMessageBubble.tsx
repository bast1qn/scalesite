// ============================================
// TICKET MESSAGE BUBBLE COMPONENT
// Displays individual chat messages in ticket thread
// ============================================

import React from 'react';
import { TicketIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { formatTimeAgo } from '../../../lib/dateUtils';
import type { Message } from '../../../types/tickets';
import {
    isSystemMessage as checkIsSystemMessage,
    stripSystemPrefix,
    getTicketAuthorName,
    getMessageClasses,
    getAvatarClasses,
    getMessageFlexDirection
} from '../../../lib/ticket-utils';

interface TicketMessageBubbleProps {
    message: Message;
    currentUserId: string | undefined;
}

export const TicketMessageBubble: React.FC<TicketMessageBubbleProps> = ({
    message,
    currentUserId
}) => {
    const isUser = message.user_id === currentUserId;
    const isSupport = message.profiles && (message.profiles.role === 'team' || message.profiles.role === 'owner');
    const isSystemMessage = checkIsSystemMessage(message.text);

    const authorName = getTicketAuthorName(message.profiles, isSupport, isUser);
    const messageClasses = getMessageClasses(isUser, isSystemMessage);
    const avatarClasses = getAvatarClasses(isUser, isSupport);
    const flexDirection = getMessageFlexDirection(isUser);
    const displayText = stripSystemPrefix(message.text);

    return (
        <div className={`flex gap-3 ${flexDirection}`}>
            {/* Avatar */}
            <div className={avatarClasses}>
                {isSupport ? (
                    <TicketIcon className="w-4 h-4 text-white" />
                ) : (
                    <UserCircleIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                )}
            </div>

            {/* Message Bubble */}
            <div className={messageClasses}>
                <p>{displayText}</p>
                <p className="text-[10px] mt-2 opacity-70 text-right font-medium">
                    {authorName}, {formatTimeAgo(message.created_at)}
                </p>
            </div>
        </div>
    );
};
