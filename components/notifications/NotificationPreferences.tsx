// NotificationPreferences - User Notification Settings UI
// Woche 25: Real-time Features - Notifications

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import {
    BellIcon,
    BellSlashIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    EnvelopeIcon,
    ClockIcon,
    CheckIcon,
    XMarkIcon,
} from '../Icons';

const NotificationPreferences: React.FC = () => {
    const {
        preferences,
        updatePreferences,
        requestPermission,
        canShowBrowserNotifications,
    } = useNotifications();

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleUpdate = async (newPrefs: Partial<typeof preferences>) => {
        setSaving(true);
        setSaved(false);
        await updatePreferences(newPrefs);
        setSaving(false);
        setSaved(true);

        setTimeout(() => setSaved(false), 2000);
    };

    const handleRequestPermission = async () => {
        const granted = await requestPermission();
        if (granted) {
            await handleUpdate({ browser: true });
        }
    };

    const Toggle: React.FC<{
        enabled: boolean;
        onChange: (enabled: boolean) => void;
        label: string;
        description?: string;
    }> = ({ enabled, onChange, label, description }) => (
        <div className="flex items-start justify-between">
            <div>
                <p className="font-medium text-slate-900 dark:text-white">{label}</p>
                {description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
                )}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled
                        ? 'bg-gradient-to-r from-blue-500 to-violet-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500">
                        <BellIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Benachrichtigungseinstellungen
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Verwalte wie und wann du Benachrichtigungen erhältst
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Browser Notifications */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                        Browser-Benachrichtigungen
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <Toggle
                                enabled={preferences.browser}
                                onChange={(enabled) => handleUpdate({ browser: enabled })}
                                label="Push-Benachrichtigungen"
                                description="Benachrichtigungen im Browser anzeigen, auch wenn die Seite im Hintergrund läuft"
                            />

                            {!canShowBrowserNotifications() && (
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-start gap-2">
                                        <BellSlashIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                                                Keine Berechtigung
                                            </p>
                                            <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5">
                                                Du musst Browser-Benachrichtigungen in deinem Browser zulassen.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleRequestPermission}
                                            className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                                        >
                                            Aktivieren
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <Toggle
                                enabled={preferences.sound}
                                onChange={(enabled) => handleUpdate({ sound: enabled })}
                                label="Benachrichtigungston"
                                description="Ton bei neuen Benachrichtigungen abspielen"
                            />
                        </div>
                    </div>
                </section>

                {/* Email Notifications */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                        E-Mail-Benachrichtigungen
                    </h3>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <Toggle
                            enabled={preferences.email}
                            onChange={(enabled) => handleUpdate({ email: enabled })}
                            label="E-Mail Benachrichtigungen"
                            description="Wichtige Benachrichtigungen zusätzlich per E-Mail erhalten"
                        />
                    </div>
                </section>

                {/* Notification Types */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                        Benachrichtigungsarten
                    </h3>

                    <div className="space-y-3">
                        {[
                            { key: 'ticket', label: 'Ticket-Updates', description: 'Neue Nachrichten und Statusänderungen' },
                            { key: 'project', label: 'Projekt-Updates', description: 'Meilensteine und Fortschritte' },
                            { key: 'billing', label: 'Rechnungen', description: 'Neue Rechnungen und Zahlungserinnerungen' },
                            { key: 'team', label: 'Team-Aktivitäten', description: 'Einladungen und Team-Updates' },
                            { key: 'system', label: 'System-Benachrichtigungen', description: 'Wichtige System-Updates' },
                            { key: 'marketing', label: 'Marketing & Tipps', description: 'Neuigkeiten und Tipps' },
                        ].map(({ key, label, description }) => (
                            <div key={key} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <Toggle
                                    enabled={preferences.types[key as keyof typeof preferences.types]}
                                    onChange={(enabled) =>
                                        handleUpdate({
                                            types: {
                                                ...preferences.types,
                                                [key]: enabled,
                                            },
                                        })
                                    }
                                    label={label}
                                    description={description}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quiet Hours */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Ruhezeiten
                    </h3>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                        <Toggle
                            enabled={preferences.quiet_hours.enabled}
                            onChange={(enabled) =>
                                handleUpdate({
                                    quiet_hours: {
                                        ...preferences.quiet_hours,
                                        enabled,
                                    },
                                })
                            }
                            label="Ruhezeiten aktivieren"
                            description="Keine Benachrichtigungen während bestimmter Stunden"
                        />

                        {preferences.quiet_hours.enabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-2 gap-4 pt-4"
                            >
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Startzeit
                                    </label>
                                    <input
                                        type="time"
                                        value={preferences.quiet_hours.start}
                                        onChange={(e) =>
                                            handleUpdate({
                                                quiet_hours: {
                                                    ...preferences.quiet_hours,
                                                    start: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Endzeit
                                    </label>
                                    <input
                                        type="time"
                                        value={preferences.quiet_hours.end}
                                        onChange={(e) =>
                                            handleUpdate({
                                                quiet_hours: {
                                                    ...preferences.quiet_hours,
                                                    end: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Save Status */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        {saving && (
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                Speichern...
                            </div>
                        )}
                        {saved && (
                            <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                <CheckIcon className="w-4 h-4" />
                                Gespeichert
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPreferences;
