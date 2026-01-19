// Chat List Component
import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import Users from 'lucide-react/dist/esm/icons/users';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Search from 'lucide-react/dist/esm/icons/search';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import type { ChatConversationWithDetails } from '../../lib/chat';
import { useDebounce } from '../../lib/hooks/useDebounce';

interface ChatListProps {
    conversations: ChatConversationWithDetails[];
    activeConversationId: string | null;
    onSelectConversation: (conversationId: string) => void;
    onCreateChat: () => void;
    currentUserId: string;
}

export const ChatList = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onCreateChat,
    currentUserId
}: ChatListProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'direct' | 'group'>('all');

    // Debounce search query to improve performance
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Stable callbacks for event handlers
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleFilterAll = useCallback(() => setFilterType('all'), []);
    const handleFilterDirect = useCallback(() => setFilterType('direct'), []);
    const handleFilterGroup = useCallback(() => setFilterType('group'), []);

    const handleSelectConversation = useCallback((conversationId: string) => {
        onSelectConversation(conversationId);
    }, [onSelectConversation]);

    // Filter conversations based on search and type (memoized)
    const filteredConversations = useMemo(() => {
        return conversations.filter(conv => {
            const matchesSearch = debouncedSearchQuery === '' ||
                (conv.type === 'direct' && getDisplayName(conv, currentUserId).toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
                (conv.type === 'group' && conv.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

            const matchesType = filterType === 'all' || conv.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [conversations, debouncedSearchQuery, filterType, currentUserId]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Nachrichten
                    </h2>
                    <button
                        onClick={onCreateChat}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Neuer Chat"
                    >
                        <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Chats durchsuchen..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleFilterAll}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            filterType === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Alle
                    </button>
                    <button
                        onClick={handleFilterDirect}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                            filterType === 'direct'
                                ? 'bg-blue-500 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <MessageCircle className="w-3 h-3" />
                        Direkt
                    </button>
                    <button
                        onClick={handleFilterGroup}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                            filterType === 'group'
                                ? 'bg-blue-500 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Users className="w-3 h-3" />
                        Gruppen
                    </button>
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-sm">
                                {searchQuery ? 'Keine Chats gefunden' : 'Noch keine Chats'}
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <motion.div
                                key={conversation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.15 }}
                            >
                                <ChatListItem
                                    conversation={conversation}
                                    isActive={conversation.id === activeConversationId}
                                    onClick={() => handleSelectConversation(conversation.id)}
                                    currentUserId={currentUserId}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Chat List Item Component
interface ChatListItemProps {
    conversation: ChatConversationWithDetails;
    isActive: boolean;
    onClick: () => void;
    currentUserId: string;
}

const ChatListItem = memo(({ conversation, isActive, onClick, currentUserId }: ChatListItemProps) => {
    const displayName = getDisplayName(conversation, currentUserId);
    const avatarUrl = getAvatarUrl(conversation, currentUserId);
    const lastMessage = conversation.last_message;
    const unreadCount = conversation.unread_count || 0;

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 flex items-start gap-3 transition-colors border-l-4 ${
                isActive
                    ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                    : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold text-lg">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                )}
                {conversation.type === 'direct' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                    }`}>
                        {displayName}
                    </h3>
                    {lastMessage && (
                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                            {formatMessageTime(lastMessage.created_at)}
                        </span>
                    )}
                </div>

                {lastMessage ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {lastMessage.sender_id === currentUserId && 'Du: '}
                        {lastMessage.content}
                    </p>
                ) : (
                    <p className="text-sm text-slate-400 italic">Noch keine Nachrichten</p>
                )}
            </div>

            {/* Unread Badge */}
            {unreadCount > 0 && (
                <div className="shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                </div>
            )}
        </button>
    );
});
ChatListItem.displayName = 'ChatListItem';

// Helper Functions
function getDisplayName(conversation: ChatConversationWithDetails, currentUserId: string): string {
    if (conversation.type === 'group') {
        return conversation.name || 'Gruppenchat';
    }

    // For direct chats, get the other participant's name
    const otherParticipant = conversation.participants.find(p => p.user_id !== currentUserId);
    return otherParticipant?.profile?.name || 'Unbekannt';
}

function getAvatarUrl(conversation: ChatConversationWithDetails, currentUserId: string): string | undefined {
    if (conversation.type === 'group') {
        return conversation.avatar_url;
    }

    // For direct chats, get the other participant's avatar
    const otherParticipant = conversation.participants.find(p => p.user_id !== currentUserId);
    return otherParticipant?.profile?.avatar_url;
}

// Time constants for relative time formatting
const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;

function formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
    const diffHours = Math.floor(diffMs / MS_PER_HOUR);
    const diffDays = Math.floor(diffMs / MS_PER_DAY);

    if (diffMins < 1) return 'Jetzt';
    if (diffMins < 60) return `vor ${diffMins}m`;
    if (diffHours < 24) return `vor ${diffHours}h`;
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return date.toLocaleDateString('de-DE', { weekday: 'short' });

    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}
