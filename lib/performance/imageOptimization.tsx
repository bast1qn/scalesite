/**
 * Progressive Image Loading with Blur-Up Technique
 *
 * PERFORMANCE: Load tiny placeholder first, then fade in full image
 * - Improves perceived performance (LCP)
 * - Prevents layout shift (CLS)
 * - Better user experience with progressive enhancement
 *
 * @performance
 * - Reduces LCP by showing content immediately
 * - Eliminates CLS with proper aspect ratio
 * - Uses low-quality image placeholder (LQIP) for instant feedback
 */

import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  placeholder?: string;        // Tiny base64 or low-res image URL
  blurAmount?: number;         // Blur strength (default: 10px)
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;              // Responsive image sizes
  srcSet?: string;             // Responsive image sources
}

/**
 * Progressive Image Component with Blur-Up Effect
 */
export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  placeholder,
  blurAmount = 10,
  className = '',
  style = {},
  onLoad,
  onError,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes,
  srcSet
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use intersection observer for lazy loading
  const { isIntersecting } = useIntersectionObserver(imgRef, {
    threshold: 0.01,
    rootMargin: '50px'
  });

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Don't load actual image if not intersected (unless loading is eager)
  const shouldLoad = loading === 'eager' || isIntersecting;

  const imageStyle: CSSProperties = {
    ...style,
    width: width || '100%',
    height: height || 'auto',
    transition: 'filter 0.3s ease-in-out',
    filter: isLoaded ? 'none' : `blur(${blurAmount}px)`,
    opacity: isLoaded ? 1 : 0.7
  };

  if (hasError) {
    return (
      <div
        className={`bg-slate-200 dark:bg-slate-800 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-8 h-8 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder image */}
      {placeholder && !isLoaded && shouldLoad && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          style={{
            ...imageStyle,
            position: 'absolute',
            top: 0,
            left: 0,
            filter: `blur(${blurAmount}px)`
          }}
          className="pointer-events-none"
        />
      )}

      {/* Actual image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

/**
 * Hook to generate blur placeholder from image
 * Generates a tiny base64 preview
 */
export function useBlurPlaceholder(src: string, size = 10) {
  const [placeholder, setPlaceholder] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Draw tiny version of image
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      // Convert to base64
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      setPlaceholder(dataUrl);
    };

    img.src = src;
  }, [src, size]);

  return placeholder;
}

/**
 * Responsive Image with srcset generation
 */
export interface ResponsiveImageProps extends Omit<ProgressiveImageProps, 'srcSet'> {
  src: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  formats?: {
    webp?: string;
    avif?: string;
  };
}

export function ResponsiveImage({
  src,
  formats,
  alt,
  width,
  height,
  className = '',
  ...rest
}: ResponsiveImageProps) {
  const generateSrcSet = useCallback(() => {
    const sources = [];

    if (formats?.avif) {
      sources.push({
        type: 'image/avif',
        srcSet: generateSizesSrcSet(formats.avif)
      });
    }

    if (formats?.webp) {
      sources.push({
        type: 'image/webp',
        srcSet: generateSizesSrcSet(formats.webp)
      });
    }

    return sources;
  }, [formats]);

  const generateSizesSrcSet = useCallback((baseSrc: string) => {
    // Generate srcset from base URL with size parameters
    // This is a simplified example - you'd implement based on your image service
    return `${baseSrc}?w=640 640w, ${baseSrc}?w=960 960w, ${baseSrc}?w=1280 1280w, ${baseSrc}?w=1920 1920w`;
  }, []);

  const sources = generateSrcSet();
  const defaultSrc = src.xl || src.desktop || src.tablet || src.mobile || '';

  return (
    <picture className={className}>
      {sources.map((source) => (
        <source
          key={source.type}
          type={source.type}
          srcSet={source.srcSet}
          sizes="(max-width: 640px) 640px, (max-width: 960px) 960px, (max-width: 1280px) 1280px, 1920px"
        />
      ))}

      <ProgressiveImage
        src={defaultSrc}
        alt={alt}
        width={width}
        height={height}
        {...rest}
      />
    </picture>
  );
}

/**
 * Critical Image Loader - preload above-the-fold images
 */
export function useCriticalImages(images: string[]) {
  useEffect(() => {
    if (!('requestIdleCallback' in window)) return;

    const idleCallbackId = requestIdleCallback(() => {
      images.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;

        if (link.relList.supports('prefetch')) {
          link.fetchPriority = 'high';
        }

        document.head.appendChild(link);
      });
    });

    return () => {
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(idleCallbackId);
      }
    };
  }, images);
}

/**
 * Image aspect ratio container - prevents CLS
 */
export function AspectRatioContainer({
  aspectRatio,
  children,
  className = ''
}: {
  aspectRatio: number;  // width / height
  children: React.ReactNode;
  className?: string;
}) {
  const paddingTop = `${(1 / aspectRatio) * 100}%`;

  return (
    <div
      className={`relative ${className}`}
      style={{ paddingTop }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}

/**
 * Lazy load images with Intersection Observer
 */
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        threshold: 0.01,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, options]);

  return { isIntersecting };
}
