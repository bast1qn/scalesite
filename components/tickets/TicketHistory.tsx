import React from 'react';
import { BorderSpinner } from '../ui';

/**
 * TicketHistory Component
 *
 * Timeline view of ticket status changes, comments, and attachments
 *
 * @param events - History events to display
 * @loading - Loading state
 * @error - Error message
 * @className - Additional CSS classes
 */

export type EventType = 'status_change' | 'comment' | 'attachment' | 'assignment' | 'priority_change' | 'system';

export interface HistoryEvent {
    id: string;
    type: EventType;
    timestamp: string;
    author?: {
        name: string;
        role?: string;
    };
    data: {
        title: string;
        description?: string;
        fromValue?: string;
        toValue?: string;
        attachments?: Array<{
            name: string;
            url: string;
            size?: number;
        }>;
    };
}

export interface TicketHistoryProps {
    events: HistoryEvent[];
    loading?: boolean;
    error?: string | null;
    className?: string;
}

const TicketHistory: React.FC<TicketHistoryProps> = ({
    events,
    loading = false,
    error = null,
    className = ''
}) => {
    // Format timestamp
    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'gerade eben';
        if (diffMins < 60) return `vor ${diffMins} Min.`;
        if (diffHours < 24) return `vor ${diffHours} Std.`;
        if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: date.getFullYear() !== now.getFullYear() ? '2-digit' : undefined
        });
    };

    // Get event icon
    const getEventIcon = (type: EventType): React.ReactNode => {
        const iconClass = "w-5 h-5";

        switch (type) {
            case 'status_change':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'comment':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                );
            case 'attachment':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                );
            case 'assignment':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'priority_change':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                );
            case 'system':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Get event color classes
    const getEventColorClasses = (type: EventType): string => {
        switch (type) {
            case 'status_change':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700';
            case 'comment':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700';
            case 'attachment':
                return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700';
            case 'assignment':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700';
            case 'priority_change':
                return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
            case 'system':
                return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`p-6 ${className}`}>
                <div className="flex flex-col items-center justify-center py-12">
                    <BorderSpinner size="md" color="blue" className="mb-4" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Lade Historie...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`p-6 ${className}`}>
                <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
                    <p className="font-bold">Fehler</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (events.length === 0) {
        return (
            <div className={`p-6 ${className}`}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-600 dark:text-slate-400 font-semibold mb-1">Keine Aktivitäten</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">Noch keine Historie verfügbar</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-6 ${className}`}>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Aktivitäts-Verlauf
            </h3>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

                {/* Events */}
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={event.id} className="relative flex gap-4">
                            {/* Icon */}
                            <div className={`
                                relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
                                ${getEventColorClasses(event.type)}
                            `}>
                                {getEventIcon(event.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pb-2">
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                                    {/* Title */}
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {event.data.title}
                                            </p>
                                            {event.author && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {event.author.name}
                                                    {event.author.role && (
                                                        <span className="ml-1.5 text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                                            {event.author.role}
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <time className="flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            {formatTimestamp(event.timestamp)}
                                        </time>
                                    </div>

                                    {/* Description */}
                                    {event.data.description && (
                                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-wrap">
                                            {event.data.description}
                                        </p>
                                    )}

                                    {/* Value Change (e.g., status or priority) */}
                                    {event.data.fromValue && event.data.toValue && (
                                        <div className="mt-3 flex items-center gap-2 text-sm">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium">
                                                {event.data.fromValue}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-bold">
                                                {event.data.toValue}
                                            </span>
                                        </div>
                                    )}

                                    {/* Attachments */}
                                    {event.data.attachments && event.data.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                                Anhänge
                                            </p>
                                            <div className="space-y-1.5">
                                                {event.data.attachments.map((attachment, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={attachment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                                    >
                                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">
                                                            {attachment.name}
                                                        </span>
                                                        {attachment.size && (
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {(attachment.size / 1024).toFixed(1)} KB
                                                            </span>
                                                        )}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicketHistory;
