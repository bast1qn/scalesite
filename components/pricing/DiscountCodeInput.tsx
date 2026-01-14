// ============================================
// DISCOUNT CODE INPUT COMPONENT
// Week 8: Intelligent Pricing System - Advanced
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon, CheckBadgeIcon, XMarkIcon, LightBulbIcon, SparklesIcon } from '../Icons';
import { useLanguage } from '../../contexts';
import { validateDiscountCode, formatPrice, type DiscountCode } from '../../lib/pricing';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DiscountCodeInputProps {
    onCodeApplied?: (code: string, discount: DiscountCode) => void;
    onCodeRemoved?: () => void;
    currency?: string;
    subtotal?: number;                    // Subtotal to check minimum purchase
    variant?: 'input' | 'button' | 'compact'; // Display variant
    showSavedAmount?: boolean;            // Show amount saved
    placeholder?: string;                 // Custom placeholder
    className?: string;
    disabled?: boolean;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

// ============================================
// DISCOUNT CODE INPUT COMPONENT
// ============================================

export const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
    onCodeApplied,
    onCodeRemoved,
    currency = 'EUR',
    subtotal = 0,
    variant = 'input',
    showSavedAmount = true,
    placeholder,
    className = '',
    disabled = false
}) => {
    const { t, language } = useLanguage();
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<ValidationStatus>('idle');
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [discount, setDiscount] = useState<DiscountCode | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    // Load saved code from localStorage
    useEffect(() => {
        // SSR-Safety: Check if window is defined (not server-side)
        if (typeof window === 'undefined') return;

        const savedCode = localStorage.getItem('appliedDiscountCode');
        if (savedCode) {
            const validated = validateDiscountCode(savedCode);
            if (validated) {
                setAppliedCode(savedCode);
                setDiscount(validated);
                setStatus('valid');
            }
        }
    }, []);

    // Validate code (debounced)
    useEffect(() => {
        if (!code || code.trim().length === 0) {
            setStatus('idle');
            setErrorMessage('');
            return;
        }

        const timer = setTimeout(() => {
            validateCode(code.trim());
        }, 500);

        return () => clearTimeout(timer);
    }, [code, subtotal]);

    const validateCode = (inputCode: string) => {
        setStatus('validating');
        setErrorMessage('');

        const validated = validateDiscountCode(inputCode);

        if (!validated) {
            setStatus('invalid');
            setErrorMessage(t('pricing.discount.invalid') || 'Ungültiger Rabattcode');
            return;
        }

        // Check minimum purchase
        if (validated.minPurchase && subtotal < validated.minPurchase) {
            setStatus('invalid');
            setErrorMessage(
                (t('pricing.discount.min_purchase') || 'Mind. {amount} erforderlich')?.replace(
                    '{amount}',
                    formatPrice(validated.minPurchase, currency)
                )
            );
            return;
        }

        setStatus('valid');
        setDiscount(validated);
        setAppliedCode(inputCode);

        // Save to localStorage (SSR-safe)
        if (typeof window !== 'undefined') {
            localStorage.setItem('appliedDiscountCode', inputCode);
        }

        // Callback
        if (onCodeApplied) {
            onCodeApplied(inputCode, validated);
        }
    };

    const handleApply = () => {
        if (code.trim()) {
            validateCode(code.trim());
        }
    };

    const handleRemove = () => {
        setCode('');
        setAppliedCode(null);
        setDiscount(null);
        setStatus('idle');
        setErrorMessage('');

        // Remove from localStorage (SSR-safe)
        if (typeof window !== 'undefined') {
            localStorage.removeItem('appliedDiscountCode');
        }

        if (onCodeRemoved) {
            onCodeRemoved();
        }
    };

    const calculateSavedAmount = (): number => {
        if (!discount || !appliedCode || subtotal === 0) return 0;

        if (discount.type === 'percentage') {
            const amount = subtotal * (discount.value / 100);
            // Apply max discount limit
            if (discount.maxDiscount) {
                return Math.min(amount, discount.maxDiscount);
            }
            return amount;
        } else {
            return Math.min(discount.value, subtotal);
        }
    };

    const savedAmount = calculateSavedAmount();

    // Input Variant
    if (variant === 'input') {
        return (
            <div className={`space-y-3 ${className}`}>
                {/* Header with expand button */}
                {!isExpanded && !appliedCode && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        disabled={disabled}
                        className="
                            w-full flex items-center justify-center gap-2
                            px-4 py-3 rounded-xl
                            bg-slate-100 dark:bg-slate-800
                            border-2 border-dashed border-slate-300 dark:border-slate-600
                            text-slate-600 dark:text-slate-400
                            hover:border-primary-400 dark:hover:border-primary-500
                            hover:text-primary-600 dark:hover:text-primary-400
                            hover:bg-primary-50 dark:hover:bg-primary-900/10
                            transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        <TagIcon className="w-5 h-5" />
                        <span className="font-semibold">
                            {t('pricing.discount.add_code') || 'Rabattcode hinzufügen'}
                        </span>
                    </button>
                )}

                {/* Expanded input */}
                <AnimatePresence>
                    {(isExpanded || appliedCode) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="
                                p-4 bg-white dark:bg-slate-800
                                rounded-xl border border-slate-200 dark:border-slate-700
                            ">
                                {!appliedCode ? (
                                    /* Input Form */
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TagIcon className="w-5 h-5 text-primary-500" />
                                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                                {t('pricing.discount.title') || 'Rabattcode eingeben'}
                                            </h4>
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                                placeholder={
                                                    placeholder ||
                                                    (t('pricing.discount.placeholder') || 'z.B. WELCOME10')
                                                }
                                                disabled={disabled || status === 'validating'}
                                                className="
                                                    flex-1 px-4 py-2.5
                                                    bg-slate-50 dark:bg-slate-900
                                                    border border-slate-200 dark:border-slate-700
                                                    rounded-lg
                                                    text-slate-900 dark:text-white
                                                    placeholder:text-slate-400
                                                    focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
                                                    transition-all duration-200
                                                    disabled:opacity-50
                                                    font-mono uppercase
                                                "
                                                autoFocus
                                            />

                                            {status !== 'valid' && (
                                                <button
                                                    onClick={handleApply}
                                                    disabled={disabled || !code.trim() || status === 'validating'}
                                                    className="
                                                        px-5 py-2.5 rounded-lg
                                                        bg-gradient-to-r from-primary-600 to-violet-600
                                                        hover:from-primary-500 hover:to-violet-500
                                                        text-white font-semibold
                                                        shadow-md hover:shadow-lg
                                                        transition-all duration-200
                                                        disabled:opacity-50 disabled:cursor-not-allowed
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {status === 'validating' ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                            Prüfen...
                                                        </span>
                                                    ) : (
                                                        (t('pricing.discount.apply') || 'Anwenden')
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Validation Messages */}
                                        <AnimatePresence>
                                            {status === 'invalid' && errorMessage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="
                                                        flex items-center gap-2 p-3
                                                        bg-red-50 dark:bg-red-900/20
                                                        border border-red-200 dark:border-red-800/30
                                                        rounded-lg
                                                        text-red-700 dark:text-red-300 text-sm
                                                    "
                                                >
                                                    <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                                                    <span>{errorMessage}</span>
                                                </motion.div>
                                            )}

                                            {status === 'valid' && discount && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="
                                                        p-3
                                                        bg-emerald-50 dark:bg-emerald-900/20
                                                        border border-emerald-200 dark:border-emerald-800/30
                                                        rounded-lg
                                                    "
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                                <CheckBadgeIcon className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                                                                    {discount.code}
                                                                </div>
                                                                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                                                                    {discount.type === 'percentage'
                                                                        ? `${discount.value}% Rabatt`
                                                                        : `${formatPrice(discount.value, currency)} Rabatt`
                                                                    }
                                                                    {discount.maxPurchase && ` (max. ${formatPrice(discount.maxPurchase, currency)})`}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={handleRemove}
                                                            className="
                                                                p-1.5 rounded-lg
                                                                hover:bg-emerald-100 dark:hover:bg-emerald-900/30
                                                                text-emerald-600 dark:text-emerald-400
                                                                transition-all duration-200
                                                            "
                                                        >
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {showSavedAmount && savedAmount > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800/30"
                                                        >
                                                            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                                                                <SparklesIcon className="w-4 h-4" />
                                                                <span>
                                                                    Du sparst{' '}
                                                                    <strong>{formatPrice(savedAmount, currency)}</strong>
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Help text */}
                                        {status === 'idle' && (
                                            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                <LightBulbIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    {t('pricing.discount.help') ||
                                                        'Gib deinen Rabattcode ein und klicke auf "Anwenden"'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Applied Code Display */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="
                                            p-4
                                            bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20
                                            border border-emerald-200 dark:border-emerald-800/30
                                            rounded-xl
                                        "
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-md">
                                                    <CheckBadgeIcon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-emerald-700 dark:text-emerald-300 text-base">
                                                        {appliedCode}
                                                    </div>
                                                    <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                        {discount?.type === 'percentage'
                                                            ? `${discount?.value}% Rabatt aktiviert`
                                                            : `${formatPrice(discount?.value || 0, currency)} Rabatt aktiviert`
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleRemove}
                                                className="
                                                    p-2 rounded-lg
                                                    hover:bg-emerald-100 dark:hover:bg-emerald-900/30
                                                    text-emerald-600 dark:text-emerald-400
                                                    transition-all duration-200
                                                "
                                                title="Rabattcode entfernen"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {showSavedAmount && savedAmount > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/30"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                                        Du sparst:
                                                    </span>
                                                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                                        {formatPrice(savedAmount, currency)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Button Variant
    if (variant === 'button') {
        return (
            <div className={className}>
                {!appliedCode ? (
                    <button
                        onClick={() => setIsExpanded(true)}
                        disabled={disabled}
                        className="
                            w-full flex items-center justify-center gap-2
                            px-4 py-3 rounded-xl
                            bg-slate-100 dark:bg-slate-800
                            border border-slate-200 dark:border-slate-700
                            text-slate-700 dark:text-slate-300 font-semibold
                            hover:border-primary-400 hover:text-primary-600
                            hover:bg-primary-50 dark:hover:bg-primary-900/10
                            transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        <TagIcon className="w-5 h-5" />
                        <span>{t('pricing.discount.add_code') || 'Rabattcode'}</span>
                    </button>
                ) : (
                    <div className="
                        p-3 bg-emerald-50 dark:bg-emerald-900/20
                        rounded-lg border border-emerald-200 dark:border-emerald-800/30
                    ">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckBadgeIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                    {appliedCode}
                                </span>
                                {showSavedAmount && savedAmount > 0 && (
                                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                        (-{formatPrice(savedAmount, currency)})
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleRemove}
                                className="
                                    p-1.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30
                                    text-emerald-600 dark:text-emerald-400
                                    transition-all
                                "
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal for input */}
                <AnimatePresence>
                    {isExpanded && (
                        <>
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                                onClick={() => setIsExpanded(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="
                                    fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                                    md:w-full md:max-w-md
                                    bg-white dark:bg-slate-900
                                    rounded-2xl shadow-2xl
                                    z-50
                                    p-6
                                "
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TicketIcon className="w-5 h-5 text-primary-500" />
                                        {t('pricing.discount.title') || 'Rabattcode eingeben'}
                                    </h3>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="
                                            p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
                                            text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                                            transition-all
                                        "
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        placeholder={
                                            placeholder ||
                                            (t('pricing.discount.placeholder') || 'z.B. WELCOME10')
                                        }
                                        disabled={disabled || status === 'validating'}
                                        className="
                                            w-full px-4 py-3
                                            bg-slate-50 dark:bg-slate-800
                                            border border-slate-200 dark:border-slate-700
                                            rounded-xl
                                            text-slate-900 dark:text-white
                                            placeholder:text-slate-400
                                            focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
                                            transition-all duration-200
                                            disabled:opacity-50
                                            font-mono uppercase text-center text-lg
                                        "
                                        autoFocus
                                    />

                                    {/* Status messages */}
                                    {status === 'validating' && (
                                        <div className="flex items-center justify-center gap-2 text-slate-500">
                                            <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                                            <span>Code wird überprüft...</span>
                                        </div>
                                    )}

                                    {status === 'invalid' && errorMessage && (
                                        <div className="
                                            p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30
                                            rounded-lg text-red-700 dark:text-red-300 text-sm text-center
                                        ">
                                            {errorMessage}
                                        </div>
                                    )}

                                    {status === 'valid' && (
                                        <div className="
                                            p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30
                                            rounded-lg text-emerald-700 dark:text-emerald-300 text-center font-semibold
                                        ">
                                            ✓ Code angewendet!
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            handleApply();
                                            if (status === 'valid') {
                                                setIsExpanded(false);
                                            }
                                        }}
                                        disabled={disabled || !code.trim() || status === 'validating' || status === 'invalid'}
                                        className="
                                            w-full py-3 rounded-xl
                                            bg-gradient-to-r from-primary-600 to-violet-600
                                            hover:from-primary-500 hover:to-violet-500
                                            text-white font-semibold
                                            shadow-lg hover:shadow-xl
                                            transition-all duration-200
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        "
                                    >
                                        {status === 'valid'
                                            ? (t('pricing.discount.applied') || 'Angewendet!')
                                            : (t('pricing.discount.apply') || 'Anwenden')
                                        }
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Compact Variant
    if (variant === 'compact') {
        return (
            <div className={className}>
                {!appliedCode ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder={placeholder || 'Code'}
                            disabled={disabled || status === 'validating'}
                            className="
                                flex-1 px-3 py-2 text-sm
                                bg-slate-50 dark:bg-slate-800
                                border border-slate-200 dark:border-slate-700
                                rounded-lg
                                text-slate-900 dark:text-white
                                placeholder:text-slate-400
                                focus:outline-none focus:border-primary-500
                                transition-all duration-200
                                disabled:opacity-50
                                font-mono uppercase
                            "
                        />
                        <button
                            onClick={handleApply}
                            disabled={disabled || !code.trim() || status === 'validating'}
                            className="
                                px-4 py-2 rounded-lg
                                bg-primary-600 hover:bg-primary-500
                                text-white font-medium text-sm
                                transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {status === 'validating' ? '...' : (t('pricing.discount.apply') || 'Apply')}
                        </button>
                    </div>
                ) : (
                    <div className="
                        flex items-center justify-between
                        p-2 bg-emerald-50 dark:bg-emerald-900/20
                        rounded-lg border border-emerald-200 dark:border-emerald-800/30
                    ">
                        <div className="flex items-center gap-2">
                            <CheckBadgeIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">
                                {appliedCode}
                            </span>
                            {showSavedAmount && savedAmount > 0 && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                    -{formatPrice(savedAmount, currency)}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleRemove}
                            className="
                                p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30
                                text-emerald-600 dark:text-emerald-400
                                transition-all
                            "
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return null;
};

// ============================================
// DISCOUNT CODE BADGE COMPONENT
// ============================================

interface AppliedCodeBadgeProps {
    code: string;
    discount: DiscountCode;
    savedAmount: number;
    currency?: string;
    onRemove: () => void;
    variant?: 'default' | 'compact';
}

export const AppliedCodeBadge: React.FC<AppliedCodeBadgeProps> = ({
    code,
    discount,
    savedAmount,
    currency = 'EUR',
    onRemove,
    variant = 'default'
}) => {
    if (variant === 'compact') {
        return (
            <div className="
                inline-flex items-center gap-1.5 px-2.5 py-1
                bg-emerald-100 dark:bg-emerald-900/30
                border border-emerald-300 dark:border-emerald-700/50
                rounded-full
                text-emerald-700 dark:text-emerald-300 text-sm font-semibold
            ">
                <CheckBadgeIcon className="w-3.5 h-3.5" />
                <span>{code}</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                    (-{formatPrice(savedAmount, currency)})
                </span>
                <button
                    onClick={onRemove}
                    className="
                        ml-1 p-0.5 rounded-full
                        hover:bg-emerald-200 dark:hover:bg-emerald-800/50
                        transition-all
                    "
                >
                    <XMarkIcon className="w-3 h-3" />
                </button>
            </div>
        );
    }

    return (
        <div className="
            flex items-center justify-between
            p-3 bg-emerald-50 dark:bg-emerald-900/20
            border border-emerald-200 dark:border-emerald-800/30
            rounded-lg
        ">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckBadgeIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                    <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {code}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                        {discount.type === 'percentage'
                            ? `${discount.value}% Rabatt`
                            : `${formatPrice(discount.value, currency)} Rabatt`
                        }
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    -{formatPrice(savedAmount, currency)}
                </span>
                <button
                    onClick={onRemove}
                    className="
                        p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30
                        text-emerald-600 dark:text-emerald-400 transition-all
                    "
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// ============================================
// EXPORTS
// ============================================

export default DiscountCodeInput;
