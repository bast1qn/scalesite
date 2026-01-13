import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XIcon,
    PencilIcon,
    EyeIcon,
    SparklesIcon,
    CodeIcon,
    LinkIcon,
    Image as ImageIcon,
    BoldIcon,
    ItalicIcon,
    ListIcon
} from 'lucide-react';
import EmailPreview from './EmailPreview';
import type { EmailPreviewProps } from './EmailPreview';
import { Campaign, CampaignStats } from './CampaignList';

/**
 * CampaignBuilder Component
 *
 * WYSIWYG campaign builder with live preview and scheduling
 *
 * @param campaign - Campaign to edit (null for new campaign)
 * @param onSave - Callback for saving campaign
 * @param onCancel - Callback for canceling
 * @param subscribersCount - Number of subscribers for estimation
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface CampaignData {
    name: string;
    subject: string;
    preview_text: string;
    content: string;
    target_segment: 'all' | 'new' | 'active';
    scheduled_for?: string;
}

export interface CampaignBuilderProps {
    campaign?: Campaign | null;
    onSave: (data: CampaignData) => Promise<void>;
    onCancel: () => void;
    subscribersCount: number;
    isLoading?: boolean;
    className?: string;
}

type TabType = 'edit' | 'preview';
type InsertType = 'heading' | 'text' | 'button' | 'image' | 'link' | 'divider' | 'spacer';

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
    campaign,
    onSave,
    onCancel,
    subscribersCount,
    isLoading = false,
    className = ''
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('edit');
    const [formData, setFormData] = useState<CampaignData>({
        name: '',
        subject: '',
        preview_text: '',
        content: '',
        target_segment: 'all',
        scheduled_for: ''
    });
    const [showInsertMenu, setShowInsertMenu] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initialize form with campaign data if editing
    useEffect(() => {
        if (campaign) {
            setFormData({
                name: campaign.name,
                subject: campaign.subject,
                preview_text: campaign.preview_text || '',
                content: campaign.content,
                target_segment: campaign.target_segment as CampaignData['target_segment'],
                scheduled_for: campaign.scheduled_for ? new Date(campaign.scheduled_for).toISOString().slice(0, 16) : ''
            });
        }
    }, [campaign]);

    // Auto-save draft to localStorage every 30 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            localStorage.setItem('newsletter_draft', JSON.stringify(formData));
        }, 30000);

        // Load draft on mount if no campaign
        if (!campaign) {
            const draft = localStorage.getItem('newsletter_draft');
            if (draft) {
                try {
                    const parsed = JSON.parse(draft);
                    if (confirm('Möchtest du den gespeicherten Entwurf wiederherstellen?')) {
                        setFormData(parsed);
                    }
                } catch (e) {
                    // Invalid draft, ignore
                }
            }
        }

        return () => clearInterval(timer);
    }, [formData, campaign]);

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.subject.trim() || !formData.content.trim()) {
            alert('Bitte fülle alle Pflichtfelder aus.');
            return;
        }

        setSaving(true);
        try {
            await onSave(formData);
            localStorage.removeItem('newsletter_draft');
        } finally {
            setSaving(false);
        }
    };

    const insertHTML = (type: InsertType) => {
        const inserts: Record<InsertType, string> = {
            heading: '<h2 style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #1e293b;">Deine Überschrift</h2>\n',
            text: '<p style="font-size: 16px; line-height: 1.6; margin: 15px 0; color: #475569;">Dein Text hier...</p>\n',
            button: '<div style="text-align: center; margin: 25px 0;">\n  <a href="#" style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Button Text</a>\n</div>\n',
            image: '<div style="text-align: center; margin: 25px 0;">\n  <img src="https://via.placeholder.com/600x300" alt="Bild" style="max-width: 100%; height: auto; border-radius: 8px;" />\n</div>\n',
            link: '<a href="#" style="color: #2563eb; text-decoration: underline;">Dein Link</a>',
            divider: '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />\n',
            spacer: '<div style="height: 20px;"></div>\n'
        };

        setFormData(prev => ({
            ...prev,
            content: prev.content + inserts[type]
        }));
        setShowInsertMenu(false);
    };

    const calculateEstimate = (): number => {
        const multipliers = {
            all: 1,
            new: 0.2, // 20% estimation for new subscribers
            active: 0.5 // 50% estimation for active subscribers
        };
        return Math.round(subscribersCount * multipliers[formData.target_segment]);
    };

    const getPreviewProps = (): EmailPreviewProps => ({
        subject: formData.subject,
        previewText: formData.preview_text,
        content: formData.content
    });

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}>
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onCancel}
            ></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {campaign ? 'Kampagne bearbeiten' : 'Neue Kampagne'}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {campaign ? `Bearbeitest: ${campaign.name}` : 'Erstelle eine neue Newsletter-Kampagne'}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                        <XIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-700 px-6 shrink-0">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                                activeTab === 'edit'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <PencilIcon className="w-4 h-4 inline mr-2" />
                            Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`pb-4 px-1 font-semibold text-sm transition-colors border-b-2 -mb-px ${
                                activeTab === 'preview'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <EyeIcon className="w-4 h-4 inline mr-2" />
                            Vorschau
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'edit' ? (
                            <motion.div
                                key="edit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full overflow-y-auto p-6"
                            >
                                <div className="max-w-3xl mx-auto space-y-6">
                                    {/* Campaign Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Kampagnenname *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="z.B. Monatlicher Newsletter Januar"
                                        />
                                    </div>

                                    {/* Subject Line */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Betreffzeile *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="Dein Januar-Update ist da!"
                                            maxLength={100}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                            {formData.subject.length}/100 Zeichen
                                        </p>
                                    </div>

                                    {/* Preview Text */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Preview Text
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.preview_text}
                                            onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="Kurze Vorschau für Email-Clients..."
                                            maxLength={150}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                            {formData.preview_text.length}/150 Zeichen
                                        </p>
                                    </div>

                                    {/* Target Segment */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Zielgruppe
                                        </label>
                                        <select
                                            value={formData.target_segment}
                                            onChange={(e) => setFormData({ ...formData, target_segment: e.target.value as CampaignData['target_segment'] })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        >
                                            <option value="all">Alle Abonnenten ({subscribersCount})</option>
                                            <option value="new">Neue Abonnenten - letzte 30 Tage (~{Math.round(subscribersCount * 0.2)})</option>
                                            <option value="active">Aktive (hat letzte Kampagne geöffnet) (~{Math.round(subscribersCount * 0.5)})</option>
                                        </select>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Geschätzte Empfänger: {calculateEstimate()}
                                        </p>
                                    </div>

                                    {/* Schedule */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Zeitpunkt senden (optional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.scheduled_for}
                                            onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                            Leer lassen für Entwurf (später senden)
                                        </p>
                                    </div>

                                    {/* HTML Content */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                                                Inhalt (HTML) *
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowInsertMenu(!showInsertMenu)}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        <SparklesIcon className="w-4 h-4" />
                                                        Einfügen
                                                    </button>

                                                    {/* Insert Menu */}
                                                    <AnimatePresence>
                                                        {showInsertMenu && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-10"
                                                            >
                                                                <button
                                                                    onClick={() => insertHTML('heading')}
                                                                    className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
                                                                >
                                                                    <BoldIcon className="w-4 h-4" />
                                                                    Überschrift
                                                                </button>
                                                                <button
                                                                    onClick={() => insertHTML('text')}
                                                                    className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                    Textabsatz
                                                                </button>
                                                                <button
                                                                    onClick={() => insertHTML('button')}
                                                                    className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
                                                                >
                                                                    <SparklesIcon className="w-4 h-4" />
                                                                    Button
                                                                </button>
                                                                <button
                                                                    onClick={() => insertHTML('image')}
                                                                    className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
                                                                >
                                                                    <ImageIcon className="w-4 h-4" />
                                                                    Bild
                                                                </button>
                                                                <button
                                                                    onClick={() => insertHTML('link')}
                                                                    className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
                                                                >
                                                                    <LinkIcon className="w-4 h-4" />
                                                                    Link
                                                                </button>
                                                                <button
                                                                    onClick={() => insertHTML('divider')}
                                                                    className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
                                                                >
                                                                    <div className="w-4 h-0.5 bg-slate-400" />
                                                                    Trennlinie
                                                                </button>
                                                                <button
                                                                    onClick={() => insertHTML('spacer')}
                                                                    className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
                                                                >
                                                                    <ListIcon className="w-4 h-4" />
                                                                    Abstand
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button
                                                    onClick={() => setActiveTab('preview')}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    Vorschau
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            rows={20}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
                                            placeholder="<!DOCTYPE html>&#10;<html>&#10;<body>&#10;  <!-- Dein HTML Code -->&#10;</body>&#10;</html>"
                                        />
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-slate-500">
                                                {formData.content.length} Zeichen
                                            </p>
                                            <button
                                                onClick={() => setActiveTab('preview')}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Live Vorschau öffnen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6"
                            >
                                <div className="max-w-4xl mx-auto">
                                    <EmailPreview {...getPreviewProps()} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || isLoading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                Speichert...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <SparklesIcon className="w-5 h-5" />
                                                                {campaign ? 'Aktualisieren' : 'Erstellen'}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                };

                                export default CampaignBuilder;
