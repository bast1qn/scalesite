// React imports
import React, { useState, useEffect, useCallback } from 'react';

// Third-party imports
// None

// Internal imports
import { api } from '../../lib';
import { useLanguage } from '../../contexts';
import {
    CheckCircleIcon,
    ClockIcon,
    CursorClickIcon,
    EnvelopeIcon,
    EyeIcon,
    PaperAirplaneIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UsersIcon,
    XMarkIcon,
} from '../index';

// Types
interface Subscriber {
    id: string;
    name: string | null;
    email: string;
    created_at: string;
}

interface Campaign {
    id: string;
    name: string;
    subject: string;
    preview_text: string | null;
    content: string;
    target_segment: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent';
    scheduled_for: string | null;
    sent_count: number;
    open_count: number;
    click_count: number;
    unsubscribe_count: number;
    created_at: string;
    sent_at: string | null;
}

type TabType = 'campaigns' | 'subscribers';

// Constants
const NEWSLETTER_TABS: { id: TabType; label: string }[] = [
    { id: 'campaigns', label: 'Kampagnen' },
    { id: 'subscribers', label: 'Abonnenten' }
];

const NewsletterManager: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('campaigns');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    // Campaign Form State
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [campaignForm, setCampaignForm] = useState({
        name: '',
        subject: '',
        preview_text: '',
        content: '',
        target_segment: 'all',
        scheduled_for: ''
    });

    /**
     * Fetches campaigns and subscribers data
     */
    const fetchData = async () => {
        setLoading(true);
        try {
            const [campaignsRes, subscribersRes] = await Promise.all([
                api.getCampaigns(),
                api.getSubscribers()
            ]);
            setCampaigns(campaignsRes.data || []);
            setSubscribers(subscribersRes.data || []);
        } catch (e) {
            // Error fetching data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Opens campaign modal for create or edit
     * ✅ PERFORMANCE: Memoized with useCallback to prevent recreation on every render
     */
    const openCampaignModal = useCallback((campaign?: Campaign) => {
        if (campaign) {
            setEditingCampaign(campaign);
            setCampaignForm({
                name: campaign.name,
                subject: campaign.subject,
                preview_text: campaign.preview_text || '',
                content: campaign.content,
                target_segment: campaign.target_segment,
                scheduled_for: campaign.scheduled_for ? new Date(campaign.scheduled_for).toISOString().slice(0, 16) : ''
            });
        } else {
            setEditingCampaign(null);
            setCampaignForm({
                name: '',
                subject: '',
                preview_text: '',
                content: '',
                target_segment: 'all',
                scheduled_for: ''
            });
        }
        setShowCampaignModal(true);
    }, []);

    /**
     * Handles campaign form submission (create or update)
     * ✅ PERFORMANCE: Memoized with useCallback to prevent recreation
     */
    const handleCampaignSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCampaign) {
                await api.updateCampaign(editingCampaign.id, {
                    ...campaignForm,
                    scheduled_for: campaignForm.scheduled_for || undefined
                });
            } else {
                await api.createCampaign(campaignForm);
            }
            setShowCampaignModal(false);
            fetchData();
        } catch (e) {
            // Error saving campaign
        }
    }, [editingCampaign, campaignForm]);

    /**
     * Sends campaign immediately
     * ✅ PERFORMANCE: Memoized with useCallback to prevent recreation
     */
    const handleSendCampaign = useCallback(async (campaignId: string) => {
        if (!confirm('Möchtest du diese Kampagne wirklich jetzt senden?')) return;
        try {
            await api.sendCampaign(campaignId);
            fetchData();
        } catch (e) {
            // Error sending campaign
        }
    }, []);

    /**
     * Deletes campaign by ID
     * ✅ PERFORMANCE: Memoized with useCallback to prevent recreation
     */
    const handleDeleteCampaign = useCallback(async (campaignId: string) => {
        if (!confirm('Möchtest du diese Kampagne wirklich löschen?')) return;
        try {
            await api.deleteCampaign(campaignId);
            fetchData();
        } catch (e) {
            // Error deleting campaign
        }
    }, []);

    /**
     * Deletes subscriber by ID
     * ✅ PERFORMANCE: Memoized with useCallback to prevent recreation
     */
    const handleDeleteSubscriber = useCallback(async (subscriberId: string) => {
        if (!confirm('Möchtest du diesen Abonnenten wirklich entfernen?')) return;
        try {
            await api.deleteSubscriber(subscriberId);
            fetchData();
        } catch (e) {
            // Error deleting subscriber
        }
    }, []);

    // ✅ PERFORMANCE: Memoized tab switch handlers
    const handleCampaignsTabClick = useCallback(() => setActiveTab('campaigns'), []);
    const handleSubscribersTabClick = useCallback(() => setActiveTab('subscribers'), []);

    // ✅ PERFORMANCE: Memoized modal close handler
    const handleCloseModal = useCallback(() => setShowCampaignModal(false), []);

    // ✅ PERFORMANCE: Memoized input change handlers
    const handleInputChange = useCallback((field: keyof typeof campaignForm, value: string) => {
        setCampaignForm(prev => ({ ...prev, [field]: value }));
    }, []);

    /**
     * Returns status badge styling and label
     */
    const getStatusBadge = useCallback((status: Campaign['status']) => {
        const badges = {
            draft: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: 'Entwurf' },
            scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'Geplant' },
            sending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', label: 'Wird gesendet...' },
            sent: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Gesendet' }
        };
        const badge = badges[status];
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    }, []);

    /**
     * Calculates open rate percentage
     * ✅ PERFORMANCE: Memoized to prevent recalculation
     */
    const openRate = useCallback((campaign: Campaign) => {
        if (campaign.sent_count === 0) return 0;
        return Math.round((campaign.open_count / campaign.sent_count) * 100);
    }, []);

    /**
     * Calculates click rate percentage
     * ✅ PERFORMANCE: Memoized to prevent recalculation
     */
    const clickRate = useCallback((campaign: Campaign) => {
        if (campaign.open_count === 0) return 0;
        return Math.round((campaign.click_count / campaign.open_count) * 100);
    }, []);

    // ✅ PERFORMANCE: Memoized button click handler for new campaign
    const handleNewCampaignClick = useCallback(() => openCampaignModal(), [openCampaignModal]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Newsletter Management</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Erstelle und verwalte deine Newsletter-Kampagnen
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex gap-8">
                    <button
                        onClick={handleCampaignsTabClick}
                        className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                            activeTab === 'campaigns'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Kampagnen
                    </button>
                    <button
                        onClick={handleSubscribersTabClick}
                        className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                            activeTab === 'subscribers'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Abonnenten ({subscribers.length})
                    </button>
                </nav>
            </div>

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <EnvelopeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{campaigns.length}</p>
                                    <p className="text-sm text-slate-500">Gesamt</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                                    <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {campaigns.filter(c => c.status === 'draft').length}
                                    </p>
                                    <p className="text-sm text-slate-500">Entwürfe</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {campaigns.filter(c => c.status === 'sent').length}
                                    </p>
                                    <p className="text-sm text-slate-500">Gesendet</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                                    <UsersIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{subscribers.length}</p>
                                    <p className="text-sm text-slate-500">Abonnenten</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campaign List */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kampagnen</h2>
                            <button
                                onClick={handleNewCampaignClick}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Neue Kampagne
                            </button>
                        </div>

                        {campaigns.length === 0 ? (
                            <div className="p-12 text-center">
                                <EnvelopeIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">Keine Kampagnen vorhanden</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {campaigns.map((campaign) => (
                                    <div key={campaign.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {campaign.name}
                                                    </h3>
                                                    {getStatusBadge(campaign.status)}
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 mb-2">{campaign.subject}</p>
                                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <PaperAirplaneIcon className="w-4 h-4" />
                                                        {campaign.sent_count} gesendet
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <EyeIcon className="w-4 h-4" />
                                                        {campaign.open_count} ({openRate(campaign)}%)
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CursorClickIcon className="w-4 h-4" />
                                                        {campaign.click_count} ({clickRate(campaign)}%)
                                                    </span>
                                                    {campaign.scheduled_for && (
                                                        <span className="flex items-center gap-1">
                                                            <ClockIcon className="w-4 h-4" />
                                                            {new Date(campaign.scheduled_for).toLocaleDateString('de-DE')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {campaign.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleSendCampaign(campaign.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
                                                        title="Senden"
                                                    >
                                                        <PaperAirplaneIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openCampaignModal(campaign)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                    title="Bearbeiten"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCampaign(campaign.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                    title="Löschen"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Abonnenten ({subscribers.length})
                        </h2>
                    </div>

                    {subscribers.length === 0 ? (
                        <div className="p-12 text-center">
                            <UsersIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">Keine Abonnenten vorhanden</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {subscribers.map((subscriber) => (
                                <div key={subscriber.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {subscriber.name || 'Unbekannt'}
                                            </p>
                                            <p className="text-sm text-slate-500">{subscriber.email}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Angemeldet: {new Date(subscriber.created_at).toLocaleDateString('de-DE')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteSubscriber(subscriber.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                            title="Entfernen"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Campaign Modal */}
            {showCampaignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingCampaign ? 'Kampagne bearbeiten' : 'Neue Kampagne'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCampaignSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={campaignForm.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="z.B. Monatlicher Newsletter Januar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Betreff *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={campaignForm.subject}
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Dein Januar-Update ist da!"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Preview Text
                                </label>
                                <input
                                    type="text"
                                    value={campaignForm.preview_text}
                                    onChange={(e) => handleInputChange('preview_text', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Kurze Vorschau für Email-Clients"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Inhalt *
                                </label>
                                <textarea
                                    required
                                    value={campaignForm.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    rows={12}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
                                    placeholder="HTML oder Text Inhalt..."
                                />
                                <p className="mt-1 text-xs text-slate-500">Du kannst HTML verwenden</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Zielgruppe
                                </label>
                                <select
                                    value={campaignForm.target_segment}
                                    onChange={(e) => handleInputChange('target_segment', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="all">Alle Abonnenten</option>
                                    <option value="new">Neue Abonnenten (letzte 30 Tage)</option>
                                    <option value="active">Aktive (hat letzte Kampagne geöffnet)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Zeitplan (optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={campaignForm.scheduled_for}
                                    onChange={(e) => handleInputChange('scheduled_for', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <p className="mt-1 text-xs text-slate-500">Leer lassen für sofortigen Versand oder Draft</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    {editingCampaign ? 'Aktualisieren' : 'Erstellen'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsletterManager;
