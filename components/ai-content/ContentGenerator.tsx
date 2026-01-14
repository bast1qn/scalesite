// ============================================
// AI CONTENT GENERATOR - Main Container
// Content Type Selection, Input Forms, Generation Trigger, Loading States, Result Display
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndustrySelector } from './IndustrySelector';
import { KeywordInput } from './KeywordInput';
import { ToneSelector, ToneType } from './ToneSelector';
import {
    ContentGenerationOptions,
    GeneratedContent,
    AIContentService
} from '../../lib/ai-content';

// ============================================
// TYPES & INTERFACES
// ============================================

export type ContentType = 'headline' | 'about' | 'service' | 'blog' | 'product' | 'faq' | 'testimonial';

interface ContentTypeOption {
    id: ContentType;
    name: string;
    nameDe: string;
    description: string;
    icon: string;
    requiresAdditionalInfo: boolean;
}

interface ContentGeneratorProps {
    onGenerate?: (content: GeneratedContent) => void;
    onSaveContent?: (content: GeneratedContent) => Promise<void>;
    projectId?: string;
    disabled?: boolean;
    defaultContentType?: ContentType;
}

// ============================================
// CONTENT TYPE OPTIONS
// ============================================

const CONTENT_TYPES: ContentTypeOption[] = [
    {
        id: 'headline',
        name: 'Headline',
        nameDe: 'Überschrift',
        description: 'Aufmerksamkeitsstarke Titel für Ihre Website',
        icon: '✨',
        requiresAdditionalInfo: false
    },
    {
        id: 'about',
        name: 'About Us',
        nameDe: 'Über uns',
        description: 'Über uns Seite mit Ihrer Geschichte',
        icon: '🏢',
        requiresAdditionalInfo: false
    },
    {
        id: 'service',
        name: 'Service Description',
        nameDe: 'Dienstleistungsbeschreibung',
        description: 'Detaillierte Beschreibung Ihrer Dienstleistungen',
        icon: '⚙️',
        requiresAdditionalInfo: false
    },
    {
        id: 'blog',
        name: 'Blog Post',
        nameDe: 'Blog-Artikel',
        description: 'Vollständiger Blog-Beitrag zu einem Thema',
        icon: '📝',
        requiresAdditionalInfo: true
    },
    {
        id: 'product',
        name: 'Product Description',
        nameDe: 'Produktbeschreibung',
        description: 'Überzeugende Produktbeschreibung',
        icon: '🛍️',
        requiresAdditionalInfo: false
    },
    {
        id: 'faq',
        name: 'FAQ',
        nameDe: 'FAQ',
        description: 'Häufig gestellte Fragen mit Antworten',
        icon: '❓',
        requiresAdditionalInfo: false
    },
    {
        id: 'testimonial',
        name: 'Testimonial',
        nameDe: 'Kundenreferenz',
        description: 'Authentische Kundenbewertung',
        icon: '⭐',
        requiresAdditionalInfo: false
    }
];

// ============================================
// MAIN COMPONENT
// ============================================

