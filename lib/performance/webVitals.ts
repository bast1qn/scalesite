/**
 * CORE WEB VITALS MONITORING
 *
 * Measures and reports real-user performance metrics:
 * - LCP (Largest Contentful Paint): Loading performance
 * - FID (First Input Delay): Interactivity
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): First paint
 * - TTFB (Time to First Byte): Server response
 */

// ✅ FIXED: Added proper PerformanceEntry types to eliminate 'any'
interface LCPEntry extends PerformanceEntry {
  renderTime?: number;
  loadTime?: number;
}

interface FIDEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface CLSEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  startTime: number;
}

interface FCPEntry extends PerformanceEntry {
  startTime: number;
}

interface NavigationTimingEntry extends PerformanceEntry {
  responseStart: number;
  requestStart: number;
}

export interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface WebVitalsReport {
  lcp?: VitalMetric;
  fid?: VitalMetric;
  cls?: VitalMetric;
  fcp?: VitalMetric;
  ttfb?: VitalMetric;
  timestamp: number;
  url: string;
  userAgent: string;
}

// Rating thresholds based on Web Vitals recommendations
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },      // ms
  FID: { good: 100, poor: 300 },        // ms
  CLS: { good: 0.1, poor: 0.25 },       // score
  FCP: { good: 1800, poor: 3000 },      // ms
  TTFB: { good: 800, poor: 1800 },      // ms
};

function getRating(name: string, value: number): VitalMetric['rating'] {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
function measureLCP(): Promise<VitalMetric> {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve({ name: 'LCP', value: 0, rating: 'good', timestamp: Date.now() });
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // ✅ FIXED: Use proper LCPEntry type instead of 'any'
        const lastEntry = entries[entries.length - 1] as LCPEntry;
        const value = lastEntry.renderTime || lastEntry.loadTime || 0;

        observer.disconnect();

        resolve({
          name: 'LCP',
          value: Math.round(value),
          rating: getRating('LCP', value),
          timestamp: Date.now(),
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Fallback after 10 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve({ name: 'LCP', value: 0, rating: 'poor', timestamp: Date.now() });
      }, 10000);
    } catch (error) {
      resolve({ name: 'LCP', value: 0, rating: 'poor', timestamp: Date.now() });
    }
  });
}

/**
 * Measure First Input Delay (FID)
 */
function measureFID(): Promise<VitalMetric> {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve({ name: 'FID', value: 0, rating: 'good', timestamp: Date.now() });
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // ✅ FIXED: Use proper FIDEntry type instead of 'any'
        const firstEntry = entries[0] as FIDEntry;
        const value = firstEntry.processingStart - firstEntry.startTime;

        observer.disconnect();

        resolve({
          name: 'FID',
          value: Math.round(value),
          rating: getRating('FID', value),
          timestamp: Date.now(),
        });
      });

      observer.observe({ entryTypes: ['first-input'] });

      // Fallback after 10 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve({ name: 'FID', value: 0, rating: 'good', timestamp: Date.now() });
      }, 10000);
    } catch (error) {
      resolve({ name: 'FID', value: 0, rating: 'good', timestamp: Date.now() });
    }
  });
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
function measureCLS(): Promise<VitalMetric> {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve({ name: 'CLS', value: 0, rating: 'good', timestamp: Date.now() });
      return;
    }

    try {
      let clsValue = 0;
      let sessionValue = 0;
      // ✅ FIXED: Use proper CLSEntry type instead of 'any'
      let sessionEntries: CLSEntry[] = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as CLSEntry[]) {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            // If entries are too far apart, start a new session
            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime > 1000 &&
              (!firstSessionEntry || entry.startTime - firstSessionEntry.startTime > 5000)
            ) {
              sessionValue = 0;
              sessionEntries = [];
            }

            sessionValue += entry.value;
            sessionEntries.push(entry);

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
            }
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      // Report after 5 seconds of page load
      setTimeout(() => {
        observer.disconnect();
        resolve({
          name: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
          rating: getRating('CLS', clsValue),
          timestamp: Date.now(),
        });
      }, 5000);
    } catch (error) {
      resolve({ name: 'CLS', value: 0, rating: 'good', timestamp: Date.now() });
    }
  });
}

/**
 * Measure First Contentful Paint (FCP)
 */
