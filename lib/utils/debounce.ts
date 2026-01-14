/**
 * ✅ PERFORMANCE: Debounce Utility
 * Prevents excessive function calls (e.g., API calls during typing)
 * Reduces server load and improves UI responsiveness
 *
 * @example
 * const debouncedSearch = debounce((query) => searchAPI(query), 300);
 * debouncedSearch('search term');
 */

export function debounce<T extends (...args: Parameters<any>) => ReturnType<any>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    };
}

/**
 * ✅ PERFORMANCE: Throttle Utility
 * Limits function execution to once per time period
 * Useful for scroll/resize event handlers
 *
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle<T extends (...args: Parameters<any>) => ReturnType<any>>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
