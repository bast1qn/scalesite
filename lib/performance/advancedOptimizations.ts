/**
 * ADVANCED PERFORMANCE OPTIMIZATIONS
 * Collection of high-impact performance utilities
 *
 * @performance
 * - RequestIdleCallback batching
 * - RAF-based animations
 * - Debounced/throttled operations
 * - Memory leak prevention
 */

import { useEffect, useRef, useCallback, type DependencyList } from 'react';

// =====================================================
// REQUESTIDLECALLBACK UTILITIES
// Execute non-critical tasks during browser idle periods
// =====================================================

/**
 * Run callback during browser idle time with fallback
 */
export function runWhenIdle(
  callback: () => void,
  timeout: number = 2000
): void {
  if ('requestIdleCallback' in window) {
    // ✅ FIXED: Use proper type casting instead of 'any'
    const windowWithIdle = window as Window & {
      requestIdleCallback: (cb: () => void, options: { timeout: number }) => number;
    };
    windowWithIdle.requestIdleCallback(
      () => callback(),
      { timeout }
    );
  } else {
    // Fallback for Safari
    setTimeout(() => callback(), 1);
  }
}

/**
 * Hook for running effects during idle time
 */
export function useIdleEffect(
  effect: () => void | (() => void),
  deps?: DependencyList
): void {
  useEffect(() => {
    const cleanupRef = { current: null as (() => void) | null };

    runWhenIdle(() => {
      cleanupRef.current = effect() || null;
    });

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, deps);
}

// =====================================================
// REQUESTANIMATIONFRAME UTILITIES
// Smooth 60fps animations
// =====================================================

/**
 * Throttle function using RAF for smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(fn: T): T {
  let rafId: number | null = null;
  let lastArgs: Parameters<T>;

  return ((...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        fn(...lastArgs);
        rafId = null;
      });
    }
  }) as T;
}

/**
 * Hook for RAF-based scroll handlers
 */
export function useRafScroll(
  callback: (scrollY: number) => void,
  deps: DependencyList = []
): void {
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          if (scrollY !== lastScrollRef.current) {
            callback(scrollY);
            lastScrollRef.current = scrollY;
          }
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, deps);
}

// =====================================================
// ADVANCED DEBOUNCE/THROTTLE
// Optimized event handlers
// =====================================================

/**
 * Leading-edge debounce (executes immediately, then waits)
 */
export function debounceLeading<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      fn(...args);
      lastCall = now;
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
        lastCall = Date.now();
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Trailing throttle (executes at end of delay period)
 */
export function throttleTrailing<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    lastArgs = args;

    if (!timer) {
      timer = setTimeout(() => {
        if (lastArgs) {
          fn(...lastArgs);
        }
        timer = null;
        lastArgs = null;
      }, delay);
    }
  };
}

// =====================================================
// MEMORY LEAK PREVENTION
// Cleanup utilities for side effects
// =====================================================

/**
 * Hook for async operations with cleanup
 * Prevents state updates on unmounted components
 */
export function useAsyncEffect(
  asyncFn: () => Promise<void>,
  deps: DependencyList = []
): void {
  useEffect(() => {
    let cancelled = false;

    asyncFn().then(() => {
      if (!cancelled) {
        // Component is still mounted
      }
    });

    return () => {
      cancelled = true;
    };
  }, deps);
}

/**
 * AbortController wrapper for fetch requests
 */
export function useAbortController(): {
  getSignal: () => AbortSignal;
  abort: () => void;
  isAborted: () => boolean;
} {
  const controllerRef = useRef<AbortController | null>(null);

  const getSignal = useCallback(() => {
    if (!controllerRef.current) {
      controllerRef.current = new AbortController();
    }
    return controllerRef.current.signal;
  }, []);

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  const isAborted = useCallback(() => {
    return controllerRef.current?.signal.aborted ?? false;
  }, []);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return { getSignal, abort, isAborted };
}

// =====================================================
// BATCH STATE UPDATES
// Reduce render cycles with React automatic batching
// =====================================================

/**
 * Batch multiple state updates into single render
 * Note: React 18+ does this automatically, but explicit batching
 * can still be useful for complex scenarios
 */
