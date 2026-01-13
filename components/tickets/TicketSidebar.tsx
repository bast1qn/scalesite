import React from 'react';

/**
 * TicketSidebar Component
 *
 * Displays comprehensive ticket information in a sidebar layout
 * including project info, related service, status history, and assigned team members
 *
 * @param ticket - Ticket data
 * @param project - Related project information
 * @param service - Related service information
 * @param members - Assigned team members
 * @onAssignMember - Callback to assign a team member
 * @loading - Loading state
 * @className - Additional CSS classes
 */

export interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
    last_update: string;
    user_id: string;
}

export interface Project {
    id: string;
    name: string;
    status: string;
    progress: number;
    industry?: string;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface StatusHistoryEntry {
    id: string;
    status: string;
    changed_at: string;
    changed_by?: string;
}

export interface TicketSidebarProps {
    ticket: Ticket;
    project?: Project | null;
    service?: Service | null;
    members?: TeamMember[];
    statusHistory?: StatusHistoryEntry[];
    onAssignMember?: () => void;
    loading?: boolean;
    className?: string;
}

const TicketSidebar: React.FC<TicketSidebarProps> = ({
    ticket,
    project,
    service,
    members = [],
    statusHistory = [],
    onAssignMember,
    loading = false,
    className = ''
}) => {
    // Format timestamp
    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status color
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Offen':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
            case 'In Bearbeitung':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
            case 'Warten auf Antwort':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
            case 'Geschlossen':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';
        }
    };

    // Get progress bar color
    const getProgressColor = (progress: number): string => {
        if (progress < 25) return 'bg-red-500';
        if (progress < 50) return 'bg-orange-500';
        if (progress < 75) return 'bg-yellow-500';
        if (progress < 100) return 'bg-blue-500';
        return 'bg-green-500';
    };

    if (loading) {
        return (
            <div className={`w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 p-6 ${className}`}>
                <div className="animate-pulse space-y-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className={`w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 overflow-y-auto ${className}`}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                        Ticket-Details
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        #{ticket.id.slice(-6).toUpperCase()}
                    </p>
                </div>

                {/* Ticket Status & Priority */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        Status
                    </h3>
                    <div className="flex flex-col gap-2">
                        <div className={`px-3 py-2 rounded-lg border font-bold text-sm ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>Priorität:</span>
                            <span className="font-semibold">{ticket.priority}</span>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        Datum
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Erstellt:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {formatTimestamp(ticket.created_at)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Letzte Änderung:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {formatTimestamp(ticket.last_update)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Related Project */}
                {project && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Zugehöriges Projekt
                        </h3>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {project.name}
                                    </p>
                                    {project.industry && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {project.industry}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {project.status}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-slate-600 dark:text-slate-400">Fortschritt:</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {project.progress}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getProgressColor(project.progress)} transition-all duration-300`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Service */}
                {service && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Zugehöriger Service
                        </h3>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                                {service.name}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-2">
                                {service.description}
                            </p>
                            <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-black text-blue-900 dark:text-blue-100">
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(service.price)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assigned Team Members */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Team ({members.length})
                        </h3>
                        {onAssignMember && (
                            <button
                                onClick={onAssignMember}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                            >
                                + Hinzufügen
                            </button>
                        )}
                    </div>

                    {members.length > 0 ? (
                        <div className="space-y-2">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                            Keine Teammitglieder zugewiesen
                        </p>
                    )}
                </div>

                {/* Status History */}
                {statusHistory.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Status-Verlauf
                        </h3>
                        <div className="space-y-2">
                            {statusHistory.slice(0, 5).map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(entry.status).split(' ')[0]}`} />
                                    <div className="flex-1 min-w-0">
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {entry.status}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400 ml-1">
                                            {formatTimestamp(entry.changed_at)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketSidebar;
