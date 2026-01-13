// ============================================
// CONTENT EDITOR
// Edit website content with live validation
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIContentGenerator } from './AIContentGenerator';
import type { ContentConfig } from './Configurator';
import { VALIDATION_LIMITS } from './constants';

export { type ContentConfig };

interface ContentEditorProps {
    content: ContentConfig;
    onChange: (content: ContentConfig) => void;
    readOnly?: boolean;
}

export const ContentEditor = ({
    content,
    onChange,
    readOnly = false
}: ContentEditorProps) => {
    const [localContent, setLocalContent] = useState(content);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setLocalContent(content);
    }, [content]);

    /**
     * Validates a single content field based on type and length constraints
     * @param field - The field key to validate
     * @param value - The value to validate
     * @returns Error message if validation fails, null otherwise
     */
    const validateField = (field: keyof ContentConfig, value: ContentConfig[keyof ContentConfig]): string | null => {
        switch (field) {
            case 'headline':
                if (!value || typeof value !== 'string' || value.trim().length < VALIDATION_LIMITS.HEADLINE_MIN) {
                    return `Headline muss mindestens ${VALIDATION_LIMITS.HEADLINE_MIN} Zeichen lang sein`;
                }
                if (value.length > VALIDATION_LIMITS.HEADLINE_MAX) {
                    return `Headline darf maximal ${VALIDATION_LIMITS.HEADLINE_MAX} Zeichen lang sein`;
                }
                break;
            case 'subheadline':
                if (value && typeof value === 'string' && value.length > VALIDATION_LIMITS.SUBHEADLINE_MAX) {
                    return `Subheadline darf maximal ${VALIDATION_LIMITS.SUBHEADLINE_MAX} Zeichen lang sein`;
                }
                break;
            case 'aboutText':
                if (!value || typeof value !== 'string' || value.trim().length < VALIDATION_LIMITS.ABOUT_TEXT_MIN) {
                    return `Über-uns Text muss mindestens ${VALIDATION_LIMITS.ABOUT_TEXT_MIN} Zeichen lang sein`;
                }
                if (value.length > VALIDATION_LIMITS.ABOUT_TEXT_MAX) {
                    return `Text darf maximal ${VALIDATION_LIMITS.ABOUT_TEXT_MAX} Zeichen lang sein`;
                }
                break;
            case 'services':
                if (!value || !Array.isArray(value) || value.length === 0) {
                    return 'Mindestens ein Service erforderlich';
                }
                break;
        }
        return null;
    };

    const handleChange = (field: keyof ContentConfig, value: ContentConfig[keyof ContentConfig]) => {
        const updated = { ...localContent, [field]: value };
        setLocalContent(updated);

        // Validate on change if field was touched
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({
                ...prev,
                [field]: error || ''
            }));
        }

        // Auto-save after debouncing could be added here
        onChange(updated);
    };

    const handleBlur = (field: keyof ContentConfig) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, localContent[field]);
        setErrors(prev => ({
            ...prev,
            [field]: error || ''
        }));
    };

    const handleAddService = () => {
        const services = [...localContent.services, ''];
        handleChange('services', services);
    };

    const handleRemoveService = (index: number) => {
        const services = localContent.services.filter((_, i) => i !== index);
        handleChange('services', services);
    };

    const handleServiceChange = (index: number, value: string) => {
        const services = [...localContent.services];
        services[index] = value;
        handleChange('services', services);
    };

    /**
     * Formats character count display text
     * @param text - The text to count
     * @param max - Maximum allowed characters
     * @returns Formatted string like "45/100"
     */
    const getCharacterCount = (text: string, max: number) => {
        return `${text.length}/${max}`;
    };

    /**
     * Determines color class based on character usage percentage
     * @param text - The text to check
     * @param max - Maximum allowed characters
     * @returns Tailwind color class string
     */
    const getCharacterCountColor = (text: string, max: number) => {
        const percentage = (text.length / max) * 100;
        if (percentage >= 100) return 'text-red-500';
        if (percentage >= 80) return 'text-orange-500';
        return 'text-dark-text/50 dark:text-light-text/50';
    };

    return (
        <div className="space-y-6">
            {/* Headline */}
            <div>
                <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-2">
                    Headline <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={localContent.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    onBlur={() => handleBlur('headline')}
                    disabled={readOnly}
                    placeholder="Ihr Erfolg beginnt hier"
                    className={`w-full px-4 py-2 border rounded-md bg-surface dark:bg-dark-surface text-dark-text dark:text-light-text
                        ${errors.headline ? 'border-red-500' : 'border-dark-text/20 dark:border-light-text/20'}
                        ${readOnly ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    maxLength={VALIDATION_LIMITS.HEADLINE_MAX}
                />
                <div className="flex justify-between mt-1">
                    <AnimatePresence>
                        {errors.headline && touched.headline && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-red-500"
                            >
                                {errors.headline}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <span className={`text-sm ${getCharacterCountColor(localContent.headline, VALIDATION_LIMITS.HEADLINE_MAX)}`}>
                        {getCharacterCount(localContent.headline, VALIDATION_LIMITS.HEADLINE_MAX)}
                    </span>
                </div>
            </div>

            {/* Subheadline */}
            <div>
                <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-2">
                    Subheadline
                </label>
                <input
                    type="text"
                    value={localContent.subheadline}
                    onChange={(e) => handleChange('subheadline', e.target.value)}
                    onBlur={() => handleBlur('subheadline')}
                    disabled={readOnly}
                    placeholder="Professionelle Websites für Ihr Business"
                    className={`w-full px-4 py-2 border rounded-md bg-surface dark:bg-dark-surface text-dark-text dark:text-light-text
                        ${errors.subheadline ? 'border-red-500' : 'border-dark-text/20 dark:border-light-text/20'}
                        ${readOnly ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    maxLength={VALIDATION_LIMITS.SUBHEADLINE_MAX}
                />
                <div className="flex justify-between mt-1">
                    <AnimatePresence>
                        {errors.subheadline && touched.subheadline && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-red-500"
                            >
                                {errors.subheadline}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <span className={`text-sm ${getCharacterCountColor(localContent.subheadline, VALIDATION_LIMITS.SUBHEADLINE_MAX)}`}>
                        {getCharacterCount(localContent.subheadline, VALIDATION_LIMITS.SUBHEADLINE_MAX)}
                    </span>
                </div>
            </div>

            {/* About Text */}
            <div>
                <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-2">
                    Über-uns Text <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={localContent.aboutText}
                    onChange={(e) => handleChange('aboutText', e.target.value)}
                    onBlur={() => handleBlur('aboutText')}
                    disabled={readOnly}
                    placeholder="Wir sind Ihr Partner für professionelle Webseiten-Lösungen..."
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-md bg-surface dark:bg-dark-surface text-dark-text dark:text-light-text resize-none
                        ${errors.aboutText ? 'border-red-500' : 'border-dark-text/20 dark:border-light-text/20'}
                        ${readOnly ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    maxLength={VALIDATION_LIMITS.ABOUT_TEXT_MAX}
                />
                <div className="flex justify-between mt-1">
                    <AnimatePresence>
                        {errors.aboutText && touched.aboutText && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-red-500"
                            >
                                {errors.aboutText}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <span className={`text-sm ${getCharacterCountColor(localContent.aboutText, VALIDATION_LIMITS.ABOUT_TEXT_MAX)}`}>
                        {getCharacterCount(localContent.aboutText, VALIDATION_LIMITS.ABOUT_TEXT_MAX)}
                    </span>
                </div>
            </div>

            {/* Services */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-dark-text dark:text-light-text">
                        Services <span className="text-red-500">*</span>
                    </label>
                    {!readOnly && (
                        <button
                            onClick={handleAddService}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            + Service hinzufügen
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    {localContent.services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => handleServiceChange(index, e.target.value)}
                                disabled={readOnly}
                                placeholder={`Service ${index + 1}`}
                                className={`flex-1 px-4 py-2 border rounded-md bg-surface dark:bg-dark-surface text-dark-text dark:text-light-text
                                    ${errors.services ? 'border-red-500' : 'border-dark-text/20 dark:border-light-text/20'}
                                    ${readOnly ? 'cursor-not-allowed opacity-50' : ''}
                                `}
                            />
                            {!readOnly && localContent.services.length > 1 && (
                                <button
                                    onClick={() => handleRemoveService(index)}
                                    className="px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                    aria-label="Service entfernen"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {errors.services && touched.services && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-red-500 mt-1 block"
                        >
                            {errors.services}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* AI Helper */}
            <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-dark-text dark:text-light-text mb-1">
                            AI Content Generator
                        </h4>
                        <p className="text-xs text-dark-text/60 dark:text-light-text/60 mb-2">
                            Lassen Sie KI Ihre Inhalte generieren oder verbessern.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsAIGeneratorOpen(true)}
                            disabled={readOnly}
                            className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Content generieren →
                        </button>
                    </div>
                </div>
            </div>

            {/* Validation Info */}
            <div className="mt-4 p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                <p className="text-xs text-dark-text/60 dark:text-light-text/60">
                    <span className="font-medium">Hinweis:</span> Felder mit <span className="text-red-500">*</span> sind Pflichtfelder.
                </p>
            </div>

            {/* AI Content Generator Modal */}
            <AIContentGenerator
                isOpen={isAIGeneratorOpen}
                onClose={() => setIsAIGeneratorOpen(false)}
                onContentGenerated={(generatedContent) => {
                    const updated = {
                        ...localContent,
                        headline: generatedContent.headline,
                        subheadline: generatedContent.subheadline,
                        aboutText: generatedContent.aboutText
                    };
                    setLocalContent(updated);
                    onChange(updated);
                }}
                currentContent={localContent}
            />
        </div>
    );
};
