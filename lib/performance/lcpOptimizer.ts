/**
 * LARGEST CONTENTFUL PAINT (LCP) OPTIMIZATION
 * Reduces LCP by prioritizing above-the-fold content
 *
 * @performance
 * - Target LCP: < 2.5s (good), < 4s (needs improvement)
 * - Preload critical resources
 * - Prioritize critical images
 * - Remove render-blocking resources
 */

/**
 * Get LCP candidate element (largest element in viewport)
 */
export function getLCPCandidate(): Element | null {
  if (typeof document === 'undefined') return null;

  // Elements that are commonly LCP candidates
  const candidates = document.querySelectorAll(
    'img, video, svg, canvas, [role="img"], background-image'
  );

  let largestElement: Element | null = null;
  let largestSize = 0;

  candidates.forEach(element => {
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight;

    if (isInViewport) {
      const size = rect.width * rect.height;
      if (size > largestSize) {
        largestSize = size;
        largestElement = element;
      }
    }
  });

  return largestElement;
}

/**
 * Preload critical CSS for above-the-fold content
 */
export function preloadCriticalCSS(): void {
  if (typeof document === 'undefined') return;

  // Add preload hints for critical styles
  const criticalStyles = [
    '/index.css',
  ];

  criticalStyles.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.prepend(link);
  });
}

/**
 * Preconnect to critical origins
 */
export function setupPreconnectOrigins(): void {
  if (typeof document === 'undefined') return;

  const origins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://*.clerk.accounts.dev',
  ];

  origins.forEach(origin => {
    // DNS prefetch
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = origin;
    document.head.appendChild(dnsPrefetch);

    // Preconnect
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = origin;
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  });
}

/**
 * Mark LCP image with fetch priority
 */
export function prioritizeLCPImage(): void {
  if (typeof document === 'undefined') return;

  // Find potential LCP images (hero images, large banners)
  const lcpSelectors = [
    '[data-lcp="true"]',
    'img[alt*="hero"]',
    'img[alt*="banner"]',
    'picture > img:first-of-type',
    'header img',
    'section:first-of-type img',
  ];

  for (const selector of lcpSelectors) {
    const image = document.querySelector(selector) as HTMLImageElement;
    if (image) {
      image.fetchPriority = 'high';
      image.loading = 'eager'; // Override lazy loading

      // Add preload hint
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'image';
      preload.href = image.currentSrc || image.src;
      preload.fetchPriority = 'high';
      document.head.appendChild(preload);

      break; // Only prioritize first LCP candidate
    }
  }
}

/**
 * Remove render-blocking resources
 */
export function removeRenderBlocking(): void {
  if (typeof document === 'undefined') return;

  // Add async/defer to blocking scripts
  const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');

  scripts.forEach(script => {
    // Skip critical scripts
    if (script.textContent?.includes('react') || script.textContent?.includes('app')) {
      return;
    }

    script.setAttribute('defer', '');
  });
}

/**
 * Optimize font loading for LCP
 */
export function optimizeFontLoading(): void {
  if (typeof document === 'undefined') return;

  // Use font-display: swap for all fonts
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
    @font-face {
      font-family: 'Plus Jakarta Sans';
      font-display: swap;
    }
    @font-face {
      font-family: 'Outfit';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);

  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
  ];

  criticalFonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Reserve space for LCP element to prevent CLS
 */
export function reserveLCPSpace(): void {
  if (typeof document === 'undefined') return;

  // Find LCP candidate
  const lcpCandidate = getLCPCandidate();
  if (!lcpCandidate) return;

  // Ensure image has explicit dimensions
  if (lcpCandidate instanceof HTMLImageElement) {
    const img = lcpCandidate;

    // If dimensions are not set, use natural dimensions
    if (!img.width && img.naturalWidth) {
      img.style.width = `${img.naturalWidth}px`;
      img.style.height = `${img.naturalHeight}px`;
    }

    // Set aspect-ratio to prevent layout shift
    if (img.naturalWidth && img.naturalHeight) {
      img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    }
  }
}

/**
 * Defer offscreen images
 */
export function deferOffscreenImages(): void {
  if (typeof document === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const images = document.querySelectorAll('img[loading="lazy"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;

          // Load image if data-src is present
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }

          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
    }
  );

  images.forEach(img => observer.observe(img));
}

/**
 * Initialize LCP optimization
 */
export function initLCPOptimization(): void {
  if (typeof document === 'undefined') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupPreconnectOrigins();
      prioritizeLCPImage();
      optimizeFontLoading();
      reserveLCPSpace();
      removeRenderBlocking();
      preloadCriticalCSS();
    });
  } else {
    setupPreconnectOrigins();
    prioritizeLCPImage();
    optimizeFontLoading();
    reserveLCPSpace();
    removeRenderBlocking();
    preloadCriticalCSS();
  }

  // Defer offscreen images after initial load
  window.addEventListener('load', deferOffscreenImages);
}

/**
 * Measure actual LCP
 */
export function measureLCP(): Promise<number> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(0);
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // ✅ FIXED: Use proper PerformanceEntry type instead of 'any'
      const lastEntry = entries[entries.length - 1] as PerformanceEntry | undefined;
      resolve(lastEntry?.startTime ?? 0);
      observer.disconnect();
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // Fallback timeout
    setTimeout(() => {
      resolve(0);
      observer.disconnect();
    }, 10000);
  });
}

/**
 * HOOK: Use LCP optimization in React
 */
export function useLCPOptimization(): void {
  useEffect(() => {
    initLCPOptimization();

    // Measure LCP in development
    if (import.meta.env.DEV) {
      measureLCP().then(lcp => {
        if (lcp > 0) {
          console.log(`[Perf] LCP: ${lcp.toFixed(0)}ms`);

          if (lcp > 4000) {
            console.warn('[Perf] LCP is poor (> 4s). Consider optimizing.');
          } else if (lcp > 2500) {
            console.warn('[Perf] LCP needs improvement (> 2.5s)');
          } else {
            console.log('[Perf] LCP is good (< 2.5s)');
          }
        }
      });
    }
  }, []);
}

/**
 * LCP optimization checklist for manual review
 */
export const LCP_OPTIMIZATION_CHECKLIST = {
  preconnectOrigins: '✅ DNS prefetch and preconnect configured',
  preloadCriticalCSS: '✅ Critical CSS preloaded',
  prioritizeHeroImage: '✅ Hero image marked with fetchpriority="high"',
  reserveSpace: '✅ Explicit dimensions on images to prevent CLS',
  fontDisplaySwap: '✅ font-display: swap enabled',
  deferNonCritical: '✅ Non-critical JS deferred',
  compressAssets: '✅ Gzip/Brotli compression enabled',
  CDN: '⚠️ Consider CDN for static assets',
  imageFormats: '⚠️ Consider WebP/AVIF with fallback',
  criticalCSSInline: '⚠️ Consider inlining critical CSS',
} as const;
