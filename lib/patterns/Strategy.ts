/**
 * Strategy Pattern Implementation
 *
 * Purpose: Define a family of algorithms, encapsulate each one, and make them interchangeable.
 * Strategy lets the algorithm vary independently from clients that use it.
 *
 * Use Cases: Validation strategies, sorting algorithms, payment processing, data formatting
 *
 * SOLID Compliance:
 * - Single Responsibility: Each strategy implements one algorithm
 * - Open/Closed: New strategies can be added without modifying existing code
 * - Dependency Inversion: Context depends on Strategy interface, not concrete implementations
 */

// ==================== Validation Strategies ====================

// Import ValidationResult from common types to ensure consistency
import type { ValidationResult } from '../../types/common';

/**
 * Validation Strategy Interface
 * LSP COMPLIANCE: All strategies must implement both sync and async validation
 * This ensures substitutability - any strategy can be used interchangeably
 */
export interface IValidationStrategy {
  /**
   * Synchronous validation
   * All strategies MUST implement this method
   */
  validate(value: any): ValidationResult | Promise<ValidationResult>;

  /**
   * Asynchronous validation
   * Default implementation wraps validate() for consistency
   * Strategies can override for true async operations (e.g., API calls)
   */
  validateAsync?(value: any): Promise<ValidationResult>;
}

/**
 * Email Validation Strategy
 */
export class EmailValidationStrategy implements IValidationStrategy {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(value: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!value) {
      errors.push('Email is required');
    } else if (!this.emailRegex.test(value)) {
      errors.push('Invalid email format');
    }

