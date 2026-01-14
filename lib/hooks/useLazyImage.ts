import { useState, useRef, useEffect } from 'react';

/**
 * ✅ PERFORMANCE: Lazy Loading Hook for Images
 * Uses IntersectionObserver to load images only when visible
 * Reduces initial page load and saves bandwidth
 *
 * @example
 * const [imgRef, isLoaded, src] = useLazyImage('/path/to/image.jpg');
 * <img ref={imgRef} src={src} alt="..." loading="lazy" />
 */
export function useLazyImage(src: string, options?: IntersectionObserverInit): [React.RefObject<HTMLImageElement>, boolean, string | undefined] {
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
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
                ...options
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [src, options]);

    useEffect(() => {
        if (imageSrc && imgRef.current) {
            imgRef.current.onload = () => setIsLoaded(true);
        }
    }, [imageSrc]);

    return [imgRef, isLoaded, imageSrc];
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
