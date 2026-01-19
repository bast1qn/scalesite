/**
 * Pricing Utility Functions
 * Replaces nested ternaries with clear, testable functions
 */

import { PRICING } from '@/lib/constants';

/**
 * Volume discount thresholds and percentages
 */
const VOLUME_DISCOUNTS = [
  { minQuantity: 50, discount: 0.40 }, // 40% discount for 50+ items
  { minQuantity: 25, discount: 0.30 }, // 30% discount for 25-49 items
  { minQuantity: 10, discount: 0.20 }, // 20% discount for 10-24 items
  { minQuantity: 0,  discount: 0.10 }, // 10% discount for 1-9 items
] as const;

/**
 * Calculate volume discount percentage based on quantity
 * Replaces nested ternary: quantity >= 50 ? 40% : quantity >= 25 ? 30% : quantity >= 10 ? 20% : 10%
 * @param quantity - The quantity to calculate discount for
 * @returns Discount percentage (e.g., 0.40 for 40%)
 */
export function calculateVolumeDiscount(quantity: number): number {
  for (const tier of VOLUME_DISCOUNTS) {
    if (quantity >= tier.minQuantity) {
      return tier.discount;
    }
  }
  return 0;
}

/**
 * Get volume discount as formatted percentage string
 * @param quantity - The quantity to calculate discount for
 * @returns Formatted percentage string (e.g., "40%")
 */
export function getVolumeDiscountPercentage(quantity: number): string {
  const discount = calculateVolumeDiscount(quantity);
  return `${Math.round(discount * 100)}%`;
}

/**
 * Calculate price with volume discount applied
 * @param basePrice - The base price per unit
 * @param quantity - The quantity being purchased
 * @returns Total price after discount
 */
export function calculatePriceWithDiscount(basePrice: number, quantity: number): number {
  const discount = calculateVolumeDiscount(quantity);
  return basePrice * quantity * (1 - discount);
}

/**
 * Calculate savings from volume discount
 * @param basePrice - The base price per unit
 * @param quantity - The quantity being purchased
 * @returns Amount saved
 */
export function calculateSavings(basePrice: number, quantity: number): number {
  const discount = calculateVolumeDiscount(quantity);
  return basePrice * quantity * discount;
}

/**
 * Determine pricing tier based on quantity
 * @param quantity - The quantity to check
 * @returns Pricing tier name
 */
export function getPricingTier(quantity: number): string {
  if (quantity >= 50) return 'enterprise';
  if (quantity >= 25) return 'business';
  if (quantity >= 10) return 'starter';
  return 'basic';
}

/**
 * Calculate total price for a project with optional addons
 * @param basePrice - The base project price
 * @param options - Project options with optional addons
 * @returns Total price
 */
export interface ProjectPricingOptions {
  contactForm?: boolean;
  blog?: boolean;
  hosting?: boolean;
  domain?: boolean;
  maintenance?: boolean;
  quantity?: number;
}

export function calculateProjectPrice(
  basePrice: number,
  options: ProjectPricingOptions = {}
): number {
  const {
    contactForm = false,
    blog = false,
    hosting = false,
    domain = false,
    maintenance = false,
    quantity = 1,
  } = options;

  let total = basePrice;

  // Add optional addon prices
  if (contactForm) total += PRICING.basic; // Example: contact form costs basic plan price
  if (blog) total += PRICING.starter;
  if (hosting) total += PRICING.business;
  if (domain) total += 15; // Fixed domain price
  if (maintenance) total += PRICING.basic * 12; // Annual maintenance

  // Apply volume discount if quantity > 1
  if (quantity > 1) {
    const discount = calculateVolumeDiscount(quantity);
    total = total * quantity * (1 - discount);
  }

  return total;
}

/**
 * Format price for display
 * @param price - The price to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: de-DE)
 * @returns Formatted price string
 */
export function formatPrice(
  price: number,
  currency: string = PRICE_FORMAT.currency,
  locale: string = PRICE_FORMAT.locale
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: PRICE_FORMAT.minimumFractionDigits,
    maximumFractionDigits: PRICE_FORMAT.maximumFractionDigits,
  }).format(price);
}

/**
 * Calculate monthly price from annual price
 * @param annualPrice - The annual price
 * @returns Monthly price
 */
export function calculateMonthlyPrice(annualPrice: number): number {
  return annualPrice / 12;
}

/**
 * Calculate annual price with discount
 * @param monthlyPrice - The monthly price
 * @param months - Number of months (default: 12)
 * @param discount - Annual discount (default: from PRICING)
 * @returns Annual price after discount
 */
export function calculateAnnualPrice(
  monthlyPrice: number,
  months: number = 12,
  discount: number = PRICING.annualDiscount
): number {
  const annualTotal = monthlyPrice * months;
  return annualTotal * (1 - discount);
}

// Import PRICE_FORMAT from constants
import { PRICE_FORMAT } from '@/lib/constants';
