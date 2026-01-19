// React
import { useState, useRef, useEffect, memo, type ReactNode, type MouseEvent } from 'react';
import { useScrollReveal } from '../lib/hooks/useScrollReveal';

/**
 * TiltCard Component - Premium 3D tilt effect on hover
 *
 * Linear/Vercel-inspired subtle 3D perspective with smooth damping.
 *
 * @example
 * ```tsx
 * <TiltCard tiltStrength={15}>
 *   <div className="p-6 bg-white rounded-2xl">
 *     Content with subtle 3D effect
 *   </div>
 * </TiltCard>
 * ```
 */

export interface TiltCardProps {
  children: ReactNode;
  /**
   * Maximum tilt angle in degrees
   * @default 10
   */
  tiltStrength?: number;
  /**
   * Scale factor on hover
   * @default 1.02
   */
  scale?: number;
  /**
   * Enable/disable perspective
   * @default true
   */
  enablePerspective?: boolean;
  /**
   * Enable/disable glare effect
   * @default false
   */
  enableGlare?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Disable tilt effect
   * @default false
   */
  disabled?: boolean;
}

export const TiltCard = memo(({
  children,
  tiltStrength = 10,
  scale = 1.02,
  enablePerspective = true,
  enableGlare = false,
  className = '',
  disabled = false,
}: TiltCardProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // GPU-accelerated transform calculation
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate mouse position relative to center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate tilt angles (clamped to tiltStrength)
    const tiltX = (mouseY / (rect.height / 2)) * -tiltStrength;
    const tiltY = (mouseX / (rect.width / 2)) * tiltStrength;

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth 60fps updates
    animationFrameRef.current = requestAnimationFrame(() => {
      setTilt({
        x: Math.max(-tiltStrength, Math.min(tiltStrength, tiltX)),
        y: Math.max(-tiltStrength, Math.min(tiltStrength, tiltY)),
      });

      // Calculate glare position if enabled
      if (enableGlare) {
        setGlarePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Memoize transform styles for performance
  const cardStyle = {
    transform: isHovered
      ? `perspective(${enablePerspective ? 1000 : 0}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${scale}, ${scale}, ${scale})`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered
      ? 'transform 0.1s ease-out' // Fast response during hover
      : 'transform 0.5s ease-out', // Smooth return to rest
    willChange: isHovered ? 'transform' : 'auto',
    backfaceVisibility: 'hidden' as const,
    transformStyle: 'preserve-3d' as const,
  };

  // Glare effect style
  const glareStyle = {
    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.3), transparent 60%)`,
    opacity: isHovered ? 1 : 0,
    transition: isHovered
      ? 'opacity 0.3s ease-out, background 0.1s ease-out'
      : 'opacity 0.5s ease-out',
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: enablePerspective ? '1000px' : 'none',
      }}
    >
      {/* Glare effect */}
      {enableGlare && (
        <div
          className="absolute inset-0 rounded-inherit pointer-events-none z-10"
          style={glareStyle}
        />
      )}

      {/* Card content */}
      <div
        style={cardStyle}
        className="h-full w-full"
      >
        {children}
      </div>
    </div>
  );
});

TiltCard.displayName = 'TiltCard';

/**
 * TiltCardWithReveal - TiltCard with scroll reveal animation
 *
 * Combines 3D tilt effect with scroll-triggered entrance animation.
 *
 * @example
 * ```tsx
 * <TiltCardWithReveal direction="up" tiltStrength={15}>
 *   <div className="p-6 bg-white rounded-2xl">
 *     Content with 3D tilt + scroll reveal
 *   </div>
 * </TiltCardWithReveal>
 * ```
 */

export interface TiltCardWithRevealProps extends TiltCardProps {
  /**
   * Scroll reveal direction
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  /**
   * Delay before animation starts (in ms)
   * @default 0
   */
  delay?: number;
  /**
   * Animation duration (in ms)
   * @default 600
   */
  duration?: number;
  /**
   * Trigger animation when X% of element is visible (0-1)
   * @default 0.1
   */
  threshold?: number;
}

export const TiltCardWithReveal = memo(({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  ...tiltProps
}: TiltCardWithRevealProps) => {
  const [ref, isVisible] = useScrollReveal({ threshold, triggerOnce: true });

  // Transform values for different directions
  const transforms = {
    up: 'translate3d(0, 32px, 0)',
    down: 'translate3d(0, -32px, 0)',
    left: 'translate3d(32px, 0, 0)',
    right: 'translate3d(-32px, 0, 0)',
    fade: 'translate3d(0, 0, 0)',
    scale: 'translate3d(0, 0, 0) scale(0.96)',
  };

  const revealStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : transforms[direction],
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
  };

  return (
    <div ref={ref} style={revealStyle}>
      <TiltCard {...tiltProps}>
        {children}
      </TiltCard>
    </div>
  );
});

TiltCardWithReveal.displayName = 'TiltCardWithReveal';

export default TiltCard;
