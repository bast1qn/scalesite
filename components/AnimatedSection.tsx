
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  stagger?: boolean;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', id, stagger = false, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view
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
  }, []);
  
  const containerClass = stagger ? 'stagger-container' : '';
  const style = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div
      ref={sectionRef}
      id={id}
      style={style}
      className={`animated-section ${isVisible ? 'is-visible' : ''} ${containerClass} ${className}`}
    >
      {children}
    </div>
  );
};
