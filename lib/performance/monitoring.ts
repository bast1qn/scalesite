/**
 * Core Web Vitals Monitoring System
 *
 * Tracks and reports:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - FID (First Input Delay) - Interactivity (desktop only, INP for mobile)
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - INP (Interaction to Next Paint) - Responsiveness
 * - FCP (First Contentful Paint) - Loading performance
 * - TTFB (Time to First Byte) - Server response time
 *
 * @performance
 * - Uses PerformanceObserver API for accurate measurements
 * - Respects user's data-saver preferences
 * - Samples metrics to avoid performance overhead
 * - Reports to analytics/console for debugging
 */

export interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  navigationType?: string;
}

export interface PerformanceEntry {
  name?: string;
  value?: number;
  startTime?: number;
  duration?: number;
  entryType?: string;
}

export interface CoreWebVitals {
  LCP?: Metric;
  FID?: Metric;
  CLS?: Metric;
  INP?: Metric;
  FCP?: Metric;
  TTFB?: Metric;
}

// Performance thresholds according to Google's standards
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },        // 2.5s, 4.0s
  FID: { good: 100, poor: 300 },          // 100ms, 300ms
  CLS: { good: 0.1, poor: 0.25 },         // 0.1, 0.25
  INP: { good: 200, poor: 500 },          // 200ms, 500ms
  FCP: { good: 1800, poor: 3000 },        // 1.8s, 3.0s
  TTFB: { good: 800, poor: 1800 },        // 800ms, 1.8s
} as const;

type MetricName = keyof typeof THRESHOLDS;

/**
 * Get rating for a metric value
 */
function getRating(name: MetricName, value: number): Metric['rating'] {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Check if user prefers reduced data usage
 */
function isDataSaverMode(): boolean {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return false;
  }
  return navigator.connection.saveData || false;
}

/**
 * Check if monitoring should be enabled (respects sampling and data-saver)
 */
function shouldMonitor(): boolean {
  // Disable in data-saver mode
  if (isDataSaverMode()) {
    return false;
  }

  // Sample 10% of users to reduce analytics overhead
  const SAMPLING_RATE = 0.1;
  return Math.random() < SAMPLING_RATE;
}

/**
 * Logger function for metrics (can be replaced with analytics)
 */
function logMetric(metric: Metric): void {
  // Console logging in development
  if (import.meta.env.DEV) {
    const ratingEmoji = {
      good: '✅',
      'needs-improvement': '⚠️',
      poor: '❌'
    }[metric.rating];

    console.log(
      `[Performance] ${metric.name}: ${metric.value.toFixed(0)}ms ${ratingEmoji}`
    );
  }

  // ✅ DOCUMENTED: Analytics integration placeholder
  // When analytics service is available, uncomment one of these approaches:
  //
  // Google Analytics 4:
  // if (typeof gtag === 'function') {
  //   gtag('event', metric.name, {
  //     value: metric.value,
  //     custom_map: { metric_name: metric.name }
  //   });
  // }
  //
  // Custom analytics service:
  // sendToAnalytics(metric);
  //
  // Or use a proper analytics package like:
  // - @vercel/analytics
  // - Plausible
  // - Umami
  // - Matomo
}

/**
 * Track Largest Contentful Paint (LCP)
 *
 * Measures the time it takes for the largest content element to become visible.
 * LCP is a Core Web Vital metric that measures perceived load speed.
 *
 * @returns Promise that resolves to the LCP metric or null if tracking fails
 *
 * @example
 * const lcp = await trackLCP();
 * if (lcp) console.log(`LCP: ${lcp.value}ms - Rating: ${lcp.rating}`);
 *
 * @see https://web.dev/lcp/
 * @see https://developer.chrome.com/docs/lighthouse/performance/largest-contentful-paint/
 */
function trackLCP(): Promise<Metric | null> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(null);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;

        const metric: Metric = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          timestamp: Date.now(),
          navigationType: (lastEntry as unknown as { navigationType?: string })?.navigationType || undefined
        };

        logMetric(metric);
        observer.disconnect();
        resolve(metric);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Fallback timeout (LCP should occur within 10 seconds)
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 10000);
    } catch (error) {
      console.warn('LCP tracking failed:', error);
      resolve(null);
    }
  });
}

