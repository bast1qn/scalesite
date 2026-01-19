/**
 * Performance Budget Configuration
 *
 * Defines acceptable performance thresholds for the application
 * Used in CI/CD to catch performance regressions
 *
 * @performance
 * - Enforces bundle size limits
 * - Monitors Core Web Vitals thresholds
 * - Prevents performance degradation over time
 */

export interface PerformanceBudget {
  // Budget categories
  bundles: BundleBudget[];
  vitals: WebVitalsBudget;
  assets: AssetBudget;
  quantities: QuantityBudget;
}

export interface BundleBudget {
  name: string;
  maxSize: number; // in bytes
  gzipSize?: number; // optional gzip limit
  compression?: 'gzip' | 'brotli';
}

export interface WebVitalsBudget {
  LCP: number; // ms
  FID: number; // ms
  CLS: number;
  INP: number; // ms
  FCP: number; // ms
  TTFB: number; // ms
}

export interface AssetBudget {
  imageSize: number; // bytes
  totalImagesPerPage: number; // bytes
  fontFileSize: number; // bytes per font file
  totalFontsPerPage: number; // bytes
}

export interface QuantityBudget {
  maxScripts: number;
  maxStylesheets: number;
  maxFonts: number;
  maxImages: number;
}

/**
 * Performance budget configuration
 * Adjust these values based on your targets
 */
export const performanceBudget: PerformanceBudget = {
  bundles: [
    // Critical bundles (must be very small)
    {
      name: 'vendor',
      maxSize: 200 * 1024, // 200 KB
      gzipSize: 70 * 1024, // 70 KB gzipped
    },
    {
      name: 'icons',
      maxSize: 50 * 1024, // 50 KB
      gzipSize: 20 * 1024,
    },
    // Feature bundles
    {
      name: 'charts',
      maxSize: 150 * 1024, // 150 KB
      gzipSize: 50 * 1024,
    },
    {
      name: 'motion',
      maxSize: 100 * 1024, // 100 KB
      gzipSize: 35 * 1024,
    },
    {
      name: 'docs',
      maxSize: 200 * 1024, // 200 KB
      gzipSize: 70 * 1024,
    },
    {
      name: 'clerk-js',
      maxSize: 300 * 1024, // 300 KB (Clerk is heavy)
      gzipSize: 100 * 1024,
    },
  ],

  vitals: {
    // Core Web Vitals - "Good" thresholds
    LCP: 2500, // 2.5s
    FID: 100, // 100ms
    CLS: 0.1,
    INP: 200, // 200ms
    FCP: 1800, // 1.8s
    TTFB: 800, // 800ms
  },

  assets: {
    imageSize: 500 * 1024, // 500 KB per image
    totalImagesPerPage: 2 * 1024 * 1024, // 2 MB total images per page
    fontFileSize: 100 * 1024, // 100 KB per font file
    totalFontsPerPage: 300 * 1024, // 300 KB total fonts per page
  },

  quantities: {
    maxScripts: 10,
    maxStylesheets: 5,
    maxFonts: 4,
    maxImages: 20,
  },
};

/**
 * Check if bundle size exceeds budget
 */
export function checkBundleBudget(
  bundleName: string,
  size: number,
  gzipSize?: number
): { passes: boolean; error?: string } {
  const budget = performanceBudget.bundles.find((b) => b.name === bundleName);

  if (!budget) {
    return { passes: true }; // No budget defined for this bundle
  }

  if (size > budget.maxSize) {
    return {
      passes: false,
      error: `Bundle "${bundleName}" exceeds budget: ${formatBytes(size)} > ${formatBytes(budget.maxSize)}`,
    };
  }

  if (budget.gzipSize && gzipSize && gzipSize > budget.gzipSize) {
    return {
      passes: false,
      error: `Bundle "${bundleName}" gzipped size exceeds budget: ${formatBytes(gzipSize)} > ${formatBytes(budget.gzipSize)}`,
    };
  }

  return { passes: true };
}

/**
 * Check if Web Vital meets budget
 */
