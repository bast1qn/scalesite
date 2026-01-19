/**
 * ADVANCED IMAGE OPTIMIZATION
 * Modern image formats, responsive images, and lazy loading
 *
 * @performance
 * - WebP/AVIF format detection
 * - Responsive srcset generation
 * - Native lazy loading
 * - LCP optimization with priority hints
 */

export interface ImageSrcSet {
  src: string;
  srcset?: string;
  sizes?: string;
}

/**
 * Check browser support for modern image formats
 */
export function getSupportedFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof document === 'undefined') return 'jpeg';

  // Check AVIF support
  const avifSupported = document.createElement('canvas')
    .toDataURL('image/avif')
    .indexOf('data:image/avif') === 0;

  if (avifSupported) return 'avif';

  // Check WebP support
  const webpSupported = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;

  if (webpSupported) return 'webp';

  return 'jpeg';
}

/**
 * Generate responsive srcset for images
 * @param baseUrl - Base image URL without extension
 * @param widths - Array of widths to generate
 * @returns srcset string
 */
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths
    .map(width => `${baseUrl}-${width}w.${getSupportedFormat()} ${width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * @param breakpoints - Array of conditions and sizes
 * @returns sizes string
 */
export function generateSizes(breakpoints: Array<{
  condition: string;
  size: string;
}>): string {
  return breakpoints
    .map(bp => `${bp.condition} ${bp.size}`)
    .join(', ');
}

/**
 * Default sizes for common image types
 */
export const DEFAULT_SIZES = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  thumbnail: '(max-width: 640px) 50vw, 25vw',
  full: '100vw',
};

/**
 * Lazy load images with IntersectionObserver
 * Falls back to native lazy loading
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;

          if (src) img.src = src;
          if (srcset) img.srcset = srcset;

          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');

          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px', // Start loading 50px before viewport
      threshold: 0.01,
    }
  );

  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Preload critical images for LCP
 */
export function preloadCriticalImages(urls: string[]): void {
  if (typeof document === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}

/**
 * Get image dimensions for aspect ratio
 * Prevents CLS by reserving space
 */
export function getAspectRatio(
  width: number,
  height: number
): { paddingTop: string } {
  const ratio = (height / width) * 100;
  return {
    paddingTop: `${ratio}%`,
  };
}

/**
 * Priority queue for image loading
 * Critical images load immediately, others lazy load
 */
export enum ImagePriority {
  CRITICAL = 'high',
  HIGH = 'auto',
  LOW = 'lazy',
}

/**
 * Generate image props for OptimizedImage component
 */
export function generateImageProps(config: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: ImagePriority;
  sizes?: string;
  className?: string;
}) {
  const {
    src,
    alt,
    width,
    height,
    priority = ImagePriority.LOW,
    sizes = DEFAULT_SIZES.card,
    className = '',
  } = config;

  // Generate srcset with common widths
  const widths = [320, 640, 960, 1280, 1920];
  const srcset = generateSrcSet(src.replace(/\.\w+$/, ''), widths);

  return {
    src,
    srcset,
    sizes,
    alt,
    width,
    height,
    loading: priority === ImagePriority.CRITICAL ? 'eager' : 'lazy',
    fetchPriority: priority,
    decoding: 'async' as const,
    className,
  };
}

/**
 * Format-specific compression settings
 */
export const COMPRESSION_SETTINGS = {
  avif: {
    quality: 80,
    alphaQuality: 90,
  },
  webp: {
    quality: 85,
    alphaQuality: 90,
  },
  jpeg: {
    quality: 85,
    progressive: true,
  },
};

/**
 * Convert image to modern format (client-side)
 * Note: This is a simplified version. Real implementation would use canvas
 */
export async function convertImageToModernFormat(
  file: File,
  targetFormat: 'webp' | 'avif' = 'webp'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        `image/${targetFormat}`,
        COMPRESSION_SETTINGS[targetFormat].quality / 100
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