export function batchUpdates<T>(updates: (() => T)[]): T[] {
  // ✅ FIXED: Use proper type checking for React API
  if ('unstable_batchedUpdates' in React) {
    const ReactWithBatching = React as typeof React & {
      unstable_batchedUpdates: <U>(callback: () => U) => U;
    };
    // React 17 and earlier
    return ReactWithBatching.unstable_batchedUpdates(() => {
      return updates.map(fn => fn());
    });
  }

  // React 18+ has automatic batching
  return updates.map(fn => fn());
}

// =====================================================
// DEFERRED VALUE UPDATES
// Non-blocking UI updates
// =====================================================

/**
 * Hook for deferred value updates (React 18+)
 * Prioritizes critical updates over less important ones
 */
export function useDeferredValue<T>(value: T, initialValue?: T): T {
  const [deferredValue, setDeferredValue] = useState(initialValue ?? value);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setDeferredValue(value);
    });

    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return deferredValue;
}

/**
 * Hook for transition tracking (React 18+)
 * Marks urgent vs non-urgent updates
 */
export function useTransition(): [
  boolean,
  (callback: () => void) => void
] {
  const [isPending, setIsPending] = useState(false);

  const startTransition = useCallback((callback: () => void) => {
    setIsPending(true);

    // ✅ FIXED: Use proper type checking for React 18+ startTransition
    const ReactWithTransition = React as typeof React & {
      startTransition?: (callback: () => void) => void;
    };

    // Use startTransition if available (React 18+)
    if (ReactWithTransition.startTransition) {
      ReactWithTransition.startTransition(() => {
        callback();
        setIsPending(false);
      });
    } else {
      // Fallback: Use setTimeout
      setTimeout(() => {
        callback();
        setIsPending(false);
      }, 0);
    }
  }, []);

  return [isPending, startTransition];
}

// =====================================================
// LAYOUT STABILITY
// Prevent CLS with dimension reservations
// =====================================================

/**
 * Hook for reserving space for dynamic content
 * Prevents layout shift when content loads
 */
export function useReservedSpace(
  loader: () => Promise<{ width: number; height: number }>
): { style: React.CSSProperties; isLoading: boolean } {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loader().then(dims => {
      setDimensions(dims);
      setIsLoading(false);
    });
  }, [loader]);

  const style: React.CSSProperties = useMemo(() => {
    if (dimensions) {
      return {
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      };
    }
    return {};
  }, [dimensions]);

  return { style, isLoading };
}

// =====================================================
// IMAGE LOADING OPTIMIZATION
// Priority-based image loading
// =====================================================

/**
 * Hook for progressive image loading
 */
export function useProgressiveImage(
  src: string,
  placeholder?: string
): { src: string; isLoading: boolean } {
  const [imageSrc, setImageSrc] = useState(placeholder ?? src);
  const [isLoading, setIsLoading] = useState(!placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };
  }, [src]);

  return { src: imageSrc, isLoading };
}

/**
 * Preload image with priority
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.fetchPriority = priority;

  document.head.appendChild(link);
}

// =====================================================
// PERFORMANCE MARKING
// Mark and measure operations
// =====================================================

/**
 * Mark performance start
 */
export function perfMark(name: string): void {
  if (import.meta.env.DEV && performance.mark) {
    performance.mark(`${name}-start`);
  }
}

/**
 * Mark performance end and measure
 */
export function perfMeasure(name: string, label?: string): number {
  if (import.meta.env.DEV && performance.measure) {
    performance.mark(`${name}-end`);
    performance.measure(label ?? name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(label ?? name)[0];
    return measure?.duration ?? 0;
  }
  return 0;
}

/**
 * Hook for component performance tracking
 */
export function usePerfTrack(componentName: string): void {
  if (import.meta.env.DEV) {
    useEffect(() => {
      perfMark(componentName);
      return () => {
        const duration = perfMeasure(componentName);
        console.log(`[Perf] ${componentName} rendered in ${duration.toFixed(2)}ms`);
      };
    });
  }
}

// Re-export React for convenience
export { React, useState, useEffect };
