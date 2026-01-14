/**
 * Performance Utility Hooks and Helpers
 *
 * Collection of performance-optimized React hooks
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * Hook to track component render count (dev only)
 */
export function useRenderCount(componentName: string) {
  if (!import.meta.env.DEV) return { count: 0 };

  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log(`[Render Count] ${componentName}: ${renderCount.current}`);
  });

  return { count: renderCount.current };
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to detect network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [effectiveType, setEffectiveType] = useState<Navigator['connection']['effectiveType']>(
    navigator.connection?.effectiveType || '4g'
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (navigator.connection) {
      const handleConnectionChange = () => {
        setEffectiveType(navigator.connection!.effectiveType || '4g');
      };

      navigator.connection.addEventListener('change', handleConnectionChange);
      return () => {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, []);

  return {
    isOnline,
    effectiveType,
    isSlowConnection: effectiveType === '2g' || effectiveType === 'slow-2g'
  };
}

/**
 * Hook to defer component rendering
 */
export function useDeferredRender<T>(value: T, delay = 0): T | null {
  const [deferredValue, setDeferredValue] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return deferredValue;
}

/**
 * Hook for lazy component initialization
 */
export function useLazyInit<T>(initFn: () => T): T | null {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    const idleCallbackId = requestIdleCallback(() => {
      setValue(initFn());
    });

    return () => cancelIdleCallback(idleCallbackId);
  }, [initFn]);

  return value;
}

/**
 * Hook to measure component render time
 */
export function useRenderTime(componentName: string) {
  if (!import.meta.env.DEV) {
    return { renderTime: 0 };
  }

  const renderStartTime = useRef<number>(Date.now());
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - renderStartTime.current;
    setRenderTime(duration);

    console.log(`[Render Time] ${componentName}: ${duration}ms`);
  });

  return { renderTime };
}

/**
 * Hook to detect if element is in viewport
 */
export function useInViewport(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInViewport;
}

/**
 * Hook to implement viewport-based resource loading
 */
export function useViewportLoad<T>(
  factory: () => T,
  ref: React.RefObject<Element>
): T | null {
  const [value, setValue] = useState<T | null>(null);
  const isInViewport = useInViewport(ref);

  useEffect(() => {
    if (isInViewport && !value) {
      setValue(factory());
    }
  }, [isInViewport, value, factory]);

  return value;
}

/**
 * Hook for memory-efficient event listeners
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: { passive?: boolean; capture?: boolean }
) {
  useEffect(() => {
    window.addEventListener(eventName, handler, options);

    return () => {
      window.removeEventListener(eventName, handler, options);
    };
  }, [eventName, handler, options]);
}

/**
 * Hook for local storage with proper error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // TYPE-SAFE: Use typeof check instead of instanceof Function
        const valueToStore =
          typeof value === 'function' ? (value as (prev: T) => T)(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook to track previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook for conditional hook execution
 */
export function useConditionalHook<T>(
  condition: boolean,
  hook: () => T
): T | undefined {
  return condition ? hook() : undefined;
}

/**
 * Hook for RAF-based animation loop
 */
export function useRAFLoop(callback: () => void, isActive = true) {
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isActive) return;

    const loop = () => {
      callback();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [callback, isActive]);
}

/**
 * Hook to detect if user is on mobile device
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook for throttled value updates
 */
export function useThrottledValue<T>(value: T, limit = 100): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

/**
 * Hook to track component lifecycle
 */
export function useComponentLifecycle(componentName: string) {
  if (!import.meta.env.DEV) {
    return { mountTime: 0, unmount: () => {} };
  }

  const mountTime = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    console.log(`[Component Mount] ${componentName} at ${now - mountTime.current}ms from render`);

    return () => {
      const unmountTime = Date.now();
      const duration = unmountTime - mountTime.current;
      console.log(`[Component Unmount] ${componentName} after ${duration}ms`);
    };
  }, [componentName]);

  return {
    mountTime: mountTime.current,
    unmount: () => {
      const duration = Date.now() - mountTime.current;
      console.log(`[Component Unmount] ${componentName} after ${duration}ms`);
    }
  };
}

/**
 * Optimized memo hook with deep comparison
 *
 * @template T - The type of value to memoize
 * @param factory - Function that creates the value to memoize
 * @param deps - Dependencies array for deep comparison
 * @returns Memoized value
 */
export function useDeepMemo<T>(factory: () => T, deps: readonly unknown[]): T {
  const ref = useRef<{ deps: readonly unknown[]; value: T } | null>(null);

  if (!ref.current || !isEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

/**
 * Deep equality check for primitive values, arrays, and plain objects
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal, false otherwise
 */
function isEqual(a: unknown, b: unknown): boolean {
  // Fast path: strict equality
  if (a === b) return true;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  // Handle plain objects
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => isEqual(a[key], b[key as keyof typeof b]));
  }

  return false;
}

/**
 * Type guard to check if value is a plain object (not null, not array, not Date, etc.)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}