    // Check for common typos in domain
    if (value) {
      const typoDomains = ['gmial.com', 'gmai.com', 'yahooo.com', 'hotmial.com'];
      const domain = value.split('@')[1];
      if (typoDomains.includes(domain)) {
        warnings.push(`Possible typo in domain: ${domain}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * Password Validation Strategy
 */
export class PasswordValidationStrategy implements IValidationStrategy {
  private minLength: number;
  private requireUppercase: boolean;
  private requireLowercase: boolean;
  private requireNumbers: boolean;
  private requireSpecialChars: boolean;

  constructor(options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}) {
    this.minLength = options.minLength || 8;
    this.requireUppercase = options.requireUppercase ?? true;
    this.requireLowercase = options.requireLowercase ?? true;
    this.requireNumbers = options.requireNumbers ?? true;
    this.requireSpecialChars = options.requireSpecialChars ?? true;
  }

  validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (value.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(value)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.requireLowercase && !/[a-z]/.test(value)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.requireNumbers && !/\d/.test(value)) {
      errors.push('Password must contain at least one number');
    }

    if (this.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('Password must contain at least one special character');
    }

    // Password strength indicator
    const warnings: string[] = [];
    if (errors.length === 0) {
      const strength = this.calculateStrength(value);
      if (strength < 3) {
        warnings.push('Password is weak. Consider adding more variety.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private calculateStrength(password: string): number {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  }
}

/**
 * URL Validation Strategy
 */
export class URLValidationStrategy implements IValidationStrategy {
  private allowRelative: boolean;
  private allowedProtocols?: string[];

  constructor(options: {
    allowRelative?: boolean;
    allowedProtocols?: string[];
  } = {}) {
    this.allowRelative = options.allowRelative ?? false;
    this.allowedProtocols = options.allowedProtocols || ['http:', 'https:', 'ftp:'];
  }

  validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value) {
      errors.push('URL is required');
      return { isValid: false, errors };
    }

    try {
      const url = new URL(value);

      if (this.allowedProtocols && !this.allowedProtocols.includes(url.protocol)) {
        errors.push(`Protocol must be one of: ${this.allowedProtocols.join(', ')}`);
      }
    } catch (e) {
      if (!this.allowRelative || !value.startsWith('/')) {
        errors.push('Invalid URL format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Phone Number Validation Strategy
 */
export class PhoneValidationStrategy implements IValidationStrategy {
  private countryCode: string;

  constructor(countryCode: string = 'DE') {
    this.countryCode = countryCode;
  }

  validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value) {
      errors.push('Phone number is required');
      return { isValid: false, errors };
    }

    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    // Country-specific validation
    const patterns: Record<string, RegExp> = {
      DE: /^\+49[1-9]\d{8,10}$/, // Germany
      US: /^\+1[2-9]\d{9}$/, // United States
      UK: /^\+44[1-9]\d{8,9}$/, // United Kingdom
      FR: /^\+33[1-9]\d{8}$/, // France
    };

    const pattern = patterns[this.countryCode];
    if (pattern && !pattern.test(digitsOnly)) {
      errors.push(`Invalid phone number format for ${this.countryCode}`);
    } else if (!pattern && digitsOnly.length < 10) {
      errors.push('Phone number is too short');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Date Validation Strategy
 */
export class DateValidationStrategy implements IValidationStrategy {
  private minDate?: Date;
  private maxDate?: Date;
  private format?: string;

  constructor(options: {
    minDate?: Date;
    maxDate?: Date;
    format?: string;
  } = {}) {
    this.minDate = options.minDate;
    this.maxDate = options.maxDate;
    this.format = options.format;
  }

  validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value) {
      errors.push('Date is required');
      return { isValid: false, errors };
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
      return { isValid: false, errors };
    }

    if (this.minDate && date < this.minDate) {
      errors.push(`Date must be after ${this.minDate.toISOString()}`);
    }

    if (this.maxDate && date > this.maxDate) {
      errors.push(`Date must be before ${this.maxDate.toISOString()}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// ==================== Validator Context ====================

/**
 * Validator Context
 * Uses different validation strategies based on configuration
 */
export class ValidatorContext {
  private strategy: IValidationStrategy;

  constructor(strategy: IValidationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IValidationStrategy): void {
    this.strategy = strategy;
  }

  validate(value: any): ValidationResult {
    return this.strategy.validate(value);
  }

  async validateAsync(value: any): Promise<ValidationResult> {
    if (this.strategy.validateAsync) {
      return this.strategy.validateAsync(value);
    }
    return this.strategy.validate(value);
  }
}

// ==================== Composite Validator ====================

/**
 * Composite Validator
 * Runs multiple validation strategies
 */
export class CompositeValidator implements IValidationStrategy {
  private validators: Map<string, IValidationStrategy> = new Map();

  addValidator(name: string, strategy: IValidationStrategy): void {
    this.validators.set(name, strategy);
  }

  removeValidator(name: string): void {
    this.validators.delete(name);
  }

  validate(value: any): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    this.validators.forEach((strategy, name) => {
      const result = strategy.validate(value);
      allErrors.push(...result.errors);
      if (result.warnings) {
        allWarnings.push(...result.warnings);
      }
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}

// ==================== Form Validator ====================

/**
 * Form Validator
 * Validates multiple fields with different strategies
 */
export class FormValidator {
  private fieldValidators: Map<string, IValidationStrategy> = new Map();

  addFieldValidator(fieldName: string, strategy: IValidationStrategy): void {
    this.fieldValidators.set(fieldName, strategy);
  }

  validateForm(data: Record<string, any>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    this.fieldValidators.forEach((strategy, fieldName) => {
      results[fieldName] = strategy.validate(data[fieldName]);
    });

    return results;
  }

  isFormValid(data: Record<string, any>): boolean {
    const results = this.validateForm(data);
    return Object.values(results).every(result => result.isValid);
  }

  getFormErrors(data: Record<string, any>): string[] {
    const results = this.validateForm(data);
    const errors: string[] = [];

    Object.entries(results).forEach(([fieldName, result]) => {
      result.errors.forEach(error => {
        errors.push(`${fieldName}: ${error}`);
      });
    });

    return errors;
  }
}

// ==================== Usage Examples ====================

/**
 * Example: Simple validation with strategy
 * NOTE: This function is intentionally not exported to avoid conflict with
 * lib/validation.ts validateEmail, which is the OWASP-compliant version
 * that should be used throughout the application.
 */
function validateEmailWithStrategy(email: string): ValidationResult {
  const strategy = new EmailValidationStrategy();
  const validator = new ValidatorContext(strategy);
  return validator.validate(email);
}

/**
 * Example: Password validation with custom requirements
 */
export function validateStrongPassword(password: string): ValidationResult {
  const strategy = new PasswordValidationStrategy({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  });
  const validator = new ValidatorContext(strategy);
  return validator.validate(password);
}

/**
 * Example: Composite validation
 */
export function validateUserRegistration(data: {
  email: string;
  password: string;
  phone?: string;
}): ValidationResult {
  const composite = new CompositeValidator();

  // Add multiple validators
  composite.addValidator('email', new EmailValidationStrategy());
  composite.addValidator('password', new PasswordValidationStrategy({
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
  }));

  if (data.phone) {
    composite.addValidator('phone', new PhoneValidationStrategy('DE'));
  }

  // Validate email
  const emailResult = composite.validators.get('email')!.validate(data.email);
  if (!emailResult.isValid) {
    return emailResult;
  }

  // Validate password
  const passwordResult = composite.validators.get('password')!.validate(data.password);
  if (!passwordResult.isValid) {
    return passwordResult;
  }

  // Validate phone if provided
  if (data.phone) {
    const phoneResult = composite.validators.get('phone')!.validate(data.phone);
    if (!phoneResult.isValid) {
      return phoneResult;
    }
  }

  return { isValid: true, errors: [] };
}

/**
 * Example: Form validation
 */
export function createRegistrationFormValidator(): FormValidator {
  const formValidator = new FormValidator();

  formValidator.addFieldValidator('email', new EmailValidationStrategy());
  formValidator.addFieldValidator('password', new PasswordValidationStrategy());
  formValidator.addFieldValidator('confirmPassword', new PasswordValidationStrategy());
  formValidator.addFieldValidator('phone', new PhoneValidationStrategy('DE'));
  formValidator.addFieldValidator('website', new URLValidationStrategy({
    allowRelative: false,
    allowedProtocols: ['http:', 'https:'],
  }));

  return formValidator;
}

/**
 * Example: Dynamic validation
 */
export function validateField(fieldName: string, value: any): ValidationResult {
  const strategies: Record<string, IValidationStrategy> = {
    email: new EmailValidationStrategy(),
    password: new PasswordValidationStrategy(),
    url: new URLValidationStrategy(),
    phone: new PhoneValidationStrategy(),
  };

  const strategy = strategies[fieldName];
  if (!strategy) {
    return { isValid: true, errors: [] };
  }

  const validator = new ValidatorContext(strategy);
  return validator.validate(value);
}

/**
 * Example: Switching strategies at runtime
 */
export function validateByCountryCode(phone: string, countryCode: string): ValidationResult {
  const validator = new ValidatorContext(new PhoneValidationStrategy(countryCode));
  return validator.validate(phone);
}
