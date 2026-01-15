// ============================================
// DISCOUNT INPUT VARIANT COMPONENT
// Full-featured expandable input variant
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon } from '../../Icons';
import { type DiscountCode } from '../../../lib/pricing';
import DiscountCodeForm from './DiscountCodeForm';
import DiscountCodeDisplay from './DiscountCodeDisplay';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DiscountInputVariantProps {
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
// DISCOUNT INPUT VARIANT COMPONENT
// ============================================

export const DiscountInputVariant: React.FC<DiscountInputVariantProps> = ({
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
    return (
        <div className="space-y-3">
            {/* Header with expand button */}
            {!isExpanded && !appliedCode && (
                <button
                    onClick={onToggleExpand}
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
                    <span className="font-semibold">Rabattcode hinzufügen</span>
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
                                <DiscountCodeForm
                                    code={code}
                                    status={status}
                                    appliedCode={appliedCode}
                                    discount={discount}
                                    errorMessage={errorMessage}
                                    subtotal={subtotal}
                                    currency={currency}
                                    showSavedAmount={showSavedAmount}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    onCodeChange={onCodeChange}
                                    onApply={onApply}
                                    onRemove={onRemove}
                                />
                            ) : (
                                <DiscountCodeDisplay
                                    code={appliedCode}
                                    discount={discount}
                                    subtotal={subtotal}
                                    currency={currency}
                                    showSavedAmount={showSavedAmount}
                                    onRemove={onRemove}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DiscountInputVariant;
