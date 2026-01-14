
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { CustomSelect, PlusCircleIcon, ArrowLeftIcon, PaperAirplaneIcon, TicketIcon, UserCircleIcon, XMarkIcon, CheckBadgeIcon, EnvelopeIcon, BuildingStorefrontIcon, BriefcaseIcon, UserPlusIcon } from '../index';
import { AuthContext, useLanguage } from '../../contexts';
import { api, getSafeURL } from '../../lib';
import { alertCreateFailed, alertError, alertUserNotAdded, alertAssigned, alertAssignFailed } from '../../lib/dashboardAlerts';
import { useChatScroll } from '../../lib/hooks';
import { TicketCardSkeleton } from '../skeleton';
import { formatTimeAgo } from '../../lib/utils/dateFormat';

// --- TYPE DEFINITIONS ---
interface Profile {
    name: string;
    role: 'team' | 'user' | 'owner';
    company?: string;
    email?: string;
}

interface Message {
    id: string;
    user_id: string;
    text: string;
    created_at: string;
    profiles: Profile | null;
}

interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    status: 'Offen' | 'In Bearbeitung' | 'Geschlossen';
    priority: 'Niedrig' | 'Mittel' | 'Hoch';
    created_at: string;
    last_update: string;
    assigned_to: string | null;
    profiles: Profile | null;
    assignee: Profile | null;
}

interface Service {
    id: number | string;
    name: string;
    price: number;
    sale_price?: number;
}

interface TicketMember {
    id: string;
    name: string;
    email: string;
    role: string;
    added_at: string;
}

// --- HELPER FUNCTIONS ---
const priorityOptions = [ { value: 'Niedrig', label: 'Niedrig' }, { value: 'Mittel', label: 'Mittel' }, { value: 'Hoch', label: 'Hoch' }];

/**
 * Returns Tailwind CSS classes for ticket status badges
 * @param status - The ticket status
 * @returns CSS class string for status styling
 */
const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
        case 'Offen': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
        case 'In Bearbeitung': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
        case 'Geschlossen': return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
};

