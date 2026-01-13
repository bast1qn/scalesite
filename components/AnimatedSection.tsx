import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { prefersReducedMotion, easings, intersectionOptions } from '../lib/animations';

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
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
        rootMargin: intersectionOptions.rootMargin,
        threshold: intersectionOptions.threshold,
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
    // direction, delay, and stagger are only used in getVariants which is called outside useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, once]);

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
          duration: 0.5,
          delay: delay * 0.001,
          ease: [0.25, 0.1, 0.25, 1],
          ...(stagger && {
            staggerChildren: 0.08,
            delayChildren: 0.05,
          }),
        },
      },
    };

    switch (direction) {
      case 'up':
        return { hidden: { ...baseVariants.hidden, y: 40, scale: 0.98 }, visible: { ...baseVariants.visible, y: 0, scale: 1 } };
      case 'down':
        return { hidden: { ...baseVariants.hidden, y: -40, scale: 0.98 }, visible: { ...baseVariants.visible, y: 0, scale: 1 } };
      case 'left':
        return { hidden: { ...baseVariants.hidden, x: 40, scale: 0.98 }, visible: { ...baseVariants.visible, x: 0, scale: 1 } };
      case 'right':
        return { hidden: { ...baseVariants.hidden, x: -40, scale: 0.98 }, visible: { ...baseVariants.visible, x: 0, scale: 1 } };
      case 'scale':
        return { hidden: { ...baseVariants.hidden, scale: 0.95 }, visible: { ...baseVariants.visible, scale: 1 } };
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
      style={{ willChange: 'opacity, transform' }}
      onAnimationComplete={() => {
        if (sectionRef.current) {
          sectionRef.current.style.willChange = 'auto';
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
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div ref={containerRef} initial="hidden" animate={controls} variants={containerVariants} className={className}>
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
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
