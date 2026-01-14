/**
 * Web Worker: Price Calculator
 *
 * PERFORMANCE: Offloads heavy calculations to background thread
 * - Prevents UI blocking during price calculations
 * - Enables smooth 60fps even with complex calculations
 * - Runs in separate thread from main UI
 *
 * @usage
 * const worker = new Worker(new URL('./priceCalculator.worker.ts', import.meta.url));
 * worker.postMessage({ type: 'calculate', data: { basePrice: 29, features: [...] } });
 * worker.onmessage = (e) => console.log(e.data.result);
 */

export interface PriceCalculationInput {
  basePrice: number;
  features: Array<{
    name: string;
    price: number;
    quantity?: number;
  }>;
  discountCode?: string;
  taxRate?: number;
}

export interface PriceCalculationResult {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  breakdown: Array<{
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
}

// Discount code database (could be fetched from API)
const DISCOUNT_CODES: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
  'WELCOME10': { type: 'percentage', value: 10 },
  'LAUNCH20': { type: 'percentage', value: 20 },
  'SAVE50': { type: 'fixed', value: 50 },
};

self.onmessage = (e: MessageEvent<PriceCalculationInput>) => {
  const { basePrice, features, discountCode, taxRate = 0.19 } = e.data;

  // Perform heavy calculation
  const result = calculatePrice({ basePrice, features, discountCode, taxRate });

  // Send result back to main thread
  self.postMessage({ type: 'result', result });
};

function calculatePrice(input: PriceCalculationInput): PriceCalculationResult {
  const { basePrice, features, discountCode, taxRate } = input;

  // Calculate base total
  let subtotal = basePrice;

  // Calculate feature totals
  const breakdown = features.map((feature) => {
    const quantity = feature.quantity || 1;
    const total = feature.price * quantity;
    subtotal += total;

    return {
      name: feature.name,
      price: feature.price,
      quantity,
      total,
    };
  });

  // Apply discount
  let discount = 0;
  if (discountCode && DISCOUNT_CODES[discountCode]) {
    const discountRule = DISCOUNT_CODES[discountCode];
    if (discountRule.type === 'percentage') {
      discount = subtotal * (discountRule.value / 100);
    } else {
      discount = discountRule.value;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Calculate tax
  const tax = discountedSubtotal * taxRate;

  // Calculate total
  const total = discountedSubtotal + tax;

  return {
    subtotal,
    discount,
    tax,
    total,
    breakdown,
  };
}

// Export worker creation helper
export function createPriceCalculatorWorker() {
  return new Worker(new URL('./priceCalculator.worker.ts', import.meta.url), {
    type: 'module',
  });
}