// --- MAIN COMPONENT ---
const TicketSupport = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [ticketMessages, setTicketMessages] = useState<Message[]>([]);
    const [ticketMembers, setTicketMembers] = useState<TicketMember[]>([]);
    const [reply, setReply] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { messagesEndRef, handleScroll, forceScroll } = useChatScroll(
        chatContainerRef,
        ticketMessages,
        view === 'detail'
    );

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'active' | 'closed'>('active');

    // Member Invite State
    const [showInviteInput, setShowInviteInput] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);

    // Admin: Assign Service State
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [assignLoading, setAssignLoading] = useState(false);

    const isTeamOrOwner = user?.role === 'team' || user?.role === 'owner';

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

    useEffect(() => {
        fetchTickets();
        if (isTeamOrOwner) {
            api.getServices().then(res => {
                if(res.data) {
                    setServices(res.data);
                    if(res.data.length > 0) setSelectedServiceId(res.data[0].id.toString());
                }
            });
        }
    }, [user]);

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

    const selectedTicket = useMemo(() => {
        return tickets.find(t => t.id === selectedTicketId) || null;
    }, [tickets, selectedTicketId]);

    const handleViewTicket = (ticketId: string) => {
        setSelectedTicketId(ticketId);
        setTicketMessages([]);
        forceScroll();
        fetchMessages(ticketId);
        fetchMembers(ticketId);
        setView('detail');
        setShowInviteInput(false);
        setInviteEmail('');
    };

    const handleCreateTicket = async (subject: string, priority: 'Niedrig'|'Mittel'|'Hoch', message: string) => {
        if (!user) return;
        setActionLoading(true);
        try {
            await api.createTicket(subject, priority, message);
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
        if (!reply.trim() || !selectedTicket || !user) return;

        setActionLoading(true);
        try {
            await api.replyToTicket(selectedTicket.id, reply);
            setReply('');
            forceScroll();
            await fetchMessages(selectedTicket.id);
            await fetchTickets();
        } catch (err) {
            alertError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail || !selectedTicketId) return;
        setInviteLoading(true);
        try {
            await api.inviteToTicket(selectedTicketId, inviteEmail);
            setInviteEmail('');
            setShowInviteInput(false);
            await fetchMembers(selectedTicketId);
            await fetchMessages(selectedTicketId); // Fetch messages again to see system message immediately
        } catch (e) {
            alertError(e instanceof Error ? e.message : "Nutzer konnte nicht hinzugefügt werden.");
        } finally {
            setInviteLoading(false);
        }
    };

    const handleAssignService = async () => {
        if (!selectedTicketId || !selectedServiceId) return;
        const serviceIdNum = parseInt(selectedServiceId);
        if (isNaN(serviceIdNum)) return;
        setAssignLoading(true);
        try {
            // Use correct payload structure. parseInt is only for legacy DB services.
            // If ID is string (automation services), API handles it.
            await api.adminAssignServiceToTicket(selectedTicketId, serviceIdNum);
            alertAssigned();
            await fetchMessages(selectedTicketId);
            await fetchTickets(); // Update status in list
        } catch (e) {
            alertAssignFailed(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setAssignLoading(false);
        }
    };

    const filteredTickets = useMemo(() => {
        if (filter === 'active') {
            return tickets.filter(t => t.status !== 'Geschlossen');
        }
        return tickets.filter(t => t.status === 'Geschlossen');
    }, [tickets, filter]);

    if (loading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('dashboard.tickets.title')}</h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {isTeamOrOwner ? 'Verwalten Sie eingehende Kundenanfragen.' : 'Hier können Sie Unterstützung anfordern und Anfragen verwalten.'}
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TicketCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }
    
    if (error) {
        return (
           <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Ticket-Support</h1>
                <div className="mt-8 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                   <strong className="font-bold">Verbindungsfehler:</strong>
                   <span className="block sm:inline ml-2">{error}</span>
                   <button onClick={() => fetchTickets()} className="block mt-2 text-sm font-bold hover:underline">Erneut versuchen</button>
               </div>
           </div>
       );
   }

   // DETAIL VIEW
    if (view === 'detail' && selectedTicket) {
        return (
            <div>
                <button onClick={() => setView('list')} className="group flex items-center gap-2 text-sm font-bold text-slate-900/80 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 mb-4">
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t('dashboard.tickets.back_to_overview')}
                </button>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* CHAT AREA */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col h-[600px]">
                        <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                             <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white break-words">{selectedTicket.subject}</h1>
                             <div className="flex items-center gap-2 mt-2">
                                 <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
                                 <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">#{selectedTicket.id.slice(0,8)}</span>
                             </div>
                        </div>

                        <div
                            ref={chatContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4"
                        >
                            {ticketMessages.map((msg) => {
                                const isUser = msg.user_id === user?.id;
                                const isSupport = msg.profiles && (msg.profiles.role === 'team' || msg.profiles.role === 'owner');
                                const authorName = isSupport ? `Support (${msg.profiles?.name || 'Team'})` : (isUser ? 'Sie' : (msg.profiles?.name || 'Unbekannt'));

                                // Special styling for "System Messages"
                                const isSystemMessage = msg.text.includes("SYSTEM:") || msg.text.includes("AUTOMATISCHE DIENSTANFRAGE");

                                return (
                                    <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${isUser ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                            {isSupport ? <TicketIcon className="w-4 h-4 text-white" /> : <UserCircleIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />}
                                        </div>
                                        <div className={`p-4 max-w-lg rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm ${
                                            isUser
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : isSystemMessage
                                                ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-slate-900 dark:text-white rounded-tl-none font-mono text-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'
                                        }`}>
                                            <p>{msg.text.replace('SYSTEM:', '').trim()}</p>
                                            <p className={`text-[10px] mt-2 opacity-70 text-right font-medium`}>{authorName}, {formatTimeAgo(msg.created_at)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {ticketMessages.length === 0 && <p className="text-center text-slate-500 font-medium">Keine Nachrichten.</p>}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleAddReply} className={`mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 ${selectedTicket.status === 'Geschlossen' && user?.role === 'user' ? 'hidden' : ''}`}>
                            <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Ihre Antwort..." rows={2} className="flex-1 block w-full px-4 py-3 text-sm rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></textarea>
                            <button type="submit" className="group p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-500 disabled:cursor-not-allowed self-end shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]" disabled={!reply.trim() || actionLoading}>
                                <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* SIDEBAR INFO */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Participants Section */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <UserCircleIcon className="w-4 h-4 text-blue-500" />
                                    Teilnehmer
                                </h3>
                                <button
                                    onClick={() => setShowInviteInput(!showInviteInput)}
                                    className="group text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    title="Nutzer hinzufügen"
                                >
                                    <UserPlusIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {showInviteInput && (
                                <form onSubmit={handleInviteMember} className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">E-Mail Adresse</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            required
                                            value={inviteEmail}
                                            onChange={e => setInviteEmail(e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="kollege@firma.de"
                                        />
                                        <button type="submit" disabled={inviteLoading} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                            {inviteLoading ? '...' : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {/* Creator always shown */}
                                {selectedTicket.profiles && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-200 dark:border-blue-800">
                                            {selectedTicket.profiles.name ? selectedTicket.profiles.name.charAt(0) : '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedTicket.profiles.name || 'Gelöschter Nutzer'}</p>
                                            <p className="text-[10px] text-slate-500 truncate font-medium">Ersteller</p>
                                        </div>
                                    </div>
                                )}
                                {/* Added Members */}
                                {ticketMembers.map(member => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-slate-600">
                                            {member.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{member.name || 'Unbekannt'}</p>
                                            <p className="text-[10px] text-slate-500 truncate font-medium">{member.email || ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isTeamOrOwner && selectedTicket.profiles && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-200 dark:border-blue-800/30">
                                <h3 className="font-black mb-4 text-blue-900 dark:text-blue-200 flex items-center gap-2">
                                    <BuildingStorefrontIcon className="w-5 h-5" />
                                    Kunden-Info
                                </h3>
                                <div className="space-y-3 text-sm">
                                    {selectedTicket.profiles.company && (
                                        <div>
                                            <span className="block text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wide font-bold">Firma</span>
                                            <span className="text-slate-900 dark:text-white font-semibold">
                                                {selectedTicket.profiles.company}
                                            </span>
                                        </div>
                                    )}
                                    {selectedTicket.profiles.email && (
                                        <div>
                                             <span className="block text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wide font-bold">E-Mail</span>
                                             {/* SECURITY: getSafeURL prevents javascript: and mailto injection (OWASP A03:2021) */}
                                             <a href={getSafeURL(`mailto:${selectedTicket.profiles.email}`)} className="text-blue-600 hover:underline flex items-center gap-2 break-all font-medium transition-colors">
                                                 <EnvelopeIcon className="w-3 h-3"/> {selectedTicket.profiles.email}
                                             </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ADMIN ACTIONS: Assign Service */}
                        {isTeamOrOwner && (
                            <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-200 dark:border-green-800/30">
                                <h3 className="font-black mb-4 text-green-900 dark:text-green-200 flex items-center gap-2">
                                    <BriefcaseIcon className="w-5 h-5" />
                                    Dienstleistung buchen
                                </h3>
                                <div className="space-y-3">
                                    <select
                                        value={selectedServiceId}
                                        onChange={(e) => setSelectedServiceId(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-green-300 dark:border-green-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-green-500 transition-all"
                                    >
                                        <option value="" disabled>Dienstleistung wählen</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.sale_price && s.sale_price < s.price ? s.sale_price : s.price}€)
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAssignService}
                                        disabled={assignLoading || !selectedServiceId}
                                        className="group w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-md active:scale-[0.98]"
                                    >
                                        {assignLoading ? (
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                <CheckBadgeIcon className="w-4 h-4 group-hover:scale-[1.02] transition-transform" />
                                                Kostenpflichtig buchen
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                            <h3 className="font-black mb-4 text-slate-900 dark:text-white">Details</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between"><dt className="text-slate-900/70 dark:text-white/70 font-medium">Status</dt><dd className="font-bold text-slate-900 dark:text-white">{selectedTicket.status}</dd></div>
                                <div className="flex justify-between"><dt className="text-slate-900/70 dark:text-white/70 font-medium">Priorität</dt><dd className="font-bold text-slate-900 dark:text-white">{selectedTicket.priority}</dd></div>
                                <div className="flex justify-between"><dt className="text-slate-900/70 dark:text-white/70 font-medium">Erstellt am</dt><dd className="text-slate-900/90 dark:text-white/90 font-medium">{!isNaN(new Date(selectedTicket.created_at).getTime()) ? new Date(selectedTicket.created_at).toLocaleDateString() : '-'}</dd></div>
                                <div className="flex justify-between"><dt className="text-slate-900/70 dark:text-white/70 font-medium">Letztes Update</dt><dd className="text-slate-900/90 dark:text-white/90 font-medium">{formatTimeAgo(selectedTicket.last_update)}</dd></div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIST VIEW
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('dashboard.tickets.title')}</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {isTeamOrOwner ? 'Verwalten Sie eingehende Kundenanfragen.' : 'Hier können Sie Unterstützung anfordern und Anfragen verwalten.'}
                    </p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="group bg-blue-600 dark:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
                    <PlusCircleIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:inline">{t('dashboard.tickets.create')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                 <div className="flex border-b border-slate-200 dark:border-slate-700/50">
                    <button
                        onClick={() => setFilter('active')}
                        className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 ${filter === 'active' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        Offene Anfragen
                    </button>
                    <button
                        onClick={() => setFilter('closed')}
                        className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 ${filter === 'closed' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        Archiv (Geschlossen)
                    </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
                        <div key={ticket.id} onClick={() => handleViewTicket(ticket.id)} className="group p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-all duration-200">
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate flex items-center gap-2">
                                        {ticket.subject}
                                        {ticket.profiles?.name && (
                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md flex-shrink-0">
                                                {ticket.profiles.name}
                                            </span>
                                        )}
                                    </h3>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0 ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                                <div className="flex items-center gap-3">
                                     <span className="font-medium">#{ticket.id.slice(0,8)}</span>
                                     <span>•</span>
                                     <span>{formatTimeAgo(ticket.last_update)}</span>
                                </div>
                                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-transform duration-200 group-hover:scale-125 ${ticket.priority === 'Hoch' ? 'bg-blue-600 border-blue-600' : ticket.priority === 'Mittel' ? 'bg-yellow-500 border-yellow-500' : 'bg-slate-400 border-slate-400'}`} title={`Priorität: ${ticket.priority}`}></div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
                            <TicketIcon className="w-12 h-12 opacity-20 mb-4" />
                            <p className="font-medium">Keine Tickets in dieser Ansicht.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl shadow-blue-500/10 border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t('dashboard.tickets.create')}</h3>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
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

const CreateTicketForm = ({ onSubmit, loading }: { onSubmit: (subject: string, priority: 'Niedrig'|'Mittel'|'Hoch', message: string) => void; loading: boolean }) => {
    const { t } = useLanguage();
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState('Niedrig');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(subject, priority as 'Niedrig' | 'Mittel' | 'Hoch', message);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">Betreff</label>
                <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="input-premium py-2" placeholder="Kurze Zusammenfassung" />
            </div>
             <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">Priorität</label>
                <CustomSelect
                    id="priority"
                    options={priorityOptions}
                    value={priority}
                    onChange={setPriority}
                />
            </div>
             <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">Nachricht</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} className="input-premium resize-none" placeholder="Beschreiben Sie Ihr Anliegen so genau wie möglich..." />
            </div>
            <div className="pt-2 flex justify-end">
                <button type="submit" disabled={loading} className="group bg-blue-600 dark:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
    )
}

export default TicketSupport;
