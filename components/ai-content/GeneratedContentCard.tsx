// ============================================
// AI GENERATED CONTENT CARD
// Compact display card with actions for generated content
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedContent } from '../../lib/ai-content';

// ============================================
// TYPES & INTERFACES
// ============================================

interface GeneratedContentCardProps {
    content: GeneratedContent;
    onSelect?: (content: GeneratedContent) => void;
    onCopy?: (content: string) => void;
    onRegenerate?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    onSave?: (content: GeneratedContent) => void;
    isSelected?: boolean;
    isSaved?: boolean;
    showVariations?: boolean;
    compact?: boolean;
    disabled?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function GeneratedContentCard({
    content,
    onSelect,
    onCopy,
    onRegenerate,
    onDelete,
    onEdit,
    onSave,
    isSelected = false,
    isSaved = false,
    showVariations = true,
    compact = false,
    disabled = false
}: GeneratedContentCardProps) {
    const [currentVariation, setCurrentVariation] = useState(0);
    const [copySuccess, setCopySuccess] = useState(false);

    const currentContent = content.variations[currentVariation] || content.content;
    const wordCount = currentContent.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = currentContent.length;

    // Handle copy to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentContent);
            setCopySuccess(true);
            onCopy?.(currentContent);

            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Get content type icon
    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            headline: '✨',
            about: '🏢',
            service: '⚙️',
            blog: '📝',
            product: '🛍️',
            faq: '❓',
            testimonial: '⭐'
        };
        return icons[type] || '📄';
    };

    // Get content type label (German)
    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            headline: 'Überschrift',
            about: 'Über uns',
            service: 'Dienstleistung',
            blog: 'Blog-Artikel',
            product: 'Produktbeschreibung',
            faq: 'FAQ',
            testimonial: 'Kundenreferenz'
        };
        return labels[type] || type;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={disabled ? {} : { y: -2 }}
            className={`
                relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200
                ${isSelected
                    ? 'border-violet-500 dark:border-violet-400 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between">
                    {/* Content Type & Info */}
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{getTypeIcon(content.type)}</span>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {getTypeLabel(content.type)}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{content.metadata.industry}</span>
                                <span>•</span>
                                <span>{wordCount} Wörter</span>
                                <span>•</span>
                                <span>{new Date(content.metadata.generatedAt).toLocaleDateString('de-DE')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {/* Saved Indicator */}
                        {isSaved && (
                            <div className="mr-2 flex items-center gap-1 text-green-600 dark:text-green-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium">Gespeichert</span>
                            </div>
                        )}

                        {/* Copy Button */}
                        <motion.button
                            type="button"
                            onClick={handleCopy}
                            disabled={disabled}
                            whileHover={{ scale: disabled ? 1 : 1.1 }}
                            whileTap={{ scale: disabled ? 1 : 0.9 }}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50"
                            title="In Zwischenablage kopieren"
                        >
                            {copySuccess ? (
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </motion.button>

                        {/* Edit Button */}
                        {onEdit && (
                            <motion.button
                                type="button"
                                onClick={onEdit}
                                disabled={disabled}
                                whileHover={{ scale: disabled ? 1 : 1.1 }}
                                whileTap={{ scale: disabled ? 1 : 0.9 }}
                                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors disabled:opacity-50"
                                title="Bearbeiten"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </motion.button>
                        )}

                        {/* Regenerate Button */}
                        {onRegenerate && (
                            <motion.button
                                type="button"
                                onClick={onRegenerate}
                                disabled={disabled}
                                whileHover={{ scale: disabled ? 1 : 1.1 }}
                                whileTap={{ scale: disabled ? 1 : 0.9 }}
                                className="p-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-600 dark:text-violet-400 transition-colors disabled:opacity-50"
                                title="Neu generieren"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </motion.button>
                        )}

                        {/* Delete Button */}
                        {onDelete && (
                            <motion.button
                                type="button"
                                onClick={onDelete}
                                disabled={disabled}
                                whileHover={{ scale: disabled ? 1 : 1.1 }}
                                whileTap={{ scale: disabled ? 1 : 0.9 }}
                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                                title="Löschen"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
                {/* Content Preview */}
                <div className={`
                    prose dark:prose-invert max-w-none
                    ${compact ? 'text-sm' : ''}
                `}>
                    {content.type === 'headline' ? (
                        <h3 className={`font-bold text-gray-900 dark:text-white ${compact ? 'text-lg' : 'text-xl'}`}>
                            {currentContent}
                        </h3>
                    ) : (
                        <div className={`
                            whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed
                            ${compact ? 'line-clamp-3' : ''}
                        `}>
                            {currentContent}
                        </div>
                    )}
                </div>

                {/* Stats Bar */}
                {!compact && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                                <span>💡 {content.metadata.tone}</span>
                                <span>📝 {wordCount} Wörter</span>
                                <span>🔤 {charCount} Zeichen</span>
                            </div>
                            {content.metadata.keywords.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <span>🏷️</span>
                                    <span className="truncate max-w-[200px]">
                                        {content.metadata.keywords.slice(0, 3).join(', ')}
                                        {content.metadata.keywords.length > 3 && '...'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Card Footer - Variations & Actions */}
            {showVariations && content.variations.length > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between">
                        {/* Variation Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Versionen:
                            </span>
                            <div className="flex gap-1">
                                {content.variations.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        type="button"
                                        onClick={() => setCurrentVariation(index)}
                                        disabled={disabled}
                                        whileHover={{ scale: disabled ? 1 : 1.1 }}
                                        whileTap={{ scale: disabled ? 1 : 0.9 }}
                                        className={`
                                            w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200
                                            ${currentVariation === index
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                            }
                                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {index + 1}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Select/Save Button */}
                        <div className="flex gap-2">
                            {onSelect && !isSelected && (
                                <motion.button
                                    type="button"
                                    onClick={() => onSelect(content)}
                                    disabled={disabled}
                                    whileHover={{ scale: disabled ? 1 : 1.02 }}
                                    whileTap={{ scale: disabled ? 1 : 0.98 }}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${disabled
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white'
                                        }
                                    `}
                                >
                                    Auswählen
                                </motion.button>
                            )}

                            {onSave && !isSaved && (
                                <motion.button
                                    type="button"
                                    onClick={() => onSave(content)}
                                    disabled={disabled}
                                    whileHover={{ scale: disabled ? 1 : 1.02 }}
                                    whileTap={{ scale: disabled ? 1 : 0.98 }}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${disabled
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                        }
                                    `}
                                >
                                    Speichern
                                </motion.button>
                            )}

                            {isSelected && (
                                <div className="px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Ausgewählt
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Indicator Badge */}
            {isSelected && (
                <div className="absolute top-2 right-2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg"
                    >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default GeneratedContentCard;
