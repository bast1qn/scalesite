// ============================================
// INTELLIGENT PRICING CALCULATOR
// Week 7: Foundation Component
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCurrency, useLanguage } from '../../contexts';
import { FORM_LIMITS } from '../../lib/constants';
import {
    calculatePrice,
    type PricingConfig,
    type PriceBreakdown,
    formatPrice,
    calculateSavings,
    getDiscountPercentage
} from '../../lib/pricing';

interface PricingCalculatorProps {
    serviceId?: number;
    initialQuantity?: number;
    initialFeatures?: string[];
    onPriceChange?: (breakdown: PriceBreakdown) => void;
    currency?: string;
    countryCode?: string;
    showDetails?: boolean;
}

export const PricingCalculator = ({
    serviceId = 1,
    initialQuantity = 1,
    initialFeatures = [],
    onPriceChange,
    currency = 'EUR',
    countryCode = 'DE',
    showDetails = true
}: PricingCalculatorProps) => {
    const { t, language } = useLanguage();
    const { formatPrice: formatCurrencyPrice } = useCurrency();

    // State Management
    const [quantity, setQuantity] = useState<number>(initialQuantity);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures);
    const [discountCode, setDiscountCode] = useState<string>('');
    const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    // Available Features (from pricing.ts FEATURE_PRICES)
    const availableFeatures = useMemo(() => [
        { key: 'contact_form', label: language === 'de' ? 'Kontaktformular' : 'Contact Form', price: 15 },
        { key: 'gallery', label: language === 'de' ? 'Bildergalerie' : 'Gallery', price: 20 },
        { key: 'blog', label: language === 'de' ? 'Blog-Funktion' : 'Blog', price: 25 },
        { key: 'seo_basic', label: language === 'de' ? 'Basis SEO' : 'Basic SEO', price: 30 },
        { key: 'seo_advanced', label: language === 'de' ? 'Erweitertes SEO' : 'Advanced SEO', price: 50 },
        { key: 'analytics', label: language === 'de' ? 'Analytics' : 'Analytics', price: 15 },
        { key: 'social_media_integration', label: language === 'de' ? 'Social Media' : 'Social Media', price: 10 },
        { key: 'newsletter', label: language === 'de' ? 'Newsletter' : 'Newsletter', price: 20 },
        { key: 'multilingual', label: language === 'de' ? 'Mehrsprachig' : 'Multilingual', price: 40 },
        { key: 'booking_system', label: language === 'de' ? 'Buchungssystem' : 'Booking System', price: 35 },
        { key: 'payment_gateway', label: language === 'de' ? 'Zahlungsgateway' : 'Payment Gateway', price: 45 },
        { key: 'live_chat', label: language === 'de' ? 'Live Chat' : 'Live Chat', price: 25 },
        { key: 'member_area', label: language === 'de' ? 'Mitgliederbereich' : 'Member Area', price: 50 },
    ], [language]);

    // Calculate price whenever dependencies change
    useEffect(() => {
        const config: PricingConfig = {
            serviceId,
            quantity,
            features: selectedFeatures,
            discountCode: discountCode || undefined,
            currency
        };

        const breakdown = calculatePrice(config, countryCode);
        setPriceBreakdown(breakdown);

        // Notify parent component
        if (onPriceChange) {
            onPriceChange(breakdown);
        }

        // Persist to localStorage
        if (isDirty) {
            const storageKey = `pricing-calculator-${serviceId}`;
            localStorage.setItem(storageKey, JSON.stringify({
                quantity,
                features: selectedFeatures,
                discountCode
            }));
        }
    }, [serviceId, quantity, selectedFeatures, discountCode, currency, countryCode, onPriceChange, isDirty]);

    // Load saved state from localStorage
    useEffect(() => {
        // SSR-Safety: Check if window is defined (not server-side)
        if (typeof window === 'undefined') return;

        const storageKey = `pricing-calculator-${serviceId}`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                const { quantity: savedQuantity, features: savedFeatures, discountCode: savedCode } = JSON.parse(saved);
                setQuantity(savedQuantity || initialQuantity);
                setSelectedFeatures(savedFeatures || initialFeatures);
                setDiscountCode(savedCode || '');
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, [serviceId, initialQuantity, initialFeatures]);

    /**
     * Toggle feature selection
     * @param featureKey - Feature identifier to toggle
     */
    const toggleFeature = useCallback((featureKey: string) => {
        setIsDirty(true);
        setSelectedFeatures(prev =>
            prev.includes(featureKey)
                ? prev.filter(f => f !== featureKey)
                : [...prev, featureKey]
        );
    }, []);

    /**
     * Handle quantity change with clamping to min/max limits
     * @param value - New quantity value
     */
    const handleQuantityChange = useCallback((value: number) => {
        setIsDirty(true);
        const clamped = Math.max(FORM_LIMITS.quantityMin, Math.min(FORM_LIMITS.quantityMax, value));
        setQuantity(clamped);
    }, []);

    /**
     * Clear discount code input
     */
    const clearDiscount = useCallback(() => {
        setIsDirty(true);
        setDiscountCode('');
    }, []);

    /**
     * Reset calculator to initial values and clear localStorage
     */
    const resetCalculator = useCallback(() => {
        setIsDirty(true);
        setQuantity(initialQuantity);
        setSelectedFeatures(initialFeatures);
        setDiscountCode('');

        // Remove from localStorage (SSR-safe)
        if (typeof window !== 'undefined') {
            const storageKey = `pricing-calculator-${serviceId}`;
            localStorage.removeItem(storageKey);
        }
    }, [initialQuantity, initialFeatures, serviceId]);

    // Calculate savings
    const savings = useMemo(() => {
        if (!priceBreakdown) return 0;
        return calculateSavings(priceBreakdown);
    }, [priceBreakdown]);

    // Calculate discount percentage
    const discountPercent = useMemo(() => {
        if (!priceBreakdown) return 0;
        return getDiscountPercentage(priceBreakdown);
    }, [priceBreakdown]);

    if (!priceBreakdown) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Calculator Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {language === 'de' ? 'Preis konfigurieren' : 'Configure Price'}
                </h3>
                {isDirty && (
                    <button
                        onClick={resetCalculator}
                        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                        {language === 'de' ? 'Zurücksetzen' : 'Reset'}
                    </button>
                )}
            </div>

            {/* Quantity Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'de' ? 'Anzahl' : 'Quantity'}
                </label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= FORM_LIMITS.quantityMin}
                        className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        min={FORM_LIMITS.quantityMin}
                        max={FORM_LIMITS.quantityMax}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || FORM_LIMITS.quantityDefault)}
                        className="flex-1 h-10 px-4 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                    />
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= FORM_LIMITS.quantityMax}
                        className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'de' ? 'Features hinzufügen' : 'Add Features'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableFeatures.map((feature) => {
                        const isSelected = selectedFeatures.includes(feature.key);
                        return (
                            <button
                                key={feature.key}
                                onClick={() => toggleFeature(feature.key)}
                                className={`p-3 rounded-lg text-sm text-left transition-all ${
                                    isSelected
                                        ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500'
                                }`}
                            >
                                <div className="font-medium">{feature.label}</div>
                                <div className={`text-xs mt-1 ${isSelected ? 'text-primary-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                    +{formatCurrencyPrice(feature.price)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Discount Code Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'de' ? 'Discount-Code' : 'Discount Code'}
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => {
                            setIsDirty(true);
                            setDiscountCode(e.target.value.toUpperCase());
                        }}
                        placeholder={language === 'de' ? 'Code eingeben...' : 'Enter code...'}
                        className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 uppercase"
                    />
                    {discountCode && (
                        <button
                            onClick={clearDiscount}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                        >
                            {language === 'de' ? 'Löschen' : 'Clear'}
                        </button>
                    )}
                </div>
                {priceBreakdown.promoDiscount > 0 && (
                    <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ {language === 'de' ? 'Discount angewendet!' : 'Discount applied!'}
                    </p>
                )}
            </div>

            {/* Price Summary */}
            {showDetails && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    {/* Savings Banner */}
                    {savings > 0 && (
                        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    {language === 'de' ? 'Sie sparen' : 'You save'}
                                </span>
                                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                    {formatCurrencyPrice(savings)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Subtotal */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            {language === 'de' ? 'Zwischensumme' : 'Subtotal'}
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {formatCurrencyPrice(priceBreakdown.subtotal)}
                        </span>
                    </div>

                    {/* Discounts */}
                    {priceBreakdown.volumeDiscount > 0 && (
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {language === 'de' ? 'Mengenrabatt' : 'Volume Discount'}
                                {quantity >= 5 && (
                                    <span className="ml-1 text-xs text-primary-600 dark:text-primary-400">
                                        ({quantity >= 50 ? '40%' : quantity >= 25 ? '30%' : quantity >= 10 ? '20%' : '10%'})
                                    </span>
                                )}
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                -{formatCurrencyPrice(priceBreakdown.volumeDiscount)}
                            </span>
                        </div>
                    )}

                    {priceBreakdown.featureDiscount > 0 && (
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {language === 'de' ? 'Feature-Rabatt' : 'Feature Discount'}
                                <span className="ml-1 text-xs text-primary-600 dark:text-primary-400">
                                    (10%)
                                </span>
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                -{formatCurrencyPrice(priceBreakdown.featureDiscount)}
                            </span>
                        </div>
                    )}

                    {priceBreakdown.promoDiscount > 0 && (
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {discountCode || (language === 'de' ? 'Discount' : 'Discount')}
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                -{formatCurrencyPrice(priceBreakdown.promoDiscount)}
                            </span>
                        </div>
                    )}

                    {/* Tax */}
                    {priceBreakdown.taxAmount > 0 && (
                        <div className="flex items-center justify-between mb-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {language === 'de' ? 'MwSt.' : 'VAT'}
                                <span className="ml-1 text-xs text-slate-500">
                                    (19%)
                                </span>
                            </span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                +{formatCurrencyPrice(priceBreakdown.taxAmount)}
                            </span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-slate-300 dark:border-slate-600">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                            {language === 'de' ? 'Gesamt' : 'Total'}
                        </span>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">
                            {formatCurrencyPrice(priceBreakdown.total)}
                        </span>
                    </div>

                    {/* Price per item */}
                    {quantity > 1 && (
                        <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                            {formatCurrencyPrice(priceBreakdown.total / quantity)} {language === 'de' ? 'pro Einheit' : 'per unit'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PricingCalculator;
