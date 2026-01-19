// ============================================
// ENTERPRISE-GRADE ERROR HANDLING SYSTEM
// Architecture: Layered Error Management
// OWASP A04:2021 - Insecure Design
// SOLID: Single Responsibility, Open/Closed
// ============================================

import { AuthApiError } from '@supabase/supabase-js';

// ============================================
// BASE ERROR CLASSES (Custom Error Hierarchy)
// ============================================

/**
 * Base Application Error
 * All custom errors inherit from this class
 * SOLID: Open/Closed Principle - Extensible without modification
 */
export abstract class BaseAppError extends Error {
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;
  public readonly correlationId: string;

  constructor(
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;
    this.correlationId = crypto.randomUUID?.() ?? Math.random().toString(36);

    // Maintains proper stack trace (V8 engine)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get user-friendly error message
   */
  abstract getUserMessage(language: 'de' | 'en'): string;

  /**
   * Get error severity for monitoring
   */
  abstract getSeverity(): 'low' | 'medium' | 'high' | 'critical';

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return false;
  }

  /**
   * Get error context for logging
   */
  getLogContext(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      correlationId: this.correlationId,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack
    };
  }
}

// ============================================
// DOMAIN-SPECIFIC ERROR CLASSES
// ============================================

/**
 * Authentication Error
 * Used for login, registration, session management
 */
export class AuthenticationError extends BaseAppError {
  constructor(
    message: string,
    public readonly authErrorType: SecureErrorType,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }

  getUserMessage(language: 'de' | 'en'): string {
    return ERROR_MESSAGES[this.authErrorType][language];
  }

  getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    if (this.authErrorType === SecureErrorType.AUTH_TOO_MANY_REQUESTS) {
      return 'medium';
    }
    return 'low';
  }

  override isRetryable(): boolean {
    return this.authErrorType === SecureErrorType.NETWORK_ERROR ||
           this.authErrorType === SecureErrorType.AUTH_TOO_MANY_REQUESTS;
  }
}

/**
 * Network Error
 * Used for connection issues, timeouts
 */
export class NetworkError extends BaseAppError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }

  getUserMessage(language: 'de' | 'en'): string {
    return ERROR_MESSAGES[SecureErrorType.NETWORK_ERROR][language];
  }

  getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    return 'medium';
  }

  override isRetryable(): boolean {
    return true;
  }
}

/**
 * Validation Error
 * Used for form validation, data validation
 */
export class ValidationError extends BaseAppError {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, { field, value, ...context });
  }

  getUserMessage(language: 'de' | 'en'): string {
    if (language === 'de') {
      return `Validierungsfehler im Feld "${this.field}": ${this.message}`;
    }
    return `Validation error in field "${this.field}": ${this.message}`;
  }

  getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    return 'low';
  }
}

/**
 * Business Logic Error
 * Used for domain-specific errors
 */
export class BusinessLogicError extends BaseAppError {
  constructor(
    message: string,
    public readonly code: string,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }

  getUserMessage(language: 'de' | 'en'): string {
    if (language === 'de') {
      return `Geschäftsregel verletzt: ${this.message}`;
    }
    return `Business rule violated: ${this.message}`;
  }

  getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    return 'medium';
  }
}

/**
 * Critical System Error
 * Used for unrecoverable system failures
 */
export class CriticalSystemError extends BaseAppError {
  constructor(
    message: string,
    public readonly systemComponent: string,
    context?: Record<string, unknown>
  ) {
    super(message, { systemComponent, ...context });
  }

  getUserMessage(language: 'de' | 'en'): string {
    if (language === 'de') {
      return 'Ein kritischer Fehler ist aufgetreten. Bitte kontaktieren Sie den Support.';
    }
    return 'A critical error occurred. Please contact support.';
  }

  getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    return 'critical';
  }
}

/**
 * Secure error types
 */
