/**
 * API Modules - Shared Types
 *
 * Internal types used across API modules for consistency
 */

import type { SupabaseError } from '../supabase';

export type ApiErrorType = 'network' | 'auth' | 'validation' | 'not_found' | 'server' | 'unknown';

export interface ApiError {
  type: ApiErrorType;
  message: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Error classification utility
 * Maps Supabase errors to user-friendly error types
 */
export function classifyError(error: SupabaseError): ApiErrorType {
  if (!error.code) return 'unknown';

  // Network/timeout errors
  if (error.message?.includes('timeout') || error.message?.includes('network')) {
    return 'network';
  }

  // Authentication errors
  if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
    return 'auth';
  }

  // Validation errors
  if (error.code === '23505' || error.code === '23503' || error.code === '23502') {
    return 'validation';
  }

  // Not found errors
  if (error.code === 'PGRST116') {
    return 'not_found';
  }

  // Server errors (5xx)
  if (error.code.startsWith('5')) {
    return 'server';
  }

  return 'unknown';
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(type: ApiErrorType): string {
  const messages: Record<ApiErrorType, string> = {
    network: 'Network error. Please check your connection.',
    auth: 'Session expired. Please log in again.',
    validation: 'Invalid data provided. Please check your input.',
    not_found: 'Resource not found.',
    server: 'Server error. Please try again later.',
    unknown: 'An error occurred. Please try again.'
  };
  return messages[type];
}

/**
 * Handle Supabase errors with security best practices
 * Prevents information leakage (OWASP A05:2021)
 */
export function handleSupabaseError(error: SupabaseError | null): ApiError | null {
  if (error) {
    // SECURITY: Don't expose internal error messages to users
    if (import.meta.env.DEV) {
      console.error('[API] Internal error:', error.message, error.code);
    }

    const errorType = classifyError(error);
    const userMessage = getUserFriendlyMessage(errorType);

    return {
      type: errorType,
      message: userMessage
    };
  }
  return null;
}
