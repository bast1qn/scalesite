// ============================================
// DISCOUNT CODE INPUT COMPONENT
// Week 8: Intelligent Pricing System - Advanced
// Refactored: Split into sub-components for better maintainability
// ============================================

import { useState, useEffect } from 'react';
import { CheckBadgeIcon, XMarkIcon } from '../Icons';
import { validateDiscountCode, formatPrice, type DiscountCode } from '../../lib/pricing';
import { useLanguage } from '../../contexts';

import DiscountInputVariant from './discount/DiscountInputVariant';
import DiscountButtonVariant from './discount/DiscountButtonVariant';
import DiscountCompactVariant from './discount/DiscountCompactVariant';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DiscountCodeInputProps {
    onCodeApplied?: (code: string, discount: DiscountCode) => void;
    onCodeRemoved?: () => void;
    currency?: string;
    subtotal?: number;
    variant?: 'input' | 'button' | 'compact';
    showSavedAmount?: boolean;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

// ============================================
// CONSTANTS
// ============================================

const DISCOUNT_CODE_STORAGE_KEY = 'appliedDiscountCode';
const VALIDATION_DEBOUNCE_MS = 500;

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
    const { t } = useLanguage();

    // State
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<ValidationStatus>('idle');
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [discount, setDiscount] = useState<DiscountCode | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    // Load saved code from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedCode = localStorage.getItem(DISCOUNT_CODE_STORAGE_KEY);
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
        }, VALIDATION_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [code, subtotal]);

    // Handlers
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
                    validated.minPurchase.toString()
                )
            );
            return;
        }

        setStatus('valid');
        setDiscount(validated);
        setAppliedCode(inputCode);

        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(DISCOUNT_CODE_STORAGE_KEY, inputCode);
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

        // Remove from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem(DISCOUNT_CODE_STORAGE_KEY);
        }

        if (onCodeRemoved) {
            onCodeRemoved();
        }
    };

    // Render variant
    const commonProps = {
        code,
        status,
        appliedCode,
        discount,
        errorMessage,
        subtotal,
        currency,
        showSavedAmount,
        placeholder,
        disabled,
        onCodeChange: setCode,
        onApply: handleApply,
        onRemove: handleRemove
    };

    if (variant === 'input') {
        return (
            <div className={className}>
                <DiscountInputVariant
                    {...commonProps}
                    isExpanded={isExpanded}
                    onToggleExpand={() => setIsExpanded(!isExpanded)}
                />
            </div>
        );
    }

    if (variant === 'button') {
        return (
            <div className={className}>
                <DiscountButtonVariant
                    {...commonProps}
                    isExpanded={isExpanded}
                    onToggleExpand={() => setIsExpanded(!isExpanded)}
                />
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className={className}>
                <DiscountCompactVariant
                    {...commonProps}
                />
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
