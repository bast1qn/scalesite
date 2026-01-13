import { useState, useEffect, useRef, RefObject, useCallback, MouseEvent, MouseEventHandler } from 'react';

/**
 * Custom hook to detect clicks outside of a component
 * Useful for dropdowns, modals, popups, etc.
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  enabled: boolean = true
): [RefObject<T>, boolean] {
  const [isOutside, setIsOutside] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOutside(true);
      } else {
        setIsOutside(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [enabled]);

  return [ref, isOutside];
}

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
 * Alternative version that calls a callback when clicking outside
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
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
 * Custom hook to get the previous value of a state or prop
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Custom hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for localStorage with SSR safety
 * @deprecated Use useStorage instead for better type inference and simplicity
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
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Failed to save to localStorage (key: ${key}):`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Simplified storage hook for primitive values (strings, booleans, numbers)
 * Automatically serializes/deserializes values
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
        console.warn(`Failed to save to localStorage (key: ${key}):`, error);
      }
    }
  };

  return [storedValue, setValue];
}

/**
 * Custom hook that runs an effect only once on mount
 */
export function useMountEffect(effect: () => void): void {
  useEffect(effect, []);
}

/**
 * Custom hook for media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Modern browsers
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
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
 * Custom hook to set document page title
 * Automatically restores previous title on unmount
 */
export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title;
    return () => {
      // Restore default title on unmount
      document.title = 'ScaleSite - Premium Web Development';
    };
  }, [title]);
}
