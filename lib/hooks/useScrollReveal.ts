// ============================================
// SCROLL REVEAL HOOK
// Performance-optimized scroll animations
// Reference: Linear, Vercel, Stripe design systems
// ============================================

import { useEffect, useRef, useState } from 'react';

export type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

export interface UseScrollRevealOptions {
  /**
   * Threshold for triggering the animation (0-1)
   * @default 0.1
   */
  threshold?: number;

  /**
   * Root margin for the intersection observer
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Animation delay in milliseconds
   * @default 0
   */
  delay?: number;

  /**
   * Animation duration in milliseconds
   * @default 600
   */
  duration?: number;

  /**
   * Direction of the animation
   * @default 'up'
   */
  direction?: ScrollRevealDirection;

  /**
   * Only trigger once
   * @default true
   */
  triggerOnce?: boolean;
}

export interface UseScrollRevealReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
  hasAnimated: boolean;
}

/**
 * useScrollReveal - Performance-optimized scroll animations
 *
 * Features:
 * - Intersection Observer for lazy triggering
 * - GPU-accelerated transforms
 * - Smooth easing curves
 * - Configurable direction, delay, duration
 * - Trigger once support
 *
 * @example
 * const { ref, isVisible } = useScrollReveal({ direction: 'up', delay: 200 });
 *
 * <div ref={ref} className={cn('scroll-reveal', isVisible && 'is-visible')}>
 *   Content
 * </div>
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}): UseScrollRevealReturn {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    delay = 0,
    duration = 600,
    direction = 'up',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          // Add delay if specified
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    // Start observing
    observer.observe(element);

    // Cleanup
    return () => observer.disconnect();
  }, [threshold, rootMargin, delay, triggerOnce, hasAnimated]);

  // Apply animation styles
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial styles
    element.style.opacity = isVisible ? '1' : '0';
    element.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    // Set transform based on direction
    if (!isVisible) {
      switch (direction) {
        case 'up':
          element.style.transform = 'translateY(24px)';
          break;
        case 'down':
          element.style.transform = 'translateY(-24px)';
          break;
        case 'left':
          element.style.transform = 'translateX(24px)';
          break;
        case 'right':
          element.style.transform = 'translateX(-24px)';
          break;
        case 'scale':
          element.style.transform = 'scale(0.96)';
          break;
      }
    } else {
      element.style.transform = 'translate(0) scale(1)';
    }

    // Add will-change for performance
    element.style.willChange = 'opacity, transform';
  }, [isVisible, duration, direction]);

  return { ref, isVisible, hasAnimated };
}

/* ==================== STAGGER ANIMATIONS ==================== */

export interface UseStaggerChildrenOptions {
  /**
   * Delay between each child in milliseconds
   * @default 100
   */
  staggerDelay?: number;

  /**
   * Initial delay in milliseconds
   * @default 0
   */
  initialDelay?: number;

  /**
   * Animation duration per child
   * @default 500
   */
  duration?: number;

  /**
   * Direction of the animation
   * @default 'up'
   */
  direction?: ScrollRevealDirection;
}

/**
 * useStaggerChildren - Staggered children animations
 *
 * Features:
 * - Automatic delay assignment
 * - Smooth entrance
 * - Performance-optimized
 *
 * @example
 * const { ref, isVisible } = useStaggerChildren({ staggerDelay: 100 });
 *
 * <div ref={ref} className={cn('stagger-fade', isVisible && 'is-visible')}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </div>
 */
export function useStaggerChildren(options: UseStaggerChildrenOptions = {}): UseScrollRevealReturn {
  const {
    staggerDelay = 100,
    initialDelay = 0,
    duration = 500,
    direction = 'up',
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, initialDelay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [initialDelay, hasAnimated]);

  // Apply stagger animations to children
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const children = Array.from(element.children) as HTMLElement[];

    children.forEach((child, index) => {
      const delay = initialDelay + index * staggerDelay;

      // Set initial styles
      child.style.opacity = isVisible ? '1' : '0';
      child.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

      // Set transform based on direction
      if (!isVisible) {
        switch (direction) {
          case 'up':
            child.style.transform = 'translateY(16px)';
            break;
          case 'down':
            child.style.transform = 'translateY(-16px)';
            break;
          case 'left':
            child.style.transform = 'translateX(16px)';
            break;
          case 'right':
            child.style.transform = 'translateX(-16px)';
            break;
          case 'scale':
            child.style.transform = 'scale(0.96)';
            break;
        }
      } else {
        child.style.transform = 'translate(0) scale(1)';
      }

      // Add will-change for performance
      child.style.willChange = 'opacity, transform';
    });
  }, [isVisible, staggerDelay, initialDelay, duration, direction]);

  return { ref, isVisible, hasAnimated };
}

/* ==================== PARALLAX EFFECT ==================== */

export interface UseParallaxOptions {
  /**
   * Speed of the parallax effect
   * @default 0.5
   */
  speed?: number;

  /**
   * Direction of the parallax
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
}

/**
 * useParallax - Smooth parallax effect on scroll
 *
 * Features:
 * - Smooth parallax on scroll
 * - GPU-accelerated
 * - Configurable speed and direction
 *
 * @example
 * const { ref, transform } = useParallax({ speed: 0.5 });
 *
 * <div ref={ref} style={{ transform }}>
 *   Parallax content
 * </div>
 */
export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = 'vertical' } = options;
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const scrolled = window.scrollY;
          const rate = (rect.top + scrolled) * speed;

          if (direction === 'vertical') {
            setTransform(`translate3d(0, ${rate}px, 0)`);
          } else {
            setTransform(`translate3d(${rate}px, 0, 0)`);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, transform };
}
