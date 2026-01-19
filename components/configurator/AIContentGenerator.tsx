// ============================================
// AI CONTENT GENERATOR MODAL
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { XIcon, Wand2, Loader2 } from '../Icons';

interface AIContentGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onContentGenerated: (content: {
        headline: string;
        subheadline: string;
        aboutText: string;
    }) => void;
    currentContent?: {
        headline: string;
        subheadline: string;
        aboutText: string;
    };
}

export const AIContentGenerator = ({
    isOpen,
    onClose,
    onContentGenerated,
    currentContent
}: AIContentGeneratorProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [industry, setIndustry] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'persuasive'>('professional');
    const [generatedContent, setGeneratedContent] = useState<{
        headline: string;
        subheadline: string;
        aboutText: string;
    } | null>(null);

    const industries = [
        'Restaurant & Gastronomie',
        'Immobilien',
        'Architektur & Design',
        'E-Commerce',
        'Finanzberatung',
        'Anwaltskanzlei',
        'Agentur',
        'Handwerk',
        'Gesundheitswesen',
        'Bildung',
        'Technologie',
        'Sonstiges'
    ];

    const tones = [
        { value: 'professional', label: 'Professionell' },
        { value: 'casual', label: 'Locker' },
        { value: 'friendly', label: 'Freundlich' },
        { value: 'persuasive', label: 'Überzeugend' }
    ] as const;

    const handleGenerate = async () => {
        if (!industry || !companyName) {
            alert('Bitte füllen Sie alle Pflichtfelder aus');
            return;
        }

        setIsGenerating(true);

        try {
            // Import AI content generation function
            const { generateWebsiteContent } = await import('../../lib/ai-content');

            const result = await generateWebsiteContent({
                industry,
                companyName,
                targetAudience,
                tone,
                language: 'de'
            });

            if (result.success && result.content) {
                setGeneratedContent({
                    headline: result.content.headline || currentContent?.headline || '',
                    subheadline: result.content.subheadline || currentContent?.subheadline || '',
                    aboutText: result.content.aboutText || currentContent?.aboutText || ''
                });
            } else {
                alert('Inhalt konnte nicht generiert werden: ' + (result.error || 'Unbekannter Fehler'));
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error generating content:', error);
            }
            alert('Fehler bei der Generierung');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = () => {
        if (generatedContent) {
            onContentGenerated(generatedContent);
            handleClose();
        }
    };

    const handleClose = () => {
        setGeneratedContent(null);
        setIndustry('');
        setCompanyName('');
        setTargetAudience('');
        setTone('professional');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                                        <Wand2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            KI Content Generator
                                        </h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Lassen Sie KI Ihre Website-Inhalte erstellen
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6 space-y-6">
                            {!generatedContent ? (
                                <>
                                    {/* Industry Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                            Branche *
                                        </label>
                                        <select
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="">Bitte wählen...</option>
                                            {industries.map((ind) => (
                                                <option key={ind} value={ind}>
                                                    {ind}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Company Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                            Unternehmen / Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="z.B. Müller's Gasthaus"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    {/* Target Audience */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                            Zielgruppe
                                        </label>
                                        <input
                                            type="text"
                                            value={targetAudience}
                                            onChange={(e) => setTargetAudience(e.target.value)}
                                            placeholder="z.B. Familien, Geschäftsleute, Touristen"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    {/* Tone Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                            Tonfall
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {tones.map((t) => (
                                                <button
                                                    key={t.value}
                                                    onClick={() => setTone(t.value)}
                                                    className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                                                        tone === t.value
                                                            ? 'border-primary bg-primary/10 text-primary'
                                                            : 'border-slate-300 dark:border-slate-600 hover:border-primary/50'
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Generate Button */}
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !industry || !companyName}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-3"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Inhalt wird generiert...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="w-5 h-5" />
                                                Inhalt generieren
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Generated Content Preview */}
                                    <div className="space-y-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                                                ✓ Inhalt erfolgreich generiert!
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                Headline
                                            </h3>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {generatedContent.headline}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                Subheadline
                                            </h3>
                                            <p className="text-slate-900 dark:text-white">
                                                {generatedContent.subheadline}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                Über uns Text
                                            </h3>
                                            <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                                                {generatedContent.aboutText}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setGeneratedContent(null)}
                                            className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                                        >
                                            Neu generieren
                                        </button>
                                        <button
                                            onClick={handleApply}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-lg font-medium transition-all"
                                        >
                                            Übernehmen
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
