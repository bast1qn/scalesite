// ============================================
// PRICING CALCULATIONS
// Dynamic Pricing System with Discounts
// ============================================

// ============================================
// TYPES & INTERFACES
// ============================================

export interface PricingConfig {
    serviceId: number;
    quantity: number;
    features?: string[];
    discountCode?: string;
    promoCode?: string;
    currency?: string;
}

export interface PriceBreakdown {
    basePrice: number;
    quantity: number;
    subtotal: number;
    volumeDiscount: number;
    featureDiscount: number;
    promoDiscount: number;
    taxAmount: number;
    total: number;
    currency: string;
    breakdown: LineItem[];
}

export interface LineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    discount?: number;
}

export interface VolumeTier {
    minQuantity: number;
    discountPercentage: number;
}

export interface DiscountCode {
    code: string;
    type: 'percentage' | 'fixed' | 'bogo';
    value: number;
    minPurchase?: number;
    maxDiscount?: number;
    expiresAt?: Date;
    usageLimit?: number;
    usedCount?: number;
    applicableServices?: number[];
}

export interface TimeLimitedOffer {
    id: string;
    name: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: Date;
    endDate: Date;
    applicableServices?: number[];
    minQuantity?: number;
}

// ============================================
// BASE PRICING
// ============================================

/**
 * Base prices for different services (in EUR)
 * Adjust these values based on your pricing strategy
 */
const BASE_PRICES: Record<number, number> = {
    1: 29,    // Basic Website
    2: 49,    // Professional Website
    3: 79,    // E-commerce Website
    4: 99,    // Custom Website
    5: 19,    // Landing Page
    6: 39,    // Blog Website
    7: 59,    // Portfolio Website
    8: 89,    // Business Website
    9: 129,   // Enterprise Website
    10: 149   // Premium Website
};

/**
 * Feature pricing add-ons (in EUR)
 */
const FEATURE_PRICES: Record<string, number> = {
    'contact_form': 15,
    'gallery': 20,
    'blog': 25,
    'seo_basic': 30,
    'seo_advanced': 50,
    'analytics': 15,
    'social_media_integration': 10,
    'newsletter': 20,
    'multilingual': 40,
    'booking_system': 35,
    'payment_gateway': 45,
    'live_chat': 25,
    'member_area': 50,
    'custom_domain': 10,
    'ssl_certificate': 0,  // Free
    'backup_daily': 10,
    'priority_support': 30
};

/**
 * Volume discount tiers
 */
const VOLUME_TIERS: VolumeTier[] = [
    { minQuantity: 5, discountPercentage: 10 },
    { minQuantity: 10, discountPercentage: 20 },
    { minQuantity: 25, discountPercentage: 30 },
    { minQuantity: 50, discountPercentage: 40 }
];

/**
 * Tax rates by country (in percentage)
 */
const TAX_RATES: Record<string, number> = {
    'DE': 19,   // Germany
    'AT': 20,   // Austria
    'CH': 7.7,  // Switzerland
    'FR': 20,   // France
    'IT': 22,   // Italy
    'ES': 21,   // Spain
    'NL': 21,   // Netherlands
    'BE': 21,   // Belgium
    'PL': 23,   // Poland
    'CZ': 21,   // Czech Republic
    'GB': 20,   // United Kingdom
    'US': 0,    // United States (no VAT)
    'default': 19
};

// ============================================
// ACTIVE DISCOUNT CODES
// ============================================

/**
 * Valid discount codes (in production, store these in database)
 */
const DISCOUNT_CODES: Record<string, DiscountCode> = {
    'WELCOME10': {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minPurchase: 50,
        maxDiscount: 100,
        usageLimit: 1000
    },
    'SAVE20': {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        minPurchase: 100,
        maxDiscount: 200
    },
    'FLAT50': {
        code: 'FLAT50',
        type: 'fixed',
        value: 50,
        minPurchase: 150
    },
    'LAUNCH25': {
        code: 'LAUNCH25',
        type: 'percentage',
        value: 25,
        minPurchase: 200,
        expiresAt: new Date('2025-12-31')
    },
    'SUMMER15': {
        code: 'SUMMER15',
        type: 'percentage',
        value: 15,
        minPurchase: 75
    }
};

/**
 * Active time-limited offers
 */
