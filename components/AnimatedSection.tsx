import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { prefersReducedMotion, intersectionOptions } from '../lib/animations';
import { useIntersectionObserver } from '../lib/hooks';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
  once?: boolean;
  stagger?: boolean;
}

export const AnimatedSection = ({
  children,
  className = '',
  id,
  delay = 0,
  direction = 'up',
  once = true,
  stagger = false
}: AnimatedSectionProps) => {
  const controls = useAnimation();
  const hasAnimatedRef = useRef(false);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: intersectionOptions.threshold,
    rootMargin: intersectionOptions.rootMargin,
  });

  useEffect(() => {
    if (prefersReducedMotion()) {
      controls.start('visible');
      return;
    }

    if (isIntersecting && (!once || !hasAnimatedRef.current)) {
      controls.start('visible');
      hasAnimatedRef.current = true;
    } else if (!once && !isIntersecting && hasAnimatedRef.current) {
      controls.start('hidden');
      hasAnimatedRef.current = false;
    }
  }, [controls, isIntersecting, once, hasAnimatedRef]);

  const getVariants = () => {
    if (prefersReducedMotion()) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }

    const baseVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.4,
          delay: delay * 0.001,
          ease: [0.16, 1, 0.3, 1],
          ...(stagger && {
            staggerChildren: 0.06,
            delayChildren: 0.04,
          }),
        },
      },
    };

    switch (direction) {
      case 'up':
        return { hidden: { ...baseVariants.hidden, y: 32, scale: 0.98 }, visible: { ...baseVariants.visible, y: 0, scale: 1 } };
      case 'down':
        return { hidden: { ...baseVariants.hidden, y: -32, scale: 0.98 }, visible: { ...baseVariants.visible, y: 0, scale: 1 } };
      case 'left':
        return { hidden: { ...baseVariants.hidden, x: 32, scale: 0.98 }, visible: { ...baseVariants.visible, x: 0, scale: 1 } };
      case 'right':
        return { hidden: { ...baseVariants.hidden, x: -32, scale: 0.98 }, visible: { ...baseVariants.visible, x: 0, scale: 1 } };
      case 'scale':
        return { hidden: { ...baseVariants.hidden, scale: 0.96 }, visible: { ...baseVariants.visible, scale: 1 } };
      case 'none':
      default:
        return baseVariants;
    }
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      initial="hidden"
      animate={controls}
      variants={getVariants()}
      className={className}
      style={{ willChange: 'opacity, transform' }}
      onAnimationComplete={() => {
        if (ref.current) {
          ref.current.style.willChange = 'auto';
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1, threshold = 0.1 }: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}) => {
  const controls = useAnimation();
  const [ref, isIntersecting] = useIntersectionObserver({ threshold });

  useEffect(() => {
    if (prefersReducedMotion()) {
      controls.start('visible');
      return;
    }

    if (isIntersecting) {
      controls.start('visible');
    }
  }, [controls, isIntersecting, threshold]); // threshold is used in useIntersectionObserver

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={containerVariants} className={className}>
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '', delay = 0 }: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
