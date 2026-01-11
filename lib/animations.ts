/**
 * Optimized Animation Settings
 * Centralized animation configuration for consistent and performant animations
 */

import { Transition } from 'framer-motion';

// Base transition optimized for performance
export const baseTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // Custom easing for smoother feel
};

// Fast transition for quick UI feedback
export const fastTransition: Transition = {
  duration: 0.15,
  ease: 'easeOut',
};

// Reduced motion transition for accessibility
export const reducedMotionTransition: Transition = {
  duration: 0.01,
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get appropriate transition based on user preferences
export const getTransition = (custom?: Transition): Transition => {
  if (prefersReducedMotion()) {
    return reducedMotionTransition;
  }
  return { ...baseTransition, ...custom };
};

// Fade in animation variants - lazy to avoid initialization issues
export const fadeInVariants = () => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: getTransition(),
  },
  exit: {
    opacity: 0,
    transition: getTransition(),
  },
});

// Slide up animation variants - lazy
export const slideUpVariants = () => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: getTransition(),
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: getTransition(),
  },
});

// Slide in from right animation variants - lazy
export const slideInRightVariants = () => ({
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: getTransition(),
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: getTransition(),
  },
});

// Scale animation variants - lazy
export const scaleVariants = () => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: getTransition(),
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: getTransition(),
  },
});

// Stagger children animation - lazy
export const staggerContainer = () => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ...getTransition(),
    },
  },
});

// Optimized page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

// Optimized modal animation
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// Hardware acceleration hints for better performance
export const hardwareAccelerationProps = {
  style: {
    // Force GPU acceleration
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  },
};

// Cleanup function to remove will-change after animation
export const cleanupAnimationProps = {
  style: {
    willChange: 'auto',
  },
};

/**
 * Optimized animation wrapper component props
 * Use these for consistent, performant animations throughout the app
 */
export const animationProps = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: fadeInVariants,
};

// Spring physics presets for different feels
export const springPresets = {
  gentle: {
    type: 'spring',
    damping: 15,
    stiffness: 150,
  },
  bouncy: {
    type: 'spring',
    damping: 10,
    stiffness: 200,
  },
  snappy: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
  smooth: {
    type: 'spring',
    damping: 25,
    stiffness: 100,
  },
} as const;

// Performance tip: Use layoutId for shared element transitions
export const sharedElementTransition = {
  layoutId: 'shared-element',
  transition: {
    type: 'spring',
    damping: 30,
    stiffness: 200,
  },
};
