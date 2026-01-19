// ============================================
// TICKET SUPPORT - Main Container Component
// Orchestrates ticket list, detail view, and creation
// ============================================

import React, { useState, useContext, useEffect } from 'react';
import { ArrowLeftIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

// Internal imports
import { AuthContext, useLanguage } from '../../contexts';
import { api, validateString } from '../../lib';
import { alertCreateFailed, alertError } from '../../lib/dashboardAlerts';
import { TicketCardSkeleton } from '../skeleton';
import { CustomSelect } from '../CustomSelect';

// Type imports
import type {
    Ticket,
    Message,
    TicketMember,
    Service,
    TicketViewMode,
    TicketFilter,
    TicketPriority,
    CreateTicketFormData
} from '../../types/tickets';

// Constants and utilities
import { TICKET_PRIORITIES, DEFAULT_TICKET_PRIORITY, LOADING_SKELETON_COUNT } from '../../lib/constants/tickets';
import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from '../../lib/constants/tickets';

// Sub-components
import { TicketList, TicketChatArea, TicketSidebar } from './tickets';

// ============================================
// CREATE TICKET FORM COMPONENT
// ============================================

interface CreateTicketFormProps {
    onSubmit: (data: CreateTicketFormData) => void;
    loading: boolean;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onSubmit, loading }) => {
    const { t } = useLanguage();
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState<TicketPriority>(DEFAULT_TICKET_PRIORITY);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ subject, priority, message });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Betreff
                </label>
                <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="input-premium py-2"
                    placeholder="Kurze Zusammenfassung"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Priorität
                </label>
                <CustomSelect
                    id="priority"
                    options={TICKET_PRIORITIES}
                    value={priority}
                    onChange={setPriority}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Nachricht
                </label>
                <textarea
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    className="input-premium resize-none"
                    placeholder="Beschreiben Sie Ihr Anliegen so genau wie möglich..."
                />
            </div>

            <div className="pt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="group bg-blue-600 dark:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Erstelle...
                        </>
                    ) : (
                        <>
                            {t('dashboard.tickets.create')}
                            <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

// ============================================
// MAIN TICKET SUPPORT COMPONENT
// ============================================

const TicketSupport: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();

    // State
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [view, setView] = useState<TicketViewMode>('list');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [ticketMessages, setTicketMessages] = useState<Message[]>([]);
    const [ticketMembers, setTicketMembers] = useState<TicketMember[]>([]);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<TicketFilter>('active');

    // Admin: Assign Service State
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');

    const isTeamOrOwner = user?.role === 'team' || user?.role === 'owner';

    // Data fetching
    const fetchTickets = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.getTickets();
            setTickets(data);
        } catch (err) {
            setError('Tickets konnten nicht geladen werden: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (ticketId: string) => {
        try {
            const { data } = await api.getTicketMessages(ticketId);
            setTicketMessages(data);
        } catch (err) {
            // Silent fail - error handling is optional
        }
    };

    const fetchMembers = async (ticketId: string) => {
        try {
            const { data } = await api.getTicketMembers(ticketId);
            setTicketMembers(data || []);
        } catch (err) {
            // Silent fail - error handling is optional
        }
    };

    // Initialize data
    useEffect(() => {
        fetchTickets();
        if (isTeamOrOwner) {
            api.getServices().then(res => {
                if (res.data) {
                    setServices(res.data);
                    if (res.data.length > 0) setSelectedServiceId(res.data[0].id.toString());
                }
            });
        }
    }, [user, isTeamOrOwner]);

    // Event handlers
    const handleViewTicket = (ticketId: string) => {
        setSelectedTicketId(ticketId);
        setTicketMessages([]);
        fetchMessages(ticketId);
        fetchMembers(ticketId);
        setView('detail');
    };

    const handleCreateTicket = async (data: CreateTicketFormData) => {
        if (!user) return;
        setActionLoading(true);
        try {
            await api.createTicket(data.subject, data.priority, data.message);
            await fetchTickets();
            setShowCreateModal(false);
        } catch (err) {
            alertCreateFailed(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddReply = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedTicket = tickets.find(t => t.id === selectedTicketId);
        if (!reply.trim() || !selectedTicket || !user) return;

        const messageValidation = validateString(reply.trim(), {
            minLength: MIN_MESSAGE_LENGTH,
            maxLength: MAX_MESSAGE_LENGTH,
            allowEmpty: false
        });

        if (!messageValidation.isValid) {
            alertError('Invalid message. Please check your input.');
            return;
        }

        setActionLoading(true);
        try {
            await api.replyToTicket(selectedTicket.id, messageValidation.sanitized || reply.trim());
            setReply('');
            await fetchMessages(selectedTicket.id);
            await fetchTickets();
        } catch (err) {
            alertError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setActionLoading(false);
        }
    };

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        if (filter === 'active') {
            return ticket.status !== 'Geschlossen';
        }
        return ticket.status === 'Geschlossen';
    });

    // Loading state
    if (loading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {t('dashboard.tickets.title')}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {isTeamOrOwner
                                ? 'Verwalten Sie eingehende Kundenanfragen.'
                                : 'Hier können Sie Unterstützung anfordern und Anfragen verwalten.'}
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    {Array.from({ length: LOADING_SKELETON_COUNT }).map((_, i) => (
                        <TicketCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Ticket-Support
                </h1>
                <div className="mt-8 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Verbindungsfehler:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                    <button onClick={() => fetchTickets()} className="block mt-2 text-sm font-bold hover:underline">
                        Erneut versuchen
                    </button>
                </div>
            </div>
        );
    }

    // Detail view
    const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;
    if (view === 'detail' && selectedTicket) {
        return (
            <div>
                <button
                    onClick={() => setView('list')}
                    className="group flex items-center gap-2 text-sm font-bold text-slate-900/80 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t('dashboard.tickets.back_to_overview')}
                </button>

                <div className="grid lg:grid-cols-3 gap-6">
                    <TicketChatArea
                        ticket={selectedTicket}
                        messages={ticketMessages}
                        currentUserId={user?.id}
                        reply={reply}
                        onReplyChange={setReply}
                        onSubmitReply={handleAddReply}
                        actionLoading={actionLoading}
                    />

                    <TicketSidebar
                        ticket={selectedTicket}
                        members={ticketMembers}
                        services={services}
                        selectedServiceId={selectedServiceId}
                        onServiceChange={setSelectedServiceId}
                        onMembersUpdate={() => selectedTicketId && fetchMembers(selectedTicketId)}
                        onMessagesUpdate={() => selectedTicketId && fetchMessages(selectedTicketId)}
                        onTicketsUpdate={fetchTickets}
                    />
                </div>
            </div>
        );
    }

    // List view (default)
    return (
        <div>
            <TicketList
                tickets={filteredTickets}
                filter={filter}
                onFilterChange={setFilter}
                onSelectTicket={handleViewTicket}
                onCreateTicket={() => setShowCreateModal(true)}
                createButtonText={t('dashboard.tickets.create')}
            />

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl shadow-blue-500/10 border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                                {t('dashboard.tickets.create')}
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <XMarkIcon className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-5 sm:p-6">
                            <CreateTicketForm onSubmit={handleCreateTicket} loading={actionLoading} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSupport;
