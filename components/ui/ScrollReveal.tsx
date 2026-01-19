// React
import { useEffect, useState, useRef, useMemo, type ReactNode, type RefObject } from 'react';

// Types
export interface ScrollRevealProps {
  children: ReactNode;
  /**
   * Delay before animation starts (in ms)
   * @default 0
   */
  delay?: number;
  /**
   * Direction of animation
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Trigger animation when X% of element is visible (0-1)
   * @default 0.1
   */
  threshold?: number;
  /**
   * Offset from viewport edge to trigger (in pixels)
   * Negative = trigger before element enters viewport
   * @default -50
   */
  rootMargin?: string;
  /**
   * Animation duration (in ms)
   * @default 600
   */
  duration?: number;
  /**
   * Only trigger once
   * @default true
   */
  triggerOnce?: boolean;
  /**
   * Custom ref to observe
   */
  customRef?: RefObject<HTMLDivElement>;
}

/**
 * ScrollReveal Component - Linear-inspired GPU-accelerated scroll animations
 *
 * @example
 * ```tsx
 * <ScrollReveal direction="up">
 *   <h2>Überschrift</h2>
 * </ScrollReveal>
 *
 * <ScrollReveal direction="left" delay={200}>
 *   <p>Content</p>
 * </ScrollReveal>
 * ```
 */
export const ScrollReveal = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.1,
  rootMargin = '-50px 0px -50px 0px',
  duration = 600,
  triggerOnce = true,
  customRef,
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = customRef || internalRef;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create Intersection Observer for scroll detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add small delay for smoother feel
          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          // Unobserve after trigger if triggerOnce is true
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, threshold, rootMargin, triggerOnce, delay]);

  // Transform values for different directions (GPU-accelerated)
  const transforms = {
    up: 'translate3d(0, 32px, 0)',
    down: 'translate3d(0, -32px, 0)',
    left: 'translate3d(32px, 0, 0)',
    right: 'translate3d(-32px, 0, 0)',
    fade: 'translate3d(0, 0, 0)',
    scale: 'translate3d(0, 0, 0) scale(0.96)',
  };

  // Get current transform based on visibility
  const getTransform = () => {
    if (isVisible) {
      return direction === 'scale' ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 0, 0)';
    }
    return transforms[direction];
  };

  // ✅ PERFORMANCE: Memoize style object to prevent recreation on every render
  const elementStyle = useMemo(() => ({
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    // GPU-accelerated transitions
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    // Optimize for GPU
    willChange: isVisible ? 'auto' : 'opacity, transform',
    // Enable hardware acceleration
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  }), [isVisible, getTransform, duration, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={elementStyle}
    >
      {children}
    </div>
  );
};

// ============================================================================
// STAGGER REVEAL
// ============================================================================

export interface StaggerRevealProps {
  children: ReactNode;
  /**
   * Delay between each child (in ms)
   * @default 100
   */
  staggerDelay?: number;
  /**
   * Start delay (in ms)
   * @default 0
   */
  startDelay?: number;
  /**
   * Direction of animation
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Trigger animation when X% of element is visible (0-1)
   * @default 0.1
   */
  threshold?: number;
  /**
   * Animation duration (in ms)
   * @default 500
   */
  duration?: number;
}

/**
 * StaggerReveal Component - Animate children with staggered delay
 *
 * @example
 * ```tsx
 * <StaggerReveal staggerDelay={150}>
 *   <Card>Card 1</Card>
 *   <Card>Card 2</Card>
 *   <Card>Card 3</Card>
 * </StaggerReveal>
 * ```
 */
export const StaggerReveal = ({
  children,
  staggerDelay = 100,
  startDelay = 0,
  direction = 'up',
  className = '',
  threshold = 0.1,
  duration = 500,
}: StaggerRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, startDelay);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, startDelay]);

  // Transform values
  const transforms = {
    up: 'translate3d(0, 24px, 0)',
    down: 'translate3d(0, -24px, 0)',
    left: 'translate3d(24px, 0, 0)',
    right: 'translate3d(-24px, 0, 0)',
    fade: 'translate3d(0, 0, 0)',
    scale: 'translate3d(0, 0, 0) scale(0.96)',
  };

  const childrenArray = (children as ReactNode[]) || [];

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child: ReactNode, index: number) => {
        // ✅ PERFORMANCE: Memoize style objects for each child
        const childStyle = useMemo(() => ({
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? (direction === 'scale' ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 0, 0)')
            : transforms[direction],
          transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${startDelay + index * staggerDelay}ms,
                      transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${startDelay + index * staggerDelay}ms`,
          willChange: isVisible ? 'auto' : 'opacity, transform',
          backfaceVisibility: 'hidden' as const,
        }), [isVisible, direction, duration, startDelay, index, staggerDelay, transforms]);

        return (
          <div
            key={index}
            style={childStyle}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// PARALLAX SCROLL
// ============================================================================

export interface ParallaxScrollProps {
  children: ReactNode;
  /**
   * Parallax speed (negative = slower, positive = faster)
   * @default 0.5
   */
  speed?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ParallaxScroll Component - Subtle parallax effect on scroll
 *
 * @example
 * ```tsx
 * <ParallaxScroll speed={0.5}>
 *   <div>Background element</div>
 * </ParallaxScroll>
 * ```
 */
export const ParallaxScroll = ({
  children,
  speed = 0.5,
  className = '',
}: ParallaxScrollProps) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        const rate = scrolled * speed;

        requestAnimationFrame(() => {
          setOffset(rate);
        });
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  // ✅ PERFORMANCE: Memoize parallax style object
  const parallaxStyle = useMemo(() => ({
    transform: `translate3d(0, ${offset}px, 0)`,
    willChange: 'transform' as const,
    backfaceVisibility: 'hidden' as const,
  }), [offset]);

  return (
    <div
      ref={ref}
      className={className}
      style={parallaxStyle}
    >
      {children}
    </div>
  );
};

// ============================================================================
// VIEWPORT PROGRESS
// ============================================================================

export interface ViewportProgressProps {
  children: (progress: number) => ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ViewportProgress Component - Track element's progress through viewport
 *
 * @example
 * ```tsx
 * <ViewportProgress>
 *   {(progress) => (
 *     <div style={{ opacity: progress }}>
 *       Content fades in as you scroll
 *     </div>
 *   )}
 * </ViewportProgress>
 * ```
 */
export const ViewportProgress = ({
  children,
  className = '',
}: ViewportProgressProps) => {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress (0 = top of viewport, 1 = bottom of viewport)
      const elementProgress = 1 - rect.top / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, elementProgress));

      requestAnimationFrame(() => {
        setProgress(clampedProgress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children(progress)}
    </div>
  );
};

// ============================================================================
// HOOK: USE SCROLL REVEAL
// ============================================================================

/**
 * useScrollReveal Hook - Reusable hook for scroll reveal logic
 *
 * @example
 * ```tsx
 * const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });
 *
 * return (
 *   <div ref={ref} style={{ opacity: isVisible ? 1 : 0 }}>
 *     Content
 *   </div>
 * );
 * ```
 */
export const useScrollReveal = (options: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { threshold = 0.1, rootMargin = '-50px 0px', triggerOnce = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible] as const;
};

// Default export
export default ScrollReveal;
