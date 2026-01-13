import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    BellIcon,
    GlobeIcon,
    PlayIcon,
    PauseIcon,
    TrashIcon,
    EditIcon,
    CheckCircleIcon
} from 'lucide-react';
import { Campaign } from './CampaignList';

/**
 * CampaignScheduler Component
 *
 * Schedule campaigns with timezone support and recurring options
 *
 * @param campaigns - List of campaigns to schedule
 * @param onUpdateSchedule - Callback for updating schedule
 * @param onCancelSchedule - Callback for canceling schedule
 * @param timezones - Available timezones
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface ScheduledCampaign extends Campaign {
    scheduled_for: string;
    timezone: string;
    recurring?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval: number;
        end_date?: string;
    };
}

export interface CampaignSchedulerProps {
    campaigns: ScheduledCampaign[];
    onUpdateSchedule?: (campaignId: string, scheduledFor: string, timezone: string, recurring?: ScheduledCampaign['recurring']) => Promise<void>;
    onCancelSchedule?: (campaignId: string) => Promise<void>;
    timezones?: string[];
    isLoading?: boolean;
    className?: string;
}

type ViewMode = 'upcoming' | 'past' | 'recurring';

const COMMON_TIMEZONES = [
    'Europe/Berlin',
    'Europe/London',
    'Europe/Paris',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney',
    'UTC'
];

const CampaignScheduler: React.FC<CampaignSchedulerProps> = ({
    campaigns,
    onUpdateSchedule,
    onCancelSchedule,
    timezones = COMMON_TIMEZONES,
    isLoading = false,
    className = ''
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('upcoming');
    const [editingSchedule, setEditingSchedule] = useState<ScheduledCampaign | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState('Europe/Berlin');
    const [scheduleDateTime, setScheduleDateTime] = useState('');
    const [recurringEnabled, setRecurringEnabled] = useState(false);
    const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [recurringInterval, setRecurringInterval] = useState(1);
    const [recurringEndDate, setRecurringEndDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Filter and sort campaigns
    const filteredCampaigns = useMemo(() => {
        const now = new Date();

        return campaigns
            .filter((campaign) => {
                const scheduledDate = new Date(campaign.scheduled_for);

                switch (viewMode) {
                    case 'upcoming':
                        return scheduledDate >= now && !campaign.recurring;
                    case 'past':
                        return scheduledDate < now && !campaign.recurring;
                    case 'recurring':
                        return !!campaign.recurring;
                    default:
                        return true;
                }
            })
            .sort((a, b) => {
                const dateA = new Date(a.scheduled_for).getTime();
                const dateB = new Date(b.scheduled_for).getTime();
                return viewMode === 'past' ? dateB - dateA : dateA - dateB;
            });
    }, [campaigns, viewMode]);

    const openEditModal = (campaign: ScheduledCampaign) => {
        setEditingSchedule(campaign);
        setSelectedTimezone(campaign.timezone);
        setScheduleDateTime(new Date(campaign.scheduled_for).toISOString().slice(0, 16));
        setRecurringEnabled(!!campaign.recurring);
        setRecurringFrequency(campaign.recurring?.frequency || 'weekly');
        setRecurringInterval(campaign.recurring?.interval || 1);
        setRecurringEndDate(campaign.recurring?.end_date ? new Date(campaign.recurring.end_date).toISOString().slice(0, 10) : '');
    };

    const handleSave = async () => {
        if (!onUpdateSchedule || !editingSchedule) return;

        setIsSaving(true);
        try {
            const recurring = recurringEnabled
                ? {
                      frequency: recurringFrequency,
                      interval: recurringInterval,
                      end_date: recurringEndDate || undefined
                  }
                : undefined;

            await onUpdateSchedule(
                editingSchedule.id,
                new Date(scheduleDateTime).toISOString(),
                selectedTimezone,
                recurring
            );
            setEditingSchedule(null);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = async (campaignId: string) => {
        if (!onCancelSchedule) return;
        if (!confirm('Möchtest du diese Planung wirklich abbrechen?')) return;
        await onCancelSchedule(campaignId);
    };

    const formatDateTime = (dateString: string, timezone: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone
        });
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffDays === 0) {
            if (diffHours === 0) return 'Jetzt';
            if (diffHours === 1) return 'In 1 Stunde';
            return `In ${diffHours} Stunden`;
        }
        if (diffDays === 1) return 'Morgen';
        if (diffDays === 7) return 'In 1 Woche';
        if (diffDays < 0) return `${Math.abs(diffDays)} Tage her`;
        return `In ${diffDays} Tagen`;
    };

    const getRecurringLabel = (campaign: ScheduledCampaign) => {
        if (!campaign.recurring) return null;

        const { frequency, interval, end_date } = campaign.recurring;
        const labels = {
            daily: interval === 1 ? 'Täglich' : `Alle ${interval} Tage`,
            weekly: interval === 1 ? 'Wöchentlich' : `Alle ${interval} Wochen`,
            monthly: interval === 1 ? 'Monatlich' : `Alle ${interval} Monate`
        };

        return (
            <span className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-medium">
                <BellIcon className="w-3 h-3" />
                {labels[frequency]}
                {end_date && ` bis ${new Date(end_date).toLocaleDateString('de-DE')}`}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kampagnen-Zeitscheduler</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Plane und verwalte deine Newsletter-Kampagnen
                    </p>
                </div>
            </div>

            {/* View Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setViewMode('upcoming')}
                        className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                            viewMode === 'upcoming'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <CalendarIcon className="w-4 h-4 inline mr-2" />
                        Bevorstehend ({campaigns.filter(c => new Date(c.scheduled_for) >= new Date() && !c.recurring).length})
                    </button>
                    <button
                        onClick={() => setViewMode('recurring')}
                        className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                            viewMode === 'recurring'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <BellIcon className="w-4 h-4 inline mr-2" />
                        Wiederkehrend ({campaigns.filter(c => c.recurring).length})
                    </button>
                    <button
                        onClick={() => setViewMode('past')}
                        className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                            viewMode === 'past'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <ClockIcon className="w-4 h-4 inline mr-2" />
                        Vergangen
                    </button>
                </nav>
            </div>

            {/* Campaign List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredCampaigns.length === 0 ? (
                    <div className="p-12 text-center">
                        <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                            {viewMode === 'upcoming' && 'Keine geplanten Kampagnen vorhanden'}
                            {viewMode === 'recurring' && 'Keine wiederkehrenden Kampagnen vorhanden'}
                            {viewMode === 'past' && 'Keine vergangenen Kampagnen vorhanden'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredCampaigns.map((campaign, index) => (
                            <motion.div
                                key={campaign.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {campaign.name}
                                            </h3>
                                            {campaign.recurring && getRecurringLabel(campaign)}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                                            {campaign.subject}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    {formatDateTime(campaign.scheduled_for, campaign.timezone)}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                                                    <ClockIcon className="w-4 h-4" />
                                                    {getRelativeTime(campaign.scheduled_for)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <GlobeIcon className="w-4 h-4" />
                                                {campaign.timezone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {onUpdateSchedule && (
                                            <button
                                                onClick={() => openEditModal(campaign)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                title="Planung bearbeiten"
                                            >
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        {onCancelSchedule && viewMode !== 'past' && (
                                            <button
                                                onClick={() => handleCancel(campaign.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                title="Planung abbrechen"
                                            >
                                                <PauseIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Schedule Modal */}
            {editingSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setEditingSchedule(null)}
                    ></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-6"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Kampagne planen
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Datum & Uhrzeit *
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={scheduleDateTime}
                                    onChange={(e) => setScheduleDateTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Zeitzone *
                                </label>
                                <select
                                    value={selectedTimezone}
                                    onChange={(e) => setSelectedTimezone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    {timezones.map((tz) => (
                                                                        <option key={tz} value={tz}>
                                                                            {tz}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <label className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                        Wiederkehrend
                                                                    </label>
                                                                    <button
                                                                        onClick={() => setRecurringEnabled(!recurringEnabled)}
                                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                                            recurringEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                                                                        }`}
                                                                    >
                                                                        <span
                                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                                recurringEnabled ? 'translate-x-6' : 'translate-x-1'
                                                                            }`}
                                                                        />
                                                                    </button>
                                                                </div>

                                                                {recurringEnabled && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="space-y-3"
                                                                    >
                                                                        <div>
                                                                            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                                                                Häufigkeit
                                                                            </label>
                                                                            <select
                                                                                value={recurringFrequency}
                                                                                onChange={(e) => setRecurringFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                                                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                                            >
                                                                                <option value="daily">Täglich</option>
                                                                                <option value="weekly">Wöchentlich</option>
                                                                                <option value="monthly">Monatlich</option>
                                                                            </select>
                                                                        </div>

                                                                        <div>
                                                                            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                                                                Intervall (alle X Tage/Wochen/Monate)
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                min={1}
                                                                                max={52}
                                                                                value={recurringInterval}
                                                                                onChange={(e) => setRecurringInterval(parseInt(e.target.value) || 1)}
                                                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                                                                Enddatum (optional)
                                                                            </label>
                                                                            <input
                                                                                type="date"
                                                                                value={recurringEndDate}
                                                                                onChange={(e) => setRecurringEndDate(e.target.value)}
                                                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                                            />
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </div>

                                                            <div className="flex justify-end gap-3 pt-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingSchedule(null)}
                                                                    className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    Abbrechen
                                                                </button>
                                                                <button
                                                                    onClick={handleSave}
                                                                    disabled={isSaving || !scheduleDateTime}
                                                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                                                >
                                                                    {isSaving ? (
                                                                        <>
                                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                            Speichert...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircleIcon className="w-5 h-5" />
                                                                            Speichern
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                };

                                export default CampaignScheduler;
