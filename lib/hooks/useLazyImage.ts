import { useState, useRef, useEffect } from 'react';

interface UseLazyImageOptions extends IntersectionObserverInit {
  /** Fallback image source on error */
  fallbackSrc?: string;
  /** Callback on load complete */
  onLoad?: () => void;
  /** Callback on error */
  onError?: () => void;
}

/**
 * ✅ PERFORMANCE + ACCESSIBILITY: Lazy Loading Hook for Images
 * Uses IntersectionObserver to load images only when visible
 * Reduces initial page load and saves bandwidth
 *
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Error handling with fallback support
 * - Load state tracking for loading states
 * - Accessibility-compliant attributes
 *
 * @example
 * ```tsx
 * const [imgRef, isLoaded, src, attrs] = useLazyImage('/path/to/image.jpg', {
 *   fallbackSrc: '/fallback.jpg',
 *   onLoad: () => console.log('Image loaded'),
 *   onError: () => console.log('Image failed'),
 * });
 *
 * <img
 *   ref={imgRef}
 *   src={src}
 *   alt="Descriptive alt text"
 *   {...attrs}
 *   className={isLoaded ? 'loaded' : 'loading'}
 * />
 * ```
 */
export function useLazyImage(
  src: string,
  options: UseLazyImageOptions = {}
): [
  React.RefObject<HTMLImageElement>,
  boolean,
  string | undefined,
  { loading: 'lazy'; onError: () => void; onLoad: () => void }
] {
  const { fallbackSrc, onLoad, onError, ...observerOptions } = options;

  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        ...observerOptions
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, observerOptions]);

  useEffect(() => {
    if (imageSrc && imgRef.current) {
      imgRef.current.onload = () => {
        setIsLoaded(true);
        onLoad?.();
      };

      imgRef.current.onerror = () => {
        setHasError(true);
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
        onError?.();
      };
    }
  }, [imageSrc, fallbackSrc, onLoad, onError]);

  const accessibilityAttrs = {
    loading: 'lazy' as const,
    onError: () => {
      setHasError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
      onError?.();
    },
    onLoad: () => {
      setIsLoaded(true);
      onLoad?.();
    },
  };

  return [imgRef, isLoaded, imageSrc, accessibilityAttrs];
}

/**
 * ✅ PERFORMANCE: Preload critical images
 * Use for above-the-fold images that should load immediately
 *
 * @example
 * usePreloadImage('/hero-image.jpg');
 */
export function usePreloadImage(src: string): void {
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;

        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, [src]);
}
