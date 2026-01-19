// NotificationToast - Toast Notifications for Real-time Alerts
// Woche 25: Real-time Features - Notifications

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, type AppNotification } from '../../contexts/NotificationContext';
import { TIMING } from '../../lib/constants';
import {
    BellIcon,
    BriefcaseIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    CreditCardIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    TicketIcon,
    UsersIcon,
    XMarkIcon,
} from '../Icons';

// Constants
const DEFAULT_TOAST_DURATION = 5000; // 5 seconds
const TOAST_CLOSE_DELAY = 300; // 300ms for fade-out animation

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
        return false;
    }
};

interface NotificationToastProps {
    notification: AppNotification;
    onClose: () => void;
    duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
    notification,
    onClose,
    duration = DEFAULT_TOAST_DURATION,
}) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, TOAST_CLOSE_DELAY);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (notification.type) {
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

    const getGradient = () => {
        switch (notification.type) {
            case 'success':
                return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
            case 'warning':
                return 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800';
            case 'error':
                return 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800';
            case 'ticket':
                return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800';
            case 'project':
                return 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-800';
            case 'billing':
                return 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800';
            case 'team':
                return 'from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 border-cyan-200 dark:border-cyan-800';
            case 'message':
                return 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800';
            default:
                return 'from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-200 dark:border-slate-800';
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
        if (diffMins < 60) return `vor ${diffMins}m`;
        const diffHours = Math.floor(diffMs / MS_PER_HOUR);
        if (diffHours < 24) return `vor ${diffHours}h`;
        const diffDays = Math.floor(diffMs / MS_PER_DAY);
        return `vor ${diffDays}d`;
    };

    const handleClick = () => {
        if (notification.link) {
            // SECURITY: Validate URL to prevent open redirect vulnerabilities
            if (isValidRedirectUrl(notification.link)) {
                // SECURITY: Use React Router instead of window.location.href for safer navigation
                navigate(notification.link);
            } else {
                console.warn('[Security] Blocked potentially unsafe redirect:', notification.link);
            }
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 400, y: -50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 400, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm bg-gradient-to-br ${getGradient()}`}
                    style={{ maxWidth: '400px' }}
                >
                    {/* Progress Bar */}
                    {duration > 0 && (
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                            className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 origin-left"
                        />
                    )}

                    <div
                        className={`p-4 ${notification.link ? 'cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 focus:outline-none rounded-xl' : ''}`}
                        onClick={handleClick}
                    >
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="shrink-0 mt-0.5">
                                {getIcon()}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                                        {notification.title}
                                    </h4>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsVisible(false);
                                            setTimeout(onClose, TIMING.uiNormal);
                                        }}
                                        className="shrink-0 p-2 min-h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors hover:scale-110 active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                                    >
                                        <XMarkIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </button>
                                </div>

                                {notification.message && (
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                                        {getTimeAgo(notification.created_at)}
                                    </span>
                                    {!notification.read && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Toast Container
export const NotificationToastContainer: React.FC = () => {
    const { notifications } = useNotifications();
    const [activeToasts, setActiveToasts] = useState<Set<string>>(new Set());

    // Show only unread notifications as toasts, max 3 at a time
    const recentUnread = notifications
        .filter(n => !n.read)
        .slice(0, 3);

    useEffect(() => {
        // Mark notifications as shown in toasts
        const newToastIds = new Set(recentUnread.map(n => n.id));
        setActiveToasts(newToastIds);
    }, [notifications, recentUnread, setActiveToasts]);

    if (recentUnread.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            {recentUnread.map((notification) => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onClose={() => {
                        setActiveToasts(prev => {
                            const next = new Set(prev);
                            next.delete(notification.id);
                            return next;
                        });
                    }}
                />
            ))}
        </div>
    );
};

export default NotificationToast;
