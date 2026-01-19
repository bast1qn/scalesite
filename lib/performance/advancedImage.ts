/**
 * Advanced Image Optimization System
 *
 * Implements modern image optimization techniques:
 * - Responsive images with srcset
 * - Modern formats (WebP, AVIF)
 * - Lazy loading with Intersection Observer
 * - Blur-up placeholders
 * - Progressive enhancement
 * - CLS prevention with aspect ratio preservation
 *
 * @performance
 * - Reduces image payload by 60-80% with WebP/AVIF
 * - Prevents CLS with aspect ratio reservation
 * - Improves LCP by prioritizing above-fold images
 */

export interface ImageSource {
  src: string;
  type: string;
  sizes?: string;
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  srcset?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'sync' | 'async' | 'auto';
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | 'color';
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Generate responsive srcset for images
 * Creates multiple sizes for different screen densities
 */
export function generateSrcset(
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string {
  // Check if URL already has query parameters
  const separator = baseUrl.includes('?') ? '&' : '?';

  return sizes
    .map((size) => {
      // For external images that support sizing (like Cloudinary, Imgix, etc.)
      // This is a template - adjust based on your image provider
      const sizedUrl = `${baseUrl}${separator}w=${size}`;
      return `${sizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Generate source tags for modern formats
 * Browsers will pick the best supported format
 */
export function generatePictureSources(
  imageBase: string,
  sizes: number[] = [640, 960, 1280, 1920]
): ImageSource[] {
  const sources: ImageSource[] = [
    {
      src: imageBase,
      type: 'image/avif',
      sizes: '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw',
    },
    {
      src: imageBase.replace(/\.\w+$/, '.webp'),
      type: 'image/webp',
      sizes: '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw',
    },
  ];

  return sources;
}

/**
 * Calculate aspect ratio for preventing CLS
 */
export function calculateAspectRatio(width: number, height: number): number {
  return height / width;
}

/**
 * Generate padding-bottom percentage for aspect ratio
 * This reserves space before the image loads
 */
export function generateAspectRatioStyle(
  width: number,
  height: number
): React.CSSProperties {
  const aspectRatio = calculateAspectRatio(width, height);
  return {
    aspectRatio: `${width} / ${height}`,
    // Fallback for browsers that don't support aspect-ratio
    paddingBottom: `${aspectRatio * 100}%`,
  };
}

/**
 * Generate low-quality blur placeholder
 * Creates a tiny base64 image for blur-up effect
 */
export async function generateBlurPlaceholder(
  src: string,
  quality: number = 10,
  width: number = 20
): Promise<string> {
  try {
    // This would typically be done server-side or at build time
    // For client-side, we use a canvas approach
    const response = await fetch(src);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = (bitmap.height / bitmap.width) * width;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return '';
    }

    // Draw scaled down
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // Apply blur
    ctx.filter = 'blur(5px)';
    ctx.drawImage(canvas, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
    return dataUrl;
  } catch (error) {
    console.warn('Failed to generate blur placeholder:', error);
    return '';
  }
}

/**
 * Generate color placeholder (average color)
 * Faster than blur, no visual detail
 */
export async function generateColorPlaceholder(
  src: string
): Promise<string> {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return 'transparent';
    }

    ctx.drawImage(bitmap, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

    return `rgb(${r}, ${g}, ${b})`;
  } catch (error) {
    return '#e5e7eb'; // Default gray
  }
}

/**
 * Check if browser supports modern image formats
 */
export function supportsFormat(format: 'avif' | 'webp'): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(false);
      return;
    }

    const dataUrl = canvas.toDataURL(`image/${format}`);
    resolve(dataUrl.indexOf(`data:image/${format}`) === 0);
  });
}

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private loadedImages = new WeakSet<HTMLImageElement>();

  constructor(options?: IntersectionObserverInit) {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        ...options,
      }
    );
  }

  observe(img: HTMLImageElement): void {
    if (this.loadedImages.has(img)) {
      return;
    }

    // Load immediately if data-src is missing
    const dataSrc = img.dataset.src;
    if (!dataSrc) {
      return;
    }

    this.observer?.observe(img);
  }

  private loadImage(img: HTMLImageElement): void {
    const dataSrc = img.dataset.src;
    const dataSrcset = img.dataset.srcset;

    if (dataSrc) {
      img.src = dataSrc;
    }
    if (dataSrcset) {
      img.srcset = dataSrcset;
    }

    img.onload = () => {
      img.classList.add('loaded');
      this.loadedImages.add(img);
    };

    img.onerror = () => {
      img.classList.add('error');
    };
  }

  disconnect(): void {
    this.observer?.disconnect();
  }
}

/**
 * Preload critical images
 * Use for above-fold images that should load immediately
 */
export function preloadImage(
  url: string,
  fetchPriority: 'high' | 'low' | 'auto' = 'auto'
): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;

  if (fetchPriority !== 'auto') {
    link.setAttribute('fetchpriority', fetchPriority);
  }

  document.head.appendChild(link);
}

/**
 * Responsive image component props generator
 */
export function generateResponsiveImageProps(
  baseUrl: string,
  alt: string,
  options: {
    widths?: number[];
    sizes?: string;
    priority?: boolean;
    aspectRatio?: { width: number; height: number };
  } = {}
): OptimizedImageProps {
  const { widths = [640, 960, 1280, 1920], sizes, priority = false, aspectRatio } = options;

  const props: OptimizedImageProps = {
    src: baseUrl,
    alt,
    loading: priority ? 'eager' : 'lazy',
    decoding: priority ? 'sync' : 'async',
    srcset: generateSrcset(baseUrl, widths),
    sizes,
  };

  if (aspectRatio) {
    props.style = generateAspectRatioStyle(aspectRatio.width, aspectRatio.height);
    props.width = aspectRatio.width;
    props.height = aspectRatio.height;
  }

  return props;
}

/**
 * Optimize hero/LCP image
 * Special handling for the largest contentful paint
 */
export function optimizeHeroImage(
  src: string,
  alt: string
): OptimizedImageProps {
  return {
    src,
    alt,
    loading: 'eager',
    decoding: 'sync',
    priority: true,
    sizes: '(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 1200px',
  };
}

/**
 * Get optimal image size based on container width
 */
export function getOptimalImageSize(
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number {
  const targetWidth = containerWidth * devicePixelRatio;

  // Round to nearest 100px for better caching
  return Math.ceil(targetWidth / 100) * 100;
}

/**
 * Create responsive sizes attribute
 * Based on common breakpoints
 */
export function generateSizes(
  breakpoints: Record<string, string> = {
    '640px': '100vw',
    '1280px': '50vw',
    '1920px': '33vw',
  }
): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
    .join(', ');
}
