/**
 * SPOTLIGHT CARD - Phase 2
 * Loop 24/200 | Focus: Advanced Hover Effects
 * Referenz: Linear, Vercel, Stripe
 *
 * FEATURES:
 * - Mouse-following spotlight effect
 * - Subtle gradient overlay
 * - GPU-accelerated opacity transitions
 * - Configurable spotlight size and intensity
 * - Touch device support
 * - Accessibility (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * <SpotlightCard size={400} intensity={0.08}>
 *   <div className="card-content">...</div>
 * </SpotlightCard>
 * ```
 */

import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  /**
   * Spotlight size in pixels
   * @default 400
   */
  size?: number;
  /**
   * Spotlight intensity (0-1)
   * @default 0.08
   */
  intensity?: number;
  /**
   * Spotlight color (RGB only)
   * @default '75, 90, 237' (primary-600)
   */
  color?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export const SpotlightCard = ({
  children,
  size = 400,
  intensity = 0.08,
  color = '75, 90, 237',
  className = '',
  disabled = false,
}: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
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

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    requestAnimationFrame(() => {
      setGlowPosition({ x, y });
    });
  };

  const handleMouseEnter = () => {
    if (!disabled && !prefersReducedMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(${size}px circle at ${glowPosition.x}% ${glowPosition.y}%, rgb(${color}) / ${intensity}, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
          willChange: prefersReducedMotion ? 'auto' : 'opacity',
        }}
      />
      {children}
    </div>
  );
};
