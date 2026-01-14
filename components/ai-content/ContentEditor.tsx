// ============================================
// AI CONTENT EDITOR
// In-place editing with rich features, word count, and version history
// ============================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES & INTERFACES
// ============================================

interface ContentVersion {
    id: string;
    content: string;
    timestamp: string;
    author: string;
    changeDescription?: string;
}

interface ContentEditorProps {
    initialContent: string;
    onSave?: (content: string, changeDescription?: string) => Promise<void>;
    onCancel?: () => void;
    readOnly?: boolean;
    maxLength?: number;
    placeholder?: string;
    showWordCount?: boolean;
    showCharCount?: boolean;
    enableVersionHistory?: boolean;
    autoSaveInterval?: number; // in milliseconds, 0 = disabled
    className?: string;
    disabled?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ContentEditor({
    initialContent,
    onSave,
    onCancel,
    readOnly = false,
    maxLength,
    placeholder = 'Hier Inhalt schreiben...',
    showWordCount = true,
    showCharCount = true,
    enableVersionHistory = true,
    autoSaveInterval = 0,
    className = '',
    disabled = false
}: ContentEditorProps) {
    // Content State
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(!readOnly);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Version History
    const [versions, setVersions] = useState<ContentVersion[]>([
        {
            id: 'initial',
            content: initialContent,
            timestamp: new Date().toISOString(),
            author: 'System',
            changeDescription: 'Initiale Version'
        }
    ]);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

    // Save State
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Change Description (for version history)
    const [changeDescription, setChangeDescription] = useState('');

    // Auto-save timer
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate stats
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = content.length;
    const charCountNoSpaces = content.replace(/\s/g, '').length;

    // Check if content is at max length
    const isAtMaxLength = maxLength && charCount >= maxLength;

    // Handle content change
    const handleContentChange = useCallback((newContent: string) => {
        // Enforce max length
        if (maxLength && newContent.length > maxLength) {
            newContent = newContent.substring(0, maxLength);
        }

        setContent(newContent);
        setHasUnsavedChanges(newContent !== initialContent);
        setSaveError(null);
    }, [initialContent, maxLength]);

    // Handle save
    const handleSave = async () => {
        if (disabled || isSaving || !hasUnsavedChanges) {
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            // Call parent save handler
            await onSave?.(content, changeDescription);

            // Add new version
            const newVersion: ContentVersion = {
                id: Date.now().toString(),
                content,
                timestamp: new Date().toISOString(),
                author: 'User',
                changeDescription: changeDescription || 'Inhalt aktualisiert'
            };

            setVersions(prev => [newVersion, ...prev]);
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            setChangeDescription('');

            // Exit edit mode if read-only was requested
            if (readOnly) {
                setIsEditing(false);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Speichern fehlgeschlagen';
            setSaveError(errorMessage);
            if (import.meta.env.DEV) {
                console.error('Save failed:', err);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setContent(initialContent);
        setHasUnsavedChanges(false);
        setChangeDescription('');
        onCancel?.();
    };

    // Handle restore version
    const handleRestoreVersion = (versionId: string) => {
        const version = versions.find(v => v.id === versionId);
        if (version) {
            setContent(version.content);
            setHasUnsavedChanges(true);
            setShowVersionHistory(false);
            setSelectedVersion(null);
        }
    };

    // Auto-save effect
    useEffect(() => {
        if (autoSaveInterval > 0 && hasUnsavedChanges && !disabled && !isSaving) {
            autoSaveTimerRef.current = setTimeout(() => {
                handleSave();
            }, autoSaveInterval);
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [content, hasUnsavedChanges, autoSaveInterval, disabled, isSaving]);

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }

        // Esc to cancel
        if (e.key === 'Escape' && hasUnsavedChanges) {
            handleCancel();
        }
    }, [handleSave, hasUnsavedChanges]);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Editor Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Inhalt bearbeiten
                    </h3>
                    {hasUnsavedChanges && (
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                            Ungespeichert
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                {!readOnly && (
                    <div className="flex items-center gap-2">
                        {/* Version History Button */}
                        {enableVersionHistory && versions.length > 1 && (
                            <motion.button
                                type="button"
                                onClick={() => setShowVersionHistory(!showVersionHistory)}
                                disabled={disabled}
                                whileHover={{ scale: disabled ? 1 : 1.05 }}
                                whileTap={{ scale: disabled ? 1 : 0.95 }}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                    ${disabled
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }
                                `}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </motion.button>
                        )}

                        {/* Cancel Button */}
                        {hasUnsavedChanges && (
                            <motion.button
                                type="button"
                                onClick={handleCancel}
                                disabled={disabled || isSaving}
                                whileHover={{ scale: disabled ? 1 : 1.05 }}
                                whileTap={{ scale: disabled ? 1 : 0.95 }}
                                className={`
                                    px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                    ${disabled || isSaving
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }
                                `}
                            >
                                Abbrechen
                            </motion.button>
                        )}

                        {/* Save Button */}
                        <motion.button
                            type="button"
                            onClick={handleSave}
                            disabled={disabled || isSaving || !hasUnsavedChanges}
                            whileHover={{ scale: disabled ? 1 : 1.05 }}
                            whileTap={{ scale: disabled ? 1 : 0.95 }}
                            className={`
                                px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                                ${disabled || isSaving || !hasUnsavedChanges
                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                                }
                            `}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Speichern...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Speichern
                                </>
                            )}
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Change Description Input */}
            {enableVersionHistory && hasUnsavedChanges && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <input
                        type="text"
                        value={changeDescription}
                        onChange={(e) => setChangeDescription(e.target.value)}
                        placeholder="Änderungsbeschreibung (optional)"
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    />
                </motion.div>
            )}

            {/* Text Editor */}
            <div className="relative">
                <textarea
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isSaving}
                    placeholder={placeholder}
                    readOnly={!isEditing}
                    maxLength={maxLength}
                    className={`
                        w-full min-h-[300px] p-4 rounded-xl border-2 resize-none transition-all duration-200
                        ${disabled || isSaving
                            ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
                            : isAtMaxLength
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600 text-gray-900 dark:text-white'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20'
                        }
                        font-mono text-sm leading-relaxed
                    `}
                />

                {/* Last Saved Indicator */}
                <AnimatePresence>
                    {lastSaved && !hasUnsavedChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-3 right-3 text-xs text-green-600 dark:text-green-400 flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Gespeichert um {lastSaved.toLocaleTimeString('de-DE')}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    {showWordCount && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{wordCount} Wörter</span>
                        </span>
                    )}
                    {showCharCount && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <span>{charCount} Zeichen</span>
                            <span className="text-gray-400">({charCountNoSpaces} ohne Leerzeichen)</span>
                        </span>
                    )}
                    {maxLength && (
                        <span className={isAtMaxLength ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                            {charCount} / {maxLength} Zeichen
                        </span>
                    )}
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="text-gray-400 dark:text-gray-500">
                    <span className="hidden sm:inline">⌘S = Speichern</span>
                    {hasUnsavedChanges && <span className="ml-2">Esc = Abbrechen</span>}
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {saveError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Version History Sidebar */}
            <AnimatePresence>
                {showVersionHistory && enableVersionHistory && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Versionsverlauf ({versions.length})
                        </h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {versions.map((version, index) => (
                                <motion.div
                                    key={version.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`
                                        p-3 rounded-lg border-2 transition-all duration-200
                                        ${selectedVersion === version.id
                                            ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-500 dark:border-violet-400'
                                            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                    {version.author}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(version.timestamp).toLocaleString('de-DE')}
                                                </span>
                                            </div>
                                            {version.changeDescription && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {version.changeDescription}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRestoreVersion(version.id)}
                                            disabled={disabled}
                                            className="px-2 py-1 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors disabled:opacity-50"
                                        >
                                            Wiederherstellen
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {version.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default ContentEditor;
