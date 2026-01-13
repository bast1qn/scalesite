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

// ============================================
// PHONE VALIDATION
// ============================================

/**
 * Validates phone number (international format)
 * Supports E.164 format and local formats
 */
export const validatePhone = (phone: string): ValidationResult => {
    const errors: string[] = [];

    if (!phone || phone.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    // Remove common separators and spaces
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Check minimum length (E.164: max 15 digits after country code)
    if (cleaned.length < 7 || cleaned.length > 16) {
        errors.push('invalid_length');
        return { isValid: false, errors };
    }

    // Check if it starts with + (international format) or is a valid local number
    const phoneRegex = /^(\+|00)[1-9]\d{6,14}$/;

    if (!phoneRegex.test(cleaned)) {
        errors.push('invalid_format');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: cleaned
    };
};

// ============================================
// PROJECT VALIDATION
// ============================================

/**
 * Validates project name
 */
export const validateProjectName = (name: string): ValidationResult => {
    return validateString(name, {
        minLength: 3,
        maxLength: 100,
        allowEmpty: false
    });
};

/**
 * Validates project description
 */
export const validateProjectDescription = (description: string): ValidationResult => {
    return validateString(description, {
        minLength: 10,
        maxLength: 2000,
        allowEmpty: true
    });
};

/**
 * Validates industry selection
 */
export const validateIndustry = (industry: string, allowedIndustries: string[]): ValidationResult => {
    const errors: string[] = [];

    if (!industry || industry.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    if (!allowedIndustries.includes(industry)) {
        errors.push('invalid_industry');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: industry.trim()
    };
};

// ============================================
// COLOR VALIDATION
// ============================================

/**
 * Validates hexadecimal color code
 * Supports 3-digit (#RGB) and 6-digit (#RRGGBB) formats
 */
export const validateHexColor = (color: string): ValidationResult => {
    const errors: string[] = [];

    if (!color || color.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (!hexColorRegex.test(color)) {
        errors.push('invalid_hex_format');
        return { isValid: false, errors };
    }

    // Convert 3-digit to 6-digit for consistency
    let sanitized = color.toUpperCase();
    if (sanitized.length === 4) {
        sanitized = '#' + sanitized[1] + sanitized[1] + sanitized[2] + sanitized[2] + sanitized[3] + sanitized[3];
    }

    return {
        isValid: true,
        errors: [],
        sanitized
    };
};

/**
 * Validates color palette (array of hex colors)
 */
export const validateColorPalette = (colors: string[]): ValidationResult => {
    const errors: string[] = [];

    if (!Array.isArray(colors) || colors.length === 0) {
        errors.push('empty_palette');
        return { isValid: false, errors };
    }

    if (colors.length > 10) {
        errors.push('too_many_colors');
        return { isValid: false, errors };
    }

    for (const color of colors) {
        const result = validateHexColor(color);
        if (!result.isValid) {
            errors.push(`invalid_color: ${color}`);
            return { isValid: false, errors };
        }
    }

    return {
        isValid: true,
        errors: [],
        sanitized: colors
    };
};

// ============================================
// DATE & TIME VALIDATION
// ============================================

/**
 * Validates date string
 */
export const validateDate = (dateString: string, options: {
    minDate?: Date;
    maxDate?: Date;
    allowPast?: boolean;
    allowFuture?: boolean;
} = {}): ValidationResult => {
    const errors: string[] = [];
    const { minDate, maxDate, allowPast = true, allowFuture = true } = options;

    if (!dateString || dateString.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        errors.push('invalid_date');
        return { isValid: false, errors };
    }

    const now = new Date();

    if (!allowPast && date < now) {
        errors.push('date_in_past');
        return { isValid: false, errors };
    }

    if (!allowFuture && date > now) {
        errors.push('date_in_future');
        return { isValid: false, errors };
    }

    if (minDate && date < minDate) {
        errors.push('before_minimum');
        return { isValid: false, errors };
    }

    if (maxDate && date > maxDate) {
        errors.push('after_maximum');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: date.toISOString()
    };
};

/**
 * Validates date range (start before end)
 */
export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
    const errors: string[] = [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        errors.push('invalid_date');
        return { isValid: false, errors };
    }

    if (start >= end) {
        errors.push('start_after_end');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: []
    };
};

// ============================================
// BUSINESS VALIDATION
// ============================================

/**
 * Validates company name
 */
export const validateCompanyName = (name: string): ValidationResult => {
    return validateString(name, {
        minLength: 2,
        maxLength: 200,
        allowEmpty: false
    });
};

/**
 * Validates VAT number (EU format)
 */
export const validateVATNumber = (vat: string, countryCode: string = 'DE'): ValidationResult => {
    const errors: string[] = [];

    if (!vat || vat.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    // Remove spaces and dots
    const cleaned = vat.replace(/[\s\.]/g, '').toUpperCase();

    // EU VAT format: Country code + 8-12 characters
    const vatRegex = /^[A-Z]{2}[0-9A-Z]{8,12}$/;

    if (!vatRegex.test(cleaned)) {
        errors.push('invalid_vat_format');
        return { isValid: false, errors };
    }

    // Check country code matches
    if (!cleaned.startsWith(countryCode.toUpperCase())) {
        errors.push('country_mismatch');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: cleaned
    };
};

/**
 * Validates IBAN (International Bank Account Number)
 */
export const validateIBAN = (iban: string): ValidationResult => {
    const errors: string[] = [];

    if (!iban || iban.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    // Remove spaces and convert to uppercase
    const cleaned = iban.replace(/\s/g, '').toUpperCase();

    // Basic IBAN format: Country code (2 letters) + 2 check digits + up to 30 alphanumerics
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;

    if (!ibanRegex.test(cleaned)) {
        errors.push('invalid_iban_format');
        return { isValid: false, errors };
    }

    // Check minimum length
    if (cleaned.length < 15) {
        errors.push('too_short');
        return { isValid: false, errors };
    }

    // Check maximum length
    if (cleaned.length > 34) {
        errors.push('too_long');
        return { isValid: false, errors };
    }

    // TODO: Add full IBAN checksum validation if needed

    return {
        isValid: true,
        errors: [],
        sanitized: cleaned
    };
};

/**
 * Validates BIC (Bank Identifier Code)
 */
export const validateBIC = (bic: string): ValidationResult => {
    const errors: string[] = [];

    if (!bic || bic.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    // Remove spaces and convert to uppercase
    const cleaned = bic.replace(/\s/g, '').toUpperCase();

    // BIC format: 8 or 11 characters (Bank code + Country code + Location + Branch)
    const bicRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

    if (!bicRegex.test(cleaned)) {
        errors.push('invalid_bic_format');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: cleaned
    };
};

// ============================================
// ADDRESS VALIDATION
// ============================================

/**
 * Validates street address
 */
export const validateStreetAddress = (address: string): ValidationResult => {
    return validateString(address, {
        minLength: 5,
        maxLength: 255,
        allowEmpty: false
    });
};

/**
 * Validates postal code (format depends on country)
 */
export const validatePostalCode = (postalCode: string, countryCode: string = 'DE'): ValidationResult => {
    const errors: string[] = [];

    if (!postalCode || postalCode.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    const cleaned = postalCode.trim().toUpperCase();

    // Country-specific formats
    const patterns: Record<string, RegExp> = {
        'DE': /^\d{5}$/,                    // Germany: 5 digits
        'AT': /^\d{4}$/,                    // Austria: 4 digits
        'CH': /^\d{4}$/,                    // Switzerland: 4 digits
        'FR': /^\d{5}$/,                    // France: 5 digits
        'IT': /^\d{5}$/,                    // Italy: 5 digits
        'ES': /^\d{5}$/,                    // Spain: 5 digits
        'NL': /^\d{4}\s?[A-Z]{2}$/,        // Netherlands: 4 digits + 2 letters
        'GB': /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/, // UK: complex format
        'PL': /^\d{2}-\d{3}$/,             // Poland: 00-000
        'US': /^\d{5}(-\d{4})?$/           // US: 5 digits or 5+4
    };

    const pattern = patterns[countryCode.toUpperCase()] || patterns['DE'];

    if (!pattern.test(cleaned)) {
        errors.push('invalid_postal_format');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: cleaned
    };
};

/**
 * Validates city name
 */
export const validateCity = (city: string): ValidationResult => {
    return validateString(city, {
        minLength: 2,
        maxLength: 100,
        allowEmpty: false
    });
};

// ============================================
// CONTENT VALIDATION
// ============================================

/**
 * Validates website content (HTML, text, etc.)
 */
export const validateContent = (content: string, options: {
    maxLength?: number;
    allowHTML?: boolean;
    sanitizeHTML?: boolean;
} = {}): ValidationResult => {
    const errors: string[] = [];
    const { maxLength = 50000, allowHTML = false, sanitizeHTML = true } = options;

    if (!content || content.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    if (content.length > maxLength) {
        errors.push('too_long');
        return { isValid: false, errors };
    }

    // If HTML is not allowed, check for HTML tags
    if (!allowHTML && /<[^>]*>/.test(content)) {
        errors.push('html_not_allowed');
        return { isValid: false, errors };
    }

    // If HTML is allowed, sanitize it
    let sanitized = content;
    if (allowHTML && sanitizeHTML) {
        // Remove dangerous tags and attributes
        sanitized = sanitized
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
            .replace(/javascript:/gi, ''); // Remove javascript: protocol
    }

    return {
        isValid: true,
        errors: [],
        sanitized
    };
};

/**
 * Validates blog post content
 */
export const validateBlogPost = (title: string, content: string): ValidationResult => {
    const errors: string[] = [];

    const titleValidation = validateString(title, {
        minLength: 10,
        maxLength: 200,
        allowEmpty: false
    });

    if (!titleValidation.isValid) {
        errors.push(...titleValidation.errors.map(e => `title_${e}`));
    }

    const contentValidation = validateContent(content, {
        maxLength: 10000,
        allowHTML: true
    });

    if (!contentValidation.isValid) {
        errors.push(...contentValidation.errors.map(e => `content_${e}`));
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// ============================================
// PRICING & DISCOUNT VALIDATION
// ============================================

/**
 * Validates discount code format
 */
export const validateDiscountCode = (code: string): ValidationResult => {
    const errors: string[] = [];

    if (!code || code.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    const cleaned = code.trim().toUpperCase();

    // Discount code format: 4-20 alphanumeric characters
    const codeRegex = /^[A-Z0-9]{4,20}$/;

    if (!codeRegex.test(cleaned)) {
        errors.push('invalid_format');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: cleaned
    };
};

/**
 * Validates service ID
 */
export const validateServiceId = (serviceId: number, validIds: number[]): ValidationResult => {
    const errors: string[] = [];

    const numValidation = validateNumber(serviceId, {
        min: 1,
        integer: true,
        allowZero: false
    });

    if (!numValidation.isValid) {
        errors.push(...numValidation.errors);
        return { isValid: false, errors };
    }

    if (!validIds.includes(serviceId)) {
        errors.push('invalid_service');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: []
    };
};

/**
 * Validates quantity for pricing
 */
export const validateQuantity = (quantity: number): ValidationResult => {
    return validateNumber(quantity, {
        min: 1,
        max: 1000,
        integer: true,
        allowZero: false
    });
};

// ============================================
// FILE VALIDATION HELPERS
// ============================================

/**
 * Validates file size
 */
export const validateFileSize = (
    fileSize: number,
    maxSize: number
): ValidationResult => {
    const errors: string[] = [];

    if (fileSize === 0) {
        errors.push('empty_file');
        return { isValid: false, errors };
    }

    if (fileSize > maxSize) {
        errors.push(`file_too_large`);
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: []
    };
};

/**
 * Validates file type
 */
export const validateFileType = (
    fileType: string,
    allowedTypes: string[]
): ValidationResult => {
    const errors: string[] = [];

    if (!allowedTypes.includes(fileType)) {
        errors.push('invalid_file_type');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: []
    };
};

/**
 * Validates file name
 */
export const validateFileName = (fileName: string): ValidationResult => {
    const errors: string[] = [];

    if (!fileName || fileName.trim().length === 0) {
        errors.push('empty');
        return { isValid: false, errors };
    }

    if (fileName.length > 255) {
        errors.push('too_long');
        return { isValid: false, errors };
    }

    // Check for dangerous characters
    const dangerousChars = /[<>:"|?*]/;
    if (dangerousChars.test(fileName)) {
        errors.push('invalid_characters');
        return { isValid: false, errors };
    }

    // Check for path traversal attempts
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
        errors.push('path_traversal_attempt');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        sanitized: fileName.trim()
    };
};
