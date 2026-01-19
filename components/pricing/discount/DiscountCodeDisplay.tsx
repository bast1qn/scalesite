// ============================================
// DISCOUNT CODE DISPLAY COMPONENT
// Shows applied discount code with details
// ============================================

import { motion } from '@/lib/motion';
import { CheckBadgeIcon, XMarkIcon } from '../../Icons';
import { formatPrice, type DiscountCode } from '../../../lib/pricing';
import { useLanguage } from '../../../contexts';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DiscountCodeDisplayProps {
    code: string;
    discount: DiscountCode;
    subtotal: number;
    currency: string;
    showSavedAmount: boolean;
    onRemove: () => void;
}

// ============================================
// DISCOUNT CODE DISPLAY COMPONENT
// ============================================

export const DiscountCodeDisplay: React.FC<DiscountCodeDisplayProps> = ({
    code,
    discount,
    subtotal,
    currency,
    showSavedAmount,
    onRemove
}) => {
    const { t } = useLanguage();

    const calculateSavedAmount = (): number => {
        if (!discount || subtotal === 0) return 0;

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
                            {code}
                        </div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {discount.type === 'percentage'
                                ? `${discount.value}% Rabatt aktiviert`
                                : `${formatPrice(discount.value, currency)} Rabatt aktiviert`
                            }
                        </div>
                    </div>
                </div>

                <button
                    onClick={onRemove}
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
    );
};

export default DiscountCodeDisplay;
