// React
import { useState, useRef, memo, useEffect, type ReactNode, type MouseEvent, type ButtonHTMLAttributes } from 'react';

/**
 * MagneticButton Component - Premium magnetic pull effect
 *
 * Vercel/Linear-inspired button that subtly follows the cursor.
 * Creates a premium feel with smooth magnetic pull and spring return.
 *
 * @example
 * ```tsx
 * <MagneticButton strength={0.3} className="btn-primary">
 *   Click me
 * </MagneticButton>
 * ```
 */

export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /**
   * Magnetic strength (0-1, where 1 = follows cursor completely)
   * @default 0.3
   */
  strength?: number;
  /**
   * Spring return speed (higher = faster return)
   * @default 0.1
   */
  springSpeed?: number;
  /**
   * Enable/disable magnetic effect
   * @default true
   */
  enabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const MagneticButton = memo(({
  children,
  strength = 0.3,
  springSpeed = 0.1,
  enabled = true,
  className = '',
  disabled = false,
  ...buttonProps
}: MagneticButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationFrameRef = useRef<number>();
  const targetPositionRef = useRef({ x: 0, y: 0 });

  // Smooth spring animation loop
  useEffect(() => {
    const animate = () => {
      if (isHovered && enabled && !disabled) {
        // Spring towards target position
        setPosition((prev) => ({
          x: prev.x + (targetPositionRef.current.x - prev.x) * springSpeed,
          y: prev.y + (targetPositionRef.current.y - prev.y) * springSpeed,
        }));
      } else {
        // Spring back to center
        setPosition((prev) => ({
          x: prev.x + (0 - prev.x) * springSpeed,
          y: prev.y + (0 - prev.y) * springSpeed,
        }));
      }

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, enabled, disabled, springSpeed]);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !enabled || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate mouse position relative to center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Apply magnetic strength
    targetPositionRef.current = {
      x: mouseX * strength,
      y: mouseY * strength,
    };
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetPositionRef.current = { x: 0, y: 0 };
  };

  // GPU-accelerated transform
  const buttonStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: disabled ? 'none' : undefined,
  };

  return (
    <button
      ref={buttonRef}
      className={className}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={buttonStyle}
      {...buttonProps}
    >
      {children}
    </button>
  );
});

MagneticButton.displayName = 'MagneticButton';

/**
 * MagneticButtonWithIcon - Magnetic button with icon animation
 *
 * Adds an animated icon that moves in opposite direction to button.
 *
 * @example
 * ```tsx
 * <MagneticButtonWithIcon
 *   strength={0.3}
 *   icon={<ArrowRightIcon />}
 *   className="btn-primary"
 * >
 *   Learn More
 * </MagneticButtonWithIcon>
 * ```
 */

export interface MagneticButtonWithIconProps extends MagneticButtonProps {
  /**
   * Icon to display
   */
  icon: ReactNode;
  /**
   * Icon position
   * @default 'right'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Icon animation strength (relative to button strength)
   * @default 1.5
   */
  iconStrength?: number;
}

export const MagneticButtonWithIcon = memo(({
  children,
  icon,
  iconPosition = 'right',
  strength = 0.3,
  iconStrength = 1.5,
  className = '',
  ...buttonProps
}: MagneticButtonWithIconProps) => {
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationFrameRef = useRef<number>();
  const targetIconPositionRef = useRef({ x: 0, y: 0 });

  // Smooth spring animation loop for icon
  useEffect(() => {
    const animate = () => {
      if (isHovered) {
        // Icon moves in opposite direction
        setIconPosition((prev) => ({
          x: prev.x + (targetIconPositionRef.current.x - prev.x) * buttonProps.springSpeed,
          y: prev.y + (targetIconPositionRef.current.y - prev.y) * buttonProps.springSpeed,
        }));
      } else {
        // Spring back to center
        setIconPosition((prev) => ({
          x: prev.x + (0 - prev.x) * buttonProps.springSpeed,
          y: prev.y + (0 - prev.y) * buttonProps.springSpeed,
        }));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, buttonProps.springSpeed]);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Icon moves in opposite direction with greater strength
    targetIconPositionRef.current = {
      x: mouseX * strength * iconStrength * -1,
      y: mouseY * strength * iconStrength * -1,
    };
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    targetIconPositionRef.current = { x: 0, y: 0 };
  };

  const iconStyle = {
    transform: `translate3d(${iconPosition.x}px, ${iconPosition.y}px, 0)`,
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'transform 0.1s ease-out',
  };

  return (
    <MagneticButton
      ref={buttonRef}
      strength={strength}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...buttonProps}
    >
      {iconPosition === 'left' && (
        <span style={iconStyle} className="mr-2">
          {icon}
        </span>
      )}
      {children}
      {iconPosition === 'right' && (
        <span style={iconStyle} className="ml-2">
          {icon}
        </span>
      )}
    </MagneticButton>
  );
});

MagneticButtonWithIcon.displayName = 'MagneticButtonWithIcon';

export default MagneticButton;
