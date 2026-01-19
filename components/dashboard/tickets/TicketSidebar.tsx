// ============================================
// TICKET SIDEBAR COMPONENT
// Displays ticket details, participants, and admin actions
// ============================================

import React, { useState } from 'react';
import {
    UserCircleIcon,
    UserPlusIcon,
    EnvelopeIcon,
    BuildingStorefrontIcon,
    BriefcaseIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import type { Ticket, Service, TicketMember } from '../../../types/tickets';
import { formatTimeAgo } from '../../../lib/date-utils';
import { getSafeURL, validateEmail } from '../../../lib';
import { alertError, alertAssigned, alertAssignFailed } from '../../../lib/dashboardAlerts';
import { api } from '../../../lib/api';

interface TicketSidebarProps {
    ticket: Ticket;
    members: TicketMember[];
    services: Service[];
    selectedServiceId: string;
    onServiceChange: (serviceId: string) => void;
    onMembersUpdate: () => void;
    onMessagesUpdate: () => void;
    onTicketsUpdate: () => void;
}

export const TicketSidebar: React.FC<TicketSidebarProps> = ({
    ticket,
    members,
    services,
    selectedServiceId,
    onServiceChange,
    onMembersUpdate,
    onMessagesUpdate,
    onTicketsUpdate
}) => {
    const [showInviteInput, setShowInviteInput] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);

    const isTeamOrOwner = ticket.profiles?.role === 'team' || ticket.profiles?.role === 'owner';

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail || !ticket.id) return;

        const emailValidation = validateEmail(inviteEmail.trim());
        if (!emailValidation.isValid) {
            alertError('Invalid email format');
            return;
        }

        setInviteLoading(true);
        try {
            await api.inviteToTicket(ticket.id, emailValidation.sanitized || inviteEmail.trim());
            setInviteEmail('');
            setShowInviteInput(false);
            onMembersUpdate();
            onMessagesUpdate();
        } catch (e) {
            alertError(e instanceof Error ? e.message : "Nutzer konnte nicht hinzugefügt werden.");
        } finally {
            setInviteLoading(false);
        }
    };

    const handleAssignService = async () => {
        if (!ticket.id || !selectedServiceId) return;
        const serviceIdNum = parseInt(selectedServiceId);
        if (isNaN(serviceIdNum)) return;
        setAssignLoading(true);
        try {
            await api.adminAssignServiceToTicket(ticket.id, serviceIdNum);
            alertAssigned();
            onMessagesUpdate();
            onTicketsUpdate();
        } catch (e) {
            alertAssignFailed(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setAssignLoading(false);
        }
    };

    return (
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
                            <button
                                type="submit"
                                disabled={inviteLoading}
                                className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {inviteLoading ? '...' : 'Add'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="space-y-3">
                    {/* Creator always shown */}
                    {ticket.profiles && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-200 dark:border-blue-800">
                                {ticket.profiles.name ? ticket.profiles.name.charAt(0) : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {ticket.profiles.name || 'Gelöschter Nutzer'}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate font-medium">Ersteller</p>
                            </div>
                        </div>
                    )}
                    {/* Added Members */}
                    {members.map(member => (
                        <div key={member.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-slate-600">
                                {member.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {member.name || 'Unbekannt'}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate font-medium">
                                    {member.email || ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Customer Info (Admin Only) */}
            {isTeamOrOwner && ticket.profiles && (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-200 dark:border-blue-800/30">
                    <h3 className="font-black mb-4 text-blue-900 dark:text-blue-200 flex items-center gap-2">
                        <BuildingStorefrontIcon className="w-5 h-5" />
                        Kunden-Info
                    </h3>
                    <div className="space-y-3 text-sm">
                        {ticket.profiles.company && (
                            <div>
                                <span className="block text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wide font-bold">
                                    Firma
                                </span>
                                <span className="text-slate-900 dark:text-white font-semibold">
                                    {ticket.profiles.company}
                                </span>
                            </div>
                        )}
                        {ticket.profiles.email && (
                            <div>
                                <span className="block text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wide font-bold">
                                    E-Mail
                                </span>
                                <a
                                    href={getSafeURL(`mailto:${ticket.profiles.email}`)}
                                    className="text-blue-600 hover:underline flex items-center gap-2 break-all font-medium transition-colors"
                                >
                                    <EnvelopeIcon className="w-3 h-3" />
                                    {ticket.profiles.email}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Admin Actions: Assign Service */}
            {isTeamOrOwner && (
                <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-200 dark:border-green-800/30">
                    <h3 className="font-black mb-4 text-green-900 dark:text-green-200 flex items-center gap-2">
                        <BriefcaseIcon className="w-5 h-5" />
                        Dienstleistung buchen
                    </h3>
                    <div className="space-y-3">
                        <select
                            value={selectedServiceId}
                            onChange={(e) => onServiceChange(e.target.value)}
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
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

            {/* Ticket Details */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="font-black mb-4 text-slate-900 dark:text-white">Details</h3>
                <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-slate-900/70 dark:text-white/70 font-medium">Status</dt>
                        <dd className="font-bold text-slate-900 dark:text-white">{ticket.status}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-slate-900/70 dark:text-white/70 font-medium">Priorität</dt>
                        <dd className="font-bold text-slate-900 dark:text-white">{ticket.priority}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-slate-900/70 dark:text-white/70 font-medium">Erstellt am</dt>
                        <dd className="text-slate-900/90 dark:text-white/90 font-medium">
                            {!isNaN(new Date(ticket.created_at).getTime())
                                ? new Date(ticket.created_at).toLocaleDateString()
                                : '-'
                            }
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-slate-900/70 dark:text-white/70 font-medium">Letztes Update</dt>
                        <dd className="text-slate-900/90 dark:text-white/90 font-medium">
                            {formatTimeAgo(ticket.last_update)}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};
