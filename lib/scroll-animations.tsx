/**
 * SCROLL ANIMATIONS - Phase 2
 * Loop 16/200 | Focus: Performance & Beauty
 * Referenz: Linear, Vercel, Stripe
 *
 * GPU-ACCELERATED ANIMATIONS:
 * - Uses transform, opacity (GPU properties)
 * - willChange optimization
 * - IntersectionObserver for lazy triggering
 * - Reduced motion support
 * - RequestAnimationFrame batching
 */

import { useEffect, useRef, useState, useCallback, type RefObject } from 'react';

// ==================== CONFIGURATION ====================

const SCROLL_ANIMATION_CONFIG = {
  threshold: 0.1,        // Trigger when 10% visible
  rootMargin: '0px 0px -50px 0px',  // Offset from bottom
  duration: 400,         // Animation duration in ms
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',  // Smooth ease-out
} as const;

// ==================== INTERSECTION OBSERVER HOOK ====================

/**
 * useOnScreen - Detect when element enters viewport
 * Uses IntersectionObserver for performance
 *
 * @example
 * const [ref, isOnScreen] = useOnScreen({ threshold: 0.1 });
 * <div ref={ref}>{isOnScreen ? 'Visible!' : 'Hidden'}</div>
 */
interface UseOnScreenOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useOnScreen = (options: UseOnScreenOptions = {}): [RefObject<HTMLDivElement>, boolean] => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldTrigger = entry.isIntersecting && (!triggerOnce || !hasTriggered);

        if (shouldTrigger) {
          setIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return [ref, isIntersecting];
};

// ==================== SCROLL ANIMATION HOOKS ====================

/**
 * useScrollReveal - Animate element on scroll with GPU acceleration
 * Uses transform and opacity for 60fps performance
 *
 * @example
 * const { ref, className } = useScrollReveal({ direction: 'up' });
 * <div ref={ref} className={className}>Reveals on scroll</div>
 */