export enum SecureErrorType {
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_EXISTS = 'AUTH_USER_EXISTS',
  AUTH_WEAK_PASSWORD = 'AUTH_WEAK_PASSWORD',
  AUTH_EMAIL_INVALID = 'AUTH_EMAIL_INVALID',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_TOO_MANY_REQUESTS = 'AUTH_TOO_MANY_REQUESTS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Secure error message mapping
 * Prevents information leakage while providing helpful feedback
 */
const ERROR_MESSAGES: Record<SecureErrorType, { de: string; en: string }> = {
  [SecureErrorType.AUTH_INVALID_CREDENTIALS]: {
    de: 'Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre Eingabe.',
    en: 'Invalid credentials. Please check your input.'
  },
  [SecureErrorType.AUTH_USER_EXISTS]: {
    de: 'Diese E-Mail-Adresse ist bereits registriert.',
    en: 'This email address is already registered.'
  },
  [SecureErrorType.AUTH_WEAK_PASSWORD]: {
    de: 'Das Passwort ist zu schwach. Bitte wählen Sie ein stärkeres Passwort.',
    en: 'Password is too weak. Please choose a stronger password.'
  },
  [SecureErrorType.AUTH_EMAIL_INVALID]: {
    de: 'Die E-Mail-Adresse ist ungültig.',
    en: 'The email address is invalid.'
  },
  [SecureErrorType.AUTH_SESSION_EXPIRED]: {
    de: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.',
    en: 'Your session has expired. Please log in again.'
  },
  [SecureErrorType.AUTH_TOO_MANY_REQUESTS]: {
    de: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
    en: 'Too many requests. Please try again later.'
  },
  [SecureErrorType.NETWORK_ERROR]: {
    de: 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
    en: 'Connection error. Please check your internet connection.'
  },
  [SecureErrorType.UNKNOWN_ERROR]: {
    de: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    en: 'An error occurred. Please try again later.'
  }
};

// ============================================
// ERROR FACTORY (Factory Pattern Implementation)
// ============================================

/**
 * Error Factory
 * Creates appropriate error instances based on error type
 * Factory Pattern: Centralized error creation logic
 */
export class ErrorFactory {
  /**
   * Create authentication error
   */
  static createAuthenticationError(
    authErrorType: SecureErrorType,
    context?: Record<string, unknown>
  ): AuthenticationError {
    return new AuthenticationError(
      ERROR_MESSAGES[authErrorType].en,
      authErrorType,
      context
    );
  }

  /**
   * Create network error
   */
  static createNetworkError(
    message: string,
    statusCode?: number,
    context?: Record<string, unknown>
  ): NetworkError {
    return new NetworkError(message, statusCode, context);
  }

  /**
   * Create validation error
   */
  static createValidationError(
    field: string,
    message: string,
    value?: unknown,
    context?: Record<string, unknown>
  ): ValidationError {
    return new ValidationError(message, field, value, context);
  }

  /**
   * Create business logic error
   */
  static createBusinessLogicError(
    code: string,
    message: string,
    context?: Record<string, unknown>
  ): BusinessLogicError {
    return new BusinessLogicError(message, code, context);
  }

  /**
   * Create critical system error
   */
  static createCriticalSystemError(
    systemComponent: string,
    message: string,
    context?: Record<string, unknown>
  ): CriticalSystemError {
    return new CriticalSystemError(message, systemComponent, context);
  }

  /**
   * Convert unknown error to appropriate BaseAppError
   * Error classification strategy
   */
  static fromUnknown(error: unknown, context?: Record<string, unknown>): BaseAppError {
    // Already a BaseAppError
    if (error instanceof BaseAppError) {
      return error;
    }

    // Supabase Auth Error
    if (error instanceof AuthApiError) {
      const authErrorType = this.classifyAuthError(error);
      return this.createAuthenticationError(authErrorType, context);
    }

    // Generic Error
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Network errors
      if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
        return this.createNetworkError(error.message, undefined, context);
      }

      // Default: Unknown error wrapped in AuthenticationError
      return this.createAuthenticationError(SecureErrorType.UNKNOWN_ERROR, context);
    }

