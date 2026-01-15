// ============================================
// VALIDATION UTILITY FUNCTIONS
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate phone number (basic format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('min_length');
  }

  if (password.length > 128) {
    errors.push('max_length');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('lowercase');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('uppercase');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate that a string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate string length
 */
export const isValidLength = (
  value: string,
  minLength: number,
  maxLength: number
): boolean => {
  return value.length >= minLength && value.length <= maxLength;
};

/**
 * Validate number range
 */
export const isInRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate that a value is a positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value > 0;
};

/**
 * Validate German postal code
 */
export const isValidGermanPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * Validate German IBAN
 */
export const isValidGermanIBAN = (iban: string): boolean => {
  const ibanRegex = /^DE\d{2}\s?([0-9a-zA-Z]{4}\s?){4}[0-9a-zA-Z]{2}$/;
  return ibanRegex.test(iban.replace(/\s/g, ''));
};

/**
 * Validate VAT ID (German USt-IdNr.)
 */
export const isValidGermanVATId = (vatId: string): boolean => {
  const vatIdRegex = /^DE\d{9}$/;
  return vatIdRegex.test(vatId.replace(/\s/g, ''));
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate file size
 */
export const isValidFileSize = (
  fileSize: number,
  maxSizeInBytes: number
): boolean => {
  return fileSize <= maxSizeInBytes;
};

/**
 * Validate file type
 */
export const isValidFileType = (
  fileName: string,
  allowedExtensions: string[]
): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

/**
 * Check if string contains only alphanumeric characters
 */
export const isAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * Validate hex color code
 */
export const isValidHexColor = (color: string): boolean => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};

/**
 * Validate date string
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validate that date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && date > new Date();
};

/**
 * Validate that date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && date < new Date();
};

/**
 * Common validation for form fields
 */
export const validateFormField = (
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
  }
): ValidationResult => {
  const errors: string[] = [];

  if (rules.required && !isNotEmpty(value)) {
    errors.push('required');
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push('min_length');
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push('max_length');
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('invalid_format');
  }

  if (rules.custom && !rules.custom(value)) {
    errors.push('custom_validation_failed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
