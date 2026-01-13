// ============================================
// SECURITY VALIDATION LIBRARY
// OWASP COMPLIANT VALIDATION FUNCTIONS
// ============================================

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitized?: string;
}

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

// ============================================
// PASSWORD VALIDATION
// ============================================

export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('min_length');
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
        errors
    };
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
};

// ============================================
// EMAIL VALIDATION (RFC 5322 Compliant)
// ============================================

/**
 * Validates email format according to RFC 5322
 * Prevents email injection and malformed addresses
 */
export const validateEmail = (email: string): ValidationResult => {
    const errors: string[] = [];

    // Length check (RFC 5321: max 254 chars for entire address)
    if (!email || email.length > 254) {
        errors.push('invalid_length');
        return { isValid: false, errors };
    }

    // Basic format check (simplified RFC 5322)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
        errors.push('invalid_format');
        return { isValid: false, errors };
    }

    // Check for common injection patterns
    const dangerousPatterns = [
        /\n/, /\r/, // CRLF injection
        /<script>/i, // XSS attempts
        /javascript:/i, // Protocol injection
        /data:/i, // Data URI injection
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(email)) {
            errors.push('dangerous_content');
            return { isValid: false, errors };
        }
    }

    // Sanitize by trimming and lowercase
    const sanitized = email.trim().toLowerCase();

    return {
        isValid: true,
        errors: [],
        sanitized
    };
};

// ============================================
// STRING VALIDATION
// ============================================

/**
 * Validates string length and content
 * Prevents DoS via oversized payloads
 */
export const validateString = (
    input: string,
    options: {
        minLength?: number;
        maxLength: number;
        allowEmpty?: boolean;
        trim?: boolean;
    } = { maxLength: 1000 }
): ValidationResult => {
    const errors: string[] = [];
    const { minLength = 0, maxLength, allowEmpty = false, trim = true } = options;

    let processed = input;
    if (trim) {
        processed = processed.trim();
    }

    // Empty check
    if (!processed && !allowEmpty) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    // Length checks
    if (processed.length < minLength) {
        errors.push('too_short');
    }

    if (processed.length > maxLength) {
        errors.push('too_long');
        return { isValid: false, errors, sanitized: processed.slice(0, maxLength) };
    }

    // Check for dangerous patterns (potential XSS/injection)
    const dangerousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /javascript:/gi,
        /onerror=/gi,
        /onload=/gi,
        /onclick=/gi,
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(processed)) {
            errors.push('dangerous_content');
            return { isValid: false, errors };
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: processed
    };
};

/**
 * Sanitizes user input by removing HTML tags and encoding special characters
 */
export const sanitizeString = (input: string): string => {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// ============================================
// NUMBER VALIDATION
// ============================================

/**
 * Validates numeric input with min/max constraints
 */
export const validateNumber = (
    input: unknown,
    options: {
        min?: number;
        max?: number;
        integer?: boolean;
        allowZero?: boolean;
    } = {}
): ValidationResult => {
    const errors: string[] = [];
    const { min, max, integer = false, allowZero = true } = options;

    // Check if input is a valid number
    const num = typeof input === 'number' ? input : parseFloat(String(input));

    if (isNaN(num)) {
        errors.push('not_a_number');
        return { isValid: false, errors };
    }

    // Min value check
    if (min !== undefined && num < min) {
        errors.push('below_minimum');
    }

    // Max value check
    if (max !== undefined && num > max) {
        errors.push('above_maximum');
    }

    // Zero check
    if (!allowZero && num === 0) {
        errors.push('zero_not_allowed');
    }

    // Integer check
    if (integer && !Number.isInteger(num)) {
        errors.push('not_integer');
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: num.toString()
    };
};

// ============================================
// URL VALIDATION
// ============================================

/**
 * Validates URL format and security
 * Prevents javascript: and data: URL attacks
 */
export const validateURL = (url: string): ValidationResult => {
    const errors: string[] = [];

    if (!url || url.length > 2048) {
        errors.push('invalid_length');
        return { isValid: false, errors };
    }

    try {
        const parsed = new URL(url);

        // Only allow safe protocols
        const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
        if (!allowedProtocols.includes(parsed.protocol)) {
            errors.push('unsafe_protocol');
            return { isValid: false, errors };
        }

        return {
            isValid: true,
            errors: [],
            sanitized: parsed.href
        };
    } catch {
        errors.push('invalid_url');
        return { isValid: false, errors };
    }
};

// ============================================
// NAME VALIDATION
// ============================================

/**
 * Validates person names (letters, spaces, hyphens, apostrophes only)
 */
export const validateName = (name: string): ValidationResult => {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    if (name.length > 100) {
        errors.push('too_long');
        return { isValid: false, errors };
    }

    // Allow letters, spaces, hyphens, apostrophes, and common name characters
    const nameRegex = /^[\p{L}\s'-]+$/u;

    if (!nameRegex.test(name.trim())) {
        errors.push('invalid_characters');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: name.trim()
    };
};