export function ContentGenerator({
    onGenerate,
    onSaveContent,
    projectId,
    disabled = false,
    defaultContentType = 'headline'
}: ContentGeneratorProps) {
    // Form State
    const [contentType, setContentType] = useState<ContentType>(defaultContentType);
    const [industry, setIndustry] = useState<string>('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [tone, setTone] = useState<ToneType>('professional');
    const [additionalInput, setAdditionalInput] = useState('');

    // Loading & Error States
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Result State
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [currentVariation, setCurrentVariation] = useState(0);

    // Validate form
    const isFormValid = industry.length > 0;

    // Handle content type change
    const handleContentTypeChange = (type: ContentType) => {
        setContentType(type);
        setGeneratedContent(null);
        setError(null);
        setAdditionalInput('');
    };

    // Handle generate content
    const handleGenerate = useCallback(async () => {
        if (!isFormValid || isGenerating || disabled) {
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedContent(null);

        try {
            // Build generation options
            const options: ContentGenerationOptions = {
                type: contentType,
                industry,
                keywords,
                tone,
                language: 'de'
            };

            // Generate content based on type
            let result: GeneratedContent;

            switch (contentType) {
                case 'headline':
                    result = await AIContentService.generateHeadline(options);
                    break;

                case 'about':
                    result = await AIContentService.generateAboutContent({
                        ...options,
                        companyName: 'Ihr Unternehmen'
                    });
                    break;

                case 'service':
                    result = await AIContentService.generateServiceDescription(
                        additionalInput || 'Ihre Dienstleistung',
                        {
                            ...options,
                            keyFeatures: keywords,
                            benefits: []
                        }
                    );
                    break;

                case 'blog':
                    if (!additionalInput.trim()) {
                        setError('Bitte geben Sie ein Thema für den Blog-Artikel ein');
                        setIsGenerating(false);
                        return;
                    }
                    result = await AIContentService.generateBlogPost({
                        ...options,
                        topic: additionalInput,
                        wordCount: 800
                    });
                    break;

                case 'product':
                    result = await AIContentService.generateProductDescription(
                        additionalInput || 'Ihr Produkt',
                        options
                    );
                    break;

                case 'faq':
                    result = await AIContentService.generateFAQ({
                        ...options,
                        topic: additionalInput,
                        count: 5
                    });
                    break;

                case 'testimonial':
                    result = await AIContentService.generateTestimonial({
                        ...options,
                        customerType: additionalInput || 'zufriedener Kunde'
                    });
                    break;

                default:
                    throw new Error('Unbekannter Inhaltstyp');
            }

            setGeneratedContent(result);
            setCurrentVariation(0);

            // Call onGenerate callback
            onGenerate?.(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
            setError(errorMessage);
            if (import.meta.env.DEV) {
                console.error('Content generation failed:', err);
            }
        } finally {
            setIsGenerating(false);
        }
    }, [contentType, industry, keywords, tone, additionalInput, isGenerating, disabled, isFormValid, onGenerate]);

    // Handle save content
    const handleSaveContent = async () => {
        if (!generatedContent || !onSaveContent) {
            return;
        }

        try {
            await onSaveContent(generatedContent);
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Failed to save content:', err);
            }
            setError('Inhalt konnte nicht gespeichert werden');
        }
    };

    // Get current content type info
    const currentTypeInfo = CONTENT_TYPES.find(t => t.id === contentType)!;

    return (
        <div className="space-y-6">
            {/* Content Type Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Inhaltstyp wählen
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {CONTENT_TYPES.map((type) => (
                        <motion.button
                            key={type.id}
                            type="button"
                            onClick={() => handleContentTypeChange(type.id)}
                            disabled={disabled}
                            whileHover={{ scale: disabled ? 1 : 1.02 }}
                            whileTap={{ scale: disabled ? 1 : 0.98 }}
                            className={`
                                relative p-4 rounded-lg border-2 text-center transition-all duration-200
                                ${disabled
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                    : contentType === type.id
                                        ? 'bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-violet-500 dark:border-violet-400 shadow-md'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                                }
                            `}
                        >
                            {/* Icon */}
                            <span className="text-2xl mb-2 block">{type.icon}</span>

                            {/* Name */}
                            <div className={`text-sm font-semibold mb-1
                                ${contentType === type.id
                                    ? 'text-violet-600 dark:text-violet-400'
                                    : 'text-gray-900 dark:text-white'
                                }
                            `}>
                                {type.nameDe}
                            </div>

                            {/* Description */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                {type.description}
                            </div>

                            {/* Selected Indicator */}
                            {contentType === type.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center"
                                >
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                {/* Industry Selector */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Branche *
                    </label>
                    <IndustrySelector
                        value={industry}
                        onChange={setIndustry}
                        placeholder="Wählen Sie Ihre Branche..."
                        disabled={disabled || isGenerating}
                    />
                </div>

                {/* Keywords Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Keywords (optional)
                    </label>
                    <KeywordInput
                        value={keywords}
                        onChange={setKeywords}
                        placeholder="Keywords hinzufügen..."
                        disabled={disabled || isGenerating}
                    />
                </div>

                {/* Tone Selector */}
                <ToneSelector
                    value={tone}
                    onChange={setTone}
                    disabled={disabled || isGenerating}
                    layout="grid"
                />

                {/* Additional Input (for blog topics, product names, etc.) */}
                {currentTypeInfo.requiresAdditionalInfo && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            {contentType === 'blog' && 'Thema für Blog-Artikel *'}
                            {contentType === 'service' && 'Dienstleistungsname (optional)'}
                            {contentType === 'product' && 'Produktname (optional)'}
                            {contentType === 'faq' && 'Spezifisches Thema (optional)'}
                            {contentType === 'testimonial' && 'Kundentyp (optional)'}
                        </label>
                        <input
                            type="text"
                            value={additionalInput}
                            onChange={(e) => setAdditionalInput(e.target.value)}
                            placeholder={
                                contentType === 'blog' ? 'z.B. "Die Bedeutung von SEO im Jahr 2025"' : 'Optional...'
                            }
                            disabled={disabled || isGenerating}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <motion.button
                type="button"
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating || disabled}
                whileHover={{ scale: isFormValid && !isGenerating && !disabled ? 1.02 : 1 }}
                whileTap={{ scale: isFormValid && !isGenerating && !disabled ? 0.98 : 1 }}
                className={`
                    w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                    flex items-center justify-center gap-3
                    ${!isFormValid || isGenerating || disabled
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                    }
                `}
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Inhalt wird generiert...</span>
                    </>
                ) : (
                    <>
                        <span className="text-2xl">✨</span>
                        <span>Inhalt generieren</span>
                    </>
                )}
            </motion.button>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                                    Generierung fehlgeschlagen
                                </h4>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generated Content Display */}
            <AnimatePresence>
                {generatedContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {/* Success Header */}
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <h4 className="font-semibold text-green-600 dark:text-green-400">
                                    Inhalt erfolgreich generiert!
                                </h4>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    {currentTypeInfo.nameDe} mit Tonfall "{tone}"
                                </p>
                            </div>
                        </div>

                        {/* Content Display */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Content Header */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{currentTypeInfo.icon}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {currentTypeInfo.nameDe}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {generatedContent.metadata.industry}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {/* Copy Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedContent.content);
                                            }}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                                            title="In Zwischenablage kopieren"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>

                                        {/* Save Button */}
                                        {onSaveContent && (
                                            <button
                                                type="button"
                                                onClick={handleSaveContent}
                                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                                </svg>
                                                Speichern
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    {contentType === 'headline' ? (
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            {generatedContent.content}
                                        </h2>
                                    ) : (
                                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {generatedContent.content}
                                        </div>
                                    )}
                                </div>

                                {/* Variations */}
                                {generatedContent.variations.length > 1 && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                            Alternative Versionen
                                        </h4>
                                        <div className="space-y-2">
                                            {generatedContent.variations.map((variation, index) => (
                                                <motion.button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setCurrentVariation(index)}
                                                    className={`
                                                        w-full p-3 rounded-lg text-left transition-all duration-200
                                                        ${currentVariation === index
                                                            ? 'bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-500 dark:border-violet-400'
                                                            : 'bg-gray-50 dark:bg-gray-900 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                        }
                                                    `}
                                                >
                                                    <div className={`text-sm font-medium mb-1
                                                        ${currentVariation === index
                                                            ? 'text-violet-600 dark:text-violet-400'
                                                            : 'text-gray-900 dark:text-white'
                                                        }
                                                    `}>
                                                        Version {index + 1}
                                                        {currentVariation === index && ' (Aktiv)'}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                        {variation}
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
