/**
 * Performance Utility Functions
 *
 * Collection of performance optimization utilities for ScaleSite
 */

/**
 * Performance Monitor - Track Core Web Vitals
 */
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  /**
   * Record a timing metric
   */
  mark(name: string): void {
    this.metrics.set(name, performance.now());
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.metrics.get(startMark);
    if (!start) {
      console.warn(`Performance mark "${startMark}" not found`);
      return 0;
    }

    const end = endMark ? this.metrics.get(endMark) : performance.now();
    if (!end) {
      console.warn(`Performance mark "${endMark}" not found`);
      return 0;
    }

    const duration = end - start;
    this.metrics.set(name, duration);

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Request Deduplication - Prevent duplicate API calls
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<unknown>>();

  /**
   * Execute a request, deduplicating identical in-flight requests
   */
  async execute<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // If request is in flight, return existing promise
    if (this.pendingRequests.has(key)) {
      if (import.meta.env.DEV) {
        console.log(`[RequestDeduplicator] Deduplicated: ${key}`);
      }
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Create new request
    const promise = requestFn()
      .finally(() => {
        // Remove from pending when complete
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * Lazy load utility for components
 */
export function lazyWithDelay<T>(
  importFn: () => Promise<{ default: T }>,
  delay: number = 0
): () => Promise<{ default: T }> {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        importFn().then(resolve);
      }, delay);
    });
}

/**
 * Optimized image srcset generator
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string {
  return sizes
    .map((size) => {
      // Assuming the CDN supports size parameter
      const url = baseUrl.includes('?')
        ? `${baseUrl}&w=${size}`
        : `${baseUrl}?w=${size}`;
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if element is in viewport (for lazy loading)
 */
export function isInViewport(
  element: HTMLElement,
  threshold: number = 0.1
): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 + threshold) &&
    rect.bottom >= -threshold * (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Throttle function for performance (alternative to hook)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let context: unknown;
  let args: Parameters<T>;
  let result: unknown;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  const later = function() {
    previous = Date.now();
    timeout = null;
    result = func.apply(context as ThisParameterType<T>, args);
    if (!timeout) context = args = undefined;
  };

  return function(this: ThisParameterType<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    context = this;
    args = arguments as unknown as Parameters<T>;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context as ThisParameterType<T>, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result as unknown;
  };
}

/**
 * Debounce function for performance (alternative to hook)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(this: ThisParameterType<T>) {
    const context = this;
    const args = arguments as unknown as Parameters<T>;

    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context as ThisParameterType<T>, args);
    };

    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context as ThisParameterType<T>, args);
  };
}

/**
 * Measure Core Web Vitals
 */
export function measureCoreWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      console.log(`[Core Web Vitals] LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP observation not supported');
  }

  // First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEntry & { processingStart: number; startTime: number };
        console.log(`[Core Web Vitals] FID: ${fidEntry.processingStart - fidEntry.startTime}ms`);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID observation not supported');
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  try {
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const clsEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
          console.log(`[Core Web Vitals] CLS: ${clsValue.toFixed(3)}`);
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS observation not supported');
  }
}

/**
 * Report performance metrics to analytics (placeholder)
 */
export function reportPerformanceMetrics(metrics: Record<string, number>) {
  // Send to analytics service
  if (import.meta.env.PROD && typeof window !== 'undefined' && (window as Record<string, unknown>).gtag) {
    (window as Record<string, unknown>).gtag('event', 'timing_complete', {
      name: 'page_load',
      value: metrics['page_load'] || 0,
      event_category: 'performance'
    });
  }
}

// Initialize performance monitoring in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  console.log('[Performance] Monitoring enabled');
  measureCoreWebVitals();
}
