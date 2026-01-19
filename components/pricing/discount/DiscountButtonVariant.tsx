// ============================================
// DISCOUNT BUTTON VARIANT COMPONENT
// Button-triggered modal variant
// ============================================

import { motion, AnimatePresence } from '@/lib/motion';
import { TagIcon, CheckBadgeIcon, XMarkIcon, TicketIcon } from '../../Icons';
import { formatPrice, type DiscountCode } from '../../../lib/pricing';
import { useLanguage } from '../../../contexts';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DiscountButtonVariantProps {
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
    isExpanded: boolean;
    onCodeChange: (code: string) => void;
    onApply: () => void;
    onRemove: () => void;
    onToggleExpand: () => void;
}

// ============================================
// DISCOUNT BUTTON VARIANT COMPONENT
// ============================================

export const DiscountButtonVariant: React.FC<DiscountButtonVariantProps> = ({
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
    isExpanded,
    onCodeChange,
    onApply,
    onRemove,
    onToggleExpand
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
        <div>
            {!appliedCode ? (
                <button
                    onClick={onToggleExpand}
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
                            onClick={onRemove}
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
                            onClick={onToggleExpand}
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
                                    onClick={onToggleExpand}
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
                                    onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
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
                                        onApply();
                                        if (status === 'valid') {
                                            onToggleExpand();
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
};

export default DiscountButtonVariant;
