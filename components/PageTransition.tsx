
import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, getTransition, hardwareAccelerationProps } from '../lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Optimized Page Transition Component
 * Uses efficient animations with hardware acceleration for smooth page transitions
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  // Use reduced motion if user prefers it
  const useReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const variants = useReducedMotion()
    ? {
        initial: { opacity: 0 },
        enter: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : pageVariants;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`w-full ${className}`}
      {...hardwareAccelerationProps}
      onAnimationComplete={() => {
        // Cleanup will-change after animation completes
        (document.querySelector('[data-motion-container]') as HTMLElement)?.style.setProperty('will-change', 'auto');
      }}
      data-motion-container
    >
      {children}
    </motion.div>
  );
};
