import { useCallback, RefObject, useEffect, useRef, useState } from 'react';

// Re-export debounce hooks for convenience
export { useDebounce, useDebouncedCallback, useThrottle } from './hooks/useDebounce';

/**
 * Custom hook for hover state management
 * Returns handlers for mouse enter/leave events and the current hover state
 */
export function useHover<T extends HTMLElement = HTMLElement>(): {
  isHovered: boolean;
  onMouseEnter: MouseEventHandler<T>;
  onMouseLeave: MouseEventHandler<T>;
} {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
}

/**
 * Custom hook to detect clicks outside of a component and call a callback
 * Useful for dropdowns, modals, popups, etc.
 */
export function useClickOutsideCallback(
  callback: () => void,
  enabled: boolean = true
): RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);
  const stableCallback = useRef(callback);

  // Keep the callback ref up to date without causing effect re-runs
  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        stableCallback.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [enabled]);

  return ref;
}

/**
 * Custom hook to track scroll position
 * Returns true if scrolled past threshold
 */
export function useScroll(threshold: number = 0): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

/**
 * Custom hook to lock body scroll (for modals, mobile menus, etc.)
 */
export function useBodyScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (enabled) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [enabled]);
}

/**
 * Custom hook for chat auto-scroll behavior
 * Scrolls to bottom when new messages arrive, but only if user is near bottom
 *
 * @param containerRef - Ref to the scrollable container element
 * @param messages - Array of messages (triggers scroll when changed)
 * @param enabled - Whether auto-scroll is enabled (default: true)
 * @param autoScrollThreshold - Distance from bottom (px) to consider "near bottom" (default: 100)
 * @returns Object containing:
 *   - messagesEndRef: Ref to the bottom sentinel element
 *   - handleScroll: Function to call on scroll events
 *   - shouldScroll: Current state of whether auto-scroll is active
 *   - forceScroll: Function to force scroll to bottom
 */
export function useChatScroll(
  containerRef: RefObject<HTMLDivElement>,
  messages: readonly unknown[],
  enabled: boolean = true,
  autoScrollThreshold: number = 100
): {
  messagesEndRef: RefObject<HTMLDivElement>;
  handleScroll: () => void;
  shouldScroll: boolean;
  forceScroll: () => void;
} {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (enabled && shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [enabled, shouldScroll]);

  // Auto-scroll when messages change
  // ✅ PERFORMANCE: Use ref to avoid dependency on scrollToBottom which changes with shouldScroll
  useEffect(() => {
    if (enabled && shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, enabled, shouldScroll]); // ✅ FIXED: Direct implementation instead of calling scrollToBottom

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < autoScrollThreshold;
    setShouldScroll(isNearBottom);
  }, [containerRef, autoScrollThreshold]);

  const forceScroll = useCallback(() => {
    setShouldScroll(true);
  }, []);

  return { messagesEndRef, handleScroll, shouldScroll, forceScroll };
}

/**
 * Custom hook for localStorage with SSR safety
 * Handles JSON serialization/deserialization automatically
 *
 * @deprecated Use useStorage instead for better type inference and simplicity
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [storedValue, setValue] where setValue can accept a value or updater function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // TYPE-SAFE: Use typeof check instead of instanceof Function
      // typeof is more reliable and works across all environments
      const valueToStore = typeof value === 'function' ? (value as (val: T) => T)(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Failed to save to localStorage - continue anyway
    }
  };

  return [storedValue, setValue];
}

/**
 * Simplified storage hook for primitive values (strings, booleans, numbers)
 * Automatically serializes/deserializes values with proper type handling
 *
 * @template T - Primitive type: string, number, or boolean
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [storedValue, setValue] where setValue accepts only T values
 */
export function useStorage<T extends string | number | boolean>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      // Type-safe parsing based on T
      if (typeof initialValue === 'boolean') {
        return (item === 'true') as T;
      }
      if (typeof initialValue === 'number') {
        const num = Number(item);
        return (isNaN(num) ? initialValue : num) as T;
      }
      return item as T;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, String(value));
      } catch (error) {
        // Failed to save to localStorage - continue anyway
      }
    }
  };

  return [storedValue, setValue];
}

/**
 * Custom hook for IntersectionObserver
 * Tracks when an element enters or exits the viewport
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.root]);

  return [ref, isIntersecting];
}

/**
 * Custom hook for IntersectionObserver with once option
 * Only triggers once when element enters viewport
 */
export function useIntersectionObserverOnce(
  options: IntersectionObserverInit = {}
): [RefObject<HTMLElement>, boolean] {
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasIntersected) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasIntersected(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasIntersected, options.threshold, options.rootMargin, options.root]);

  return [ref, hasIntersected];
}

/**
 * Hook for smooth theme transitions with animation
 * Prevents flash of wrong theme and adds smooth transition effect
 */
export function useThemeTransition() {
  useEffect(() => {
    // Skip initial render
    let isInitial = true;

    // Add transition class when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && !isInitial) {
          const target = mutation.target as HTMLElement;
          const hasDarkClass = target.classList.contains('dark');

          // Add transition animation
          target.classList.add('theme-transitioning');

          setTimeout(() => {
            target.classList.remove('theme-transitioning');
          }, 300);
        }
        isInitial = false;
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);
}

/**
 * Hook to prevent flash of wrong theme during SSR
 * Removes no-transition class after initial load
 */
export function useNoFlashTheme() {
  useEffect(() => {
    // Remove no-transition class after initial render
    const timeout = setTimeout(() => {
      document.body.classList.remove('no-transition');
    }, 100);

    return () => clearTimeout(timeout);
  }, []);
}

/**
 * Hook for handling touch gestures (swipe)
 * Useful for mobile navigation, carousels, etc.
 */
interface SwipeHandlers {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
  swipeDuration?: number;
  swipeThreshold?: number;
}

interface SwipeableHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function useSwipeable({
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
  swipeDuration = 300,
  swipeThreshold = 50,
}: SwipeHandlers): SwipeableHandlers {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

    // Check if swipe was fast enough
    if (deltaTime > swipeDuration) {
      setTouchStart(null);
      return;
    }

    // Determine dominant axis
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < swipeThreshold) {
      setTouchStart(null);
      return;
    }

    // Trigger appropriate callback
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipedRight) {
        onSwipedRight();
      } else if (deltaX < 0 && onSwipedLeft) {
        onSwipedLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipedDown) {
        onSwipedDown();
      } else if (deltaY < 0 && onSwipedUp) {
        onSwipedUp();
      }
    }

    setTouchStart(null);
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
}

