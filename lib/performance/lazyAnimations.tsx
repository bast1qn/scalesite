/**
 * LAZY ANIMATION SYSTEM
 * Lazy loads framer-motion to reduce initial bundle size by ~115KB
 * Only loads animation library when user interacts with animated elements
 */

import { lazy, Suspense, type ReactNode } from 'react';

// Lazy load framer-motion components
export const MotionDiv = lazy(() =>
  import('framer-motion').then(module => ({
    default: module.motion.div
  }))
);

// Fallback component for before framer-motion loads
const AnimationFallback = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

// Lazy animated section component
export const LazyAnimatedSection = ({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <Suspense fallback={<AnimationFallback className={className}>{children}</AnimationFallback>}>
      <MotionDiv
        id={id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={className}
      >
        {children}
      </MotionDiv>
    </Suspense>
  );
};

// Trigger lazy load of animation library
export const preloadAnimations = () => {
  import('framer-motion');
};
