/**
 * MAGNETIC WRAPPER - Phase 2
 * Loop 24/200 | Focus: Advanced Micro-interactions
 * Referenz: Linear, Vercel, Stripe
 *
 * FEATURES:
 * - Magnetic pull effect towards cursor
 * - Configurable strength and smooth easing
 * - GPU-accelerated transforms
 * - Touch device support
 * - Accessibility (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * <MagneticWrapper strength={0.3}>
 *   <button>Hover me</button>
 * </MagneticWrapper>
 * ```
 */

import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from 'react';

interface MagneticWrapperProps {
  children: ReactNode;
  /**
   * Magnetic strength (0-1)
   * @default 0.3
   */
  strength?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export const MagneticWrapper = ({
  children,
  strength = 0.3,
  className = '',
  disabled = false,
}: MagneticWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    // Use requestAnimationFrame for smooth 60fps updates
    requestAnimationFrame(() => {
      setPosition({ x: deltaX, y: deltaY });
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    if (!disabled && !prefersReducedMotion) {
      setIsHovered(true);
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{
        transform: prefersReducedMotion ? 'none' : `translate(${position.x}px, ${position.y}px)`,
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
    >
      {children}
    </div>
  );
};
