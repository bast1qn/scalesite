import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DocumentTextIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon
} from '../../components/Icons';
import { InvoiceCardSkeleton } from '../skeleton';

/**
 * InvoiceList Component
 *
 * Displays a list of invoices with filtering, sorting, searching, and pagination
 *
 * @param invoices - Array of invoices to display
 * @param loading - Loading state
 * @param error - Error message
 * @param onInvoiceClick - Callback when invoice is clicked
 * @param className - Additional CSS classes
 */

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    status: InvoiceStatus;
    subtotal: number;
    taxAmount: number;
    total: number;
    currency: string;
    description?: string;
    lineItems?: LineItem[];
    projectName?: string;
    clientInfo?: {
        name: string;
        email: string;
        company?: string;
    };
}

export interface InvoiceListProps {
    invoices: Invoice[];
    loading?: boolean;
    error?: string | null;
    onInvoiceClick?: (invoice: Invoice) => void;
    className?: string;
}

type SortField = 'date' | 'dueDate' | 'total' | 'invoiceNumber';
type SortOrder = 'asc' | 'desc';

const InvoiceList: React.FC<InvoiceListProps> = ({
    invoices,
    loading = false,
    error = null,
    onInvoiceClick,
    className = ''
}) => {
    // Filter states
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Sort states
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Status options
    const statusOptions: { value: InvoiceStatus | 'all'; label: string; color: string }[] = [
        { value: 'all', label: 'Alle', color: 'gray' },
        { value: 'draft', label: 'Entwurf', color: 'gray' },
        { value: 'sent', label: 'Gesendet', color: 'blue' },
        { value: 'paid', label: 'Bezahlt', color: 'green' },
        { value: 'overdue', label: 'Überfällig', color: 'red' },
        { value: 'cancelled', label: 'Storniert', color: 'gray' },
    ];

    // Get status color
    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
            case 'sent':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700';
            case 'paid':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700';
            case 'overdue':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700';
            case 'cancelled':
                return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-600 line-through';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
        }
    };

    // Format currency
    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Filter and sort invoices
    const filteredAndSortedInvoices = useMemo(() => {
        let filtered = [...invoices];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(inv => inv.status === statusFilter);
        }

        // Date range filter
        if (dateFrom) {
            filtered = filtered.filter(inv => new Date(inv.date) >= new Date(dateFrom));
        }
        if (dateTo) {
            filtered = filtered.filter(inv => new Date(inv.date) <= new Date(dateTo));
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(inv =>
                inv.invoiceNumber.toLowerCase().includes(query) ||
                inv.description?.toLowerCase().includes(query) ||
                inv.projectName?.toLowerCase().includes(query) ||
                inv.clientInfo?.name.toLowerCase().includes(query) ||
                inv.clientInfo?.company?.toLowerCase().includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let compareValue = 0;

            if (sortField === 'date') {
                compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (sortField === 'dueDate') {
                compareValue = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else if (sortField === 'total') {
                compareValue = a.total - b.total;
            } else if (sortField === 'invoiceNumber') {
                compareValue = a.invoiceNumber.localeCompare(b.invoiceNumber);
            }

            return sortOrder === 'asc' ? compareValue : -compareValue;
        });

        return filtered;
    }, [invoices, statusFilter, dateFrom, dateTo, searchQuery, sortField, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredAndSortedInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle sort
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    // Reset filters
    const resetFilters = () => {
        setStatusFilter('all');
        setDateFrom('');
        setDateTo('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <InvoiceCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Fehler beim Laden
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{error}</p>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5" />
                        Filter
                    </h3>
                    <button
                        onClick={resetFilters}
                        className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 flex items-center gap-1"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        Zurücksetzen
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as InvoiceStatus | 'all');
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Von
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => {
                                setDateFrom(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Bis
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => {
                                setDateTo(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        />
                    </div>

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Suche
                        </label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Rechnung suchen..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    {filteredAndSortedInvoices.length} {filteredAndSortedInvoices.length === 1 ? 'Rechnung' : 'Rechnungen'} gefunden
                </div>
            </div>

            {/* Invoice List */}
            {paginatedInvoices.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <DocumentTextIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Keine Rechnungen gefunden
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Versuchen Sie, die Filter anzupassen
                    </p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                >
                    <AnimatePresence>
                        {paginatedInvoices.map((invoice) => (
                            <motion.div
                                key={invoice.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => onInvoiceClick?.(invoice)}
                                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {invoice.invoiceNumber}
                                            </h4>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                                                {statusOptions.find(s => s.value === invoice.status)?.label || invoice.status}
                                            </span>
                                        </div>

                                        {invoice.description && (
                                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                                                {invoice.description}
                                            </p>
                                        )}

                                        {invoice.projectName && (
                                            <p className="text-slate-500 dark:text-slate-500 text-sm">
                                                Projekt: {invoice.projectName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            {formatCurrency(invoice.total, invoice.currency)}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            <span>{formatDate(invoice.date)}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                            Fällig: {formatDate(invoice.dueDate)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Zurück
                    </button>

                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            const isCurrentPage = page === currentPage;
                            const isNearCurrentPage = Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;

                            if (!isNearCurrentPage && i > 0 && !([...Array(totalPages)].map((_, j) => j + 1).slice(i - 1, i + 2).includes(currentPage))) {
                                return (
                                    <span key={page} className="px-2 text-slate-400">
                                        ...
                                    </span>
                                );
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                        isCurrentPage
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Weiter
                    </button>
                </div>
            )}
        </div>
    );
};

export default InvoiceList;
