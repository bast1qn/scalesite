// ============================================
// DISCOUNT COMPACT VARIANT COMPONENT
// Compact inline input variant
// ============================================

import { CheckBadgeIcon, XMarkIcon } from '../../Icons';
import { formatPrice, type DiscountCode } from '../../../lib/pricing';
import { useLanguage } from '../../../contexts';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DiscountCompactVariantProps {
    code: string;
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    appliedCode: string | null;
    discount: DiscountCode | null;
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
// DISCOUNT COMPACT VARIANT COMPONENT
// ============================================

export const DiscountCompactVariant: React.FC<DiscountCompactVariantProps> = ({
    code,
    status,
    appliedCode,
    discount,
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
        <div>
            {!appliedCode ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
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
                        onClick={onApply}
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
                        onClick={onRemove}
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
};

export default DiscountCompactVariant;
