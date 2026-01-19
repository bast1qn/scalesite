// ========================================================================
// GPU-ACCELERATED ANIMATIONS
// ========================================================================
// Reference: Linear, Vercel, Stripe animation systems
// Philosophy: Smooth, performant, 60fps animations
// Features: GPU acceleration, reduced motion support, spring physics
// ========================================================================

import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// ========================================================================
// ANIMATION CONSTANTS
// ========================================================================

export const animationConfig = {
  // Duration (in seconds) - optimized for perceived performance
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    slower: 0.4,
    slowest: 0.5,
  },

  // Easing functions (cubic-bezier curves)
  easing: {
    // Linear/Vercel-inspired ease-out (sharp, snappy)
    easeOut: [0.16, 1, 0.3, 1] as const,

    // Smooth spring-like ease
    easeSpring: [0.34, 1.56, 0.64, 1] as const,

    // Standard ease-in-out
    easeInOut: [0.4, 0, 0.2, 1] as const,

    // Sharp, snappy transitions
    easeSharp: [0.25, 0.1, 0.25, 1] as const,

    // Soft, smooth transitions
    easeSoft: [0.25, 0.1, 0.25, 1] as const,
  },

  // Spring physics (for spring animations)
  spring: {
    // Snappy spring (fast, bouncy)
    snappy: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    } as const,

    // Smooth spring (balanced)
    smooth: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    } as const,

    // Gentle spring (slow, soft)
    gentle: {
      type: 'spring',
      stiffness: 200,
      damping: 30,
    } as const,

    // Bouncy spring (more bounce)
    bouncy: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    } as const,
  },

  // Stagger delays (for list animations)
  stagger: {
    instant: 0,
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
} as const;

// ========================================================================
// GPU-ACCELERATED ANIMATION VARIANTS
// ========================================================================
// Only use transform and opacity (GPU-accelerated properties)
// Avoid: width, height, margin, padding, top, left, right, bottom

export const gpuVariants = {
  // Fade variants
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  // Fade up (most common entrance animation)
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },

  // Fade down
  fadeDown: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },

  // Fade left
  fadeLeft: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },

  // Fade right
  fadeRight: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },

  // Scale in (for modals, dialogs)
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },

  // Scale out
  scaleOut: {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 0, scale: 0.96 },
  },

  // Slide up (for sheets, panels)
  slideUp: {
    hidden: { y: '100%' },
    visible: { y: 0 },
  },

  // Slide down
  slideDown: {
    hidden: { y: '-100%' },
    visible: { y: 0 },
  },
};

// ========================================================================
// PRESET TRANSITIONS
// ========================================================================
// Reusable transition configurations

export const transitions = {
  // Fast transition (buttons, toggles)
  fast: {
    duration: animationConfig.duration.fast,
    ease: animationConfig.easing.easeOut,
  },

  // Normal transition (cards, inputs)
  normal: {
    duration: animationConfig.duration.normal,
    ease: animationConfig.easing.easeOut,
  },

  // Slow transition (page transitions, modals)
  slow: {
    duration: animationConfig.duration.slow,
    ease: animationConfig.easing.easeOut,
  },

  // Spring transition (natural, bouncy)
  spring: animationConfig.spring.smooth,

  // Snappy spring (fast, responsive)
  springSnappy: animationConfig.spring.snappy,

  // Gentle spring (soft, smooth)
  springGentle: animationConfig.spring.gentle,
};

// ========================================================================
// HOOKS
// ========================================================================

/**
 * useGPUPreferencedMotion - Check if user prefers reduced motion
 * Returns true if reduced motion is preferred
 */
export const useGPUPreferencedMotion = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,

    // Get animation config based on motion preference
    getConfig: (config: typeof animationConfig) => {
      if (prefersReducedMotion) {
        return {
          ...config,
          duration: 0.01, // Nearly instant for reduced motion
        };
      }
      return config;
    },

    // Get variants that respect reduced motion preference
    getVariants: (variants: typeof gpuVariants.fade) => {
      if (prefersReducedMotion) {
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      }
      return variants;
    },
  };
};

