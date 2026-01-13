// ============================================
// VOLUME DISCOUNT COMPONENT
// Week 7: Visual Discount Tiers
// ============================================

import { useMemo } from 'react';
import { useLanguage } from '../../contexts';
import { getVolumeDiscount, type VolumeTier } from '../../lib/pricing';

interface VolumeDiscountProps {
    quantity: number;
    onQuantityChange?: (quantity: number) => void;
    currency?: string;
    showProgress?: boolean;
    showTiers?: boolean;
    editable?: boolean;
}

const DEFAULT_TIERS: VolumeTier[] = [
    { minQuantity: 5, discountPercentage: 10 },
    { minQuantity: 10, discountPercentage: 20 },
    { minQuantity: 25, discountPercentage: 30 },
    { minQuantity: 50, discountPercentage: 40 }
];

export const VolumeDiscount = ({
    quantity,
    onQuantityChange,
    currency = 'EUR',
    showProgress = true,
    showTiers = true,
    editable = true
}: VolumeDiscountProps) => {
    const { language } = useLanguage();

    // Calculate current discount
    const currentDiscount = useMemo(() => {
        return getVolumeDiscount(quantity);
    }, [quantity]);

    // Calculate progress to next tier
    const progressInfo = useMemo(() => {
        const currentTier = DEFAULT_TIERS.find(tier => quantity >= tier.minQuantity);
        const nextTier = DEFAULT_TIERS.find(tier => quantity < tier.minQuantity);

        if (!nextTier) {
            // Max tier reached
            return {
                currentTier: currentTier || null,
                nextTier: null,
                progress: 100,
                needed: 0
            };
        }

        const previousTierMin = currentTier?.minQuantity || 1;
        const range = nextTier.minQuantity - previousTierMin;
        const progress = ((quantity - previousTierMin) / range) * 100;
        const needed = nextTier.minQuantity - quantity;

        return {
            currentTier,
            nextTier,
            progress: Math.min(100, Math.max(0, progress)),
            needed
        };
    }, [quantity]);

    const handleQuickAdd = (amount: number) => {
        if (onQuantityChange && editable) {
            onQuantityChange(Math.max(1, quantity + amount));
        }
    };

    const handleSetQuantity = (qty: number) => {
        if (onQuantityChange && editable) {
            onQuantityChange(Math.max(1, qty));
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'de' ? 'Mengenrabatt' : 'Volume Discount'}
                </h3>
                {currentDiscount > 0 && (
                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                        -{currentDiscount}%
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {showProgress && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
                        <span>
                            {language === 'de' ? 'Aktuell' : 'Current'}: {quantity}
                        </span>
                        {progressInfo.nextTier && (
                            <span>
                                {progressInfo.nextTier.minQuantity} = {progressInfo.nextTier.discountPercentage}%
                            </span>
                        )}
                        {!progressInfo.nextTier && (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                ✓ {language === 'de' ? 'Maximum' : 'Maximum'}!
                            </span>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        {/* Background segments for each tier */}
                        <div className="absolute inset-0 flex">
                            {DEFAULT_TIERS.map((tier, index) => {
                                const previousMin = index === 0 ? 1 : DEFAULT_TIERS[index - 1].minQuantity;
                                const tierRange = tier.minQuantity - previousMin;
                                const tierPercent = (tierRange / 50) * 100; // Assuming max is 50

                                return (
                                    <div
                                        key={tier.minQuantity}
                                        className="h-full"
                                        style={{ width: `${tierPercent}%` }}
                                        title={`${tier.minQuantity}+ = ${tier.discountPercentage}%`}
                                    >
                                        <div
                                            className={`h-full transition-all duration-300 ${
                                                quantity >= tier.minQuantity
                                                    ? 'bg-gradient-to-r from-primary-500 to-violet-500'
                                                    : 'bg-slate-300 dark:bg-slate-600'
                                            }`}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress indicator */}
                        {progressInfo.nextTier && (
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white dark:bg-slate-900 shadow-lg transition-all duration-300"
                                style={{ left: `${(quantity / 50) * 100}%` }}
                            />
                        )}
                    </div>

                    {/* Tier markers */}
                    <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>1</span>
                        {DEFAULT_TIERS.map(tier => (
                            <span
                                key={tier.minQuantity}
                                className={quantity >= tier.minQuantity ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}
                            >
                                {tier.minQuantity}
                            </span>
                        ))}
                    </div>

                    {/* Next tier info */}
                    {progressInfo.nextTier && progressInfo.needed > 0 && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            {language === 'de' ? 'Noch' : 'Add'}{' '}
                            <span className="font-bold text-primary-600 dark:text-primary-400">{progressInfo.needed}</span>{' '}
                            {language === 'de' ? 'mehr für' : 'more for'}{' '}
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {progressInfo.nextTier.discountPercentage}%
                            </span>{' '}
                            {language === 'de' ? 'Discount' : 'discount'}
                        </p>
                    )}
                </div>
            )}

            {/* Quick Add Buttons */}
            {editable && progressInfo.nextTier && (
                <div className="mb-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        {language === 'de' ? 'Schnell hinzufügen:' : 'Quick add:'}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleQuickAdd(progressInfo.needed)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-primary-500 to-violet-600 hover:from-primary-600 hover:to-violet-700 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            +{progressInfo.needed} ({language === 'de' ? 'Rabatt sichern' : 'Get discount'})
                        </button>
                        <button
                            onClick={() => handleQuickAdd(1)}
                            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                            +1
                        </button>
                        <button
                            onClick={() => handleQuickAdd(5)}
                            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                            +5
                        </button>
                        <button
                            onClick={() => handleQuickAdd(10)}
                            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                            +10
                        </button>
                    </div>
                </div>
            )}

            {/* Discount Tiers Display */}
            {showTiers && (
                <div className="space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        {language === 'de' ? 'Discount-Stufen:' : 'Discount tiers:'}
                    </p>
                    {DEFAULT_TIERS.map((tier, index) => {
                        const isCurrentTier = quantity >= tier.minQuantity;
                        const isNextTier = progressInfo.nextTier?.minQuantity === tier.minQuantity;
                        const isPreviousTier = quantity < tier.minQuantity && !isNextTier;

                        return (
                            <div
                                key={tier.minQuantity}
                                className={`
                                    flex items-center justify-between p-3 rounded-lg transition-all
                                    ${isCurrentTier
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700'
                                        : isNextTier
                                            ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700 scale-105'
                                            : isPreviousTier
                                                ? 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 opacity-60'
                                                : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Status Icon */}
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center
                                        ${isCurrentTier
                                            ? 'bg-emerald-500 text-white'
                                            : isNextTier
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                        }
                                    `}>
                                        {isCurrentTier ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : isNextTier ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <span className="text-xs font-bold">{index + 1}</span>
                                        )}
                                    </div>

                                    {/* Tier info */}
                                    <div>
                                        <div className={`text-sm font-semibold ${isCurrentTier || isNextTier ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {tier.minQuantity}+ {language === 'de' ? 'Einheiten' : 'units'}
                                        </div>
                                        {isNextTier && (
                                            <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                                                {language === 'de' ? 'Nächste Stufe' : 'Next tier'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Discount percentage */}
                                <div className={`
                                    px-3 py-1 rounded-full text-sm font-bold
                                    ${isCurrentTier
                                        ? 'bg-emerald-500 text-white'
                                        : isNextTier
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                    }
                                `}>
                                    {tier.discountPercentage}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary */}
            {currentDiscount > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {language === 'de' ? 'Sie sparen' : 'You save'}
                        </span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {currentDiscount}%
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolumeDiscount;
