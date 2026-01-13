import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TeamActivityFeed Component
 *
 * Displays team activity history with filtering and event types
 *
 * @param activities - List of activity events
 * @onRefresh - Callback to refresh activities
 * @isLoading - Loading state
 * @ autoRefresh - Auto-refresh interval in ms
 * @ maxItems - Maximum items to display
 * @ variant - Display variant (default, compact, detailed)
 * @ className - Additional CSS classes
 */

export type ActivityEventType =
    | 'member_invited'
    | 'member_joined'
    | 'member_removed'
    | 'role_changed'
    | 'permission_updated'
    | 'project_created'
    | 'project_updated'
    | 'project_deleted'
    | 'content_generated'
    | 'invoice_sent'
    | 'invoice_paid'
    | 'settings_updated'
    | 'login'
    | 'logout';

export interface ActivityEvent {
    id: string;
    type: ActivityEventType;
    userId: string;
    userName: string;
    userEmail?: string;
    userAvatar?: string;
    targetUserId?: string;
    targetUserName?: string;
    targetType?: 'project' | 'member' | 'invoice' | 'settings';
    targetId?: string;
    targetName?: string;
    description?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

export interface TeamActivityFeedProps {
    activities: ActivityEvent[];
    onRefresh?: () => void;
    isLoading?: boolean;
    autoRefresh?: number;
    maxItems?: number;
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
    showFilters?: boolean;
}

// Event type configurations
const eventTypeConfig: Record<ActivityEventType, {
    label: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    borderColor: string;
    category: 'team' | 'project' | 'billing' | 'system';
}> = {
    member_invited: {
        label: 'Member Invited',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8a3 3 0 013-3h12a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3V8zM12 8v4m0 0h4m-4 0H8" />
            </svg>
        ),
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700',
        category: 'team'
    },
    member_joined: {
        label: 'Member Joined',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        category: 'team'
    },
    member_removed: {
        label: 'Member Removed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM13 7h4m-4 0v4m0-4h4" />
            </svg>
        ),
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-300 dark:border-red-700',
        category: 'team'
    },
    role_changed: {
        label: 'Role Changed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        ),
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        category: 'team'
    },
    permission_updated: {
        label: 'Permission Updated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-700 dark:text-purple-300',
        borderColor: 'border-purple-300 dark:border-purple-700',
        category: 'team'
    },
    project_created: {
        label: 'Project Created',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
        ),
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        category: 'project'
    },
    project_updated: {
        label: 'Project Updated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700',
        category: 'project'
    },
    project_deleted: {
        label: 'Project Deleted',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        ),
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-300 dark:border-red-700',
        category: 'project'
    },
    content_generated: {
        label: 'Content Generated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        category: 'project'
    },
    invoice_sent: {
        label: 'Invoice Sent',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700',
        category: 'billing'
    },
    invoice_paid: {
        label: 'Invoice Paid',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        category: 'billing'
    },
    settings_updated: {
        label: 'Settings Updated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        bgColor: 'bg-gray-50 dark:bg-gray-800',
        textColor: 'text-gray-700 dark:text-gray-300',
        borderColor: 'border-gray-300 dark:border-gray-600',
        category: 'system'
    },
    login: {
        label: 'Login',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
        ),
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        category: 'system'
    },
    logout: {
        label: 'Logout',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        ),
        bgColor: 'bg-gray-50 dark:bg-gray-800',
        textColor: 'text-gray-700 dark:text-gray-300',
        borderColor: 'border-gray-300 dark:border-gray-600',
        category: 'system'
    }
};

// Format relative time
const formatRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

// Get event message
const getEventMessage = (event: ActivityEvent): string => {
    const config = eventTypeConfig[event.type];

    switch (event.type) {
        case 'member_invited':
            return `invited ${event.targetUserName || 'a new member'} to the team`;
        case 'member_joined':
            return `joined the team`;
        case 'member_removed':
            return `removed ${event.targetUserName || 'a member'} from the team`;
        case 'role_changed':
            return `changed ${event.targetUserName || 'member'}'s role to ${event.metadata?.newRole || 'a new role'}`;
        case 'permission_updated':
            return `updated permissions for ${event.targetUserName || 'a member'}`;
        case 'project_created':
            return `created project "${event.targetName || 'Untitled'}"`;
        case 'project_updated':
            return `updated project "${event.targetName || 'Untitled'}"`;
        case 'project_deleted':
            return `deleted project "${event.targetName || 'Untitled'}"`;
        case 'content_generated':
            return `generated AI content for "${event.targetName || 'a project'}"`;
        case 'invoice_sent':
            return `sent invoice #${event.metadata?.invoiceNumber || 'N/A'}`;
        case 'invoice_paid':
            return `paid invoice #${event.metadata?.invoiceNumber || 'N/A'}`;
        case 'settings_updated':
            return `updated ${event.targetName || 'account'} settings`;
        case 'login':
            return `logged in`;
        case 'logout':
            return `logged out`;
        default:
            return `performed an action`;
    }
};

