import React, { useState } from 'react';

/**
 * TicketAssignment Component
 *
 * Team member selection with auto-assignment rules and notification system
 *
 * @param ticketId - ID of the ticket to assign
 * @param currentAssignee - Currently assigned team member
 * @param teamMembers - Available team members
 * @param onAssign - Callback when a member is assigned
 * @onAutoAssign - Callback for auto-assignment
 * @loading - Loading state
 * @disabled - Disable assignment
 * @className - Additional CSS classes
 */

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
    currentTickets?: number;
    expertise?: string[];
    available?: boolean;
}

export interface AssignmentRule {
    id: string;
    name: string;
    description: string;
    condition: 'priority' | 'category' | 'workload' | 'round_robin';
    value?: string;
}

export interface TicketAssignmentProps {
    ticketId: string;
    currentAssignee?: TeamMember | null;
    teamMembers: TeamMember[];
    onAssign: (memberId: string, notify: boolean) => void | Promise<void>;
    onAutoAssign?: (rule: AssignmentRule) => void | Promise<void>;
    assignmentRules?: AssignmentRule[];
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

const DEFAULT_ASSIGNMENT_RULES: AssignmentRule[] = [
    {
        id: 'workload-lowest',
        name: 'Geringste Auslastung',
        description: 'Weist das Ticket dem Teammitglied mit den wenigsten offenen Tickets zu',
        condition: 'workload'
    },
    {
        id: 'priority-critical',
        name: 'Kritische Priorität',
        description: 'Weist kritische Tickets automatisch erfahrenen Teammitgliedern zu',
        condition: 'priority',
        value: 'Kritisch'
    },
    {
        id: 'expertise-match',
        name: 'Expertise-Matching',
        description: 'Berücksichtigt Fachkenntnisse bei der Zuweisung',
        condition: 'category'
    },
    {
        id: 'round-robin',
        name: 'Reihum-Verteilung',
        description: 'Verteilt Tickets gleichmäßig im Team',
        condition: 'round_robin'
    }
];

const TicketAssignment: React.FC<TicketAssignmentProps> = ({
    ticketId,
    currentAssignee,
    teamMembers,
    onAssign,
    onAutoAssign,
    assignmentRules = DEFAULT_ASSIGNMENT_RULES,
    loading = false,
    disabled = false,
    className = ''
}) => {
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showAutoAssign, setShowAutoAssign] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [sendNotification, setSendNotification] = useState(true);
    const [filterRole, setFilterRole] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and sort team members
    const filteredMembers = useMemo(() => {
        return teamMembers
            .filter(member => {
                const matchesRole = filterRole === 'all' || member.role === filterRole;
                const matchesSearch = searchQuery === '' ||
                    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.email.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesRole && matchesSearch;
            })
            .sort((a, b) => {
                // Sort by availability first
                if (a.available && !b.available) return -1;
                if (!a.available && b.available) return 1;
                // Then by workload
                const workloadA = a.currentTickets || 0;
                const workloadB = b.currentTickets || 0;
                return workloadA - workloadB;
            });
    }, [teamMembers, filterRole, searchQuery]);

    // Get unique roles
    const roles = useMemo(() => {
        const roleSet = new Set(teamMembers.map(m => m.role));
        return ['all', ...Array.from(roleSet)];
    }, [teamMembers]);

    // Get suggested member based on workload
    const suggestedMember = useMemo(() => {
        if (!currentAssignee) {
            return teamMembers
                .filter(m => m.available !== false)
                .sort((a, b) => (a.currentTickets || 0) - (b.currentTickets || 0))[0];
        }
        return null;
    }, [teamMembers, currentAssignee]);

    // Handle assignment
    const handleAssign = async () => {
        if (selectedMember && onAssign) {
            await onAssign(selectedMember, sendNotification);
            setShowAssignModal(false);
            setSelectedMember(null);
            setSendNotification(true);
        }
    };

    // Handle auto-assignment
    const handleAutoAssign = async (rule: AssignmentRule) => {
        if (onAutoAssign) {
            await onAutoAssign(rule);
            setShowAutoAssign(false);
        }
    };

