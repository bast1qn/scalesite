/**
 * SMOOTH REVEAL - Phase 2
 * Loop 24/200 | Focus: Advanced Scroll Animations
 * Referenz: Linear, Vercel, Stripe
 *
 * FEATURES:
 * - Intersection Observer for scroll-triggered animations
 * - GPU-accelerated transforms (translateY, opacity)
 * - Configurable delay and duration
 * - Stagger support for multiple items
 * - Touch device support
 * - Accessibility (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * <SmoothReveal direction="up" delay={0.1}>
 *   <div>Reveal content</div>
 * </SmoothReveal>
 * ```
 */

import { useRef, useState, useEffect, type ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale';

interface SmoothRevealProps {
  children: ReactNode;
  /**
   * Animation direction
   * @default 'up'
   */
  direction?: Direction;
  /**
   * Animation delay in seconds
   * @default 0
   */
  delay?: number;
  /**
   * Animation duration in seconds
   * @default 0.6
   */
  duration?: number;
  /**
   * Animation distance in pixels
   * @default 24
   */
  distance?: number;
  /**
   * Intersection threshold (0-1)
   * @default 0.1
   */
  threshold?: number;
  /**
   * Root margin for intersection
   * @default '0px'
   */
  rootMargin?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Only animate once
   * @default true
   */
  once?: boolean;
}

export const SmoothReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 24,
  threshold = 0.1,
  rootMargin = '0px',
  className = '',
  disabled = false,
  once = true,
}: SmoothRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [disabled, once, threshold, rootMargin]);

  // Get initial transform based on direction
  const getInitialTransform = (): string => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      case 'scale':
        return 'scale(0.96)';
      default:
        return `translateY(${distance}px)`;
    }
  };

  const style = {
    opacity: isVisible || prefersReducedMotion ? 1 : 0,
    transform: isVisible || prefersReducedMotion ? 'none' : getInitialTransform(),
    transition: prefersReducedMotion
      ? 'none'
      : `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    willChange: isVisible || prefersReducedMotion ? 'auto' : 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};