interface UseScrollRevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  distance?: number;       // Distance in pixels
  duration?: number;       // Animation duration in ms
  delay?: number;          // Delay in ms
  triggerOnce?: boolean;
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const {
    direction = 'up',
    distance = 32,
    duration = 400,
    delay = 0,
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: SCROLL_ANIMATION_CONFIG.rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, triggerOnce]);

  // Get animation classes based on direction
  const getAnimationClasses = (): string => {
    const baseClasses = 'transition-all ease-out';
    const durationClass = `transition-transform duration-[${duration}ms]`;

    if (isVisible) {
      return `${baseClasses} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
    }

    switch (direction) {
      case 'up':
        return `${baseClasses} ${durationClass} opacity-0 translate-y-${distance/4}`;
      case 'down':
        return `${baseClasses} ${durationClass} opacity-0 -translate-y-${distance/4}`;
      case 'left':
        return `${baseClasses} ${durationClass} opacity-0 translate-x-${distance/4}`;
      case 'right':
        return `${baseClasses} ${durationClass} opacity-0 -translate-x-${distance/4}`;
      case 'fade':
        return `${baseClasses} ${durationClass} opacity-0`;
      case 'scale':
        return `${baseClasses} ${durationClass} opacity-0 scale-95`;
      default:
        return `${baseClasses} ${durationClass} opacity-0`;
    }
  };

  return {
    ref,
    className: getAnimationClasses(),
    isVisible,
  };
};

/**
 * useScrollParallax - Subtle parallax effect on scroll
 * GPU-accelerated with transform translate
 *
 * @example
 * const { ref, style } = useScrollParallax({ speed: 0.5 });
 * <div ref={ref} style={style}>Parallax content</div>
 */
interface UseScrollParallaxOptions {
  speed?: number;         // Parallax speed (0-1)
  disabled?: boolean;     // Disable for reduced motion
}

export const useScrollParallax = (options: UseScrollParallaxOptions = {}) => {
  const { speed = 0.5, disabled = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      const newOffset = scrolled * speed;

      // Batch update with requestAnimationFrame
      requestAnimationFrame(() => {
        setOffset(newOffset);
      });
    };

    // Use passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, disabled]);

  return {
    ref,
    style: {
      transform: `translateY(${offset}px)`,
      willChange: 'transform',
    } as React.CSSProperties,
  };
};

/**
 * useScrollScale - Scale element based on scroll position
 * GPU-accelerated with transform scale
 *
 * @example
 * const { ref, style } = useScrollScale({ min: 0.95, max: 1 });
 * <div ref={ref} style={style}>Scales on scroll</div>
 */
interface UseScrollScaleOptions {
  min?: number;          // Minimum scale (0-1)
  max?: number;          // Maximum scale (0-1)
  range?: number;        // Scroll range in pixels
}

export const useScrollScale = (options: UseScrollScaleOptions = {}) => {
  const { min = 0.95, max = 1, range = 200 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(min);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / range));
      const newScale = min + (max - min) * progress;

      requestAnimationFrame(() => {
        setScale(newScale);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [min, max, range]);

  return {
    ref,
    style: {
      transform: `scale(${scale})`,
      willChange: 'transform',
    } as React.CSSProperties,
  };
};

// ==================== BATCHED ANIMATIONS ====================

/**
 * useStaggeredAnimation - Stagger multiple elements
 * Animates children with sequential delays
 *
 * @example
 * const { ref } = useStaggeredAnimation({ delay: 100 });
 * <div ref={ref}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
interface UseStaggeredAnimationOptions {
  delay?: number;         // Delay between children in ms
  threshold?: number;     // Intersection threshold
}

export const useStaggeredAnimation = (options: UseStaggeredAnimationOptions = {}) => {
  const { delay = 100, threshold = 0.1 } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const children = element.children;
          Array.from(children).forEach((child, index) => {
            const htmlElement = child as HTMLElement;

            // Set initial state
            htmlElement.style.opacity = '0';
            htmlElement.style.transform = 'translateY(20px)';

            // Animate with delay
            setTimeout(() => {
              htmlElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              htmlElement.style.opacity = '1';
              htmlElement.style.transform = 'translateY(0)';
            }, index * delay);
          });

          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, threshold]);

  return { ref };
};

// ==================== PERFORMANCE OPTIMIZATIONS ====================

/**
 * useReducedMotion - Respect user's motion preferences
 * Returns true if user prefers reduced motion
 *
 * @example
 * const prefersReduced = useReducedMotion();
 * <div className={prefersReduced ? '' : 'animate-pulse'}>Content</div>
 */
export const useReducedMotion = (): boolean => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReduced;
};

/**
 * useWillChange - Optimize animations with willChange
 * Adds/removes willChange property for animation
 *
 * @example
 * const { ref, style } = useWillChange(['transform', 'opacity']);
 * <div ref={ref} style={style}>Optimized animation</div>
 */
export const useWillChange = (properties: string[] = ['transform', 'opacity']) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Add willChange before animation
    element.style.willChange = properties.join(', ');

    return () => {
      // Remove willChange after animation
      element.style.willChange = 'auto';
    };
  }, properties);

  return { ref };
};

// ==================== COMPONENT WRAPPERS ====================

/**
 * ScrollReveal - Simple wrapper for scroll reveal animation
 *
 * @example
 * <ScrollReveal direction="up">
 *   <p>Reveals on scroll</p>
 * </ScrollReveal>
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  className?: string;
  delay?: number;
}

export const ScrollReveal = ({ children, direction = 'up', className = '', delay = 0 }: ScrollRevealProps) => {
  const { ref, className: animationClassName } = useScrollReveal({ direction, delay });

  return (
    <div ref={ref} className={`${animationClassName} ${className}`.trim()}>
      {children}
    </div>
  );
};

/**
 * ScrollParallax - Simple wrapper for parallax effect
 *
 * @example
 * <ScrollParallax speed={0.5}>
 *   <p>Parallax content</p>
 * </ScrollParallax>
 */
interface ScrollParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ScrollParallax = ({ children, speed = 0.5, className = '' }: ScrollParallaxProps) => {
  const { ref, style } = useScrollParallax({ speed });

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};