    // Unknown error type
    return this.createAuthenticationError(SecureErrorType.UNKNOWN_ERROR, context);
  }

  /**
   * Classify Supabase auth errors into secure types
   * Private static method for encapsulation
   */
  private static classifyAuthError(error: AuthApiError): SecureErrorType {
    // Log the actual error for debugging (server-side only!)
    console.error('[AUTH ERROR] Internal error logged:', error.message);

    const status = error.status;
    const message = error.message.toLowerCase();

    // Invalid credentials (DO NOT distinguish between wrong email and wrong password!)
    if (status === 400 && (message.includes('invalid') || message.includes('not found'))) {
      return SecureErrorType.AUTH_INVALID_CREDENTIALS;
    }

    // Email already registered
    if (status === 400 && message.includes('already')) {
      return SecureErrorType.AUTH_USER_EXISTS;
    }

    // Weak password
    if (status === 400 && message.includes('password')) {
      return SecureErrorType.AUTH_WEAK_PASSWORD;
    }

    // Invalid email format
    if (status === 400 && message.includes('email')) {
      return SecureErrorType.AUTH_EMAIL_INVALID;
    }

    // Rate limiting
    if (status === 429) {
      return SecureErrorType.AUTH_TOO_MANY_REQUESTS;
    }

    // Session expired
    if (status === 401 || message.includes('expired')) {
      return SecureErrorType.AUTH_SESSION_EXPIRED;
    }

    // Default
    return SecureErrorType.UNKNOWN_ERROR;
  }
}

// ============================================
// ERROR HANDLER STRATEGIES (Strategy Pattern)
// ============================================

/**
 * Error Handler Strategy Interface
 * Strategy Pattern: Different error handling strategies
 */
export interface IErrorHandlerStrategy {
  handle(error: BaseAppError, language: 'de' | 'en'): void;
}

/**
 * Console Logging Strategy
 * Logs errors to console (development)
 */
export class ConsoleLoggingStrategy implements IErrorHandlerStrategy {
  handle(error: BaseAppError, language: 'de' | 'en'): void {
    console.error('[ERROR]', {
      ...error.getLogContext(),
      userMessage: error.getUserMessage(language)
    });
  }
}

/**
 * Production Logging Strategy
 * Sends errors to external logging service (Sentry, etc.)
 */
export class ProductionLoggingStrategy implements IErrorHandlerStrategy {
  constructor(
    private readonly loggingService?: { captureException: (error: Error) => void }
  ) {}

  handle(error: BaseAppError, language: 'de' | 'en'): void {
    // In production, send to logging service
    if (this.loggingService) {
      this.loggingService.captureException(error);
    }

    // Still log to console as fallback
    console.error('[PROD ERROR]', {
      correlationId: error.correlationId,
      severity: error.getSeverity(),
      userMessage: error.getUserMessage(language)
    });
  }
}

/**
 * User Notification Strategy
 * Shows user-friendly error messages
 */
export class UserNotificationStrategy implements IErrorHandlerStrategy {
  handle(error: BaseAppError, language: 'de' | 'en'): void {
    // This would integrate with your notification system
    const userMessage = error.getUserMessage(language);
    const severity = error.getSeverity();

    // TODO: Integrate with toast/notification system
    console.log('[USER NOTIFICATION]', { userMessage, severity });
  }
}

// ============================================
// ERROR HANDLER CONTEXT (Context Pattern)
// ============================================

/**
 * Error Handler Context
 * Context Pattern: Manages error handling strategies
 */
export class ErrorHandlerContext {
  private strategies: IErrorHandlerStrategy[] = [];