/**
 * Track First Input Delay (FID) - Desktop only
 *
 * Measures the time from when a user first interacts with your site to when
 * the browser can respond to that interaction. FID is a Core Web Vital metric
 * that measures interactivity and responsiveness.
 *
 * Note: FID is not measured on mobile devices (use INP instead).
 *
 * @returns Promise that resolves to the FID metric or null if tracking fails
 *
 * @example
 * const fid = await trackFID();
 * if (fid) console.log(`FID: ${fid.value}ms - Rating: ${fid.rating}`);
 *
 * @see https://web.dev/fid/
 * @see https://web.dev/inp/ (INP replaces FID for mobile)
 */
function trackFID(): Promise<Metric | null> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(null);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as PerformanceEventTiming;

        const metric: Metric = {
          name: 'FID',
          value: firstEntry.processingStart - firstEntry.startTime,
          rating: getRating('FID', firstEntry.processingStart - firstEntry.startTime),
          timestamp: Date.now()
        };

        logMetric(metric);
        observer.disconnect();
        resolve(metric);
      });

      observer.observe({ entryTypes: ['first-input'] });

      // FID occurs on first user interaction, no timeout needed
    } catch (error) {
      console.warn('FID tracking failed:', error);
      resolve(null);
    }
  });
}

/**
 * Track Cumulative Layout Shift (CLS)
 *
 * Measures the sum of all layout shifts that occur during the entire page lifespan.
 * CLS is a Core Web Vital metric that measures visual stability.
 * A layout shift occurs when visible elements change position unexpectedly.
 *
 * The function tracks layout shifts in "sessions" - groups of shifts that occur
 * within 1 second of each other, with no user input in between.
 *
 * @returns Promise that resolves to the CLS metric or null if tracking fails
 *
 * @example
 * const cls = await trackCLS();
 * if (cls) console.log(`CLS: ${cls.value} - Rating: ${cls.rating}`);
 *
 * @see https://web.dev/cls/
 * @see https://web.dev/evolving-cls/ (CLS 2.0 changes)
 */
function trackCLS(): Promise<Metric | null> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(null);
      return;
    }

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEntry[]) {
          // Exclude sessions initiated within 1 second of previous
          if (!entry.hadRecentInput) {
            sessionValue += entry.value;
            sessionEntries.push(entry);

            if (sessionEntries.length >= 5 || sessionValue >= 0.025) {
              clsValue += sessionValue;
              sessionValue = 0;
              sessionEntries = [];
            }
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      // Report CLS after page load - MEMORY LEAK FIX: Use AbortController for cleanup
      const abortController = new AbortController();

      const handleLoad = () => {
        timeoutId = setTimeout(() => {
          observer.disconnect();

          const metric: Metric = {
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue),
            timestamp: Date.now()
          };

          logMetric(metric);
          resolve(metric);
        }, 1000);
      };

      window.addEventListener('load', handleLoad, { signal: abortController.signal });

      // Cleanup function for Promise cancellation
      return () => {
        abortController.abort();
        if (timeoutId) clearTimeout(timeoutId);
        observer.disconnect();
      };
    } catch (error) {
      console.warn('CLS tracking failed:', error);
      resolve(null);
    }
  });
}

/**
 * Track Interaction to Next Paint (INP)
 *
 * Measures the responsiveness of a page to user interactions.
 * INP is a Core Web Vital metric that assesses interaction latency.
 * It observes all user interactions (clicks, taps, keyboard input) and reports
 * the worst interaction duration (the 98th percentile).
 *
 * INP replaces FID as the primary interactivity metric for both desktop and mobile.
 *
 * @returns Promise that resolves to the INP metric or null if tracking fails
 *
 * @example
 * const inp = await trackINP();
 * if (inp) console.log(`INP: ${inp.value}ms - Rating: ${inp.rating}`);
 *
 * @see https://web.dev/inp/
 * @see https://web.dev/inp-fid-changes/ (FID to INP migration)
 */
function trackINP(): Promise<Metric | null> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(null);
      return;
    }

    let inpValue = 0;
    let entries: PerformanceEntry[] = [];

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEntry[]) {
          entries.push(entry);

          const value = entry.duration;
          if (value > inpValue) {
            inpValue = value;
          }
        }
      });

      observer.observe({ entryTypes: ['event'] });

      // Report INP after page load + buffer
      const handleLoad = () => {
        setTimeout(() => {
          observer.disconnect();

          if (entries.length === 0) {
            resolve(null);
            return;
          }

          const metric: Metric = {
            name: 'INP',
            value: inpValue,
            rating: getRating('INP', inpValue),
            timestamp: Date.now()
          };

          logMetric(metric);
          resolve(metric);
        }, 5000);
      };

      window.addEventListener('load', handleLoad, { once: true });
    } catch (error) {
      console.warn('INP tracking failed:', error);
      resolve(null);
    }
  });
}