function measureFCP(): Promise<VitalMetric> {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve({ name: 'FCP', value: 0, rating: 'good', timestamp: Date.now() });
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // ✅ FIXED: Use proper FCPEntry type instead of 'any'
        const firstEntry = entries[0] as FCPEntry;
        const value = firstEntry?.startTime || 0;

        observer.disconnect();

        resolve({
          name: 'FCP',
          value: Math.round(value),
          rating: getRating('FCP', value),
          timestamp: Date.now(),
        });
      });

      observer.observe({ entryTypes: ['paint'] });

      // Fallback after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve({ name: 'FCP', value: 0, rating: 'poor', timestamp: Date.now() });
      }, 5000);
    } catch (error) {
      resolve({ name: 'FCP', value: 0, rating: 'poor', timestamp: Date.now() });
    }
  });
}

/**
 * Measure Time to First Byte (TTFB)
 */
function measureTTFB(): VitalMetric {
  if (typeof window === 'undefined' || !window.performance) {
    return { name: 'TTFB', value: 0, rating: 'poor', timestamp: Date.now() };
  }

  // ✅ FIXED: Use proper NavigationTimingEntry type instead of 'any'
  const navigation = performance.getEntriesByType('navigation')[0] as NavigationTimingEntry | undefined;
  const value = navigation
    ? Math.round(navigation.responseStart - navigation.requestStart)
    : 0;

  return {
    name: 'TTFB',
    value,
    rating: getRating('TTFB', value),
    timestamp: Date.now(),
  };
}

/**
 * Initialize Core Web Vitals monitoring
 */
export async function initPerformanceMonitoring(): Promise<WebVitalsReport> {
  if (typeof window === 'undefined') {
    return {
      timestamp: Date.now(),
      url: '',
      userAgent: '',
    };
  }

  // Measure all vitals in parallel
  const [lcp, fid, cls, fcp] = await Promise.all([
    measureLCP(),
    measureFID(),
    measureCLS(),
    measureFCP(),
  ]);

  const ttfb = measureTTFB();

  const report: WebVitalsReport = {
    lcp: lcp.value > 0 ? lcp : undefined,
    fid: fid.value > 0 ? fid : undefined,
    cls: cls.value > 0 ? cls : undefined,
    fcp: fcp.value > 0 ? fcp : undefined,
    ttfb: ttfb.value > 0 ? ttfb : undefined,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.group('📊 Core Web Vitals');
    console.table({
      'Largest Contentful Paint (LCP)': `${lcp.value}ms [${lcp.rating}]`,
      'First Input Delay (FID)': `${fid.value}ms [${fid.rating}]`,
      'Cumulative Layout Shift (CLS)': `${cls.value} [${cls.rating}]`,
      'First Contentful Paint (FCP)': `${fcp.value}ms [${fcp.rating}]`,
      'Time to First Byte (TTFB)': `${ttfb.value}ms [${ttfb.rating}]`,
    });
    console.groupEnd();

    // Calculate overall score
    const metrics = [lcp, fid, cls, fcp, ttfb];
    const goodCount = metrics.filter(m => m.rating === 'good').length;
    const score = Math.round((goodCount / metrics.length) * 100);

    console.log(`📈 Performance Score: ${score}/100`);
  }

  // Send to analytics in production
  if (import.meta.env.PROD) {
    sendToAnalytics(report);
  }

  return report;
}

/**
 * Send vitals to analytics endpoint
 */
function sendToAnalytics(report: WebVitalsReport) {
  // Send to your analytics service
  // Example: Google Analytics, Vercel Analytics, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'core_web_vitals', {
      event_category: 'Performance',
      lcp: report.lcp?.value,
      fid: report.fid?.value,
      cls: report.cls?.value,
      fcp: report.fcp?.value,
      ttfb: report.ttfb?.value,
    });
  }
}

/**
 * Get performance score (0-100)
 */
export function getPerformanceScore(report: WebVitalsReport): number {
  const metrics = [report.lcp, report.fid, report.cls, report.fcp, report.ttfb].filter(Boolean);
  if (metrics.length === 0) return 0;

  const goodCount = metrics.filter(m => m!.rating === 'good').length;
  return Math.round((goodCount / metrics.length) * 100);
}

/**
 * Format metric for display
 */
export function formatMetric(metric: VitalMetric): string {
  if (metric.name === 'CLS') {
    return `${metric.value} [${metric.rating}]`;
  }
  return `${metric.value}ms [${metric.rating}]`;
}
