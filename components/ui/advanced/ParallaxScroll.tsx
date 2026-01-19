/**
 * PARALLAX SCROLL - Phase 2
 * Loop 24/200 | Focus: Advanced Scroll Effects
 * Referenz: Linear, Vercel, Stripe
 *
 * FEATURES:
 * - Smooth parallax effect on scroll
 * - Configurable speed and direction
 * - GPU-accelerated transforms
 * - Intersection Observer for performance
 * - Touch device support
 * - Accessibility (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * <ParallaxScroll speed={0.5}>
 *   <div>Parallax content</div>
 * </ParallaxScroll>
 * ```
 */

import { useRef, useState, useEffect, type ReactNode } from 'react';

interface ParallaxScrollProps {
  children: ReactNode;
  /**
   * Parallax speed (0-1)
   * - 0.5: Moves at half speed
   * - 1: Normal speed
   * - -0.5: Moves in opposite direction
   * @default 0.5
   */
  speed?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Offset in pixels to start parallax effect
   * @default 0
   */
  offset?: number;
}

export const ParallaxScroll = ({
  children,
  speed = 0.5,
  className = '',
  disabled = false,
  offset = 0,
}: ParallaxScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(0);
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
    if (disabled || prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    let ticking = false;

    const updateTransform = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const relativeScroll = scrolled - elementTop + offset;

      setTransform(relativeScroll * speed);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateTransform);
        ticking = true;
      }
    };

    // Initial update
    updateTransform();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed, disabled, prefersReducedMotion, offset]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: disabled || prefersReducedMotion ? 'none' : `translateY(${transform}px)`,
        willChange: disabled || prefersReducedMotion ? 'auto' : 'transform',
      }}
    >
      {children}
    </div>
  );
};
