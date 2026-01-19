/**
 * Billing Overview Page
 *
 * Shows:
 * - Billing summary (total paid, outstanding, monthly costs)
 * - Recent invoices
 * - Active subscriptions
 * - Payment methods
 * - Quick actions
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from '@/lib/motion';
import {
    CreditCardIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon,
    PlusIcon,
    ChevronDownIcon,
    DownloadIcon,
    EyeIcon
} from '../Icons';
import {
    getInvoices,
    getSubscriptions,
    getPaymentMethods,
    formatCurrency,
    formatDate,
    type Invoice as BillingInvoice,
    type Subscription,
    type PaymentMethod
} from '../../lib/stripe';
import { InvoiceList, type Invoice } from './InvoiceList';

interface BillingStats {
    totalPaid: number;
    totalOutstanding: number;
    monthlyCost: number;
    activeSubscriptions: number;
    pendingInvoices: number;
}

interface BillingOverviewProps {
    className?: string;
}

const BillingOverview: React.FC<BillingOverviewProps> = ({ className = '' }) => {
    // Data states
    const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [stats, setStats] = useState<BillingStats>({
        totalPaid: 0,
        totalOutstanding: 0,
        monthlyCost: 0,
        activeSubscriptions: 0,
        pendingInvoices: 0
    });

    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'invoices' | 'subscriptions' | 'payment-methods'>('overview');

    // Load data
    useEffect(() => {
        loadBillingData();
    }, []);

    const loadBillingData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load data in parallel
            const [invoicesResult, subscriptionsResult, paymentMethodsResult] = await Promise.all([
                getInvoices({ limit: 10 }),
                getSubscriptions(),
                getPaymentMethods()
            ]);

            if (invoicesResult.error) throw invoicesResult.error;
            if (subscriptionsResult.error) throw subscriptionsResult.error;
            if (paymentMethodsResult.error) throw paymentMethodsResult.error;

            const invoiceData = invoicesResult.data || [];
            const subscriptionData = subscriptionsResult.data || [];
            const paymentMethodData = paymentMethodsResult.data || [];

            setInvoices(invoiceData);
            setSubscriptions(subscriptionData);
            setPaymentMethods(paymentMethodData);

            // Calculate stats
            const totalPaid = invoiceData
                .filter(inv => inv.status === 'paid')
                .reduce((sum, inv) => sum + inv.amount, 0);

            const totalOutstanding = invoiceData
                .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
                .reduce((sum, inv) => sum + inv.amount, 0);

            const monthlyCost = subscriptionData
                .filter(sub => sub.status === 'active')
                .reduce((sum, sub) => sum + sub.amount, 0);

            const activeSubscriptions = subscriptionData.filter(sub => sub.status === 'active').length;
            const pendingInvoices = invoiceData.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;

            setStats({
                totalPaid,
                totalOutstanding,
                monthlyCost,
                activeSubscriptions,
                pendingInvoices
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden der Abrechnungsdaten';
            console.error('Error loading billing data:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className={`space-y-6 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Fehler beim Laden
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
                <button
                    onClick={loadBillingData}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                >
                    Erneut versuchen
                </button>
            </div>
        );
    }

    // Tabs
    const tabs = [
        { id: 'overview', label: 'Übersicht', icon: DocumentTextIcon },
        { id: 'invoices', label: 'Rechnungen', icon: DocumentTextIcon },
        { id: 'subscriptions', label: 'Abonnements', icon: ClockIcon },
        { id: 'payment-methods', label: 'Zahlungsmethoden', icon: CreditCardIcon }
    ] as const;

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Abrechnung
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Verwalten Sie Ihre Zahlungen und Abonnements
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                                selectedTab === tab.id
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Total Paid */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Gezahlt</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(stats.totalPaid)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                Gesamtzahlbetrag
                            </p>
                        </div>

                        {/* Outstanding */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                    <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Offen</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(stats.totalOutstanding)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                {stats.pendingInvoices} ausstehende Rechnungen
                            </p>
                        </div>

                        {/* Monthly Cost */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                                    <CreditCardIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Monatlich</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(stats.monthlyCost)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                {stats.activeSubscriptions} aktive Abonnements
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="bg-gradient-to-br from-violet-500 to-primary-500 rounded-xl p-6 text-white">
                            <h3 className="font-semibold mb-3">Schnellaktionen</h3>
                            <div className="space-y-2">
                                <button className="w-full text-left px-3 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors min-h-11">
                                    Rechnung anzeigen
                                </button>
                                <button className="w-full text-left px-3 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors min-h-11">
                                    Zahlungsmethode hinzufügen
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Split: Recent Invoices & Active Subscriptions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Invoices */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Letzte Rechnungen
                                    </h3>
                                    <button
                                        onClick={() => setSelectedTab('invoices')}
                                        className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                                    >
                                        Alle anzeigen
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {invoices.length === 0 ? (
                                    <div className="text-center py-8">
                                        <DocumentTextIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            Noch keine Rechnungen vorhanden
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {invoices.slice(0, 5).map(invoice => (
                                            <div
                                                key={invoice.id}
                                                className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {invoice.invoice_number}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                                        {formatDate(invoice.issue_date)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(invoice.amount, invoice.currency)}
                                                    </p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        invoice.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}>
                                                        {invoice.status === 'paid' ? 'Bezahlt' :
                                                         invoice.status === 'overdue' ? 'Überfällig' :
                                                         invoice.status === 'sent' ? 'Offen' : invoice.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Subscriptions */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Aktive Abonnements
                                    </h3>
                                    <button
                                        onClick={() => setSelectedTab('subscriptions')}
                                        className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                                    >
                                        Verwalten
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {subscriptions.filter(s => s.status === 'active').length === 0 ? (
                                    <div className="text-center py-8">
                                        <ClockIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            Keine aktiven Abonnements
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {subscriptions
                                            .filter(s => s.status === 'active')
                                            .slice(0, 5)
                                            .map(subscription => (
                                                <div
                                                    key={subscription.id}
                                                    className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {subscription.interval === 'month' ? 'Monatliches' : 'Jährliches'} Abo
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-500">
                                                            Nächste Abbuchung: {formatDate(subscription.current_period_end)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {formatCurrency(subscription.amount, subscription.currency)}/{subscription.interval === 'month' ? 'mtl.' : 'jährl.'}
                                                        </p>
                                                        <span className="text-xs text-green-600 dark:text-green-400">
                                                            Aktiv
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Zahlungsmethoden
                                </h3>
                                <button
                                    onClick={() => setSelectedTab('payment-methods')}
                                    className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {paymentMethods.length === 0 ? (
                                <div className="text-center py-8">
                                    <CreditCardIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Keine Zahlungsmethoden hinterlegt
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {paymentMethods.map(method => (
                                        <div
                                            key={method.id}
                                            className={`relative p-4 rounded-lg border-2 transition-all ${
                                                method.is_default
                                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                            }`}
                                        >
                                            {method.is_default && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                                                        Standard
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mb-2">
                                                <CreditCardIcon className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                                                <div>
                                                    {method.card_brand && (
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {method.card_brand.toUpperCase()} •••• {method.card_last4}
                                                        </p>
                                                    )}
                                                    {method.sepa_mandate_reference && (
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            SEPA •••• {method.sepa_mandate_reference.slice(-4)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {method.card_exp_month && method.card_exp_year && (
                                                <p className="text-xs text-slate-500 dark:text-slate-500">
                                                    Gültig bis {String(method.card_exp_month).padStart(2, '0')}/{method.card_exp_year}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setSelectedTab('payment-methods')}
                                        className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 transition-all text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span className="text-sm font-medium">Neue Karte hinzufügen</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Invoices Tab */}
            {selectedTab === 'invoices' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <InvoiceList
                        invoices={invoices.map(inv => ({
                            id: inv.id,
                            invoiceNumber: inv.invoice_number,
                            date: inv.issue_date,
                            dueDate: inv.due_date,
                            status: inv.status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
                            subtotal: inv.amount - inv.tax_amount - inv.discount_amount,
                            taxAmount: inv.tax_amount,
                            total: inv.amount,
                            currency: inv.currency,
                            lineItems: inv.line_items
                        }))}
                        loading={loading}
                    />
                </motion.div>
            )}

            {/* Subscriptions Tab */}
            {selectedTab === 'subscriptions' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Abonnementverwaltung
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Hier können Sie Ihre Abonnements verwalten, upgraden oder kündigen.
                        </p>
                        {/* Subscription management would go here */}
                        <div className="mt-6 text-center py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                            <ClockIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-600 dark:text-slate-400">
                                Detaillierte Abonnementverwaltung folgt in Kürze
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Payment Methods Tab */}
            {selectedTab === 'payment-methods' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Zahlungsmethoden verwalten
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Fügen Sie Kreditkarten oder SEPA-Lastschriften hinzu und wählen Sie Ihre Standard-Zahlungsmethode.
                        </p>
                        {/* Payment method management would go here */}
                        <div className="mt-6 text-center py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                            <CreditCardIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-600 dark:text-slate-400">
                                Detaillierte Zahlungsmethodenverwaltung folgt in Kürze
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BillingOverview;
