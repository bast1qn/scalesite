/**
 * API Modules - Enterprise-Grade Type Definitions
 *
 * Standardized API response types for consistency across all modules
 * Follows SOLID principles and OpenAPI specification patterns
 */

import type { SupabaseError } from '../supabase';

// ============================================
// API ERROR TYPES (Hierarchical Error System)
// ============================================

export type ApiErrorType =
  | 'network'           // Connection/timeout errors
  | 'auth'             // Authentication/authorization errors
  | 'validation'       // Input validation errors
  | 'not_found'        // Resource not found errors
  | 'server'           // Internal server errors (5xx)
  | 'rate_limited'     // Too many requests
  | 'unknown';         // Unexpected errors

/**
 * Standardized API Error Interface
 * Compatible with OpenAPI 3.0 specification
 */
export interface ApiError {
  type: ApiErrorType;
  message: string;
  code?: string;              // Machine-readable error code
  details?: Record<string, unknown>; // Additional error context
  timestamp: string;           // ISO 8601 timestamp
  correlationId?: string;      // Request correlation ID
}

/**
 * API Response Wrapper (Success)
 * Generic type for successful responses
 */
export interface ApiResponse<T> {
  data: T;
  success: true;
  message?: string;           // Optional success message
  metadata?: ResponseMetadata;
}

/**
 * API Response Wrapper (Error)
 * Standardized error response
 */
export interface ApiResponseError {
  data: null;
  success: false;
  error: ApiError;
}

/**
 * Union Type for All API Responses
 */
export type ApiResult<T> = ApiResponse<T> | ApiResponseError;

/**
 * Response Metadata
 * Provides additional information about the response
 */
export interface ResponseMetadata {
  timestamp: string;          // ISO 8601
  requestId?: string;         // Unique request identifier
  version?: string;           // API version
  pagination?: PaginationMetadata;
}

/**
 * Pagination Metadata
 */
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Cache Entry
 * Used for API response caching
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  etag?: string;
}

/**
 * API Request Options
 * Standardized request configuration
 */
export interface ApiRequestOptions {
  cache?: boolean;            // Enable caching
  cacheTTL?: number;          // Cache time-to-live (ms)
  retries?: number;           // Number of retries
  timeout?: number;           // Request timeout (ms)
  signal?: AbortSignal;       // Abort controller signal
}

/**
 * Pagination Request Options
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Check if API response is successful
 */
export function isApiSuccess<T>(response: ApiResult<T>): response is ApiResponse<T> {
  return response.success === true;
}

/**
 * Check if API response is an error
 */
export function isApiError<T>(response: ApiResult<T>): response is ApiResponseError {
  return response.success === false;
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Create successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  metadata?: Partial<ResponseMetadata>
): ApiResponse<T> {
  return {
    data,
    success: true,
    message,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata
    }
  };
}

/**
 * Create error API response
 */
export function createErrorResponse(
  type: ApiErrorType,
  message: string,
  code?: string,
  details?: Record<string, unknown>
): ApiResponseError {
  return {
    data: null,
    success: false,
    error: {
      type,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
      correlationId: crypto.randomUUID?.() ?? Math.random().toString(36)
    }
  };
}

/**
 * Create paginated response metadata
 */
export function createPaginationMetadata(
  page: number,
  pageSize: number,
  totalCount: number
): PaginationMetadata {
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1
  };
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
