// ============================================
// MATHEMATICAL UTILITY FUNCTIONS
// ============================================

/**
 * Generate a random ID using Math.random()
 * @param length Length of the ID (default: 8)
 */
export const generateRandomId = (length: number = 8): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Alias for generateRandomId - for backward compatibility
 */
export const generateId = generateRandomId;

/**
 * Generate a unique ID with timestamp
 */
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
};

/**
 * Clamp a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Round a number to a specific precision
 */
export const roundTo = (value: number, precision: number): number => {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Round to nearest 10
 */
export const roundToNearest10 = (value: number): number => {
  return Math.round(value / 10) * 10;
};

/**
 * Calculate percentage with bounds checking (0-100)
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return clamp((value / total) * 100, 0, 100);
};

/**
 * Scale a value from one range to another
 */
export const scaleValue = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Check if a number is within a range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Generate a random number in a range
 */
export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate a random integer in a range
 */
export const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(randomInRange(min, max + 1));
};

/**
 * Calculate the sum of an array of numbers
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

/**
 * Calculate the average of an array of numbers
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
};

/**
 * Find the maximum value in an array
 */
export const max = (numbers: number[]): number => {
  return Math.max(...numbers);
};

/**
 * Find the minimum value in an array
 */
export const min = (numbers: number[]): number => {
  return Math.min(...numbers);
};

/**
 * Apply a percentage change to a value
 */
export const applyPercentageChange = (value: number, percentage: number): number => {
  return value * (1 + percentage / 100);
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Generate a random boolean with optional probability
 * @param probability Probability of true (default: 0.5)
 */
export const randomBoolean = (probability: number = 0.5): boolean => {
  return Math.random() < probability;
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Format a number with locale-specific formatting
 */
export const formatNumber = (
  value: number,
  locale: string = 'de-DE',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format a number as currency
 * Note: Duplicate of string-utils.ts formatCurrency for compatibility
 */
export const formatCurrencyMath = (
  value: number,
  locale: string = 'de-DE',
  currency: string = 'EUR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format a number as percentage
 */
export const formatPercent = (
  value: number,
  locale: string = 'de-DE',
  decimals: number = 1
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Safe division - returns 0 if divisor is 0
 */
export const safeDivide = (numerator: number, denominator: number): number => {
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Calculate growth rate between two values
 */
export const calculateGrowthRate = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};
