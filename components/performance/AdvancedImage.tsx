/**
 * ✅ PERFORMANCE ADVANCED: Modern Image Component with WebP/AVIF Support
 *
 * FEATURES:
 * - Automatic WebP/AVIF format detection with fallback
 * - Responsive images with srcset for optimal loading
 * - Lazy loading with intersection observer
 * - Blur placeholder during loading (prevents CLS)
 * - Priority hinting for LCP candidates
 * - Aspect ratio preservation (prevents layout shift)
 *
 * @performance
 * - WebP: 25-35% smaller than JPEG
 * - AVIF: 50% smaller than JPEG
 * - Lazy loading: Saves bandwidth for offscreen images
 * - Blur placeholder: Prevents CLS from image loading
 *
 * @example
 * <AdvancedImage
 *   src="/hero.jpg"
 *   webpSrc="/hero.webp"
 *   avifSrc="/hero.avif"
 *   alt="Hero"
 *   width={1920}
 *   height={1080}
 *   priority={true} // LCP candidate
 *   sizes="100vw"
 * />
 */

import { useState, useRef, useEffect, memo, type ImgHTMLAttributes, type CSSProperties } from 'react';

interface AdvancedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  src: string; // Fallback image (JPEG/PNG)
  webpSrc?: string; // WebP version
  avifSrc?: string; // AVIF version
  srcSet?: {
    fallback?: string; // e.g., "image.jpg 400w, image-800.jpg 800w"
    webp?: string; // e.g., "image.webp 400w, image-800.webp 800w"
    avif?: string; // e.g., "image.avif 400w, image-800.avif 800w"
  };
  sizes?: string; // e.g., "(max-width: 600px) 100vw, 50vw"
  width?: number;
  height?: number;
  aspectRatio?: number; // width / height
  priority?: boolean; // LCP candidate (preload, fetchpriority="high")
  lazy?: boolean; // Enable lazy loading (default: true)
  blurPlaceholder?: boolean; // Show blur during loading (default: true)
  placeholderColor?: string; // Placeholder background color
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Check if browser supports AVIF format
 */
function supportsAVIF(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  const avif = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EAAAKACGAAAAAHaWxvdAAAAAAAEAAAABwAAABJbdhcGAAAAAAAAMAbACADnQAAAABjZHRkAAAAAAAEAAAC4yHQAAAAAfZjkAAAAAAAEAAAC5naWRdAAAAAAAAAAEAAAABaHJlZWQAAAAAAAAAAQAAABoYWRkAAAAAAQAAAAAAAAABAAAAbG1sdAAAAAAAEAAAABWcHVydAAAAAAAEAAAABWZlZGV0AAAACgAAAAZwcml0YQAAAAARAAAAJGN1dHMAAAAABAAAAAJhdHgAAAAAAQAAACBaZhJ3AAAAAAAAAABZaJuzbWRlYmMAAAAAAQAAAAAAAABxZXJjcAAAAABlAAAAAXHRkYQAAAAARAAAAJGNhdiAAAAABAAAAABwaXB0cgAAAAAAAAABAAAAAQAAABRpdGNkAAAAAAAQAAAABAAAAChhdGMAAAAABAAAAAJYaXJlAAAACAAAABwYXJjAAAAAAQAAAAEAAAAAABmYXJjAAAAAAQAAAAEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAGdHJhawAAAFx0a2hkAAAAADWRkaWQAAAAAbWRkagAAAAAAAQAAAAAA';
  const img = new Image();
  return new Promise(resolve => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = avif;
  });
}

/**
 * Check if browser supports WebP format
 */
function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  const webp = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  const img = new Image();
  return new Promise(resolve => {
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
    img.src = webp;
  });
}

// Cache format detection results
let avifSupported: boolean | null = null;
let webpSupported: boolean | null = null;

/**
 * Advanced Image Component with WebP/AVIF support
 */
