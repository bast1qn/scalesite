import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MailIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    TrendingUpIcon,
    SettingsIcon,
    ZapIcon,
    RefreshCwIcon
} from 'lucide-react';

/**
 * SendGridIntegration Component
 *
 * Integration panel for SendGrid/Resend email service with stats and configuration
 *
 * @param isConnected - Connection status
 * @param provider - Email provider (sendgrid or resend)
 * @param onConnect - Callback for connecting service
 * @param onTest - Callback for testing connection
 * @param onDisconnect - Callback for disconnecting
 * @param stats - Sending statistics
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface SendingStats {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    queued: number;
}

export interface SendGridIntegrationProps {
    isConnected: boolean;
    provider: 'sendgrid' | 'resend' | null;
    onConnect?: (provider: 'sendgrid' | 'resend', apiKey: string) => Promise<void>;
    onTest?: () => Promise<boolean>;
    onDisconnect?: () => Promise<void>;
    stats?: SendingStats;
    isLoading?: boolean;
    className?: string;
}

type TabType = 'overview' | 'settings';

const SendGridIntegration: React.FC<SendGridIntegrationProps> = ({
    isConnected,
    provider,
    onConnect,
    onTest,
    onDisconnect,
    stats,
    isLoading = false,
    className = ''
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [apiKey, setApiKey] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<'sendgrid' | 'resend'>('sendgrid');
    const [connecting, setConnecting] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<boolean | null>(null);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onConnect || !apiKey.trim()) return;

        setConnecting(true);
        try {
            await onConnect(selectedProvider, apiKey.trim());
            setApiKey('');
        } finally {
            setConnecting(false);
        }
    };

    const handleTest = async () => {
        if (!onTest) return;
        setTesting(true);
        setTestResult(null);
        try {
            const result = await onTest();
            setTestResult(result);
        } finally {
            setTesting(false);
        }
    };

    const calculateDeliveryRate = (): number => {
        if (!stats || stats.sent === 0) return 0;
        return Math.round((stats.delivered / stats.sent) * 100);
    };

    const calculateOpenRate = (): number => {
        if (!stats || stats.delivered === 0) return 0;
        return Math.round((stats.opened / stats.delivered) * 100);
    };

    const calculateClickRate = (): number => {
        if (!stats || stats.opened === 0) return 0;
        return Math.round((stats.clicked / stats.opened) * 100);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Connection Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 border ${
                    isConnected
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isConnected ? (
                            <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                        ) : (
                            <XCircleIcon className="w-8 h-8 text-slate-400" />
                        )}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {isConnected ? 'Verbunden' : 'Nicht verbunden'}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {isConnected
                                    ? `Mit ${provider?.toUpperCase()} verbunden`
                                    : 'Verbinde einen E-Mail-Dienst, um Newsletter zu senden'}
                            </p>
                        </div>
                    </div>
                    {isConnected && onTest && (
                        <button
                            onClick={handleTest}
                            disabled={testing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border border-slate-300 dark:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {testing ? (
                                <>
                                    <RefreshCwIcon className="w-4 h-4 animate-spin" />
                                                                    Testet...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ZapIcon className="w-4 h-4" />
                                                                    Verbindung testen
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                {testResult !== null && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className={`mt-4 p-3 rounded-lg text-sm ${
                                                            testResult
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                        }`}
                                                    >
                                                        {testResult
                                                            ? '✓ Verbindung erfolgreich! Test-E-Mail gesendet.'
                                                            : '✗ Verbindung fehlgeschlagen. Bitte überprüfe deinen API Key.'}
                                                    </motion.div>
                                                )}
                                            </motion.div>

                                            {/* Tabs */}
                                            <div className="border-b border-slate-200 dark:border-slate-700">
                                                <nav className="flex gap-8">
                                                    <button
                                                        onClick={() => setActiveTab('overview')}
                                                        className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                                                            activeTab === 'overview'
                                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                        }`}
                                                    >
                                                        Übersicht
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveTab('settings')}
                                                        className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                                                            activeTab === 'settings'
                                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                        }`}
                                                    >
                                                        <SettingsIcon className="w-4 h-4 inline mr-2" />
                                                        Einstellungen
                                                    </button>
                                                </nav>
                                            </div>

                                            {/* Overview Tab */}
                                            {activeTab === 'overview' && (
                                                <div className="space-y-6">
                                                    {/* Stats Grid */}
                                                    {stats && isConnected && (
                                                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                                                            >
                                                                <MailIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.sent}</p>
                                                                <p className="text-xs text-slate-500">Gesendet</p>
                                                            </motion.div>

                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.05 }}
                                                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                                                            >
                                                                <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.delivered}</p>
                                                                <p className="text-xs text-slate-500">Zugestellt</p>
                                                            </motion.div>

                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.1 }}
                                                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                                                            >
                                                                <TrendingUpIcon className="w-5 h-5 text-violet-600 dark:text-violet-400 mb-2" />
                                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.opened}</p>
                                                                <p className="text-xs text-slate-500">Geöffnet</p>
                                                            </motion.div>

                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.15 }}
                                                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                                                            >
                                                                <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.clicked}</p>
                                                                <p className="text-xs text-slate-500">Geklickt</p>
                                                            </motion.div>

                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                                                            >
                                                                <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mb-2" />
                                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.bounced}</p>
                                                                <p className="text-xs text-slate-500">Bounced</p>
                                                            </motion.div>

                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.25 }}
                                                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                                                            >
                                                                <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mb-2" />
                                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.queued}</p>
                                                                <p className="text-xs text-slate-500">Queued</p>
                                                            </motion.div>
                                                        </div>
                                                    )}

                                                    {/* Performance Metrics */}
                                                    {stats && isConnected && (
                                                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                                                Leistungsmetriken
                                                            </h3>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400">Zustellungsrate</span>
                                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{calculateDeliveryRate()}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${calculateDeliveryRate()}%` }}
                                                                            transition={{ duration: 0.5 }}
                                                                            className="bg-green-500 h-2 rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400">Öffnungsrate</span>
                                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{calculateOpenRate()}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${calculateOpenRate()}%` }}
                                                                            transition={{ duration: 0.5, delay: 0.1 }}
                                                                            className="bg-violet-500 h-2 rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400">Klickrate</span>
                                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{calculateClickRate()}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${calculateClickRate()}%` }}
                                                                            transition={{ duration: 0.5, delay: 0.2 }}
                                                                            className="bg-blue-500 h-2 rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Settings Tab */}
                                            {activeTab === 'settings' && (
                                                <div className="space-y-6">
                                                    {!isConnected ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
                                                        >
                                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                                                E-Mail-Dienst verbinden
                                                            </h3>

                                                            <form onSubmit={handleConnect} className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                                        Anbieter wählen
                                                                    </label>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setSelectedProvider('sendgrid')}
                                                                            className={`p-4 rounded-xl border-2 transition-colors ${
                                                                                selectedProvider === 'sendgrid'
                                                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                                                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                                                            }`}
                                                                        >
                                                                            <div className="text-center">
                                                                                <MailIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                                                                <p className="font-semibold text-slate-900 dark:text-white">SendGrid</p>
                                                                                <p className="text-xs text-slate-500 mt-1">
                                                                                    Industriestandard
                                                                                </p>
                                                                            </div>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setSelectedProvider('resend')}
                                                                            className={`p-4 rounded-xl border-2 transition-colors ${
                                                                                selectedProvider === 'resend'
                                                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                                                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                                                            }`}
                                                                        >
                                                                            <div className="text-center">
                                                                                <MailIcon className="w-8 h-8 mx-auto mb-2 text-violet-600" />
                                                                                <p className="font-semibold text-slate-900 dark:text-white">Resend</p>
                                                                                <p className="text-xs text-slate-500 mt-1">
                                                                                    Modern & Einfach
                                                                                </p>
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                                        API Key *
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        required
                                                                        value={apiKey}
                                                                        onChange={(e) => setApiKey(e.target.value)}
                                                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                                                                        placeholder={`${selectedProvider.toUpperCase()}_API_KEY`}
                                                                    />
                                                                    <p className="mt-2 text-sm text-slate-500">
                                                                        Erhalte deinen API Key vom{' '}
                                                                        <a
                                                                            href={`https://${selectedProvider}.com`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline"
                                                                        >
                                                                            {selectedProvider === 'sendgrid' ? 'SendGrid' : 'Resend'} Dashboard
                                                                        </a>
                                                                    </p>
                                                                </div>

                                                                <div className="flex justify-end">
                                                                    <button
                                                                        type="submit"
                                                                        disabled={connecting || !apiKey.trim()}
                                                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                                                    >
                                                                        {connecting ? (
                                                                            <>
                                                                                <RefreshCwIcon className="w-5 h-5 animate-spin" />
                                                                                Verbindet...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <ZapIcon className="w-5 h-5" />
                                                                                Verbinden
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
                                                        >
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                                        Aktuelle Verbindung
                                                                    </h3>
                                                                    <p className="text-sm text-slate-500 mt-1">
                                                                        Verbunden mit {provider?.toUpperCase()}
                                                                    </p>
                                                                </div>
                                                                {onDisconnect && (
                                                                    <button
                                                                        onClick={onDisconnect}
                                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                                                                    >
                                                                        Trennen
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    <strong className="text-slate-900 dark:text-white">Status:</strong> Aktiv
                                                                </p>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                                    Der E-Mail-Versand ist aktiviert. Alle geplanten Kampagnen werden automatisch zum Zeitpunkt gesendet.
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                };

                                export default SendGridIntegration;
