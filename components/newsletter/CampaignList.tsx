import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MailIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    SendIcon,
    ClockIcon,
    CheckCircleIcon,
    EyeIcon,
    MousePointerClickIcon,
    UserMinusIcon,
    FunnelIcon,
    LayoutGridIcon,
    ListIcon,
    SearchIcon
} from 'lucide-react';

/**
 * CampaignList Component
 *
 * Main campaign list component with filtering, search, and statistics
 *
 * @param campaigns - List of campaigns
 * @subscribersCount - Total number of subscribers
 * @param onCreate - Callback for creating new campaign
 * @param onEdit - Callback for editing campaign
 * @param onSend - Callback for sending campaign
 * @param onDelete - Callback for deleting campaign
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface CampaignStats {
    sent_count: number;
    open_count: number;
    click_count: number;
    unsubscribe_count: number;
}

export interface Campaign {
    id: string;
    name: string;
    subject: string;
    preview_text: string | null;
    content: string;
    target_segment: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent';
    scheduled_for: string | null;
    sent_at: string | null;
    stats: CampaignStats;
    created_at: string;
    created_by: string;
}

export type CampaignStatus = Campaign['status'];

export interface CampaignListProps {
    campaigns: Campaign[];
    subscribersCount: number;
    onCreate?: () => void;
    onEdit?: (campaign: Campaign) => void;
    onSend?: (campaignId: string) => Promise<void>;
    onDelete?: (campaignId: string) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | CampaignStatus;

const CampaignList: React.FC<CampaignListProps> = ({
    campaigns,
    subscribersCount,
    onCreate,
    onEdit,
    onSend,
    onDelete,
    isLoading = false,
    className = ''
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and search campaigns
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => {
            // Status filter
            if (filterStatus !== 'all' && campaign.status !== filterStatus) {
                return false;
            }

            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    campaign.name.toLowerCase().includes(query) ||
                    campaign.subject.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [campaigns, filterStatus, searchQuery]);

    // Statistics
    const stats = useMemo(() => {
        return {
            total: campaigns.length,
            draft: campaigns.filter(c => c.status === 'draft').length,
            scheduled: campaigns.filter(c => c.status === 'scheduled').length,
            sending: campaigns.filter(c => c.status === 'sending').length,
            sent: campaigns.filter(c => c.status === 'sent').length
        };
    }, [campaigns]);

    const getStatusBadge = (status: CampaignStatus) => {
        const badges = {
            draft: {
                bg: 'bg-slate-100 dark:bg-slate-800',
                text: 'text-slate-600 dark:text-slate-400',
                label: 'Entwurf',
                icon: PencilIcon
            },
            scheduled: {
                bg: 'bg-blue-100 dark:bg-blue-900/30',
                text: 'text-blue-600 dark:text-blue-400',
                label: 'Geplant',
                icon: ClockIcon
            },
            sending: {
                bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                text: 'text-yellow-600 dark:text-yellow-400',
                label: 'Wird gesendet...',
                icon: SendIcon
            },
            sent: {
                bg: 'bg-green-100 dark:bg-green-900/30',
                text: 'text-green-600 dark:text-green-400',
                label: 'Gesendet',
                icon: CheckCircleIcon
            }
        };
        const badge = badges[status];
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                <Icon className="w-3.5 h-3.5" />
                {badge.label}
            </span>
        );
    };

    const calculateOpenRate = (campaign: Campaign): number => {
        if (campaign.stats.sent_count === 0) return 0;
        return Math.round((campaign.stats.open_count / campaign.stats.sent_count) * 100);
    };

    const calculateClickRate = (campaign: Campaign): number => {
        if (campaign.stats.open_count === 0) return 0;
        return Math.round((campaign.stats.click_count / campaign.stats.open_count) * 100);
    };

    const handleSend = async (campaignId: string) => {
        if (!onSend) return;
        if (!confirm('Möchtest du diese Kampagne wirklich jetzt senden?')) return;
        await onSend(campaignId);
    };

    const handleDelete = async (campaignId: string) => {
        if (!onDelete) return;
        if (!confirm('Möchtest du diese Kampagne wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
        await onDelete(campaignId);
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
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <MailIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                            <p className="text-sm text-slate-500">Gesamt</p>
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
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                            <PencilIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.draft}</p>
                            <p className="text-sm text-slate-500">Entwürfe</p>
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
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.scheduled}</p>
                            <p className="text-sm text-slate-500">Geplant</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.sent}</p>
                            <p className="text-sm text-slate-500">Gesendet</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                            <UserMinusIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{subscribersCount}</p>
                            <p className="text-sm text-slate-500">Abonnenten</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                            title="Listenansicht"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                            title="Kachelansicht"
                        >
                            <LayoutGridIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">Alle Status</option>
                            <option value="draft">Entwurf</option>
                            <option value="scheduled">Geplant</option>
                            <option value="sending">Sendet...</option>
                            <option value="sent">Gesendet</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 sm:flex-none">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Suche..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Create Button */}
                {onCreate && (
                    <button
                        onClick={onCreate}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Neue Kampagne
                    </button>
                )}
            </div>

            {/* Campaign List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredCampaigns.length === 0 ? (
                    <div className="p-12 text-center">
                        <MailIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                            {campaigns.length === 0
                                ? 'Noch keine Kampagnen vorhanden'
                                : 'Keine Kampagnen gefunden'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        <AnimatePresence>
                            {filteredCampaigns.map((campaign, index) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                                                    {campaign.name}
                                                </h3>
                                                {getStatusBadge(campaign.status)}
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mb-3 truncate">
                                                {campaign.subject}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <SendIcon className="w-4 h-4" />
                                                    {campaign.stats.sent_count} gesendet
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <EyeIcon className="w-4 h-4" />
                                                    {campaign.stats.open_count} ({calculateOpenRate(campaign)}%)
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MousePointerClickIcon className="w-4 h-4" />
                                                    {campaign.stats.click_count} ({calculateClickRate(campaign)}%)
                                                </span>
                                                {campaign.scheduled_for && campaign.status === 'scheduled' && (
                                                    <span className="flex items-center gap-1.5">
                                                        <ClockIcon className="w-4 h-4" />
                                                        {new Date(campaign.scheduled_for).toLocaleDateString('de-DE', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {campaign.status === 'draft' && onSend && (
                                                <button
                                                    onClick={() => handleSend(campaign.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
                                                    title="Jetzt senden"
                                                >
                                                    <SendIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(campaign)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                    title="Bearbeiten"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => handleDelete(campaign.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                    title="Löschen"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignList;