const TIME_LIMITED_OFFERS: TimeLimitedOffer[] = [
    {
        id: 'black-friday-2025',
        name: 'Black Friday Sale',
        description: '30% off on all websites',
        discountType: 'percentage',
        discountValue: 30,
        startDate: new Date('2025-11-24T00:00:00'),
        endDate: new Date('2025-12-01T23:59:59')
    },
    {
        id: 'new-year-2026',
        name: 'New Year Kickoff',
        description: '25% off on orders of 3+ pages',
        discountType: 'percentage',
        discountValue: 25,
        startDate: new Date('2026-01-01T00:00:00'),
        endDate: new Date('2026-01-31T23:59:59'),
        minQuantity: 3
    }
];

// ============================================
// CORE PRICING FUNCTIONS
// ============================================

/**
 * Get base price for a service
 * @param serviceId - Service ID
 * @returns Base price
 */
export const getBasePrice = (serviceId: number): number => {
    return BASE_PRICES[serviceId] || 29;
};

/**
 * Get feature price
 * @param featureKey - Feature identifier
 * @returns Feature price
 */
export const getFeaturePrice = (featureKey: string): number => {
    return FEATURE_PRICES[featureKey] || 0;
};

/**
 * Calculate volume discount percentage
 * @param quantity - Number of items/pages
 * @returns Discount percentage (0-40)
 */
export const getVolumeDiscount = (quantity: number): number => {
    for (const tier of VOLUME_TIERS) {
        if (quantity >= tier.minQuantity) {
            return tier.discountPercentage;
        }
    }
    return 0;
};

/**
 * Calculate feature prices total
 * @param features - Array of feature keys
 * @returns Total feature price
 */
export const calculateFeaturePrice = (features: string[]): number => {
    if (!features || features.length === 0) return 0;

    return features.reduce((total, feature) => {
        return total + getFeaturePrice(feature);
    }, 0);
};

/**
 * Validate discount code
 * @param code - Discount code to validate
 * @returns Valid discount code or null
 */
export const validateDiscountCode = (code: string): DiscountCode | null => {
    const normalizedCode = code.toUpperCase().trim();
    const discount = DISCOUNT_CODES[normalizedCode];

    if (!discount) {
        return null;
    }

    // Check expiration
    if (discount.expiresAt && new Date() > discount.expiresAt) {
        return null;
    }

    // Check usage limit
    if (discount.usageLimit && discount.usedCount && discount.usedCount >= discount.usageLimit) {
        return null;
    }

    return discount;
};

/**
 * Get active time-limited offers
 * @returns Array of active offers
 */
export const getActiveOffers = (): TimeLimitedOffer[] => {
    const now = new Date();

    return TIME_LIMITED_OFFERS.filter(offer => {
        return now >= offer.startDate && now <= offer.endDate;
    });
};

/**
 * Check if offer is applicable
 * @param offer - Time-limited offer
 * @param serviceId - Service ID
 * @param quantity - Quantity
 * @returns True if applicable
 */
export const isOfferApplicable = (
    offer: TimeLimitedOffer,
    serviceId: number,
    quantity: number
): boolean => {
    // Check service restrictions
    if (offer.applicableServices && !offer.applicableServices.includes(serviceId)) {
        return false;
    }

    // Check minimum quantity
    if (offer.minQuantity && quantity < offer.minQuantity) {
        return false;
    }

    return true;
};

/**
 * Get tax rate for country
 * @param countryCode - ISO country code
 * @returns Tax rate percentage
 */
export const getTaxRate = (countryCode: string = 'DE'): number => {
    return TAX_RATES[countryCode.toUpperCase()] || TAX_RATES['default'];
};

// ============================================
// MAIN PRICING CALCULATION
// ============================================

/**
 * Calculate total price with all discounts and tax
 * @param config - Pricing configuration
 * @param countryCode - Country for tax calculation
 * @returns Complete price breakdown
 */
