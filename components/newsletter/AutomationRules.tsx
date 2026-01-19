import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
    Sparkles as SparklesIcon,
    Plus as PlusIcon,
    Trash as TrashIcon,
    Edit as EditIcon,
    Play as PlayIcon,
    Pause as PauseIcon,
    Clock as ClockIcon,
    Mail as MailIcon,
    User as UserIcon,
    Bell as BellIcon,
    CheckCircle as CheckCircleIcon,
    X as XIcon
} from '@/lib/icons';

/**
 * AutomationRules Component
 *
 * Create and manage email automation rules and drip campaigns
 *
 * @param automations - List of automation rules
 * @param onCreate - Callback for creating automation
 * @param onUpdate - Callback for updating automation
 * @param onDelete - Callback for deleting automation
 * @param onToggle - Callback for toggling automation on/off
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface TriggerConfig {
    delay_hours?: number;
    date?: string;
    action_type?: string;
    inactivity_days?: number;
    [key: string]: string | number | boolean | undefined;
}

export interface ActionConfig {
    email_template_id?: string;
    wait_hours?: number;
    tag?: string;
    subject?: string;
    body?: string;
    [key: string]: string | number | boolean | undefined;
}

export interface AutomationRule {
    id: string;
    name: string;
    description: string;
    trigger: {
        type: 'welcome' | 'date' | 'action' | 'inactivity';
        config: TriggerConfig;
    };
    actions: {
        type: 'send_email' | 'wait' | 'add_tag' | 'remove_tag';
        config: ActionConfig;
    }[];
    status: 'active' | 'paused' | 'draft';
    created_at: string;
    stats?: {
        total_runs: number;
        sent_emails: number;
        conversion_rate: number;
    };
}

export interface AutomationRulesProps {
    automations: AutomationRule[];
    onCreate?: (automation: Omit<AutomationRule, 'id' | 'created_at' | 'stats'>) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<AutomationRule>) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    onToggle?: (id: string, active: boolean) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

type TriggerType = AutomationRule['trigger']['type'];
type ActionType = AutomationRule['actions'][number]['type'];

const AutomationRules: React.FC<AutomationRulesProps> = ({
    automations,
    onCreate,
    onUpdate,
    onDelete,
    onToggle,
    isLoading = false,
    className = ''
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState<AutomationRule | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        triggerType: TriggerType;
        triggerConfig: TriggerConfig;
        actions: { type: ActionType; config: ActionConfig }[];
    }>({
        name: '',
        description: '',
        triggerType: 'welcome',
        triggerConfig: {},
        actions: []
    });
    const [saving, setSaving] = useState(false);

    // Filter automations by status
    const activeAutomations = automations.filter(a => a.status === 'active');
    const pausedAutomations = automations.filter(a => a.status === 'paused');
    const draftAutomations = automations.filter(a => a.status === 'draft');

    const getTriggerIcon = (type: TriggerType) => {
        const icons = {
            welcome: UserIcon,
            date: ClockIcon,
            action: BellIcon,
            inactivity: ClockIcon
        };
        return icons[type];
    };

    const getTriggerLabel = (type: TriggerType) => {
        const labels = {
            welcome: 'Willkommens-E-Mail',
            date: 'Zeitbasiert',
            action: 'Ereignis-basiert',
            inactivity: 'Inaktivität'
        };
        return labels[type];
    };

    const handleCreate = async () => {
        if (!onCreate || !formData.name.trim()) return;

        setSaving(true);
        try {
            await onCreate({
                name: formData.name,
                description: formData.description,
                trigger: {
                    type: formData.triggerType,
                    config: formData.triggerConfig
                },
                actions: formData.actions,
                status: 'draft'
            });
            setShowCreateModal(false);
            setFormData({
                name: '',
                description: '',
                triggerType: 'welcome',
                triggerConfig: {},
                actions: []
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!onDelete) return;
        if (!confirm('Möchtest du diese Automation wirklich löschen?')) return;
        await onDelete(id);
    };

    const handleToggle = async (id: string, currentStatus: string) => {
        if (!onToggle) return;
        const newActive = currentStatus !== 'active';
        await onToggle(id, newActive);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Automation Rules</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Erstelle automatisierte E-Mail-Kampagnen und Drip Sequenzen
                    </p>
                </div>
                {onCreate && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Neue Automation
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <PlayIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeAutomations.length}</p>
                            <p className="text-sm text-slate-500">Aktiv</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                            <PauseIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pausedAutomations.length}</p>
                            <p className="text-sm text-slate-500">Pausiert</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{draftAutomations.length}</p>
                            <p className="text-sm text-slate-500">Entwürfe</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Automation List */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : automations.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <SparklesIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                        Keine Automationen vorhanden. Erstelle deine erste Automation!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {automations.map((automation, index) => {
                        const TriggerIcon = getTriggerIcon(automation.trigger.type);

                        return (
                            <motion.div
                                key={automation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                automation.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30'
                                                    : 'bg-slate-100 dark:bg-slate-700'
                                            }`}>
                                                <TriggerIcon className={`w-5 h-5 ${
                                                    automation.status === 'active'
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-slate-600 dark:text-slate-400'
                                                }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {automation.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {getTriggerLabel(automation.trigger.type)}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                automation.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                    : automation.status === 'paused'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                            }`}>
                                                {automation.status === 'active' ? 'Aktiv' : automation.status === 'paused' ? 'Pausiert' : 'Entwurf'}
                                            </span>
                                        </div>
                                        {automation.description && (
                                            <p className="text-slate-600 dark:text-slate-400 mb-3">
                                                {automation.description}
                                            </p>
                                        )}
                                        {automation.stats && (
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span>{automation.stats.total_runs} Ausführungen</span>
                                                <span>{automation.stats.sent_emails} E-Mails gesendet</span>
                                                <span>{automation.stats.conversion_rate}% Konversion</span>
                                            </div>
                                        )}
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                {automation.actions.length} Aktionen
                                            </span>
                                            <div className="flex gap-1">
                                                {automation.actions.slice(0, 3).map((action, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400"
                                                    >
                                                        {action.type === 'send_email' && <MailIcon className="w-3 h-3 mr-1" />}
                                                        {action.type === 'wait' && <ClockIcon className="w-3 h-3 mr-1" />}
                                                        {action.type === 'add_tag' && <SparklesIcon className="w-3 h-3 mr-1" />}
                                                        {action.type === 'remove_tag' && <XIcon className="w-3 h-3 mr-1" />}
                                                        {i < automation.actions.length - 1 && '→'}
                                                    </span>
                                                ))}
                                                {automation.actions.length > 3 && (
                                                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
                                                        +{automation.actions.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {onToggle && (
                                            <button
                                                onClick={() => handleToggle(automation.id, automation.status)}
                                                className={`p-2 rounded-xl transition-colors ${
                                                    automation.status === 'active'
                                                        ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                                        : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                }`}
                                                title={automation.status === 'active' ? 'Pausieren' : 'Aktivieren'}
                                            >
                                                {automation.status === 'active' ? (
                                                    <PauseIcon className="w-5 h-5" />
                                                ) : (
                                                    <PlayIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        )}
                                        {onUpdate && (
                                            <button
                                                onClick={() => setEditingAutomation(automation)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                title="Bearbeiten"
                                            >
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => handleDelete(automation.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                title="Löschen"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        ></div>
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <XIcon className="w-5 h-5 text-slate-500" />
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Neue Automation erstellen
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="z.B. Willkommens-E-Mail Serie"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Beschreibung
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                        placeholder="Beschreibe was diese Automation tut..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Auslöser (Trigger)
                                    </label>
                                    <select
                                        value={formData.triggerType}
                                        onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as TriggerType })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="welcome">Willkommen (neuer Abonnent)</option>
                                        <option value="date">Zeitbasiert (bestimmtes Datum)</option>
                                        <option value="action">Ereignis (z.B. Link geklickt)</option>
                                        <option value="inactivity">Inaktivität (keine Öffnung)</option>
                                    </select>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {getTriggerLabel(formData.triggerType)}
                                    </p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        <strong>Hinweis:</strong> Diese Automation wird als Entwurf gespeichert.
                                        Du kannst sie nach dem Erstellen aktivieren und weitere Aktionen hinzufügen.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        disabled={saving || !formData.name.trim()}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                                Erstellt...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <SparklesIcon className="w-5 h-5" />
                                                                                Erstellen
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                };

                                export default AutomationRules;
