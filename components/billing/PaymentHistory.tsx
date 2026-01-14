import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentTextIcon
} from '../../components/Icons';
import { formatCurrency, formatDateShort, getRelativeTime } from '../../lib/utils';

/**
 * PaymentHistory Component
 *
 * Displays a timeline of payment history with details and receipt download
 *
 * @param payments - Array of payments to display
 * @param loading - Loading state
 * @param error - Error message
 * @param onReceiptDownload - Callback when receipt download is clicked
 * @param className - Additional CSS classes
 */

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal' | 'sepa' | 'bank_transfer' | 'other';

export interface Payment {
    id: string;
    invoiceId: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    date: string;
    transactionId?: string;
    description?: string;
    receiptUrl?: string;
    metadata?: {
        cardLast4?: string;
        cardBrand?: string;
        paypalEmail?: string;
        sepaMandate?: string;
    };
}

export interface PaymentHistoryProps {
    payments: Payment[];
    loading?: boolean;
    error?: string | null;
    onReceiptDownload?: (payment: Payment) => void | Promise<void>;
    className?: string;
}

const PaymentHistory: FC<PaymentHistoryProps> = ({
    payments,
    loading = false,
    error = null,
    onReceiptDownload,
    className = ''
}) => {
    const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');
    const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

    // Status options
    const statusOptions: { value: PaymentStatus | 'all'; label: string; color: string }[] = [
        { value: 'all', label: 'Alle', color: 'gray' },
        { value: 'pending', label: 'Ausstehend', color: 'yellow' },
        { value: 'completed', label: 'Abgeschlossen', color: 'green' },
        { value: 'failed', label: 'Fehlgeschlagen', color: 'red' },
        { value: 'refunded', label: 'Erstattet', color: 'gray' },
    ];

    // Get status config
    const getStatusConfig = (status: PaymentStatus) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Ausstehend',
                    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
                    icon: ClockIcon
                };
            case 'completed':
                return {
                    label: 'Abgeschlossen',
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700',
                    icon: CheckCircleIcon
                };
            case 'failed':
                return {
                    label: 'Fehlgeschlagen',
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700',
                    icon: XCircleIcon
                };
            case 'refunded':
                return {
                    label: 'Erstattet',
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
                    icon: ArrowPathIcon
                };
            default:
                return {
                    label: status,
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                    icon: ClockIcon
                };
        }
    };

    // Get payment method label
    const getPaymentMethodLabel = (method: PaymentMethod): string => {
        const methodMap: Record<PaymentMethod, string> = {
            credit_card: 'Kreditkarte',
            paypal: 'PayPal',
            sepa: 'SEPA-Lastschrift',
            bank_transfer: 'Banküberweisung',
            other: 'Sonstige'
        };
        return methodMap[method] || method;
    };

    // Filter payments
    const filteredPayments = useMemo(() => {
        if (filter === 'all') return payments;
        return payments.filter(p => p.status === filter);
    }, [payments, filter]);

    // Calculate totals
    const totals = useMemo(() => {
        return {
            total: payments.length,
            completed: payments.filter(p => p.status === 'completed').length,
            pending: payments.filter(p => p.status === 'pending').length,
            failed: payments.filter(p => p.status === 'failed').length,
            refunded: payments.filter(p => p.status === 'refunded').length,
            totalAmount: payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.amount, 0)
        };
    }, [payments]);

    // Loading skeleton
    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <XCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                            <DocumentTextIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Gesamt</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totals.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Erfolgreich</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totals.completed}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Ausstehend</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totals.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Fehlgeschlagen</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totals.failed}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Amount */}
            {totals.totalAmount > 0 && (
                <div className="bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-90 mb-1">Gesamtzahlbetrag (erfolgreiche Zahlungen)</p>
                    <p className="text-3xl font-bold">{formatCurrency(totals.totalAmount)}</p>
                </div>
            )}

            {/* Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {statusOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                            filter === option.value
                                ? 'bg-violet-600 text-white'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Payment Timeline */}
            {filteredPayments.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <ClockIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Keine Zahlungen gefunden
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        {filter === 'all' ? 'Es liegen noch keine Zahlungen vor.' : 'Keine Zahlungen mit diesem Status.'}
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredPayments.map((payment, index) => {
                                const statusConfig = getStatusConfig(payment.status);
                                const StatusIcon = statusConfig.icon;
                                const isExpanded = expandedPayment === payment.id;

                                return (
                                    <motion.div
                                        key={payment.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="relative pl-20"
                                    >
                                        {/* Timeline dot */}
                                        <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${
                                            payment.status === 'completed' ? 'bg-green-500' :
                                            payment.status === 'failed' ? 'bg-red-500' :
                                            payment.status === 'pending' ? 'bg-yellow-500' :
                                            'bg-gray-500'
                                        }`}></div>

                                        {/* Payment Card */}
                                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            <div
                                                className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                onClick={() => setExpandedPayment(isExpanded ? null : payment.id)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                                {payment.invoiceNumber}
                                                            </h4>
                                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${statusConfig.color}`}>
                                                                <StatusIcon className="w-3 h-3" />
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>

                                                        {payment.description && (
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                                {payment.description}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                                                            <span>{getRelativeTime(payment.date)}</span>
                                                            <span>•</span>
                                                            <span>{getPaymentMethodLabel(payment.method)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 flex-shrink-0">
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                                {formatCurrency(payment.amount, payment.currency)}
                                                            </p>
                                                        </div>

                                                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                                            {isExpanded ? (
                                                                <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                                                            ) : (
                                                                <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                                                    >
                                                        <div className="p-6 space-y-4">
                                                            {/* Transaction Details */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                                        Transaktions-ID
                                                                    </p>
                                                                    <p className="text-sm font-mono text-slate-900 dark:text-white">
                                                                        {payment.transactionId || 'N/A'}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                                        Zahlungsart
                                                                    </p>
                                                                    <p className="text-sm text-slate-900 dark:text-white">
                                                                        {getPaymentMethodLabel(payment.method)}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                                        Datum
                                                                    </p>
                                                                    <p className="text-sm text-slate-900 dark:text-white">
                                                                        {formatDateShort(payment.date)}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                                        Betrag
                                                                    </p>
                                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                                        {formatCurrency(payment.amount, payment.currency)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Payment Method Details */}
                                                            {payment.metadata && (
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                                                        Zahlungsdetails
                                                                    </p>
                                                                    <div className="space-y-1">
                                                                        {payment.metadata.cardLast4 && (
                                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                                Karte: **** {payment.metadata.cardLast4}
                                                                                {payment.metadata.cardBrand && ` (${payment.metadata.cardBrand})`}
                                                                            </p>
                                                                        )}
                                                                        {payment.metadata.paypalEmail && (
                                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                                PayPal: {payment.metadata.paypalEmail}
                                                                            </p>
                                                                        )}
                                                                        {payment.metadata.sepaMandate && (
                                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                                SEPA-Mandat: {payment.metadata.sepaMandate}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-3 pt-2">
                                                                {onReceiptDownload && payment.receiptUrl && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onReceiptDownload(payment);
                                                                        }}
                                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                                    >
                                                                        <DocumentTextIcon className="w-4 h-4" />
                                                                        Beleg herunterladen
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