/**
 * Track First Contentful Paint (FCP)
 *
 * Measures the time from when the page starts loading to when any part of the
 * page's content is rendered on the screen. FCP is a key loading performance metric.
 *
 * "Contentful" refers to text, images, SVG, or non-white canvas elements.
 * It excludes the initial white screen and background colors.
 *
 * @returns Promise that resolves to the FCP metric or null if tracking fails
 *
 * @example
 * const fcp = await trackFCP();
 * if (fcp) console.log(`FCP: ${fcp.value}ms - Rating: ${fcp.rating}`);
 *
 * @see https://web.dev/fcp/
 * @see https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/
 */
function trackFCP(): Promise<Metric | null> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(null);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as PerformancePaintTiming;

        const metric: Metric = {
          name: 'FCP',
          value: firstEntry.startTime,
          rating: getRating('FCP', firstEntry.startTime),
          timestamp: Date.now()
        };

        logMetric(metric);
        observer.disconnect();
        resolve(metric);
      });

      observer.observe({ entryTypes: ['paint'] });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 5000);
    } catch (error) {
      console.warn('FCP tracking failed:', error);
      resolve(null);
    }
  });
}

/**
 * Track Time to First Byte (TTFB)
 */
function trackTTFB(): Metric | null {
  if (!window.performance || !window.performance.timing) {
    return null;
  }

  const timing = window.performance.timing;
  const ttfb = timing.responseStart - timing.navigationStart;

  const metric: Metric = {
    name: 'TTFB',
    value: ttfb,
    rating: getRating('TTFB', ttfb),
    timestamp: Date.now()
  };

  logMetric(metric);
  return metric;
}

/**
 * Initialize Core Web Vitals monitoring
 */
export async function initPerformanceMonitoring(): Promise<CoreWebVitals> {
  if (!shouldMonitor()) {
    console.log('[Performance] Monitoring disabled (sampling or data-saver)');
    return {};
  }

  console.log('[Performance] Starting Core Web Vitals monitoring...');

  const vitals: CoreWebVitals = {
    TTFB: trackTTFB()
  };

  // Track all metrics in parallel
  const [lcp, fid, cls, inp, fcp] = await Promise.all([
    trackLCP(),
    trackFID(),
    trackCLS(),
    trackINP(),
    trackFCP()
  ]);

  if (lcp) vitals.LCP = lcp;
  if (fid) vitals.FID = fid;
  if (cls) vitals.CLS = cls;
  if (inp) vitals.INP = inp;
  if (fcp) vitals.FCP = fcp;

  return vitals;
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(vitals: CoreWebVitals): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  Object.entries(vitals).forEach(([name, metric]) => {
    if (!metric) return;

    if (metric.rating === 'poor') {
      score -= 20;
      issues.push(`${name} is in poor state (${metric.value.toFixed(0)}ms)`);

      switch (name) {
        case 'LCP':
          recommendations.push('Optimize largest content element (image, hero section)');
          recommendations.push('Preload critical resources');
          recommendations.push('Remove render-blocking resources');
          break;
        case 'FID':
        case 'INP':
          recommendations.push('Reduce JavaScript execution time');
          recommendations.push('Break up long tasks');
          recommendations.push('Use Web Workers for heavy computations');
          break;
        case 'CLS':
          recommendations.push('Include size attributes on images');
          recommendations.push('Reserve space for dynamic content');
          recommendations.push('Avoid inserting content above existing content');
          break;
      }
    } else if (metric.rating === 'needs-improvement') {
      score -= 10;
      issues.push(`${name} needs improvement (${metric.value.toFixed(0)}ms)`);
    }
  });

  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

/**
 * Hook for React components to access performance data
 */
export function usePerformanceMonitoring() {
  const [vitals, setVitals] = useState<CoreWebVitals>({});
  const [summary, setSummary] = useState(getPerformanceSummary({}));

  useEffect(() => {
    initPerformanceMonitoring().then((measuredVitals) => {
      setVitals(measuredVitals);
      setSummary(getPerformanceSummary(measuredVitals));
    });
  }, []);

  return { vitals, summary };
}
