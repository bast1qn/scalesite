import { useState, useEffect, type ReactNode } from 'react';
import { useIntersectionObserverOnce } from '../lib/hooks';
import { getSafeURL } from '../lib/validation';
import { INTERSECTION_THRESHOLD, IMAGE_LOADING } from '../lib/constants';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
  blurDataURL?: string;
  blurAmount?: number;
  width?: number;
  height?: number;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
}

/**
 * LazyImage - Progressive Image Loading mit Blur-Up
 *
 * PERFORMANCE: Aspect ratio preservation prevents CLS
 * Features:
 * - Lazy Loading mit Intersection Observer
 * - Blur-Up Effekt für sanfte Übergänge
 * - Fallback für Fehler
 * - Konfigurierbarer Blur-Effekt
 * - Dark Mode Support
 * - Aspect Ratio Preservation for CLS optimization
 */
export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'https://via.placeholder.com/400x300?text=Loading...',
  threshold = INTERSECTION_THRESHOLD.default,
  blurDataURL,
  blurAmount = IMAGE_LOADING.defaultBlurAmount,
  width,
  height,
  aspectRatio
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(blurDataURL);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageRef, isInView] = useIntersectionObserverOnce({ threshold });

  useEffect(() => {
    if (isInView) {
      const img = new Image();

      // SECURITY: Validate URL before loading (OWASP A03:2021 - XSS Prevention)
      const safeSrc = getSafeURL(src);
      if (!safeSrc) {
        console.error('[SECURITY] Invalid image URL blocked:', src);
        setIsError(true);
        return;
      }

      // Lade das Bild
      img.src = safeSrc;
      img.onload = () => {
        setImageSrc(safeSrc);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsError(true);
      };
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [src, isInView]);

  // PERFORMANCE: Calculate aspect ratio style to prevent CLS
  const aspectRatioStyle = aspectRatio ? {
    aspectRatio: aspectRatio.replace('/', '/'),
  } : (width && height ? {
    aspectRatio: `${width} / ${height}`,
  } : {});

  return (
    <div className={`relative overflow-hidden ${className}`} style={aspectRatioStyle}>
      {/* Blur Placeholder mit Blur-Up Effekt */}
      {!isLoaded && !isError && (
        <div
          className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${IMAGE_LOADING.blurScaleFactor})` // Verhindert weiße Ränder durch Blur
          }}
        />
      )}

      {/* Hauptbild */}
      <img
        ref={imageRef}
        src={imageSrc || placeholder}
        alt={alt}
        className={`
          transition-all duration-500 ease-out
          ${isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'}
        `}
        loading="lazy"
        style={{
          filter: isLoaded ? 'none' : `blur(${blurAmount}px)`,
          width: width || '100%',
          height: height || 'auto',
          objectFit: 'cover',
        }}
        width={width}
        height={height}
      />

      {/* Loading Spinner (optional) */}
      {!isLoaded && !isError && !blurDataURL && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-slate-400 text-sm">Bild konnte nicht geladen werden</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface OptimizedBackgroundImageProps {
  src: string;
  className?: string;
  children?: ReactNode;
  blurDataURL?: string;
  blurAmount?: number;
}

/**
 * OptimizedBackgroundImage - Progressive Background Image Loading
 *
 * Features:
 * - Lazy Loading mit Blur-Up
 * - Overlay für bessere Lesbarkeit
 * - Intersection Observer
 */
export const OptimizedBackgroundImage = ({
  src,
  className = '',
  children,
  blurDataURL,
  blurAmount = IMAGE_LOADING.backgroundBlurAmount
}: OptimizedBackgroundImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [containerRef, isInView] = useIntersectionObserverOnce({ threshold: INTERSECTION_THRESHOLD.default });

  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      return () => {
        img.onload = null;
      };
    }
  }, [isInView, src, isLoaded]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Blur Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${IMAGE_LOADING.blurScaleFactor})`,
            transition: `filter ${IMAGE_LOADING.transitionDuration}ms ease-out`
          }}
        />
      )}

      {/* Hauptbild */}
      {isLoaded && (
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isLoaded ? 1 : 0
          }}
        />
      )}

      {/* Overlay */}
      {isLoaded && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-500" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LazyImage;
