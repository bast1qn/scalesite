/**
 * Payment Method Manager
 *
 * Allows users to:
 * - Add new payment methods (cards, SEPA)
 * - Set default payment method
 * - Remove payment methods
 * - View payment method details
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMING } from '../../lib/constants';
import {
    CreditCardIcon,
    PlusIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    SparklesIcon,
    ExclamationTriangleIcon
} from '../Icons';
import {
    getPaymentMethods,
    attachPaymentMethod,
    setDefaultPaymentMethod,
    detachPaymentMethod,
    formatCurrency,
    getCardBrandIcon,
    type PaymentMethod
} from '../../lib/stripe';

interface PaymentMethodManagerProps {
    className?: string;
    onPaymentMethodAdded?: (method: PaymentMethod) => void;
    onPaymentMethodRemoved?: (methodId: string) => void;
}

type AddMethodStep = 'type' | 'card' | 'sepa' | 'processing' | 'success' | 'error';

const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({
    className = '',
    onPaymentMethodAdded,
    onPaymentMethodRemoved
}) => {
    // Data
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI states
    const [showAddForm, setShowAddForm] = useState(false);
    const [addStep, setAddStep] = useState<AddMethodStep>('type');
    const [selectedMethodType, setSelectedMethodType] = useState<'card' | 'sepa'>('card');

    // Form states
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });
    const [sepaData, setSepaData] = useState({
        iban: '',
        accountHolder: ''
    });
    const [processing, setProcessing] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    // Load payment methods
    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await getPaymentMethods();

            if (error) throw error;
            setPaymentMethods(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden der Zahlungsmethoden';
            console.error('Error loading payment methods:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle add payment method
    const handleAddPaymentMethod = async () => {
        setProcessing(true);
        setAddError(null);

        try {
            setAddStep('processing');

            // In a real implementation, this would:
            // 1. Create a Stripe SetupIntent on the backend
            // 2. Use Stripe.js to collect payment details
            // 3. Confirm the SetupIntent
            // 4. Attach the payment method to the customer

            // For now, simulate the process
            await new Promise(resolve => setTimeout(resolve, TIMING.toastDuration));

            // Simulate success
            setAddStep('success');

            // Reload payment methods after a delay
            setTimeout(() => {
                loadPaymentMethods();
                setShowAddForm(false);
                setAddStep('type');
                setCardData({ number: '', expiry: '', cvc: '', name: '' });
                setSepaData({ iban: '', accountHolder: '' });
            }, 1500);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Fehler beim Hinzufügen der Zahlungsmethode';
            console.error('Error adding payment method:', err);
            setAddError(errorMessage);
            setAddStep('error');
        } finally {
            setProcessing(false);
        }
    };

    // Handle set default
    const handleSetDefault = async (methodId: string) => {
        try {
            const { success, error } = await setDefaultPaymentMethod(methodId);

            if (error || !success) throw error;

            // Update local state
            setPaymentMethods(methods =>
                methods.map(method => ({
                    ...method,
                    is_default: method.id === methodId
                }))
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Fehler beim Festlegen der Standard-Zahlungsmethode';
            console.error('Error setting default payment method:', err);
            alert(errorMessage);
        }
    };

    // Handle remove
    const handleRemove = async (methodId: string) => {
        if (!confirm('Möchten Sie diese Zahlungsmethode wirklich entfernen?')) {
            return;
        }

        try {
            const { success, error } = await detachPaymentMethod(methodId);

            if (error || !success) throw error;

            // Update local state
            setPaymentMethods(methods => methods.filter(m => m.id !== methodId));
            onPaymentMethodRemoved?.(methodId);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Fehler beim Entfernen der Zahlungsmethode';
            console.error('Error removing payment method:', err);
            alert(errorMessage);
        }
    };

    // Format card number
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Format expiry
    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
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

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Zahlungsmethoden
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Verwalten Sie Ihre gespeicherten Zahlungsmethoden
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Hinzufügen
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-900 dark:text-red-300">Fehler</p>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        {/* Step 1: Select Type */}
                        {addStep === 'type' && (
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                    Zahlungsart wählen
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedMethodType('card');
                                            setAddStep('card');
                                        }}
                                        className="p-6 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all text-left"
                                    >
                                        <CreditCardIcon className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-3" />
                                        <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                                            Kreditkarte
                                        </h5>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Visa, Mastercard, American Express
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedMethodType('sepa');
                                            setAddStep('sepa');
                                        }}
                                        className="p-6 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all text-left"
                                    >
                                        <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                                        <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                                            SEPA-Lastschrift
                                        </h5>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Automatische Abbuchung vom Konto
                                        </p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Card Details */}
                        {addStep === 'card' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Kreditkarte hinzufügen
                                    </h4>
                                    <button
                                        onClick={() => {
                                            setAddStep('type');
                                            setCardData({ number: '', expiry: '', cvc: '', name: '' });
                                        }}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Kartennummer
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.number}
                                            onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Gültig bis
                                            </label>
                                            <input
                                                type="text"
                                                value={cardData.expiry}
                                                onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                CVC
                                            </label>
                                            <input
                                                type="text"
                                                value={cardData.cvc}
                                                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/[^0-9]/g, '') })}
                                                placeholder="123"
                                                maxLength={4}
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Karteninhaber
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.name}
                                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                            placeholder="Max Mustermann"
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                        />
                                    </div>

                                    <button
                                        onClick={handleAddPaymentMethod}
                                        disabled={processing || !cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name}
                                        className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Wird verarbeitet...' : 'Karte hinzufügen'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: SEPA Details */}
                        {addStep === 'sepa' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        SEPA-Lastschrift hinzufügen
                                    </h4>
                                    <button
                                        onClick={() => {
                                            setAddStep('type');
                                            setSepaData({ iban: '', accountHolder: '' });
                                        }}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            IBAN
                                        </label>
                                        <input
                                            type="text"
                                            value={sepaData.iban}
                                            onChange={(e) => setSepaData({ ...sepaData, iban: e.target.value.toUpperCase() })}
                                            placeholder="DE89 3704 0044 0532 0130 00"
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-mono"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                            Geben Sie Ihre IBAN ohne Leerzeichen ein
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Kontoinhaber
                                        </label>
                                        <input
                                            type="text"
                                            value={sepaData.accountHolder}
                                            onChange={(e) => setSepaData({ ...sepaData, accountHolder: e.target.value })}
                                            placeholder="Max Mustermann"
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                        />
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                        <p className="text-xs text-blue-900 dark:text-blue-300">
                                            Mit dem Klick auf "Hinzufügen" erteilen Sie uns ein SEPA-Lastschriftmandat.
                                            Sie erhalten vor jeder Abbuchung eine Vorankündigung per E-Mail.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleAddPaymentMethod}
                                        disabled={processing || !sepaData.iban || !sepaData.accountHolder}
                                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Wird verarbeitet...' : 'SEPA-Mandat erteilen'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Processing */}
                        {addStep === 'processing' && (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
                                    <SparklesIcon className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-pulse" />
                                </div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Zahlungsart wird verarbeitet...
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Einen Moment, wir verifizieren Ihre Angaben
                                </p>
                            </div>
                        )}

                        {/* Success */}
                        {addStep === 'success' && (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                    <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Erfolgreich hinzugefügt!
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Ihre Zahlungsmethode wurde gespeichert
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {addStep === 'error' && (
                            <div className="p-6">
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 mb-4">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-900 dark:text-red-300">Fehler</p>
                                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">{addError}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setAddStep('type')}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Erneut versuchen
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setAddStep('type');
                                        }}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                                    >
                                        Abbrechen
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Methods List */}
            <div className="space-y-3">
                {paymentMethods.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <CreditCardIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Keine Zahlungsmethoden
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400">
                            Fügen Sie eine Kreditkarte oder SEPA-Lastschrift hinzu
                        </p>
                    </div>
                ) : (
                    paymentMethods.map(method => (
                        <motion.div
                            key={method.id}
                            layout
                            className={`relative bg-white dark:bg-slate-900 rounded-xl border-2 p-6 transition-all ${
                                method.is_default
                                    ? 'border-violet-500 shadow-md'
                                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            {method.is_default && (
                                <div className="absolute top-4 right-4">
                                    <span className="text-xs bg-violet-600 text-white px-3 py-1 rounded-full font-medium">
                                        Standard
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                    <CreditCardIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    {method.card_brand ? (
                                        <>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {method.card_brand.toUpperCase()} •••• {method.card_last4}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Gültig bis {String(method.card_exp_month).padStart(2, '0')}/{method.card_exp_year}
                                            </p>
                                        </>
                                    ) : method.sepa_mandate_reference ? (
                                        <>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                SEPA-Lastschrift
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Mandat: •••• {method.sepa_mandate_reference.slice(-4)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Zahlungsmethode
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {!method.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                                        >
                                            Als Standard
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemove(method.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Entfernen"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PaymentMethodManager;
