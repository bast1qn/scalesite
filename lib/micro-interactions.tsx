/**
 * MICRO-INTERACTIONS - Phase 2
 * Loop 16/200 | Focus: Advanced Interactions
 * Referenz: Linear, Vercel, Stripe
 *
 * SUBTLE GESTURES & MICRO-INTERACTIONS:
 * - Magnetic buttons (follow cursor slightly)
 * - Parallax on scroll (subtle depth)
 * - Card tilt (3D perspective)
 * - Ripple effects (material design inspired)
 * - Scale on hover (consistent 1.02/0.98)
 * - Glow effects (subtle shadows)
 */

import { useState, useRef, useEffect, useCallback, type MouseEvent, type ReactNode } from 'react';

// ==================== MAGNETIC BUTTON EFFECT ====================

/**
 * useMagnetic - Hook for magnetic button effect
 * Button follows cursor slightly within container
 *
 * @example
 * const { ref, style } = useMagnetic({ strength: 0.3 });
 * <button ref={ref} style={style}>Magnetic</button>
 */
interface UseMagneticOptions {
  strength?: number;      // How strongly it follows cursor (0-1)
  radius?: number;        // Radius of effect in pixels
}

export const useMagnetic = (options: UseMagneticOptions = {}) => {
  const { strength = 0.3, radius = 100 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Calculate distance and scale effect
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const scale = Math.max(0, 1 - distance / radius);

    setPosition({
      x: deltaX * strength * scale,
      y: deltaY * strength * scale,
    });
  }, [strength, radius]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};

// ==================== CARD TILT EFFECT ====================

/**
 * useCardTilt - Hook for 3D card tilt on hover
 * Creates subtle 3D perspective effect
 *
 * @example
 * const { ref, style } = useCardTilt({ maxTilt: 5 });
 * <div ref={ref} style={style}>Tilt Card</div>
 */
interface UseCardTiltOptions {
  maxTilt?: number;       // Maximum tilt angle in degrees
  perspective?: number;   // Perspective value in pixels
}

export const useCardTilt = (options: UseCardTiltOptions = {}) => {
  const { maxTilt = 5, perspective = 1000 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Calculate tilt based on cursor position
    const rotateY = (deltaX / (rect.width / 2)) * maxTilt;
    const rotateX = -(deltaY / (rect.height / 2)) * maxTilt;

    setTilt({ rotateX, rotateY });
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return {
    ref,
    style: {
      transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
      transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};

// ==================== RIPPLE EFFECT ====================

/**
 * RippleButton - Button with material-design inspired ripple effect
 *
 * @example
 * <RippleButton onClick={handleClick}>Click me</RippleButton>
 */
interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const RippleButton = ({ children, onClick, className = '', variant = 'primary' }: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples([...ripples, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        px-8 py-4 rounded-2xl font-semibold
        transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        focus:ring-2 focus:ring-primary-500/50
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// ==================== PARALLAX SCROLL ====================

/**
 * useParallax - Hook for subtle parallax on scroll
 * Element moves at different speed than scroll
 *
 * @example
 * const { ref, style } = useParallax({ speed: 0.5 });
 * <div ref={ref} style={style}>Parallax content</div>
 */
interface UseParallaxOptions {
  speed?: number;         // Speed multiplier (0.5 = half speed)
  direction?: 'up' | 'down';
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;

      const newOffset = scrolled * speed * (direction === 'up' ? 1 : -1);
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return {
    ref,
    style: {
      transform: `translateY(${offset}px)`,
      transition: 'transform 0.1s ease-out',
    },
  };
};

// ==================== GLOW ON HOVER ====================

/**
 * GlowCard - Card with subtle glow effect on hover
 * GPU-accelerated with box-shadow
 *
 * @example
 * <GlowCard className="p-6">Content with glow</GlowCard>
 */
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'emerald';
}

export const GlowCard = ({ children, className = '', glowColor = 'primary' }: GlowCardProps) => {
  const glowColors = {
    primary: 'rgba(92, 111, 255, 0.15)',
    secondary: 'rgba(139, 92, 246, 0.15)',
    emerald: 'rgba(16, 185, 129, 0.15)',
  };

  return (
    <div
      className={`
        relative rounded-2xl
        transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        ${className}
      `.trim()}
      style={{
        boxShadow: `0 4px 16px ${glowColors[glowColor]}`,
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px ${glowColors[glowColor]}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 16px ${glowColors[glowColor]}`;
      }}
    >
      {children}
    </div>
  );
};

// ==================== SCALE ON SCROLL ====================

/**
 * useScaleOnScroll - Hook for scaling elements as they enter viewport
 * Creates subtle entrance animation
 *
 * @example
 * const { ref, style } = useScaleOnScroll({ minScale: 0.95 });
 * <div ref={ref} style={style}>Scales on scroll</div>
 */
interface UseScaleOnScrollOptions {
  minScale?: number;       // Minimum scale when out of view
  maxScale?: number;       // Maximum scale when in view (usually 1)
}

export const useScaleOnScroll = (options: UseScaleOnScrollOptions = {}) => {
  const { minScale = 0.95, maxScale = 1 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(minScale);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScale(maxScale);
        } else {
          setScale(minScale);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [minScale, maxScale]);

  return {
    ref,
    style: {
      transform: `scale(${scale})`,
      transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  };
};

// ==================== STAGGERED CHILDREN ====================

/**
 * useStaggeredChildren - Hook for staggered animation of children
 * Animates children with delay
 *
 * @example
 * const { ref } = useStaggeredChildren({ delay: 100 });
 * <div ref={ref}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
interface UseStaggeredChildrenOptions {
  delay?: number;         // Delay between children in ms
  initialOpacity?: number;
}

export const useStaggeredChildren = (options: UseStaggeredChildrenOptions = {}) => {
  const { delay = 100, initialOpacity = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const children = ref.current.children;
    Array.from(children).forEach((child, index) => {
      const element = child as HTMLElement;
      element.style.opacity = initialOpacity.toString();
      element.style.transform = 'translateY(20px)';

      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      }, index * delay);
    });
  }, [delay, initialOpacity]);

  return { ref };
};

// ==================== DEVELOPER UTILITIES ====================

/**
 * Development-only visualizer for interaction effects
 */
export const InteractionVisualizer = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xl z-50 max-w-xs">
      <p className="text-xs font-semibold text-slate-500 mb-3">Micro-Interactions (Phase 2)</p>
      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
        <div>✓ Magnetic Buttons</div>
        <div>✓ Card Tilt 3D</div>
        <div>✓ Ripple Effects</div>
        <div>✓ Parallax Scroll</div>
        <div>✓ Glow on Hover</div>
        <div>✓ Scale on Scroll</div>
        <div>✓ Staggered Children</div>
      </div>
    </div>
  );
};
