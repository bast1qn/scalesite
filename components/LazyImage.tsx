import { useState, useEffect, type ReactNode } from 'react';
import { useIntersectionObserverOnce } from '../lib/hooks';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
}

export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'https://via.placeholder.com/400x300?text=Loading...',
  threshold = 0.1
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageRef, isInView] = useIntersectionObserverOnce({ threshold });

  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsError(true);
      };
    }
  }, [src, isInView]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        ref={imageRef}
        src={imageSrc || placeholder}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading="lazy"
      />
      {isError && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-slate-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

interface OptimizedBackgroundImageProps {
  src: string;
  className?: string;
  children?: ReactNode;
}

export const OptimizedBackgroundImage = ({
  src,
  className = '',
  children
}: OptimizedBackgroundImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [containerRef, isInView] = useIntersectionObserverOnce({ threshold: 0.1 });

  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [isInView, src, isLoaded]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      )}
      {isLoaded && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-500" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LazyImage;
