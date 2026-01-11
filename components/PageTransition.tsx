
import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const variants = {
  initial: { 
    opacity: 0, 
    y: 8, // Reduzierter Weg für subtileren Effekt
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: {
        duration: 0.25, // Deutlich schnellerer Eintritt
        ease: "easeOut",
    }
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    transition: {
        duration: 0.15, // Sehr schneller Austritt für snappiges Gefühl
        ease: "easeIn"
    }
  }
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
