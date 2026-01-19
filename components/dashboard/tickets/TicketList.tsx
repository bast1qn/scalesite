// ============================================
// TICKET LIST COMPONENT
// Displays filtered list of tickets
// ============================================

import React from 'react';
import { TicketIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import type { Ticket, TicketFilter } from '../../../types/tickets';
import { formatTicketId, getTicketStatusColor, getTicketPriorityClasses } from '../../../lib/ticket-utils';
import { formatTimeAgo } from '../../../lib/date-utils';

interface TicketListProps {
    tickets: Ticket[];
    filter: TicketFilter;
    onFilterChange: (filter: TicketFilter) => void;
    onSelectTicket: (ticketId: string) => void;
    onCreateTicket: () => void;
    createButtonText: string;
}

export const TicketList: React.FC<TicketListProps> = ({
    tickets,
    filter,
    onFilterChange,
    onSelectTicket,
    onCreateTicket,
    createButtonText
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Ticket-Support
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Hier können Sie Unterstützung anfordern und Anfragen verwalten.
                    </p>
                </div>
                <button
                    onClick={onCreateTicket}
                    className="group bg-blue-600 dark:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                >
                    <PlusCircleIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:inline">{createButtonText}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                {/* Filter Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700/50">
                    <button
                        onClick={() => onFilterChange('active')}
                        className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 ${
                            filter === 'active'
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        Offene Anfragen
                    </button>
                    <button
                        onClick={() => onFilterChange('closed')}
                        className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 ${
                            filter === 'closed'
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        Archiv (Geschlossen)
                    </button>
                </div>

                {/* Ticket List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => {
                            const priorityClasses = getTicketPriorityClasses(ticket.priority);

                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => onSelectTicket(ticket.id)}
                                    className="group p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-all duration-200"
                                >
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
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0 ${getTicketStatusColor(
                                                ticket.status
                                            )}`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{formatTicketId(ticket.id)}</span>
                                            <span>•</span>
                                            <span>{formatTimeAgo(ticket.last_update)}</span>
                                        </div>
                                        <div
                                            className={`w-2.5 h-2.5 rounded-full border-2 transition-transform duration-200 group-hover:scale-125 ${
                                                priorityClasses.bg
                                            } ${priorityClasses.border}`}
                                            title={`Priorität: ${ticket.priority}`}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
                            <TicketIcon className="w-12 h-12 opacity-20 mb-4" />
                            <p className="font-medium">Keine Tickets in dieser Ansicht.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