    // Get workload color
    const getWorkloadColor = (ticketCount: number): string => {
        if (ticketCount < 3) return 'text-green-600 dark:text-green-400';
        if (ticketCount < 7) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    // Get workload background
    const getWorkloadBackground = (ticketCount: number): string => {
        if (ticketCount < 3) return 'bg-green-100 dark:bg-green-900/30';
        if (ticketCount < 7) return 'bg-yellow-100 dark:bg-yellow-900/30';
        return 'bg-red-100 dark:bg-red-900/30';
    };

    if (loading) {
        return (
            <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
            {/* Current Assignment */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Ticket-Zuweisung
                    </h3>
                    <div className="flex gap-2">
                        {/* Auto-Assign Button */}
                        {onAutoAssign && (
                            <button
                                onClick={() => setShowAutoAssign(true)}
                                disabled={disabled}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Auto-Zuweisen
                            </button>
                        )}

                        {/* Assign Button */}
                        <button
                            onClick={() => setShowAssignModal(true)}
                            disabled={disabled}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
                        >
                            {currentAssignee ? 'Ändern' : 'Zuweisen'}
                        </button>
                    </div>
                </div>

                {/* Current Assignee */}
                {currentAssignee ? (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-black flex-shrink-0">
                            {currentAssignee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-blue-900 dark:text-blue-100">
                                {currentAssignee.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                                    {currentAssignee.role}
                                </span>
                                <span className="text-xs text-blue-600 dark:text-blue-400">
                                    • {currentAssignee.email}
                                </span>
                            </div>
                        </div>
                        {currentAssignee.currentTickets !== undefined && (
                            <div className={`px-3 py-1.5 rounded-lg ${getWorkloadBackground(currentAssignee.currentTickets)}`}>
                                <p className={`text-sm font-black ${getWorkloadColor(currentAssignee.currentTickets)}`}>
                                    {currentAssignee.currentTickets} Tickets
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                            Nicht zugewiesen
                        </p>
                    </div>
                )}

                {/* Suggestion */}
                {suggestedMember && !currentAssignee && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-800 dark:text-green-200 font-semibold">
                                Empfohlen: {suggestedMember.name} ({suggestedMember.currentTickets || 0} Tickets)
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Available Team Members */}
            <div className="p-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Verfügbare Teammitglieder ({teamMembers.length})
                </h4>
                <div className="space-y-2">
                    {teamMembers.slice(0, 3).map((member) => (
                        <div
                            key={member.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                currentAssignee?.id === member.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                {member.available === false && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                )}
                                {member.available === true && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {member.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {member.role}
                                </p>
                            </div>
                            {member.currentTickets !== undefined && (
                                <div className="text-right">
                                    <p className={`text-sm font-black ${getWorkloadColor(member.currentTickets)}`}>
                                        {member.currentTickets}
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                        offen
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Ticket zuweisen
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Wählen Sie ein Teammitglied für dieses Ticket
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Teammitglied suchen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Role Filter */}
                            <div className="flex flex-wrap gap-2">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setFilterRole(role)}
                                        className={`
                                            px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200
                                            ${filterRole === role
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }
                                        `}
                                    >
                                        {role === 'all' ? 'Alle Rollen' : role}
                                    </button>
                                ))}
                            </div>

                            {/* Member List */}
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <button
                                            key={member.id}
                                            onClick={() => setSelectedMember(member.id)}
                                            disabled={member.available === false}
                                            className={`
                                                w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                                                ${selectedMember === member.id
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }
                                                ${member.available === false ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                            `}
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                    {member.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {member.role}
                                                    </p>
                                                    {member.currentTickets !== undefined && (
                                                        <span className={`text-xs font-bold ${getWorkloadColor(member.currentTickets)}`}>
                                                            ({member.currentTickets})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {selectedMember === member.id && (
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Keine Teammitglieder gefunden
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Notification Toggle */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Benachrichtigung senden
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Teammitglied per E-Mail benachrichtigen
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSendNotification(!sendNotification)}
                                    className={`
                                        relative w-12 h-6 rounded-full transition-colors duration-200
                                        ${sendNotification ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}
                                    `}
                                >
                                    <span
                                        className={`
                                            absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200
                                            ${sendNotification ? 'left-7' : 'left-1'}
                                        `}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedMember(null);
                                }}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedMember}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                            >
                                Zuweisen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Auto-Assign Modal */}
            {showAutoAssign && onAutoAssign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Automatische Zuweisung
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Wählen Sie eine Regel für die automatische Ticket-Zuweisung
                            </p>
                        </div>

                        <div className="p-6 space-y-3">
                            {assignmentRules.map((rule) => (
                                <button
                                    key={rule.id}
                                    onClick={() => handleAutoAssign(rule)}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 transition-all text-left group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                                                {rule.name}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {rule.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setShowAutoAssign(false)}
                                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors"
                            >
                                Abbrechen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketAssignment;
