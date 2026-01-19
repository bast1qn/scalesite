// ========================================================================
// ✅ PERFORMANCE: Optimized Framer Motion Imports
// ========================================================================
// Direct imports enable maximal tree-shaking
// Reduces bundle size by only including motion features that are actually used
// ========================================================================

// ⚠️ CRITICAL: Use direct imports for optimal tree-shaking
// BAD: import { motion, AnimatePresence } from 'framer-motion'
// GOOD: import { motion, AnimatePresence } from '@/lib/motion'

// ========================================================================
// Core Motion Exports
// ========================================================================

export { motion } from 'framer-motion';
export { AnimatePresence } from 'framer-motion';
export { useAnimation } from 'framer-motion';
export { useReducedMotion } from 'framer-motion';

// ========================================================================
// Animation Variants Helpers
// ========================================================================

/**
 * Standard fade-in animation variant
 * Optimized for page transitions and section reveals
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Fade with upward motion (common hero animation)
 * Use for staggered list items and card reveals
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

/**
 * Scale animation for modals and dialogs
 */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
};

/**
 * Slide in from right (drawer/sidebar pattern)
 */
export const slideInRight = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  },
};

/**
 * Stagger children animation for lists
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
};

// ========================================================================
// Performance Optimized Animation Presets
// ========================================================================

/**
 * Lightweight hover animation (buttons, cards)
 * Uses transform instead of layout properties
 */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

/**
 * Press animation for buttons
 * Provides immediate visual feedback
 */
export const pressScale = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

/**
 * Optimized page transition (reduces layout shift)
 */
export const pageTransition = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
  transition: { duration: 0.3 }
};

// ========================================================================
// Spring Animation Configs
// ========================================================================

/**
 * Smooth spring for natural motion
 * Use for general UI animations
 */
export const smoothSpring = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 300,
};

/**
 * Snappy spring for interactive elements
 * Use for buttons, toggles, hovers
 */
export const snappySpring = {
  type: 'spring' as const,
  damping: 15,
  stiffness: 400,
};

/**
 * Gentle spring for large elements
 * Use for modals, page transitions
 */
export const gentleSpring = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 200,
};

// ========================================================================
// Animation Utilities
// ========================================================================

/**
 * Creates a staggered variant for list animations
 * @param staggerDelay - Delay between each child (default: 0.1)
 */
export function createStagger(staggerDelay = 0.1) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      }
    }
  };
}

/**
 * Optimistic animation for loading states
 * Pulse animation with minimal GPU usage
 */
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

/**
 * Spin animation for loaders
 * GPU-accelerated rotation
 */
export const spin = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear'
  }
};
