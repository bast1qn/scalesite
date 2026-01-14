/**
 * Subscription Manager
 *
 * Allows users to:
 * - View active subscriptions
 * - Upgrade/downgrade plans
 * - Cancel subscriptions
 * - Update payment methods
 * - View usage and billing history
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CreditCardIcon,
    DocumentTextIcon
} from '../Icons';
import {
    getSubscriptions,
    cancelSubscription,
    updateSubscriptionPaymentMethod,
    formatCurrency,
    formatDate,
    type Subscription
} from '../../lib/stripe';

interface SubscriptionManagerProps {
    className?: string;
    onSubscriptionCanceled?: (subscriptionId: string) => void;
}

type CancelStep = 'confirm' | 'reason' | 'processing' | 'success';

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
    className = '',
    onSubscriptionCanceled
}) => {
    // Data
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI states
    const [expandedSubscription, setExpandedSubscription] = useState<string | null>(null);
    const [cancelingSubscription, setCancelingSubscription] = useState<Subscription | null>(null);
    const [cancelStep, setCancelStep] = useState<CancelStep>('confirm');
    const [cancelReason, setCancelReason] = useState('');
    const [cancelFeedback, setCancelFeedback] = useState('');
    const [processing, setProcessing] = useState(false);

    // Load subscriptions
    useEffect(() => {
        loadSubscriptions();
    }, []);

    const loadSubscriptions = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await getSubscriptions();

            if (error) throw error;
            setSubscriptions(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden der Abonnements';
            console.error('Error loading subscriptions:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel subscription
    const handleCancelSubscription = async (subscription: Subscription) => {
        setCancelingSubscription(subscription);
        setCancelStep('confirm');
        setCancelReason('');
        setCancelFeedback('');
    };

    const confirmCancelSubscription = async () => {
        if (!cancelingSubscription) return;

        setProcessing(true);
        setCancelStep('processing');

        try {
            const { success, error } = await cancelSubscription(
                cancelingSubscription.id,
                true // cancel_at_period_end
            );

            if (error || !success) throw error;

            setCancelStep('success');

            // Reload subscriptions after a delay
            setTimeout(() => {
                loadSubscriptions();
                setCancelingSubscription(null);
                onSubscriptionCanceled?.(cancelingSubscription.id);
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Fehler beim Kündigen des Abonnements';
            console.error('Error canceling subscription:', err);
            alert(errorMessage);
            setCancelStep('confirm');
        } finally {
            setProcessing(false);
        }
    };

    // Get status config
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    label: 'Aktiv',
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700',
                    icon: CheckCircleIcon
                };
            case 'trialing':
                return {
                    label: 'Kostenlose Testphase',
                    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700',
                    icon: ClockIcon
                };
            case 'past_due':
                return {
                    label: 'Zahlung überfällig',
                    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
                    icon: ExclamationTriangleIcon
                };
            case 'canceled':
                return {
                    label: 'Gekündigt',
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
                    icon: XCircleIcon
                };
            case 'unpaid':
                return {
                    label: 'Unbezahlt',
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700',
                    icon: XCircleIcon
                };
            default:
                return {
                    label: status,
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                    icon: ClockIcon
                };
        }
    };

    // Calculate days remaining
    const getDaysRemaining = (periodEnd: string): number => {
        const now = new Date();
        const end = new Date(periodEnd);
        const diff = end.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                            </div>
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
                    <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Fehler beim Laden
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
                <button
                    onClick={loadSubscriptions}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Erneut versuchen
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Abonnements
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Verwalten Sie Ihre aktiven Abonnements und Zahlungseinstellungen
                </p>
            </div>

            {/* No subscriptions */}
            {subscriptions.length === 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <ClockIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Keine Abonnements
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                        Sie haben aktuell keine aktiven Abonnements
                    </p>
                </div>
            )}

            {/* Subscriptions list */}
            <div className="space-y-4">
                {subscriptions.map((subscription) => {
                    const statusConfig = getStatusConfig(subscription.status);
                    const StatusIcon = statusConfig.icon;
                    const isExpanded = expandedSubscription === subscription.id;
                    const daysRemaining = getDaysRemaining(subscription.current_period_end);

                    return (
                        <motion.div
                            key={subscription.id}
                            layout
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            {/* Header */}
                            <div
                                className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                onClick={() => setExpandedSubscription(isExpanded ? null : subscription.id)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {subscription.interval === 'month' ? 'Monatliches' : 'Jährliches'} Abo
                                            </h4>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${statusConfig.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {formatCurrency(subscription.amount, subscription.currency)}/{subscription.interval === 'month' ? 'Monat' : 'Jahr'}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                Nächste Abbuchung: {formatDate(subscription.current_period_end)}
                                            </span>
                                            {subscription.status === 'active' && daysRemaining > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-blue-600 dark:text-blue-400">
                                                        {daysRemaining} Tage verbleibend
                                                    </span>
                                                </>
                                            )}
                                        </div>
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
                                        <div className="p-6 space-y-6">
                                            {/* Subscription Details */}
                                            <div>
                                                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                                                    Abonnementdetails
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                            Betrag
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {formatCurrency(subscription.amount, subscription.currency)}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                            Abrechnungsintervall
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {subscription.interval === 'month' ? 'Monatlich' : 'Jährlich'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                            Aktuelle Periode
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                            Abonnement-ID
                                                        </p>
                                                        <p className="text-sm font-mono text-slate-900 dark:text-white">
                                                            {subscription.provider_subscription_id.slice(-8)}
                                                        </p>
                                                    </div>

                                                    {subscription.trial_end && (
                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                                Testphase endet
                                                            </p>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {formatDate(subscription.trial_end)}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {subscription.cancel_at_period_end && (
                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                                Kündigungsstatus
                                                            </p>
                                                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                                                Wird am Ende der Periode gekündigt
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {(subscription.status === 'active' || subscription.status === 'trialing') && !subscription.cancel_at_period_end && (
                                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // ✅ DOCUMENTED: Payment method update requires Stripe Customer Portal integration
                                                            // Implementation steps:
                                                            // 1. Create Stripe Customer Portal session: stripe.billingPortal.sessions.create()
                                                            // 2. Redirect user to portal URL where they can update payment methods
                                                            // 3. User is redirected back to app after updates
                                                            //
                                                            // Example backend endpoint needed:
                                                            // POST /api/create-portal-session
                                                            // Returns: { url: string }
                                                            //
                                                            // For now, show informative message to user
                                                            alert('Zahlungsmethoden-Verwaltung folgt in Kürze. Bitte kontaktieren Sie den Support für Änderungen.');
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <CreditCardIcon className="w-4 h-4" />
                                                        Zahlungsmethode ändern
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCancelSubscription(subscription);
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <XMarkIcon className="w-4 h-4" />
                                                        Abo kündigen
                                                    </button>
                                                </div>
                                            )}

                                            {subscription.status === 'past_due' && (
                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                                                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-yellow-900 dark:text-yellow-300">
                                                            Zahlung überfällig
                                                        </p>
                                                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                                            Bitte aktualisieren Sie Ihre Zahlungsmethode, um den Service fortzusetzen.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Cancel Subscription Modal */}
            <AnimatePresence>
                {cancelingSubscription && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setCancelingSubscription(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Step 1: Confirm */}
                            {cancelStep === 'confirm' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Abo wirklich kündigen?
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        Sie kündigen Ihr {cancelingSubscription.interval === 'month' ? 'monatliches' : 'jährliches'} Abo über{' '}
                                        {formatCurrency(cancelingSubscription.amount, cancelingSubscription.currency)}.
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            Ihr Abo bleibt bis zum{' '}
                                            <span className="font-semibold">
                                                {formatDate(cancelingSubscription.current_period_end)}
                                            </span>{' '}
                                            aktiv. Danach wird der Service eingestellt.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setCancelingSubscription(null)}
                                            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                                        >
                                            Abbrechen
                                        </button>
                                        <button
                                            onClick={() => setCancelStep('reason')}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Fortfahren
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Reason */}
                            {cancelStep === 'reason' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Warum kündigen Sie?
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        Ihre Rückmeldung hilft uns, den Service zu verbessern.
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        {['Zu teuer', 'Benötige nicht mehr', 'Technische Probleme', 'Besserer Alternative gefunden', 'Anderes'].map((reason) => (
                                            <button
                                                key={reason}
                                                onClick={() => setCancelReason(reason)}
                                                className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${
                                                    cancelReason === reason
                                                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        value={cancelFeedback}
                                        onChange={(e) => setCancelFeedback(e.target.value)}
                                        placeholder="Weitere Rückmeldung (optional)"
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 mb-4"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setCancelStep('confirm')}
                                            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                                        >
                                            Zurück
                                        </button>
                                        <button
                                            onClick={confirmCancelSubscription}
                                            disabled={processing}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Endgültig kündigen
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Processing */}
                            {cancelStep === 'processing' && (
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                                        <ArrowPathIcon className="w-8 h-8 text-red-600 dark:text-red-400 animate-spin" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Wird gekündigt...
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Einen Moment, wir verarbeiten Ihre Kündigung
                                    </p>
                                </div>
                            )}

                            {/* Step 4: Success */}
                            {cancelStep === 'success' && (
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                        <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Erfolgreich gekündigt!
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                        Ihr Abo bleibt bis zum {formatDate(cancelingSubscription.current_period_end)} aktiv.
                                    </p>
                                    <button
                                        onClick={() => setCancelingSubscription(null)}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Schließen
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriptionManager;