  /**
   * Add error handling strategy
   */
  addStrategy(strategy: IErrorHandlerStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Remove error handling strategy
   */
  removeStrategy(strategy: IErrorHandlerStrategy): void {
    this.strategies = this.strategies.filter(s => s !== strategy);
  }

  /**
   * Handle error with all registered strategies
   */
  handleError(error: unknown, language: 'de' | 'en' = 'de'): string {
    // Convert to BaseAppError
    const appError = ErrorFactory.fromUnknown(error);

    // Execute all strategies
    this.strategies.forEach(strategy => {
      try {
        strategy.handle(appError, language);
      } catch (handlerError) {
        console.error('[ERROR HANDLER FAILED]', handlerError);
      }
    });

    // Return user-friendly message
    return appError.getUserMessage(language);
  }
}

// ============================================
// LEGACY FUNCTIONS (Backward Compatibility)
// ============================================

/**
 * Classify Supabase auth errors into secure types
 * Prevents user enumeration and information leakage
 * @deprecated Use ErrorFactory.fromUnknown() instead
 */
export const classifyAuthError = (error: unknown): SecureErrorType => {
  // Log the actual error for debugging (server-side only!)
  console.error('[AUTH ERROR] Internal error logged:', error instanceof Error ? error.message : error);

  // Check if it's an AuthApiError from Supabase
  if (error instanceof AuthApiError) {
    const status = error.status;
    const message = error.message.toLowerCase();

    // Invalid credentials (DO NOT distinguish between wrong email and wrong password!)
    if (status === 400 && (message.includes('invalid') || message.includes('not found'))) {
      return SecureErrorType.AUTH_INVALID_CREDENTIALS;
    }

    // Email already registered
    if (status === 400 && message.includes('already')) {
      return SecureErrorType.AUTH_USER_EXISTS;
    }

    // Weak password
    if (status === 400 && message.includes('password')) {
      return SecureErrorType.AUTH_WEAK_PASSWORD;
    }

    // Invalid email format
    if (status === 400 && message.includes('email')) {
      return SecureErrorType.AUTH_EMAIL_INVALID;
    }

    // Rate limiting
    if (status === 429) {
      return SecureErrorType.AUTH_TOO_MANY_REQUESTS;
    }

    // Session expired
    if (status === 401 || message.includes('expired')) {
      return SecureErrorType.AUTH_SESSION_EXPIRED;
    }
  }

  // Generic error (network, timeout, etc.)
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return SecureErrorType.NETWORK_ERROR;
    }
  }

  // Default: Unknown error (DO NOT expose details!)
  return SecureErrorType.UNKNOWN_ERROR;
};

/**
 * Get secure error message for user
 * @param error - The error object
 * @param language - User's language ('de' or 'en')
 * @returns Secure error message (no information leakage)
 * @deprecated Use ErrorFactory.fromUnknown() + getUserMessage() instead
 */
export const getSecureErrorMessage = (
  error: unknown,
  language: 'de' | 'en' = 'de'
): string => {
  const errorType = classifyAuthError(error);
  return ERROR_MESSAGES[errorType][language];
};

/**
 * Secure error handler for login
 * Prevents user enumeration
 * @deprecated Use ErrorHandlerContext.handleError() instead
 */
export const handleLoginError = (error: unknown, language: 'de' | 'en' = 'de'): string => {
  const errorType = classifyAuthError(error);

  // SECURITY: Always show the same message for invalid credentials
  // This prevents user enumeration (checking if email exists)
  if (errorType === SecureErrorType.AUTH_INVALID_CREDENTIALS ||
      errorType === SecureErrorType.AUTH_EMAIL_INVALID) {
    return ERROR_MESSAGES[SecureErrorType.AUTH_INVALID_CREDENTIALS][language];
  }

  return ERROR_MESSAGES[errorType][language];
};

/**
 * Secure error handler for registration
 * @deprecated Use ErrorHandlerContext.handleError() instead
 */
export const handleRegisterError = (error: unknown, language: 'de' | 'en' = 'de'): string => {
  const errorType = classifyAuthError(error);
  return ERROR_MESSAGES[errorType][language];
};

/**
 * Log error securely (server-side only, never expose to client)
 * @deprecated Use BaseAppError.getLogContext() instead
 */
export const logSecureError = (context: string, error: unknown) => {
  // In production, send this to your logging service (e.g., Sentry, LogRocket)
  // NEVER include this data in client-side error messages!
  console.error(`[SECURE LOG] ${context}:`, {
    type: error instanceof Error ? error.constructor.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
};

// ============================================
// SINGLETON ERROR HANDLER (Global Instance)
// ============================================

/**
 * Global Error Handler Instance
 * Singleton Pattern: Single error handler for the entire application
 */
export const globalErrorHandler = new ErrorHandlerContext();

// Initialize with default strategies
if (process.env.NODE_ENV === 'production') {
  globalErrorHandler.addStrategy(new ProductionLoggingStrategy());
} else {
  globalErrorHandler.addStrategy(new ConsoleLoggingStrategy());
}

globalErrorHandler.addStrategy(new UserNotificationStrategy());

/**
 * Convenience function to handle errors globally
 * Use this in your error boundaries and catch blocks
 */
export const handleError = (error: unknown, language: 'de' | 'en' = 'de'): string => {
  return globalErrorHandler.handleError(error, language);
};
