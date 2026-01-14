interface SupabaseError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

export type ApiErrorType = 'network' | 'auth' | 'validation' | 'not_found' | 'server' | 'unknown';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  originalCode?: string;
}

const CLASSIFY_ERROR_PATTERNS = {
  timeout: ['timeout', 'network'],
  auth: ['JWT'],
  notFound: ['PGRST116'],
  serverPrefix: ['5'],
} as const;

const ERROR_CODES = {
  validation: ['23505', '23503', '23502'],
} as const;

export const classifyError = (error: SupabaseError): ApiErrorType => {
  if (!error.code) return 'unknown';

  // Network/timeout errors
  if (CLASSIFY_ERROR_PATTERNS.timeout.some(pattern => error.message?.includes(pattern))) {
    return 'network';
  }

  // Authentication errors
  if (error.code === 'PGRST116' || CLASSIFY_ERROR_PATTERNS.auth.some(pattern => error.message?.includes(pattern))) {
    return 'auth';
  }

  // Validation errors
  if (ERROR_CODES.validation.includes(error.code)) {
    return 'validation';
  }

  // Not found errors
  if (error.code === 'PGRST116') {
    return 'not_found';
  }

  // Server errors (5xx)
  if (CLASSIFY_ERROR_PATTERNS.serverPrefix.some(pattern => error.code.startsWith(pattern))) {
    return 'server';
  }

  return 'unknown';
};

export const getUserFriendlyMessage = (type: ApiErrorType): string => {
  const messages: Record<ApiErrorType, string> = {
    network: 'Network error. Please check your connection.',
    auth: 'Session expired. Please log in again.',
    validation: 'Invalid data provided. Please check your input.',
    not_found: 'Resource not found.',
    server: 'Server error. Please try again later.',
    unknown: 'An error occurred. Please try again.'
  };
  return messages[type];
};

export const handleSupabaseError = (error: SupabaseError | null): ApiError | null => {
  if (error) {
    // SECURITY: Don't expose internal error messages to users (OWASP A05:2021)
    // Internal errors may leak database structure, table names, or implementation details
    console.error('[API] Internal error:', error.message, error.code);

    const errorType = classifyError(error);
    const userMessage = getUserFriendlyMessage(errorType);

    return {
      type: errorType,
      message: userMessage,
      originalCode: error.code
    };
  }
  return null;
};
