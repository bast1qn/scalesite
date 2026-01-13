import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    XMarkIcon,
    CheckIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '../../components/Icons';
import { Invoice, InvoiceStatus, LineItem } from './InvoiceList';

/**
 * InvoiceDetail Component
 *
 * Displays detailed invoice information with line items, tax breakdown, and actions
 *
 * @param invoice - Invoice to display
 * @param loading - Loading state
 * @param onDownload - Callback when download button is clicked
 * @param onPayNow - Callback when pay now button is clicked
 * @param onClose - Callback when close button is clicked
 * @param className - Additional CSS classes
 */

export interface InvoiceDetailProps {
    invoice: Invoice | null;
    loading?: boolean;
    onDownload?: (invoice: Invoice) => void | Promise<void>;
    onPayNow?: (invoice: Invoice) => void | Promise<void>;
    onClose?: () => void;
    className?: string;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
    invoice,
    loading = false,
    onDownload,
    onPayNow,
    onClose,
    className = ''
}) => {
    const [downloading, setDownloading] = useState(false);
    const [paying, setPaying] = useState(false);

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

    // Get status config
    const getStatusConfig = (status: InvoiceStatus) => {
        switch (status) {
            case 'draft':
                return {
                    label: 'Entwurf',
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
                    icon: DocumentTextIcon
                };
            case 'sent':
                return {
                    label: 'Gesendet',
                    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700',
                    icon: ClockIcon
                };
            case 'paid':
                return {
                    label: 'Bezahlt',
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700',
                    icon: CheckIcon
                };
            case 'overdue':
                return {
                    label: 'Überfällig',
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700',
                    icon: ExclamationTriangleIcon
                };
            case 'cancelled':
                return {
                    label: 'Storniert',
                    color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-600',
                    icon: XMarkIcon
                };
            default:
                return {
                    label: status,
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                    icon: DocumentTextIcon
                };
        }
    };

    // Handle download
    const handleDownload = async () => {
        if (!invoice || downloading) return;

        setDownloading(true);
        try {
            await onDownload?.(invoice);
        } finally {
            setDownloading(false);
        }
    };

    // Handle pay now
    const handlePayNow = async () => {
        if (!invoice || paying) return;

        setPaying(true);
        try {
            await onPayNow?.(invoice);
        } finally {
            setPaying(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 ${className}`}>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    // No invoice state
    if (!invoice) {
        return (
            <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center ${className}`}>
                <DocumentTextIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Keine Rechnung ausgewählt
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Wählen Sie eine Rechnung aus der Liste aus
                </p>
            </div>
        );
    }

    const statusConfig = getStatusConfig(invoice.status);
    const StatusIcon = statusConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {invoice.invoiceNumber}
                            </h2>
                            <span className={`px-4 py-2 text-sm font-medium rounded-full border flex items-center gap-2 ${statusConfig.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {statusConfig.label}
                            </span>
                        </div>

                        {invoice.description && (
                            <p className="text-slate-600 dark:text-slate-400 mt-2">
                                {invoice.description}
                            </p>
                        )}

                        {invoice.projectName && (
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                Projekt: {invoice.projectName}
                            </p>
                        )}
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-slate-500" />
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6">
                    {onDownload && (
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            {downloading ? 'Lade herunter...' : 'PDF herunterladen'}
                        </button>
                    )}

                    {onPayNow && (invoice.status === 'sent' || invoice.status === 'overdue') && (
                        <button
                            onClick={handlePayNow}
                            disabled={paying}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            {paying ? 'Verarbeite...' : 'Jetzt bezahlen'}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Rechnungsdatum
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {formatDate(invoice.date)}
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Fälligkeitsdatum
                        </p>
                        <p className={`text-lg font-semibold ${
                            invoice.status === 'overdue'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-slate-900 dark:text-white'
                        }`}>
                            {formatDate(invoice.dueDate)}
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Gesamtbetrag
                        </p>
                        <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                            {formatCurrency(invoice.total, invoice.currency)}
                        </p>
                    </div>
                </div>

                {/* Client Info */}
                {invoice.clientInfo && (
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Rechnungsempfänger
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                            <p className="font-medium text-slate-900 dark:text-white">
                                {invoice.clientInfo.name}
                            </p>
                            {invoice.clientInfo.company && (
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    {invoice.clientInfo.company}
                                </p>
                            )}
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                {invoice.clientInfo.email}
                            </p>
                        </div>
                    </div>
                )}

                {/* Line Items */}
                {invoice.lineItems && invoice.lineItems.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Positionen
                        </h3>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Beschreibung
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Menge
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Einzelpreis
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Gesamtpreis
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:border-slate-800">
                                    {invoice.lineItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                                {item.description}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-900 dark:text-white text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-900 dark:text-white text-right">
                                                {formatCurrency(item.unitPrice, invoice.currency)}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white text-right">
                                                {formatCurrency(item.total, invoice.currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tax Breakdown */}
                <div className="flex justify-end">
                    <div className="w-full md:w-80 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                                Zwischensumme
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {formatCurrency(invoice.subtotal, invoice.currency)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                                MwSt. (19%)
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {formatCurrency(invoice.taxAmount, invoice.currency)}
                            </span>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-slate-900 dark:text-white">
                                    Gesamtbetrag
                                </span>
                                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                    {formatCurrency(invoice.total, invoice.currency)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Status Note */}
                {invoice.status === 'overdue' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-red-900 dark:text-red-300">
                                Diese Rechnung ist überfällig
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                Bitte begleichen Sie die Rechnung so schnell wie möglich, um Mahngebühren zu vermeiden.
                            </p>
                        </div>
                    </div>
                )}

                {invoice.status === 'paid' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-green-900 dark:text-green-300">
                                Rechnung bezahlt
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                Vielen Dank für Ihre Zahlung. Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default InvoiceDetail;