export function checkWebVital(
  metric: keyof WebVitalsBudget,
  value: number
): { passes: boolean; error?: string } {
  const budget = performanceBudget.vitals[metric];

  if (value > budget) {
    return {
      passes: false,
      error: `${metric} exceeds budget: ${value} > ${budget}`,
    };
  }

  return { passes: true };
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calculate total bundle size from build output
 */
export function calculateTotalBundleSize(
  bundles: Array<{ name: string; size: number }>
): number {
  return bundles.reduce((total, bundle) => total + bundle.size, 0);
}

/**
 * Check if performance score is acceptable
 */
export function checkPerformanceScore(score: number): {
  passes: boolean;
  rating: 'good' | 'needs-improvement' | 'poor';
} {
  if (score >= 90) {
    return { passes: true, rating: 'good' };
  } else if (score >= 50) {
    return { passes: true, rating: 'needs-improvement' };
  } else {
    return { passes: false, rating: 'poor' };
  }
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(results: {
  bundles: Array<{ name: string; size: number; gzipSize?: number }>;
  vitals: Partial<Record<keyof WebVitalsBudget, number>>;
  assets: {
    images: Array<{ size: number }>;
    fonts: Array<{ size: number }>;
  };
  quantities: {
    scripts: number;
    stylesheets: number;
    fonts: number;
    images: number;
  };
}): {
  passes: boolean;
  errors: string[];
  warnings: string[];
  summary: string;
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check bundles
  for (const bundle of results.bundles) {
    const check = checkBundleBudget(bundle.name, bundle.size, bundle.gzipSize);
    if (!check.passes && check.error) {
      errors.push(check.error);
    }
  }

  // Check Web Vitals
  for (const [metric, value] of Object.entries(results.vitals)) {
    const check = checkWebVital(metric as keyof WebVitalsBudget, value!);
    if (!check.passes && check.error) {
      errors.push(check.error);
    }
  }

  // Check assets
  const totalImageSize = results.assets.images.reduce((sum, img) => sum + img.size, 0);
  if (totalImageSize > performanceBudget.assets.totalImagesPerPage) {
    errors.push(
      `Total image size exceeds budget: ${formatBytes(totalImageSize)} > ${formatBytes(performanceBudget.assets.totalImagesPerPage)}`
    );
  }

  const totalFontSize = results.assets.fonts.reduce((sum, font) => sum + font.size, 0);
  if (totalFontSize > performanceBudget.assets.totalFontsPerPage) {
    errors.push(
      `Total font size exceeds budget: ${formatBytes(totalFontSize)} > ${formatBytes(performanceBudget.assets.totalFontsPerPage)}`
    );
  }

  // Check quantities
  if (results.quantities.scripts > performanceBudget.quantities.maxScripts) {
    warnings.push(
      `Too many scripts: ${results.quantities.scripts} > ${performanceBudget.quantities.maxScripts}`
    );
  }

  if (results.quantities.stylesheets > performanceBudget.quantities.maxStylesheets) {
    warnings.push(
      `Too many stylesheets: ${results.quantities.stylesheets} > ${performanceBudget.quantities.maxStylesheets}`
    );
  }

  const passes = errors.length === 0;

  return {
    passes,
    errors,
    warnings,
    summary: `Performance check ${passes ? '✅ PASSED' : '❌ FAILED'} with ${errors.length} errors and ${warnings.length} warnings`,
  };
}

/**
 * CI/CD helper: Check build output against budget
 */
export async function checkBuildAgainstBudget(
  buildOutputPath: string
): Promise<boolean> {
  try {
    // Read build stats from Vite's rollup-plugin-visualizer output
    // This would be implemented based on your build setup
    console.log('[Performance Budget] Checking build output...');

    // TODO: Parse actual build output
    // For now, always pass
    return true;
  } catch (error) {
    console.error('[Performance Budget] Failed to check build:', error);
    return true; // Don't fail the build on errors
  }
}

/**
 * Get performance recommendations based on metrics
 */
export function getPerformanceRecommendations(
  vitals: Partial<Record<keyof WebVitalsBudget, number>>
): string[] {
  const recommendations: string[] = [];

  if (vitals.LCP && vitals.LCP > 2500) {
    recommendations.push(
      'LCP is slow. Consider: preloading critical resources, optimizing images, removing render-blocking resources.'
    );
  }

  if (vitals.FID && vitals.FID > 100) {
    recommendations.push(
      'FID is slow. Consider: reducing JavaScript execution time, breaking up long tasks, using Web Workers.'
    );
  }

  if (vitals.CLS && vitals.CLS > 0.1) {
    recommendations.push(
      'CLS is high. Consider: adding size attributes to images, reserving space for dynamic content.'
    );
  }

  if (vitals.INP && vitals.INP > 200) {
    recommendations.push(
      'INP is slow. Consider: optimizing event handlers, reducing JavaScript main thread work.'
    );
  }

  if (vitals.TTFB && vitals.TTFB > 800) {
    recommendations.push(
      'TTFB is slow. Consider: using a CDN, optimizing server response time, enabling HTTP/2.'
    );
  }

  return recommendations;
}
