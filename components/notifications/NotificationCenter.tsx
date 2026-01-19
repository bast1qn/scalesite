// NotificationCenter - Central Notification Management UI
// Woche 25: Real-time Features - Notifications

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotifications, AppNotification } from '../../contexts/NotificationContext';
import {
    XMarkIcon,
    BellIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    TicketIcon,
    BriefcaseIcon,
    CreditCardIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    TrashIcon,
    CheckIcon,
    FunnelIcon,
} from '../Icons';

/**
 * SECURITY: Whitelist of allowed redirect paths
 * Prevents open redirect vulnerabilities (OWASP A01:2021)
 * Only redirects to known application routes are allowed
 */
const ALLOWED_REDIRECT_PATHS = [
    '/dashboard',
    '/tickets/',
    '/projects/',
    '/billing/',
    '/settings',
    '/admin',
] as const;

/**
 * Validates if a URL is safe to redirect to
 * Prevents open redirect vulnerabilities by:
 * 1. Only allowing relative URLs (no absolute URLs with protocol)
 * 2. Checking against path whitelist
 * 3. Blocking JavaScript: data: and other dangerous protocols
 *
 * @param url - The URL to validate
 * @returns true if URL is safe for redirect, false otherwise
 */
const isValidRedirectUrl = (url: string): boolean => {
    if (!url) return false;

    // SECURITY: Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    const lowerUrl = url.toLowerCase().trim();
    if (dangerousProtocols.some(proto => lowerUrl.startsWith(proto))) {
        return false;
    }

    try {
        // SECURITY: Only allow relative URLs starting with /
        // Absolute URLs (even same-origin) are blocked for defense in depth
        if (!url.startsWith('/')) {
            return false;
        }

        // SECURITY: Check against whitelist
        const isAllowed = ALLOWED_REDIRECT_PATHS.some(path => url.startsWith(path));
        if (!isAllowed) {
            return false;
        }

        return true;
    } catch {
        // Invalid URL
        return false;
    }
};

interface NotificationCenterProps {
    onClose?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    } = useNotifications();

    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const filteredNotifications = useMemo(() => {
        let filtered = [...notifications];

        // Filter by read status
        if (filter === 'unread') {
            filtered = filtered.filter(n => !n.read);
        } else if (filter === 'read') {
            filtered = filtered.filter(n => n.read);
        }

        // Filter by type
        if (typeFilter !== 'all') {
            filtered = filtered.filter(n => n.type === typeFilter);
        }

        return filtered;
    }, [notifications, filter, typeFilter]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
            case 'error':
                return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
            case 'ticket':
                return <TicketIcon className="w-5 h-5 text-blue-500" />;
            case 'project':
                return <BriefcaseIcon className="w-5 h-5 text-violet-500" />;
            case 'billing':
                return <CreditCardIcon className="w-5 h-5 text-emerald-500" />;
            case 'team':
                return <UsersIcon className="w-5 h-5 text-cyan-500" />;
            case 'message':
                return <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-500" />;
            default:
                return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
        }
    };

    const getGradient = (type: string) => {
        switch (type) {
            case 'success':
                return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/60 dark:border-green-800/40';
            case 'warning':
                return 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200/60 dark:border-amber-800/40';
            case 'error':
                return 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/60 dark:border-red-800/40';
            case 'ticket':
                return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/60 dark:border-blue-800/40';
            case 'project':
                return 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/60 dark:border-violet-800/40';
            case 'billing':
                return 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/60 dark:border-emerald-800/40';
            case 'team':
                return 'from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 border-cyan-200/60 dark:border-cyan-800/40';
            case 'message':
                return 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200/60 dark:border-indigo-800/40';
            default:
                return 'from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-200/60 dark:border-slate-800/40';
        }
    };

    // Time constants for relative time formatting
    const MS_PER_MINUTE = 60000;
    const MS_PER_HOUR = 3600000;
    const MS_PER_DAY = 86400000;

    const getTimeAgo = (date: string): string => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now.getTime() - notifDate.getTime();
        const diffMins = Math.floor(diffMs / MS_PER_MINUTE);

        if (diffMins < 1) return 'Gerade eben';
        if (diffMins < 60) return `vor ${diffMins} Min.`;
        const diffHours = Math.floor(diffMs / MS_PER_HOUR);
        if (diffHours < 24) return `vor ${diffHours} Std.`;
        const diffDays = Math.floor(diffMs / MS_PER_DAY);
        if (diffDays < 7) return `vor ${diffDays} Tagen`;
        return notifDate.toLocaleDateString('de-DE');
    };

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await markAsRead(id);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteNotification(id);
    };

    const handleNotificationClick = async (notification: AppNotification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        if (notification.link) {
            // SECURITY: Validate URL to prevent open redirect vulnerabilities
            if (isValidRedirectUrl(notification.link)) {
                // SECURITY: Use React Router instead of window.location.href for safer navigation
                navigate(notification.link);
                onClose?.(); // Close notification center after navigation
            } else {
                console.warn('[Security] Blocked potentially unsafe redirect:', notification.link);
            }
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton h-20 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500">
                            <BellIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                Benachrichtigungen
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {unreadCount} ungelesen
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-9 min-w-9 flex items-center justify-center"
                        >
                            <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 min-h-9 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <CheckIcon className="w-4 h-4" />
                            Alle als gelesen
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="px-4 py-2 min-h-9 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Alle löschen
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        {(['all', 'unread', 'read'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-2 min-h-8 text-xs font-semibold rounded-md transition-all ${
                                    filter === f
                                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {f === 'all' ? 'Alle' : f === 'unread' ? 'Ungelesen' : 'Gelesen'}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`px-3 py-2 min-h-8 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                                typeFilter === 'all'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <FunnelIcon className="w-3 h-3" />
                            Alle Typen
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[600px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <BellIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Keine Benachrichtigungen
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {filter === 'unread'
                                ? 'Alle Benachrichtigungen wurden gelesen'
                                : 'Du hast keine Benachrichtigungen'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredNotifications.map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 min-h-16 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative bg-gradient-to-br ${getGradient(
                                    notification.type
                                )} border-b border-slate-100 dark:border-slate-800/50`}
                            >
                                {/* Unread indicator */}
                                {!notification.read && (
                                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-500 to-violet-500 rounded-r-full" />
                                )}

                                <div className="flex items-start gap-3 pl-3">
                                    {/* Icon */}
                                    <div className="shrink-0 mt-0.5">
                                        {getIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {getTimeAgo(notification.created_at)}
                                            </span>
                                        </div>

                                        {notification.message && (
                                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                                                {notification.message}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {!notification.read && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                    className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline min-h-6"
                                                >
                                                    Als gelesen markieren
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                className="text-[10px] font-medium text-red-600 dark:text-red-400 hover:underline min-h-6"
                                            >
                                                Löschen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                        {notifications.length} Benachrichtigungen insgesamt
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
