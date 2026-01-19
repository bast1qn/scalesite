// ========================================================================
// ✅ PERFORMANCE: Optimized Intersection Observer Hook
// ========================================================================
// Reduces observer instances and prevents memory leaks
// Uses a single shared observer for all elements
// ========================================================================

import { useEffect, useRef, useState, RefObject } from 'react';

interface ObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Global observer cache to prevent multiple instances
const observerCache = new Map<string, IntersectionObserver>();

/**
 * Optimized intersection observer with shared instance
 * Reduces memory usage by reusing observers across components
 */
export function useIntersectionObserver(
  options: ObserverOptions = {}
): [RefObject<HTMLElement>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const hasIntersectedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create cache key for this observer configuration
    const observerKey = `${threshold}-${rootMargin}`;

    // Get or create shared observer
    let observer = observerCache.get(observerKey);

    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Check if this is our element
            if (entry.target === element) {
              if (entry.isIntersecting && (!triggerOnce || !hasIntersectedRef.current)) {
                setIsIntersecting(true);
                if (triggerOnce) {
                  hasIntersectedRef.current = true;
                }
              } else if (!triggerOnce && !entry.isIntersecting) {
                setIsIntersecting(false);
              }
            }
          });
        },
        { threshold, rootMargin }
      );

      observerCache.set(observerKey, observer);
    }

    // Observe element
    const observerInstance = observer;
    observerInstance.observe(element);

    // Cleanup
    return () => {
      observerInstance.unobserve(element);

      // Clean up unused observers
      if (observerInstance.root?.childElementCount === 0) {
        observerInstance.disconnect();
        observerCache.delete(observerKey);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isIntersecting];
}

/**
 * Cleanup function to clear all cached observers
 * Call this on app unmount or route changes
 */
export function clearObserverCache() {
  observerCache.forEach((observer) => observer.disconnect());
  observerCache.clear();
}
