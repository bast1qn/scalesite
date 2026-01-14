// ============================================
// PRICE BREAKDOWN COMPONENT
// Week 7: Detailed Price Display
// ============================================

import { useMemo } from 'react';
import { useCurrency, useLanguage } from '../../contexts';
import type { PriceBreakdown } from '../../lib/pricing';
import { getDiscountPercentage } from '../../lib/pricing';

interface PriceBreakdownDisplayProps {
    breakdown: PriceBreakdown;
    showLineItems?: boolean;
    showTax?: boolean;
    showSavings?: boolean;
    compact?: boolean;
    variant?: 'default' | 'card' | 'minimal';
}

export const PriceBreakdownDisplay = ({
    breakdown,
    showLineItems = true,
    showTax = true,
    showSavings = true,
    compact = false,
    variant = 'default'
}: PriceBreakdownDisplayProps) => {
    const { language } = useLanguage();
    const { formatPrice } = useCurrency();

    // Calculate savings
    const savings = useMemo(() => {
        return calculateSavings(breakdown);
    }, [breakdown]);

    // Calculate discount percentage
    const discountPercent = useMemo(() => {
        return getDiscountPercentage(breakdown);
    }, [breakdown]);

    // Format classes based on variant
    const containerClasses = useMemo(() => {
        switch (variant) {
            case 'card':
                return 'bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden';
            case 'minimal':
                return 'space-y-1';
            default:
                return 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden';
        }
    }, [variant]);

    const renderLineItems = () => {
        if (!showLineItems || breakdown.breakdown.length === 0) return null;

        return (
            <div className="space-y-2">
                {breakdown.breakdown.map((item, index) => {
                    const isDiscount = item.amount < 0;
                    const isTax = item.description.includes('Tax') || item.description.includes('MwSt');

                    return (
                        <div
                            key={`${item.description}-${item.amount}-${index}`}
                            className={`flex justify-between items-start ${
                                compact ? 'text-xs' : 'text-sm'
                            }`}
                        >
                            <div className="flex-1">
                                <span className={`
                                    ${isDiscount
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : isTax
                                            ? 'text-slate-600 dark:text-slate-400'
                                            : 'text-slate-700 dark:text-slate-300'
                                    }
                                `}>
                                    {item.description}
                                    {item.quantity > 1 && !isDiscount && (
                                        <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                                            ×{item.quantity}
                                        </span>
                                    )}
                                </span>
                                {item.discount !== undefined && (
                                    <span className="ml-2 text-xs text-primary-600 dark:text-primary-400 font-medium">
                                        (-{item.discount}%)
                                    </span>
                                )}
                            </div>
                            <span className={`
                                font-medium ml-4
                                ${isDiscount
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-900 dark:text-white'
                                }
                            `}>
                                {isDiscount ? '-' : ''}{formatPrice(Math.abs(item.amount))}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderSummary = () => {
        return (
            <div className="space-y-2">
                {/* Subtotal */}
                <div className={`flex justify-between items-center ${compact ? 'text-xs' : 'text-sm'}`}>
                    <span className="text-slate-600 dark:text-slate-400">
                        {language === 'de' ? 'Zwischensumme' : 'Subtotal'}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                        {formatPrice(breakdown.subtotal)}
                    </span>
                </div>

                {/* Volume Discount */}
                {breakdown.volumeDiscount > 0 && (
                    <div className={`flex justify-between items-center ${compact ? 'text-xs' : 'text-sm'}`}>
                        <span className="text-slate-600 dark:text-slate-400">
                            {language === 'de' ? 'Mengenrabatt' : 'Volume Discount'}
                            {breakdown.quantity >= 5 && (
                                <span className="ml-1 text-xs text-primary-600 dark:text-primary-400">
                                    ({breakdown.quantity >= 50 ? '40%' : breakdown.quantity >= 25 ? '30%' : breakdown.quantity >= 10 ? '20%' : '10%'})
                                </span>
                            )}
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            -{formatPrice(breakdown.volumeDiscount)}
                        </span>
                    </div>
                )}

                {/* Feature Discount */}
                {breakdown.featureDiscount > 0 && (
                    <div className={`flex justify-between items-center ${compact ? 'text-xs' : 'text-sm'}`}>
                        <span className="text-slate-600 dark:text-slate-400">
                            {language === 'de' ? 'Feature-Rabatt' : 'Feature Discount'}
                            <span className="ml-1 text-xs text-primary-600 dark:text-primary-400">
                                (10%)
                            </span>
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            -{formatPrice(breakdown.featureDiscount)}
                        </span>
                    </div>
                )}

                {/* Promo Discount */}
                {breakdown.promoDiscount > 0 && (
                    <div className={`flex justify-between items-center ${compact ? 'text-xs' : 'text-sm'}`}>
                        <span className="text-slate-600 dark:text-slate-400">
                            {language === 'de' ? 'Discount' : 'Discount'}
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            -{formatPrice(breakdown.promoDiscount)}
                        </span>
                    </div>
                )}

                {/* Tax */}
                {showTax && breakdown.taxAmount > 0 && (
                    <div className={`flex justify-between items-center ${compact ? 'text-xs' : 'text-sm'} pt-2 border-t border-slate-200 dark:border-slate-700`}>
                        <span className="text-slate-600 dark:text-slate-400">
                            {language === 'de' ? 'MwSt.' : 'VAT'}
                            <span className="ml-1 text-xs text-slate-500">
                                (19%)
                            </span>
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            +{formatPrice(breakdown.taxAmount)}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const renderTotal = () => {
        return (
            <div className={`
                flex justify-between items-center
                ${compact ? 'pt-2 mt-2' : 'pt-4 mt-4'}
                border-t-2 border-slate-300 dark:border-slate-600
            `}>
                <span className={`
                    font-bold text-slate-900 dark:text-white
                    ${compact ? 'text-sm' : 'text-base'}
                `}>
                    {language === 'de' ? 'Gesamt' : 'Total'}
                </span>
                <span className={`
                    font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600
                    ${compact ? 'text-lg' : 'text-2xl'}
                `}>
                    {formatPrice(breakdown.total)}
                </span>
            </div>
        );
    };

    const renderSavingsBanner = () => {
        if (!showSavings || savings === 0) return null;

        return (
            <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className={`font-semibold text-emerald-700 dark:text-emerald-300 ${compact ? 'text-xs' : 'text-sm'}`}>
                            {language === 'de' ? 'Sie sparen' : 'You save'}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold text-emerald-700 dark:text-emerald-300 ${compact ? 'text-lg' : 'text-xl'}`}>
                            {formatPrice(savings)}
                        </div>
                        {discountPercent > 0 && (
                            <div className={`text-emerald-600 dark:text-emerald-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                                {discountPercent}% {language === 'de' ? 'Discount' : 'discount'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderPerUnit = () => {
        if (breakdown.quantity <= 1) return null;

        return (
            <div className={`
                text-center mt-3
                ${compact ? 'text-xs' : 'text-sm'}
                text-slate-500 dark:text-slate-400
            `}>
                {formatPrice(breakdown.total / breakdown.quantity)} {language === 'de' ? 'pro Einheit' : 'per unit'}
            </div>
        );
    };

    return (
        <div className={containerClasses}>
            {!compact && variant !== 'minimal' && (
                <div className={`px-${variant === 'card' ? '6' : '4'} py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        {language === 'de' ? 'Preisübersicht' : 'Price Summary'}
                    </h3>
                </div>
            )}

            <div className={`p-${variant === 'card' ? '6' : compact ? '3' : '4'}`}>
                {renderSavingsBanner()}

                {variant === 'minimal' ? (
                    <>
                        {renderSummary()}
                        {renderTotal()}
                    </>
                ) : (
                    <>
                        {showLineItems && breakdown.breakdown.length > 0 ? (
                            <>
                                {renderLineItems()}
                                <div className="my-4 border-t border-slate-200 dark:border-slate-700" />
                                {renderSummary()}
                                {renderTotal()}
                            </>
                        ) : (
                            <>
                                {renderSummary()}
                                {renderTotal()}
                            </>
                        )}
                    </>
                )}

                {renderPerUnit()}
            </div>
        </div>
    );
};

export default PriceBreakdownDisplay;
