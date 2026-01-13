import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  mode?: 'wait' | 'sync' | 'popLayout';
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export const PageTransition = ({
  children,
  className = "",
  mode = 'wait',
  direction = 'up'
}: PageTransitionProps) => {
  const useReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getVariants = () => {
    if (useReducedMotion()) {
      return {
        initial: { opacity: 0 },
        enter: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }

    const baseTransition = {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    };

    switch (direction) {
      case 'up':
        return {
          initial: { opacity: 0, y: 30, scale: 0.98 },
          enter: { opacity: 1, y: 0, scale: 1, transition: baseTransition },
          exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' } },
        };
      case 'down':
        return {
          initial: { opacity: 0, y: -30, scale: 0.98 },
          enter: { opacity: 1, y: 0, scale: 1, transition: baseTransition },
          exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' } },
        };
      case 'left':
        return {
          initial: { opacity: 0, x: 50, scale: 0.98 },
          enter: { opacity: 1, x: 0, scale: 1, transition: baseTransition },
          exit: { opacity: 0, x: -30, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' } },
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -50, scale: 0.98 },
          enter: { opacity: 1, x: 0, scale: 1, transition: baseTransition },
          exit: { opacity: 0, x: 30, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' } },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0, scale: 0.95 },
          enter: { opacity: 1, scale: 1, transition: baseTransition },
          exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25, ease: 'easeIn' } },
        };
    }
  };

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        variants={getVariants()}
        initial="initial"
        animate="enter"
        exit="exit"
        className={`w-full ${className}`}
        onAnimationComplete={(definition) => {
          if (definition === 'enter') {
            (document.querySelector('[data-motion-container]') as HTMLElement)?.style.setProperty('will-change', 'auto');
          }
        }}
        data-motion-container
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
