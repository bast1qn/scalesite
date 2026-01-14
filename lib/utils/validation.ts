/**
 * Validation utilities for type safety and error prevention
 */

/**
 * Validates if a value is a non-null object
 *
 * @param value - Any value to check
 * @returns True if value is a non-null object
 *
 * @example
 * isObject({}) // true
 * isObject(null) // false
 * isObject([]) // true (arrays are objects)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

/**
 * Type guard to check if object has required properties
 *
 * @param obj - Object to check
 * @param properties - Array of property names to check for
 * @returns True if object has all specified properties
 *
 * @example
 * hasProperties(data, ['id', 'name']) // true if data has id and name
 */
export function hasProperties<T extends string>(
    obj: unknown,
    properties: T[]
): obj is Record<T, unknown> {
    if (!isObject(obj)) return false;
    return properties.every(prop => prop in obj);
}

/**
 * Safely validates array data from API responses
 * Filters out null/undefined values and validates structure
 *
 * @param data - Raw API response data
 * @param requiredProps - Properties that must exist on each item
 * @returns Array of validated items
 *
 * @example
 * const services = validateArray(apiResponse, ['id', 'name'])
 */
export function validateArray<T extends Record<string, unknown>>(
    data: unknown,
    requiredProps: string[] = []
): T[] {
    if (!Array.isArray(data)) return [];

    return data.filter((item): item is T => {
        if (!isObject(item)) return false;
        return requiredProps.length === 0 || hasProperties(item, requiredProps as string[]);
    });
}

/**
 * Validates a date string and returns a Date object
 * Returns null if invalid
 *
 * @param dateString - Date string to validate
 * @returns Date object or null if invalid
 *
 * @example
 * const date = validateDate("2024-01-15")
 * const invalid = validateDate("invalid") // null
 */
export function validateDate(dateString: string): Date | null {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Checks if a string is a valid email format
 *
 * @param email - Email string to validate
 * @returns True if valid email format
 *
 * @example
 * isValidEmail("test@example.com") // true
 * isValidEmail("invalid") // false
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Safely parses a number from a string, returning a default value if invalid
 *
 * @param value - String or number to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default value
 *
 * @example
 * safeParseNumber("123", 0) // 123
 * safeParseNumber("abc", 0) // 0
 * safeParseNumber(null, 0) // 0
 */
export function safeParseNumber(value: string | number | null | undefined, defaultValue: number = 0): number {
    if (typeof value === 'number') return isNaN(value) ? defaultValue : value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
}