const TeamActivityFeed: React.FC<TeamActivityFeedProps> = ({
    activities,
    onRefresh,
    isLoading = false,
    autoRefresh,
    maxItems,
    variant = 'default',
    className = '',
    showFilters = true
}) => {
    const [filterType, setFilterType] = useState<'all' | ActivityEventType>('all');
    const [filterCategory, setFilterCategory] = useState<'all' | 'team' | 'project' | 'billing' | 'system'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-refresh setup
    React.useEffect(() => {
        if (autoRefresh && onRefresh) {
            const interval = setInterval(onRefresh, autoRefresh);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, onRefresh]);

    // Filter activities
    const filteredActivities = useMemo(() => {
        let filtered = [...activities];

        // Type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(a => a.type === filterType);
        }

        // Category filter
        if (filterCategory !== 'all') {
            filtered = filtered.filter(a => eventTypeConfig[a.type].category === filterCategory);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.userName.toLowerCase().includes(query) ||
                a.userEmail?.toLowerCase().includes(query) ||
                a.targetName?.toLowerCase().includes(query) ||
                a.description?.toLowerCase().includes(query)
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Limit items
        if (maxItems) {
            filtered = filtered.slice(0, maxItems);
        }

        return filtered;
    }, [activities, filterType, filterCategory, searchQuery, maxItems]);

    // Activity statistics
    const stats = useMemo(() => {
        const byType = activities.reduce((acc, a) => {
            acc[a.type] = (acc[a.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const byCategory = activities.reduce((acc, a) => {
            const cat = eventTypeConfig[a.type].category;
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { byType, byCategory, total: activities.length };
    }, [activities]);

    // Render compact variant
    if (variant === 'compact') {
        return (
            <div className={`space-y-3 ${className}`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Recent Activity
                    </h3>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Refresh"
                        >
                            <svg className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    {filteredActivities.slice(0, 5).map((activity) => {
                        const config = eventTypeConfig[activity.type];

                        return (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <div className={`flex-shrink-0 p-1.5 rounded ${config.bgColor} ${config.textColor}`}>
                                    {config.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        <span className="font-medium">{activity.userName}</span>{' '}
                                        <span className="text-gray-600 dark:text-gray-400">{getEventMessage(activity)}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                        {formatRelativeTime(activity.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredActivities.length === 0 && (
                    <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                        No recent activity
                    </div>
                )}
            </div>
        );
    }

    // Default and detailed variants
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Team Activity
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {stats.total} events recorded
                    </p>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                )}
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search activities..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value as any)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="team">Team</option>
                                <option value="project">Projects</option>
                                <option value="billing">Billing</option>
                                <option value="system">System</option>
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Events</option>
                                {Object.entries(eventTypeConfig).map(([type, config]) => (
                                    <option key={type} value={type}>{config.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistics (detailed variant) */}
            {variant === 'detailed' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {stats.total}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Total Events
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.byCategory.team || 0}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Team Events
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.byCategory.project || 0}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Project Events
                        </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-4">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {stats.byCategory.billing || 0}
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                            Billing Events
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Feed */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <svg className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400">Loading activities...</p>
                    </div>
                </div>
            ) : filteredActivities.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No activity found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchQuery || filterType !== 'all' || filterCategory !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Activity will appear here as your team uses the platform'
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredActivities.map((activity, index) => {
                            const config = eventTypeConfig[activity.type];

                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 p-2 rounded-lg ${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
                                            {config.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        <span className="font-semibold">{activity.userName}</span>{' '}
                                                        <span className="text-gray-600 dark:text-gray-400">{getEventMessage(activity)}</span>
                                                    </p>
                                                    {activity.description && variant === 'detailed' && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {activity.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                                                    {formatRelativeTime(activity.createdAt)}
                                                </span>
                                            </div>

                                            {/* Metadata (detailed variant) */}
                                            {variant === 'detailed' && activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                                                        <span
                                                            key={key}
                                                            className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400"
                                                        >
                                                            <span className="font-medium">{key}:</span>{' '}
                                                            <span className="ml-1">{String(value)}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Load More */}
            {maxItems && filteredActivities.length >= maxItems && activities.length > maxItems && (
                <div className="text-center">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Load More Activities
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeamActivityFeed;