export const calculatePrice = (
    config: PricingConfig,
    countryCode: string = 'DE'
): PriceBreakdown => {
    const {
        serviceId,
        quantity,
        features = [],
        discountCode,
        promoCode,
        currency = 'EUR'
    } = config;

    // Get base price
    const basePrice = getBasePrice(serviceId);

    // Calculate feature prices
    const featurePriceTotal = calculateFeaturePrice(features);

    // Calculate subtotal (before discounts)
    const subtotal = (basePrice * quantity) + featurePriceTotal;

    // Calculate volume discount
    const volumeDiscountPercent = getVolumeDiscount(quantity);
    const volumeDiscountAmount = subtotal * (volumeDiscountPercent / 100);

    // Calculate remaining amount after volume discount
    let afterVolumeDiscount = subtotal - volumeDiscountAmount;

    // Calculate feature discount (if any features selected)
    const featureDiscountPercent = features.length >= 3 ? 10 : 0;
    const featureDiscountAmount = afterVolumeDiscount * (featureDiscountPercent / 100);

    let afterFeatureDiscount = afterVolumeDiscount - featureDiscountAmount;

    // Apply discount code
    let promoDiscountAmount = 0;
    if (discountCode) {
        const discount = validateDiscountCode(discountCode);
        if (discount) {
            // Check minimum purchase
            if (!discount.minPurchase || afterFeatureDiscount >= discount.minPurchase) {
                if (discount.type === 'percentage') {
                    promoDiscountAmount = afterFeatureDiscount * (discount.value / 100);
                    // Apply max discount limit
                    if (discount.maxDiscount) {
                        promoDiscountAmount = Math.min(promoDiscountAmount, discount.maxDiscount);
                    }
                } else if (discount.type === 'fixed') {
                    promoDiscountAmount = Math.min(discount.value, afterFeatureDiscount);
                }
            }
        }
    }

    // Apply time-limited offers
    if (promoCode) {
        const activeOffers = getActiveOffers();
        for (const offer of activeOffers) {
            if (isOfferApplicable(offer, serviceId, quantity)) {
                if (offer.discountType === 'percentage') {
                    const offerDiscount = afterFeatureDiscount * (offer.discountValue / 100);
                    promoDiscountAmount += offerDiscount;
                } else {
                    promoDiscountAmount += offer.discountValue;
                }
                break; // Only apply one offer
            }
        }
    }

    let afterDiscounts = afterFeatureDiscount - promoDiscountAmount;

    // Calculate tax
    const taxRate = getTaxRate(countryCode);
    const taxAmount = afterDiscounts * (taxRate / 100);

    // Calculate total
    const total = afterDiscounts + taxAmount;

    // Build breakdown line items
    const breakdown: LineItem[] = [];

    // Service line item
    breakdown.push({
        description: `Service (Base Price)`,
        quantity,
        unitPrice: basePrice,
        amount: basePrice * quantity,
        discount: volumeDiscountAmount > 0 ? volumeDiscountPercent : undefined
    });

    // Feature line items
    if (features.length > 0) {
        breakdown.push({
            description: `Features (${features.length}x)`,
            quantity: 1,
            unitPrice: featurePriceTotal,
            amount: featurePriceTotal,
            discount: featureDiscountPercent > 0 ? featureDiscountPercent : undefined
        });
    }

    // Volume discount line item
    if (volumeDiscountAmount > 0) {
        breakdown.push({
            description: `Volume Discount (${quantity} items)`,
            quantity: 1,
            unitPrice: -volumeDiscountAmount,
            amount: -volumeDiscountAmount
        });
    }

    // Promo discount line item
    if (promoDiscountAmount > 0) {
        breakdown.push({
            description: discountCode || promoCode || 'Discount',
            quantity: 1,
            unitPrice: -promoDiscountAmount,
            amount: -promoDiscountAmount
        });
    }

    // Tax line item
    if (taxAmount > 0) {
        breakdown.push({
            description: `Tax (${taxRate}%)`,
            quantity: 1,
            unitPrice: taxAmount,
            amount: taxAmount
        });
    }

    return {
        basePrice,
        quantity,
        subtotal,
        volumeDiscount: volumeDiscountAmount,
        featureDiscount: featureDiscountAmount,
        promoDiscount: promoDiscountAmount,
        taxAmount,
        total,
        currency,
        breakdown
    };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate monthly payment from total
 * @param total - Total amount
 * @param months - Number of months
 * @returns Monthly payment amount
 */
export const calculateMonthlyPayment = (
    total: number,
    months: number = 12
): number => {
    if (months <= 0) return total;
    return Math.ceil((total / months) * 100) / 100;
};

/**
 * Format price for display
 * @param amount - Price amount
 * @param currency - Currency code
 * @returns Formatted price string
 */
export const formatPrice = (
    amount: number,
    currency: string = 'EUR'
): string => {
    const locale = currency === 'EUR' ? 'de-DE' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Calculate savings from discounts
 * @param breakdown - Price breakdown
 * @returns Total savings amount
 */
export const calculateSavings = (breakdown: PriceBreakdown): number => {
    return breakdown.volumeDiscount + breakdown.featureDiscount + breakdown.promoDiscount;
};

/**
 * Get discount percentage for display
 * @param breakdown - Price breakdown
 * @returns Total discount percentage
 */
export const getDiscountPercentage = (breakdown: PriceBreakdown): number => {
    if (breakdown.subtotal === 0) return 0;
    const totalDiscount = calculateSavings(breakdown);
    return Math.round((totalDiscount / breakdown.subtotal) * 100);
};

/**
 * Estimate price before configuration
 * @param serviceId - Service ID
 * @param minQuantity - Minimum quantity
 * @param maxQuantity - Maximum quantity
 * @returns Price range
 */
export const estimatePriceRange = (
    serviceId: number,
    minQuantity: number = 1,
    maxQuantity: number = 10
): { min: number; max: number } => {
    const basePrice = getBasePrice(serviceId);
    const min = basePrice * minQuantity;
    const max = basePrice * maxQuantity;

    return {
        min,
        max
    };
};

/**
 * Compare two pricing configs
 * @param config1 - First configuration
 * @param config2 - Second configuration
 * @returns Price comparison
 */
export const comparePricing = (
    config1: PricingConfig,
    config2: PricingConfig
): { config1: PriceBreakdown; config2: PriceBreakdown; difference: number } => {
    const price1 = calculatePrice(config1);
    const price2 = calculatePrice(config2);
    const difference = price2.total - price1.total;

    return {
        config1: price1,
        config2: price2,
        difference
    };
};

/**
 * Get recommended pricing tier based on quantity
 * @param quantity - Desired quantity
 * @returns Recommended service tier
 */
export const getRecommendedTier = (quantity: number): number => {
    if (quantity < 5) return 1;  // Basic
    if (quantity < 10) return 2; // Professional
    if (quantity < 25) return 3; // E-commerce
    if (quantity < 50) return 4; // Custom
    return 9;                     // Enterprise
};

/**
 * Calculate price per page
 * @param total - Total price
 * @param quantity - Number of pages
 * @returns Price per page
 */
export const calculatePricePerPage = (total: number, quantity: number): number => {
    if (quantity <= 0) return total;
    return Math.ceil((total / quantity) * 100) / 100;
};

// ============================================
// VALIDATION
// ============================================

/**
 * Validate pricing configuration
 * @param config - Pricing configuration
 * @returns Validation result
 */
export const validatePricingConfig = (
    config: PricingConfig
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check service ID
    if (!config.serviceId || config.serviceId < 1) {
        errors.push('Invalid service ID');
    }

    // Check quantity
    if (!config.quantity || config.quantity < 1) {
        errors.push('Quantity must be at least 1');
    }

    if (config.quantity > 1000) {
        errors.push('Quantity cannot exceed 1000');
    }

    // Validate discount code if provided
    if (config.discountCode) {
        const discount = validateDiscountCode(config.discountCode);
        if (!discount) {
            errors.push('Invalid or expired discount code');
        }
    }

    // Validate features
    if (config.features) {
        const invalidFeatures = config.features.filter(f => !FEATURE_PRICES[f]);
        if (invalidFeatures.length > 0) {
            errors.push(`Invalid features: ${invalidFeatures.join(', ')}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

// ============================================
// EXPORT
// ============================================

export const PricingService = {
    calculatePrice,
    getBasePrice,
    getFeaturePrice,
    getVolumeDiscount,
    validateDiscountCode,
    getActiveOffers,
    getTaxRate,
    calculateMonthlyPayment,
    formatPrice,
    calculateSavings,
    getDiscountPercentage,
    estimatePriceRange,
    comparePricing,
    getRecommendedTier,
    calculatePricePerPage,
    validatePricingConfig
};
