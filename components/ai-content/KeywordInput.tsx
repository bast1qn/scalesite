// ============================================
// AI CONTENT GENERATOR - Keyword Input
// Tag Input System with Suggestions & Validation
// ============================================

import { useState, useRef, useEffect, KeyboardEvent, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES & INTERFACES
// ============================================

interface KeywordInputProps {
    value: string[];
    onChange: (keywords: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    maxKeywords?: number;
    minKeywordLength?: number;
    maxKeywordLength?: number;
    disabled?: boolean;
    allowDuplicates?: boolean;
}

// ============================================
// COMMON KEYWORD SUGGESTIONS
// ============================================

const DEFAULT_SUGGESTIONS = [
    // Technology
    'Innovation', 'Cloud', 'AI', 'Machine Learning', 'Automation', 'Digital', 'Tech',

    // Business
    'Growth', 'Scale', 'Profit', 'Revenue', 'Efficiency', 'Professional', 'Expert',

    // Marketing
    'SEO', 'Social Media', 'Content', 'Branding', 'Marketing', 'Conversion',

    // Quality
    'Quality', 'Premium', 'Reliable', 'Secure', 'Fast', 'Easy', 'Simple',

    // Customer
    'Customer', 'Support', 'Satisfaction', 'Experience', 'User-friendly',

    // Results
    'Results', 'Success', 'Performance', 'Optimization', 'Solution'
];

// ============================================
// MAIN COMPONENT
// ============================================

export function KeywordInput({
    value,
    onChange,
    suggestions = DEFAULT_SUGGESTIONS,
    placeholder = 'Keywords eingeben...',
    maxKeywords = 10,
    minKeywordLength = 2,
    maxKeywordLength = 30,
    disabled = false,
    allowDuplicates = false
}: KeywordInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Memoize filtered suggestions to prevent recalculation on every render
    const filteredSuggestions = useMemo(() => {
        return suggestions.filter(suggestion => {
            const matchesInput = suggestion.toLowerCase().includes(inputValue.toLowerCase());
            const notAlreadyAdded = allowDuplicates || !value.includes(suggestion);
            return matchesInput && notAlreadyAdded && inputValue.length > 0;
        });
    }, [suggestions, inputValue, value, allowDuplicates]);

    // Handle clicking outside to close suggestions
    // ✅ FIXED: containerRef is stable, empty deps is correct
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []); // ✅ VERIFIED: containerRef is stable (useRef), no deps needed

    // Validate and add keyword
    const addKeyword = useCallback((keyword: string) => {
        const trimmed = keyword.trim();

        // Clear previous errors
        setError(null);

        // Validation checks
        if (trimmed.length < minKeywordLength) {
            setError(`Keyword muss mindestens ${minKeywordLength} Zeichen lang sein`);
            return;
        }

        if (trimmed.length > maxKeywordLength) {
            setError(`Keyword darf maximal ${maxKeywordLength} Zeichen lang sein`);
            return;
        }

        if (!allowDuplicates && value.includes(trimmed)) {
            setError('Dieses Keyword wurde bereits hinzugefügt');
            return;
        }

        if (value.length >= maxKeywords) {
            setError(`Maximum von ${maxKeywords} Keywords erreicht`);
            return;
        }

        // Add keyword
        onChange([...value, trimmed]);
        setInputValue('');
        setShowSuggestions(false);
    }, [value, allowDuplicates, maxKeywords, maxKeywordLength, minKeywordLength, onChange]);

    // Remove keyword
    const removeKeyword = useCallback((indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
        setError(null);
    }, [value, onChange]);

    // Handle keyboard input
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addKeyword(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            // Remove last keyword when backspace is pressed on empty input
            removeKeyword(value.length - 1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }, [inputValue, value, addKeyword, removeKeyword]);

    // Handle suggestion click
    const handleSuggestionClick = useCallback((suggestion: string) => {
        addKeyword(suggestion);
    }, [addKeyword]);

    // Handle input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setShowSuggestions(true);
        setError(null);
    }, []);

    // Can add more keywords?
    const canAddMore = value.length < maxKeywords;

    return (
        <div ref={containerRef} className="relative">
            {/* Keywords Display & Input */}
            <div
                className={`
                    min-h-[48px] p-3 rounded-xl border-2 bg-white dark:bg-gray-800
                    flex flex-wrap gap-2 transition-all duration-200
                    ${disabled
                        ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                        : error
                            ? 'border-red-500 dark:border-red-400 focus-within:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus-within:border-violet-500 dark:focus-within:border-violet-400'
                    }
                `}
            >
                {/* Keyword Tags */}
                <AnimatePresence>
                    {value.map((keyword, index) => (
                        <motion.span
                            key={`${keyword}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg text-sm font-medium shadow-md min-h-11"
                        >
                            <span>{keyword}</span>

                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeKeyword(index)}
                                    className="hover:bg-white/20 rounded-md p-1 transition-colors min-h-7 min-w-7 flex items-center justify-center"
                                    aria-label={`Remove ${keyword}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </motion.span>
                    ))}
                </AnimatePresence>

                {/* Input Field */}
                {canAddMore && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        disabled={disabled}
                        placeholder={value.length === 0 ? placeholder : ''}
                        className="flex-1 min-w-[120px] px-2 py-2 min-h-11 text-gray-900 dark:text-white placeholder-gray-500 bg-transparent focus:outline-none"
                    />
                )}

                {/* Max Keywords Warning */}
                {!canAddMore && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 py-1.5 px-2">
                        Maximum erreicht
                    </span>
                )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyword Count */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                    {value.length} von {maxKeywords} Keywords
                </span>
                {value.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onChange([])}
                        disabled={disabled}
                        className="text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Alle entfernen
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-48 overflow-hidden"
                    >
                        <div className="py-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Vorschläge
                            </div>

                            {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                                <button
                                    key={`${suggestion}-${index}`}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-3 py-3 min-h-11 text-left text-gray-900 dark:text-white hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="flex-1">{suggestion}</span>
                                    <span className="text-xs text-gray-500">
                                        {suggestion.length} Zeichen
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Add Suggestions */}
            {value.length < maxKeywords && inputValue.length === 0 && !disabled && (
                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 py-2">
                        Schnellauswahl:
                    </span>
                    {suggestions.slice(0, 5).map((suggestion) => {
                        const isAdded = !allowDuplicates && value.includes(suggestion);
                        return (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => !isAdded && addKeyword(suggestion)}
                                disabled={isAdded}
                                className={`
                                    px-3 py-2 min-h-11 rounded-lg text-xs font-medium transition-all duration-200
                                    ${isAdded
                                        ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-not-allowed opacity-50'
                                        : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 hover:scale-[1.01] active:scale-[0.99]'
                                    }
                                `}
                            >
                                + {suggestion}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