export const AdvancedImage = memo<AdvancedImageProps>(({
  src,
  webpSrc,
  avifSrc,
  srcSet,
  sizes,
  width,
  height,
  aspectRatio,
  priority = false,
  lazy = true,
  blurPlaceholder = true,
  placeholderColor = '#f3f4f6',
  alt = '',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [supportsAvif, setSupportsAvif] = useState(false);
  const [supportsWebp, setSupportsWebp] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState(priority); // Priority images start in-view

  // Detect format support on mount
  useEffect(() => {
    if (avifSupported === null) {
      supportsAVIF().then(supported => {
        avifSupported = supported;
        setSupportsAvif(supported);
      });
    } else {
      setSupportsAvif(avifSupported);
    }

    if (webpSupported === null) {
      supportsWebP().then(supported => {
        webpSupported = supported;
        setSupportsWebp(supported);
      });
    } else {
      setSupportsWebp(webpSupported);
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, inView]);

  // Handle image load
  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    setLoaded(true); // Still remove placeholder
    onError?.();
  };

  // Calculate aspect ratio
  const calculatedAspectRatio = aspectRatio || (width && height ? width / height : undefined);

  // Build srcset based on format support
  const getSrcSet = () => {
    if (supportsAvif && srcSet?.avif) return srcSet.avif;
    if (supportsWebp && srcSet?.webp) return srcSet.webp;
    return srcSet?.fallback;
  };

  // Build src based on format support
  const getSrc = () => {
    if (error) return src; // Fallback on error
    if (supportsAvif && avifSrc) return avifSrc;
    if (supportsWebp && webpSrc) return webpSrc;
    return src;
  };

  // Container style (prevents CLS with aspect ratio)
  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width ? 'auto' : '100%',
    aspectRatio: calculatedAspectRatio ? `${calculatedAspectRatio}` : undefined,
    backgroundColor: placeholderColor,
  };

  // Image style
  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: loaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  // Blur placeholder style
  const blurStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: placeholderColor,
    backgroundImage: loaded ? 'none' : `linear-gradient(90deg, ${placeholderColor} 25%, ${placeholderColor}dd 50%, ${placeholderColor} 25%)`,
    backgroundSize: '200% 100%',
    animation: loaded ? 'none' : 'skeleton-loading 1.5s ease-in-out infinite',
    filter: loaded ? 'blur(0px)' : 'blur(10px)',
    transition: 'filter 0.3s ease-in-out',
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Blur placeholder */}
      {blurPlaceholder && !loaded && (
        <div style={blurStyle} aria-hidden="true" />
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={inView ? getSrc() : undefined}
        srcSet={inView ? getSrcSet() : undefined}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? undefined : (lazy ? 'lazy' : undefined)}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={imageStyle}
        {...props}
      />

      {/* Inline keyframes for skeleton animation */}
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});

AdvancedImage.displayName = 'AdvancedImage';

/**
 * Helper component for responsive image sets
 * Generates multiple resolutions automatically
 */
export interface ResponsiveImageProps extends Omit<AdvancedImageProps, 'srcSet'> {
  baseSrc: string; // Base filename without extension, e.g., "/images/hero"
  extension?: string; // Fallback extension (default: "jpg")
  resolutions?: number[]; // Widths to generate, e.g., [400, 800, 1200, 1920]
}

export const ResponsiveImage = memo<ResponsiveImageProps>(({
  baseSrc,
  extension = 'jpg',
  resolutions = [400, 800, 1200, 1920],
  ...props
}) => {
  // Generate srcset for all resolutions
  const generateSrcSet = (ext: string) => {
    return resolutions
      .map(res => `${baseSrc}-${res}.${ext} ${res}w`)
      .join(', ');
  };

  const srcSet = {
    fallback: generateSrcSet(extension),
    webp: generateSrcSet('webp'),
    avif: generateSrcSet('avif'),
  };

  // Get fallback sources
  const maxResolution = Math.max(...resolutions);
  const src = `${baseSrc}-${maxResolution}.${extension}`;
  const webpSrc = `${baseSrc}-${maxResolution}.webp`;
  const avifSrc = `${baseSrc}-${maxResolution}.avif`;

  return (
    <AdvancedImage
      src={src}
      webpSrc={webpSrc}
      avifSrc={avifSrc}
      srcSet={srcSet}
      {...props}
    />
  );
});

ResponsiveImage.displayName = 'ResponsiveImage';

export default AdvancedImage;
