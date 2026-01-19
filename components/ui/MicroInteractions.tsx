// React
import { useState, useRef, useEffect, type ReactNode, type MouseEvent, type CSSProperties } from 'react';

// Internal - Components
import { Button } from './Button';

// ============================================================================
// RIPPLE BUTTON
// ============================================================================

export interface RippleButtonProps {
  children: ReactNode;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  /**
   * Ripple color
   * @default 'rgba(255, 255, 255, 0.5)'
   */
  rippleColor?: string;
}

/**
 * RippleButton Component - Material Design-inspired ripple effect
 *
 * @example
 * ```tsx
 * <RippleButton variant="primary" onClick={handleClick}>
 *   Click me
 * </RippleButton>
 * ```
 */
export const RippleButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.5)',
}: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdCounter = useRef(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: rippleIdCounter.current++,
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
    >
      {children}

      {/* Ripple elements */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={
            {
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              background: rippleColor,
              transform: 'translate(-50%, -50%)',
              animation: 'ripple-animation 0.6s ease-out',
            } as CSSProperties
          }
        />
      ))}

      <style>{`
        @keyframes ripple-animation {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
    </Button>
  );
};

// ============================================================================
// MAGNETIC BUTTON
// ============================================================================

export interface MagneticButtonProps {
  children: ReactNode;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  /**
   * Magnetic strength (0-1)
   * @default 0.3
   */
  strength?: number;
}

/**
 * MagneticButton Component - Button that follows cursor magnetically
 *
 * @example
 * ```tsx
 * <MagneticButton variant="primary" onClick={handleClick}>
 *   Hover me
 * </MagneticButton>
 * ```
 */
export const MagneticButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    requestAnimationFrame(() => {
      setPosition({ x: deltaX, y: deltaY });
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:shadow-glow',
    secondary: 'text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
  }[variant];

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-9',
    md: 'px-6 py-3 text-sm min-h-11',
    lg: 'px-8 py-4 text-base min-h-12',
  }[size];

  return (
    <div
      ref={ref}
      onClick={!disabled ? onClick : undefined}
      onMouseMove={!disabled ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
      className={`
        relative inline-flex items-center justify-center
        font-semibold rounded-2xl
        cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-[1.02] active:scale-[0.98]
        focus:ring-2 focus:ring-primary-500/50
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${baseStyles}
        ${sizeStyles}
        ${className}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        willChange: 'transform',
      } as CSSProperties}
    >
      <span className="relative z-10">{children}</span>
    </div>
  );
};

// ============================================================================
// TILT CARD
// ============================================================================

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /**
   * Maximum tilt angle in degrees
   * @default 10
   */
  maxTilt?: number;
  /**
   * Tilt perspective
   * @default 1000
   */
  perspective?: number;
  /**
   * Scale on hover
   * @default 1.02
   */
  scale?: number;
}

/**
 * TiltCard Component - 3D tilt effect on hover
 *
 * @example
 * ```tsx
 * <TiltCard maxTilt={10} scale={1.02}>
 *   <div>Card content</div>
 * </TiltCard>
 * ```
 */
export const TiltCard = ({
  children,
  className = '',
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    const rotateX = (-mouseY / (rect.height / 2)) * maxTilt;

    requestAnimationFrame(() => {
      setTransform({
        rotateX: Math.max(-maxTilt, Math.min(maxTilt, rotateX)),
        rotateY: Math.max(-maxTilt, Math.min(maxTilt, rotateY)),
        scale,
      });
    });
  };

  const handleMouseLeave = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: `perspective(${perspective}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`,
        transition: 'transform 0.3s ease-out',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      } as CSSProperties}
    >
      {children}
    </div>
  );
};

// ============================================================================
// HOVER LIFT
// ============================================================================

export interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  /**
   * Lift distance in pixels
   * @default -4
   */
  lift?: number;
  /**
   * Scale on hover
   * @default 1.02
   */
  scale?: number;
  /**
   * Shadow on hover
   * @default true
   */
  showShadow?: boolean;
}

/**
 * HoverLift Component - Elegant lift effect on hover
 *
 * @example
 * ```tsx
 * <HoverLift lift={-4} scale={1.02}>
 *   <div>Card content</div>
 * </HoverLift>
 * ```
 */
export const HoverLift = ({
  children,
  className = '',
  lift = -4,
  scale = 1.02,
  showShadow = true,
}: HoverLiftProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      style={
        {
          transform: isHovered ? `translateY(${lift}px) scale(${scale})` : 'translateY(0) scale(1)',
          boxShadow: isHovered && showShadow ? '0 12px 24px -8px rgba(0, 0, 0, 0.10)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
          willChange: isHovered ? 'transform, box-shadow' : 'auto',
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
};

// ============================================================================
// ICON ROTATE
// ============================================================================

export interface IconRotateProps {
  icon: React.ComponentType<{ className?: string }>;
  isRotated: boolean;
  className?: string;
  /**
   * Rotation degrees
   * @default 180
   */
  degrees?: number;
  /**
   * Animation duration (ms)
   * @default 300
   */
  duration?: number;
}

/**
 * IconRotate Component - Smooth icon rotation on state change
 *
 * @example
 * ```tsx
 * <IconRotate icon={ChevronDownIcon} isRotated={isOpen} />
 * ```
 */
export const IconRotate = ({
  icon: Icon,
  isRotated,
  className = '',
  degrees = 180,
  duration = 300,
}: IconRotateProps) => {
  return (
    <Icon
      className={className}
      style={
        {
          transform: isRotated ? `rotate(${degrees}deg)` : 'rotate(0deg)',
          transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        } as CSSProperties
      }
    />
  );
};

// ============================================================================
// TEXT REVEAL
// ============================================================================

export interface TextRevealProps {
  children: string;
  className?: string;
  /**
   * Delay between each character (ms)
   * @default 30
   */
  charDelay?: number;
  /**
   * Start delay (ms)
   * @default 0
   */
  startDelay?: number;
}

/**
 * TextReveal Component - Staggered character reveal animation
 *
 * @example
 * ```tsx
 * <TextReveal charDelay={30}>
 *   Hello World
 * </TextReveal>
 * ```
 */
export const TextReveal = ({
  children,
  className = '',
  charDelay = 30,
  startDelay = 0,
}: TextRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  return (
    <span className={className}>
      {children.split('').map((char, index) => (
        <span
          key={index}
          style={
            {
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.4s ease ${startDelay + index * charDelay}ms, transform 0.4s ease ${startDelay + index * charDelay}ms`,
              display: 'inline-block',
              whiteSpace: 'pre',
            } as CSSProperties
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  RippleButton,
  MagneticButton,
  TiltCard,
  HoverLift,
  IconRotate,
  TextReveal,
};
