import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X as XIcon,
    CheckCircle as CheckCircleIcon,
    Mail as MailIcon,
    Heart as HeartIcon,
    AlertTriangle as AlertTriangleIcon
} from '@/lib/icons';

/**
 * UnsubscribeHandler Component
 *
 * GDPR-compliant unsubscribe handling with preference center and feedback
 *
 * @param email - Subscriber email
 * @param onUnsubscribe - Callback for unsubscribe action
 * @param onPreferenceUpdate - Callback for updating preferences
 * @param isLoading - Loading state
 * @param isEmbedded - Whether component is embedded in page
 * @param className - Additional CSS classes
 */

export interface UnsubscribeHandlerProps {
    email?: string;
    onUnsubscribe?: (email: string, reason?: string, feedback?: string) => Promise<boolean>;
    onPreferenceUpdate?: (email: string, preferences: Record<string, boolean>) => Promise<boolean>;
    isLoading?: boolean;
    isEmbedded?: boolean;
    className?: string;
}

type UnsubscribeStep = 'confirm' | 'reason' | 'feedback' | 'success' | 'preferences';
type UnsubscribeReason = 'too_many' | 'not_relevant' | 'content_quality' | 'other';

const UnsubscribeHandler: React.FC<UnsubscribeHandlerProps> = ({
    email,
    onUnsubscribe,
    onPreferenceUpdate,
    isLoading = false,
    isEmbedded = false,
    className = ''
}) => {
    const [currentStep, setCurrentStep] = useState<UnsubscribeStep>('confirm');
    const [selectedReason, setSelectedReason] = useState<UnsubscribeReason | null>(null);
    const [feedback, setFeedback] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [preferences, setPreferences] = useState({
        marketing: true,
        product_updates: true,
        tips: true,
        news: true
    });
    const [unsubscribing, setUnsubscribing] = useState(false);

    const handleUnsubscribe = async () => {
        if (!onUnsubscribe || !email) return;

        setUnsubscribing(true);
        try {
            const success = await onUnsubscribe(
                email,
                selectedReason || undefined,
                selectedReason === 'other' ? otherReason : feedback
            );

            if (success) {
                setCurrentStep('success');
            }
        } finally {
            setUnsubscribing(false);
        }
    };

    const handlePreferenceUpdate = async () => {
        if (!onPreferenceUpdate || !email) return;

        setUnsubscribing(true);
        try {
            const success = await onPreferenceUpdate(email, preferences);

            if (success) {
                setCurrentStep('success');
            }
        } finally {
            setUnsubscribing(false);
        }
    };

    if (isEmbedded) {
        // Embedded version (shown in email footer)
        return (
            <div className={`text-xs text-slate-500 ${className}`}>
                <p>
                    Du erhältst diese Email, weil du unseren Newsletter abonniert hast.
                </p>
                <p className="mt-1">
                    <a
                                                        href="#"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Abmelden
                                                    </a>
                                                    {' · '}
                                                    <a
                                                        href="#"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Newsletter-Einstellungen
                                                    </a>
                                                    {' · '}
                                                    <a
                                                        href="#"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Privatsphäre
                                                    </a>
                                                </p>
                                            </div>
                                        );
                                    }

                                    // Full page unsubscribe flow
                                    return (
                                        <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 ${className}`}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
                                            >
                                                {/* Header */}
                                                <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-center">
                                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                        <MailIcon className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h1 className="text-2xl font-bold text-white">
                                                        {currentStep === 'success' ? 'Erfolg' : 'Vom Newsletter abmelden'}
                                                    </h1>
                                                    {email && (
                                                        <p className="text-white/80 mt-2 text-sm">{email}</p>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-8">
                                                    {currentStep === 'confirm' && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="space-y-6"
                                                        >
                                                            <p className="text-slate-600 dark:text-slate-400 text-center">
                                                                Schade, dass du gehen möchtest! Wir respektieren deine Entscheidung.
                                                            </p>

                                                            <div className="space-y-3">
                                                                <button
                                                                    onClick={() => setCurrentStep('preferences')}
                                                                    className="w-full px-6 py-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold rounded-xl transition-colors text-left flex items-center gap-3"
                                                                >
                                                                    <MailIcon className="w-5 h-5" />
                                                                    <div>
                                                                        <div className="font-medium">E-Mail-Einstellungen anpassen</div>
                                                                        <div className="text-sm opacity-75">
                                                                            Wähle welche E-Mails du erhalten möchtest
                                                                        </div>
                                                                    </div>
                                                                </button>

                                                                <button
                                                                    onClick={() => setCurrentStep('reason')}
                                                                    className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors text-left flex items-center gap-3"
                                                                >
                                                                    <XIcon className="w-5 h-5" />
                                                                    <div>
                                                                        <div className="font-medium">Komplett abmelden</div>
                                                                        <div className="text-sm opacity-75">
                                                                            Alle E-Mails abbestellen
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {currentStep === 'preferences' && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="space-y-6"
                                                        >
                                                            <p className="text-slate-600 dark:text-slate-400 text-center">
                                                                Wähle aus, welche E-Mails du erhalten möchtest:
                                                            </p>

                                                            <div className="space-y-3">
                                                                {Object.entries({
                                                                    marketing: 'Marketing & Angebote',
                                                                    product_updates: 'Product Updates',
                                                                    tips: 'Tipps & Tricks',
                                                                    news: 'Neuigkeiten & Blog'
                                                                }).map(([key, label]) => (
                                                                    <label
                                                                        key={key}
                                                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                                                                            preferences[key as keyof typeof preferences]
                                                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                                                        }`}
                                                                    >
                                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                                            {label}
                                                                        </span>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={preferences[key as keyof typeof preferences]}
                                                                            onChange={(e) => setPreferences({
                                                                                ...preferences,
                                                                                [key]: e.target.checked
                                                                            })}
                                                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                        />
                                                                    </label>
                                                                ))}
                                                            </div>

                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => setCurrentStep('confirm')}
                                                                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    Zurück
                                                                </button>
                                                                <button
                                                                    onClick={handlePreferenceUpdate}
                                                                    disabled={unsubscribing}
                                                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {unsubscribing ? 'Speichert...' : 'Speichern'}
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {currentStep === 'reason' && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="space-y-6"
                                                        >
                                                            <p className="text-slate-600 dark:text-slate-400 text-center">
                                                                Warum möchtest du dich abmelden? Deine Antwort hilft uns, uns zu verbessern.
                                                            </p>

                                                            <div className="space-y-3">
                                                                {([
                                                                    { value: 'too_many', label: 'Zu viele E-Mails', icon: MailIcon },
                                                                    { value: 'not_relevant', label: 'Nicht mehr relevant', icon: XIcon },
                                                                    { value: 'content_quality', label: 'Qualität des Inhalts', icon: AlertTriangleIcon },
                                                                    { value: 'other', label: 'Anderer Grund', icon: HeartIcon }
                                                                ] as const).map(({ value, label, icon: Icon }) => (
                                                                    <button
                                                                        key={value}
                                                                        onClick={() => setSelectedReason(value as UnsubscribeReason)}
                                                                        className={`w-full px-6 py-4 rounded-xl border-2 transition-colors text-left flex items-center gap-3 ${
                                                                            selectedReason === value
                                                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                                                        }`}
                                                                    >
                                                                        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                                                        <span className="font-medium text-slate-900 dark:text-white">{label}</span>
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            {selectedReason === 'other' && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    className="mt-4"
                                                                >
                                                                    <textarea
                                                                        value={otherReason}
                                                                        onChange={(e) => setOtherReason(e.target.value)}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                                                        placeholder="Bitte teile uns deinen Grund mit..."
                                                                    />
                                                                </motion.div>
                                                            )}

                                                            <div className="space-y-3">
                                                                {selectedReason && selectedReason !== 'other' && (
                                                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                                                                            Optional: Was können wir besser machen?
                                                                        </p>
                                                                        <textarea
                                                                            value={feedback}
                                                                            onChange={(e) => setFeedback(e.target.value)}
                                                                            rows={2}
                                                                            className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                                                            placeholder="Dein Feedback (optional)..."
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => setCurrentStep('confirm')}
                                                                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    Zurück
                                                                </button>
                                                                <button
                                                                    onClick={handleUnsubscribe}
                                                                    disabled={!selectedReason || unsubscribing}
                                                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {unsubscribing ? 'Wird abgemeldet...' : 'Abmelden'}
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {currentStep === 'success' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="text-center space-y-6"
                                                        >
                                                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                                                <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                                                            </div>

                                                            <div>
                                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                                    {selectedReason ? 'Erfolgreich abgemeldet' : 'Einstellungen gespeichert'}
                                                                </h3>
                                                                <p className="text-slate-600 dark:text-slate-400">
                                                                    {selectedReason
                                                                        ? 'Du erhältst keine weiteren E-Mails von uns. Wir bedauern, dich gehen zu sehen.'
                                                                        : 'Deine E-Mail-Präferenzen wurden aktualisiert.'}
                                                                </p>
                                                            </div>

                                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-left">
                                                                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium flex items-start gap-2">
                                                                    <AlertTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                                    <span>
                                                                        Es kann bis zu 24 Stunden dauern, bis diese Änderungen wirksam werden.
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            <a
                                                                href="/"
                                                                className="inline-block px-6 py-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                                                            >
                                                                Zurück zur Website
                                                            </a>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="bg-slate-50 dark:bg-slate-900 px-8 py-4 border-t border-slate-200 dark:border-slate-700">
                                                    <p className="text-xs text-slate-500 text-center">
                                                        Deine Privatsphäre ist uns wichtig. Lies unsere{' '}
                                                        <a href="#" className="text-blue-600 hover:underline">
                                                            Datenschutzrichtlinie
                                                        </a>
                                                        {' '}für mehr Informationen.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                };

                                export default UnsubscribeHandler;
