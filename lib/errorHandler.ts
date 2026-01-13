// ============================================
// SECURE ERROR HANDLING
// OWASP A04:2021 - Insecure Design
// ============================================

import { AuthApiError } from '@supabase/supabase-js';

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

/**
 * Classify Supabase auth errors into secure types
 * Prevents user enumeration and information leakage
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
 */
export const handleRegisterError = (error: unknown, language: 'de' | 'en' = 'de'): string => {
  const errorType = classifyAuthError(error);
  return ERROR_MESSAGES[errorType][language];
};

/**
 * Log error securely (server-side only, never expose to client)
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
