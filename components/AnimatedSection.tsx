
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { prefersReducedMotion } from '../lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
  once?: boolean;
  stagger?: boolean;
}

/**
 * Enhanced AnimatedSection Component
 * Triggers animation when element enters viewport using IntersectionObserver
 * Respects prefers-reduced-motion for accessibility
 * Supports staggered children animations
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  id,
  delay = 0,
  direction = 'up',
  once = true,
  stagger = false
}) => {
  // TEMPORARY: Disabled to debug hook error
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
  /*
  // Original code disabled for debugging
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion()) {
      controls.start('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimatedRef.current)) {
          controls.start('visible');
          hasAnimatedRef.current = true;
        } else if (!once && !entry.isIntersecting) {
          controls.start('hidden');
          hasAnimatedRef.current = false;
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls, once]);

  // Enhanced direction-based variants
  const getVariants = () => {
    if (prefersReducedMotion()) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }

    const springConfig = {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    };

    const baseVariants = {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          delay: delay * 0.001,
          ease: [0.25, 0.4, 0.25, 1],
          ...(stagger && {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          }),
        },
      },
    };

    switch (direction) {
      case 'up':
        return {
          hidden: { ...baseVariants.hidden, y: 50, scale: 0.98 },
          visible: { ...baseVariants.visible, y: 0, scale: 1 },
        };
      case 'down':
        return {
          hidden: { ...baseVariants.hidden, y: -50, scale: 0.98 },
          visible: { ...baseVariants.visible, y: 0, scale: 1 },
        };
      case 'left':
        return {
          hidden: { ...baseVariants.hidden, x: 50, scale: 0.98 },
          visible: { ...baseVariants.visible, x: 0, scale: 1 },
        };
      case 'right':
        return {
          hidden: { ...baseVariants.hidden, x: -50, scale: 0.98 },
          visible: { ...baseVariants.visible, x: 0, scale: 1 },
        };
      case 'scale':
        return {
          hidden: { ...baseVariants.hidden, scale: 0.9 },
          visible: { ...baseVariants.visible, scale: 1 },
        };
      case 'none':
      default:
        return baseVariants;
    }
  };

  return (
    <motion.div
      ref={sectionRef}
      id={id}
      initial="hidden"
      animate={controls}
      variants={getVariants()}
      className={className}
      style={{
        // Enable hardware acceleration during animation
        willChange: 'opacity, transform',
      }}
      onAnimationComplete={() => {
        // Remove will-change after animation completes for better performance
        if (sectionRef.current) {
          sectionRef.current.style.willChange = 'auto';
        }
      }}
    >
      {children}
    </motion.div>
  );
  */
};

/**
 * Enhanced StaggerContainer for animating children in sequence
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}> = ({ children, className = '', staggerDelay = 0.1, threshold = 0.1 }) => {
  // TEMPORARY: Disabled to debug hook error
  return <div className={className}>{children}</div>;

  /* Original code disabled for debugging
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      controls.start('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls, threshold]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
  */
};

/**
 * Enhanced StaggerItem for use inside StaggerContainer
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  // TEMPORARY: Disabled to debug hook error
  return <div className={className}>{children}</div>;

  /* Original code disabled for debugging
  const prefersReduced = prefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            delay,
            ease: [0.25, 0.4, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
  */
};