/**
 * useIntersectionAnimation - Trigger animation on scroll
 * Uses IntersectionObserver for performance
 */
export const useIntersectionAnimation = (
  threshold = 0.1,
  rootMargin = '0px'
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};

// ========================================================================
// ANIMATED WRAPPER COMPONENTS
// ========================================================================

/**
 * FadeIn - GPU-accelerated fade-in animation
 * Only animates opacity for maximum performance
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = animationConfig.duration.normal,
  className = '',
}: FadeInProps) => {
  const { prefersReducedMotion } = useGPUPreferencedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: animationConfig.easing.easeOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeUp - GPU-accelerated fade-up animation
 * Animates opacity and Y transform (both GPU-accelerated)
 */
interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export const FadeUp = ({
  children,
  delay = 0,
  duration = animationConfig.duration.normal,
  distance = 24,
  className = '',
}: FadeUpProps) => {
  const { prefersReducedMotion, getVariants } = useGPUPreferencedMotion();

  const variants = getVariants({
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{
        duration: prefersReducedMotion ? 0.01 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: animationConfig.easing.easeOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScaleIn - GPU-accelerated scale-in animation
 * Animates opacity and scale (both GPU-accelerated)
 */
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = animationConfig.duration.normal,
  className = '',
}: ScaleInProps) => {
  const { prefersReducedMotion, getVariants } = useGPUPreferencedMotion();

  const variants = getVariants({
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{
        duration: prefersReducedMotion ? 0.01 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: animationConfig.easing.easeOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerContainer - Stagger children animations
 * Perfect for lists, grids, card collections
 */
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer = ({
  children,
  staggerDelay = animationConfig.stagger.normal,
  className = '',
}: StaggerContainerProps) => {
  const { prefersReducedMotion } = useGPUPreferencedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : animationConfig.duration.normal,
        ease: animationConfig.easing.easeOut,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
};

// ========================================================================
// PERFORMANCE UTILITY FUNCTIONS
// ========================================================================

/**
 * Optimize animation by setting will-change
 * Only set when needed, remove after animation completes
 */
export const setWillChange = (
  element: HTMLElement,
  properties: string[]
) => {
  element.style.willChange = properties.join(', ');
};

export const clearWillChange = (element: HTMLElement) => {
  element.style.willChange = 'auto';
};

/**
 * Check if animation is GPU-accelerated
 * Returns true if only using transform and opacity
 */
export const isGPUAccelerated = (properties: string[]): boolean => {
  const gpuProperties = ['transform', 'opacity', 'filter'];
  return properties.every((prop) => gpuProperties.includes(prop));
};

/**
 * Get optimized animation properties
 * Ensures only GPU-accelerated properties are used
 */
export const getOptimizedAnimation = (
  animation: Record<string, any>
): Record<string, any> => {
  const optimized: Record<string, any> = {};

  Object.entries(animation).forEach(([key, value]) => {
    if (typeof value === 'object') {
      const subProps = Object.keys(value);
      if (isGPUAccelerated(subProps)) {
        optimized[key] = value;
      } else {
        // Warn about non-GPU properties
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[Performance] Non-GPU properties detected: ${subProps.join(', ')}`
          );
        }
      }
    } else {
      optimized[key] = value;
    }
  });

  return optimized;
};

// ========================================================================
// EXPORT ALL
// ========================================================================

export const animations = {
  config: animationConfig,
  variants: gpuVariants,
  transitions,
  hooks: {
    useGPUPreferencedMotion,
    useIntersectionAnimation,
  },
  components: {
    FadeIn,
    FadeUp,
    ScaleIn,
    StaggerContainer,
  },
  utilities: {
    setWillChange,
    clearWillChange,
    isGPUAccelerated,
    getOptimizedAnimation,
  },
} as const;
