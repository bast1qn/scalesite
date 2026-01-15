// ============================================
// DISCOUNT CODE FORM COMPONENT
// Reusable form for discount code input
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon, CheckBadgeIcon, XMarkIcon, LightBulbIcon, SparklesIcon } from '../../Icons';
import { formatPrice, type DiscountCode } from '../../../lib/pricing';
import { useLanguage } from '../../../contexts';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DiscountCodeFormProps {
    code: string;
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    appliedCode: string | null;
    discount: DiscountCode | null;
    errorMessage: string;
    subtotal: number;
    currency: string;
    showSavedAmount: boolean;
    placeholder?: string;
    disabled: boolean;
    onCodeChange: (code: string) => void;
    onApply: () => void;
    onRemove: () => void;
}

// ============================================
// DISCOUNT CODE FORM COMPONENT
// ============================================

export const DiscountCodeForm: React.FC<DiscountCodeFormProps> = ({
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
    onCodeChange,
    onApply,
    onRemove
}) => {
    const { t } = useLanguage();

    const calculateSavedAmount = (): number => {
        if (!discount || !appliedCode || subtotal === 0) return 0;

        if (discount.type === 'percentage') {
            const amount = subtotal * (discount.value / 100);
            if (discount.maxDiscount) {
                return Math.min(amount, discount.maxDiscount);
            }
            return amount;
        } else {
            return Math.min(discount.value, subtotal);
        }
    };

    const savedAmount = calculateSavedAmount();

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <TagIcon className="w-5 h-5 text-primary-500" />
                <h4 className="font-semibold text-slate-900 dark:text-white">
                    {t('pricing.discount.title') || 'Rabattcode eingeben'}
                </h4>
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
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
                        onClick={onApply}
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
                                onClick={onRemove}
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
    );
};

export default DiscountCodeForm;
