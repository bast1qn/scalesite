
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { fadeInVariants, prefersReducedMotion } from '../lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
}

/**
 * Optimized AnimatedSection Component
 * Triggers animation when element enters viewport using IntersectionObserver
 * Respects prefers-reduced-motion for accessibility
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  id,
  delay = 0,
  direction = 'up',
  once = true
}) => {
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
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
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

  // Direction-based variants
  const getVariants = () => {
    if (prefersReducedMotion()) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }

    const baseVariants = {
      hidden: {
        opacity: 0,
        transition: { duration: 0.4 },
      },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.5,
          delay: delay * 0.001,
          ease: [0.25, 0.4, 0.25, 1],
        },
      },
    };

    switch (direction) {
      case 'up':
        return {
          hidden: { ...baseVariants.hidden, y: 40 },
          visible: { ...baseVariants.visible, y: 0 },
        };
      case 'down':
        return {
          hidden: { ...baseVariants.hidden, y: -40 },
          visible: { ...baseVariants.visible, y: 0 },
        };
      case 'left':
        return {
          hidden: { ...baseVariants.hidden, x: 40 },
          visible: { ...baseVariants.visible, x: 0 },
        };
      case 'right':
        return {
          hidden: { ...baseVariants.hidden, x: -40 },
          visible: { ...baseVariants.visible, x: 0 },
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
};

/**
 * StaggerContainer for animating children in sequence
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => {
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
      { threshold: 0.1 }
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
  }, [controls]);

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
};

/**
 * StaggerItem for use inside StaggerContainer
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: [0.25, 0.4, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
