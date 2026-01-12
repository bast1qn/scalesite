/**
 * Enhanced Animation Settings
 * Centralized animation configuration for consistent and performant animations
 * Includes premium effects like parallax, reveal animations, and glow effects
 */

import { Transition } from 'framer-motion';

// Base transition optimized for performance
export const baseTransition: Transition = {
  duration: 0.4,
  ease: [0.25, 0.4, 0.25, 1], // Custom easing for smoother, more premium feel
};

// Fast transition for quick UI feedback
export const fastTransition: Transition = {
  duration: 0.15,
  ease: 'easeOut',
};

// Slow transition for dramatic effects
export const slowTransition: Transition = {
  duration: 0.8,
  ease: [0.25, 0.4, 0.25, 1],
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

// Fade in animation variants
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

// Slide up animation variants
export const slideUpVariants = () => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: getTransition(),
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: getTransition(),
  },
});

// Slide in from right animation variants
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

// Scale animation variants
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

// Stagger children animation
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
      duration: 0.5,
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
 * Enhanced animation wrapper component props
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

// ==================== PREMIUM EFFECTS ====================

/**
 * Parallax scroll effect variants
 * Use with useScroll and useTransform from framer-motion
 */
export const parallaxVariants = {
  slow: { y: [0, -50, 0] },
  medium: { y: [0, -100, 0] },
  fast: { y: [0, -200, 0] },
};

/**
 * Reveal on scroll variants - for staggered reveals
 */
export const revealVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  },
};

/**
 * Glow effect animation variants
 */
export const glowVariants = {
  initial: { boxShadow: '0 0 0px rgba(59, 130, 246, 0)' },
  hover: {
    boxShadow: [
      '0 0 0px rgba(59, 130, 246, 0)',
      '0 0 20px rgba(59, 130, 246, 0.3)',
      '0 0 40px rgba(59, 130, 246, 0.5)',
      '0 0 20px rgba(59, 130, 246, 0.3)',
      '0 0 0px rgba(59, 130, 246, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Gradient text animation variants
 */
export const gradientTextVariants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Shimmer / shine effect for cards
 */
export const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: ['0%', '100%', '0%'],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Pulse glow effect
 */
export const pulseGlowVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Magnetic button effect variants
 */
export const magneticVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 15,
    },
  },
};

/**
 * Staggered list reveal
 */
export const staggeredListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggeredItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

/**
 * 3D card tilt effect variants
 */
export const tiltVariants = {
  initial: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: {
    rotateX: 5,
    rotateY: -5,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Text reveal animation (character by character)
 */
export const textRevealVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

/**
 * Counter animation for numbers
 */
export const counterVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'backOut',
    },
  },
};

/**
 * Float animation for decorative elements
 */
export const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Rotate animation for icons
 */
export const rotateVariants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Bounce animation
 */
export const bounceVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeOut',
      repeatDelay: 0.3,
    },
  },
};

/**
 * Typing cursor animation
 */
export const cursorVariants = {
  blink: {
    opacity: [1, 0, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Intersection Observer options for scroll animations
export const intersectionOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

// Easing functions for custom animations
export const easings = {
  smooth: [0.25, 0.4, 0.25, 1],
  bouncy: [0.34, 1.56, 0.64, 1],
  sharp: [0.25, 0.1, 0.25, 1],
  gentle: [0.4, 0, 0.2, 1],
} as const;
