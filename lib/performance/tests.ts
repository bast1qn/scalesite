/**
 * Performance Test Suite
 *
 * Automated tests for performance budgets and optimizations
 * Run in CI/CD or locally for performance monitoring
 *
 * @performance
 * - Catches performance regressions early
 * - Ensures budgets are maintained
 * - Provides actionable feedback
 */

import { performanceBudget, checkBundleBudget, checkWebVital, formatBytes } from './budget';

export interface PerformanceTestResult {
  name: string;
  passes: boolean;
  score: number;
  metrics: Record<string, number>;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface BundleSize {
  name: string;
  size: number;
  gzipSize?: number;
}

/**
 * Test bundle sizes against budget
 */
export function testBundleSizes(bundles: BundleSize[]): PerformanceTestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const metrics: Record<string, number> = {};

  let totalSize = 0;
  let totalGzipSize = 0;

  for (const bundle of bundles) {
    const check = checkBundleBudget(bundle.name, bundle.size, bundle.gzipSize);

    if (!check.passes && check.error) {
      errors.push(check.error);
    }

    totalSize += bundle.size;
    if (bundle.gzipSize) {
      totalGzipSize += bundle.gzipSize;
    }

    metrics[`${bundle.name}_size`] = bundle.size;
    if (bundle.gzipSize) {
      metrics[`${bundle.name}_gzip`] = bundle.gzipSize;
    }
  }

  metrics.total_size = totalSize;
  metrics.total_gzip = totalGzipSize;

  // Check if total size is acceptable
  const MAX_TOTAL_SIZE = 1024 * 1024; // 1 MB
  const MAX_TOTAL_GZIP = 300 * 1024; // 300 KB

  if (totalSize > MAX_TOTAL_SIZE) {
    errors.push(`Total bundle size exceeds limit: ${formatBytes(totalSize)} > ${formatBytes(MAX_TOTAL_SIZE)}`);
  }

  if (totalGzipSize > MAX_TOTAL_GZIP) {
    warnings.push(`Total gzipped size is large: ${formatBytes(totalGzipSize)} (recommended: ${formatBytes(MAX_TOTAL_GZIP)})`);
  }

  const score = Math.max(0, 100 - errors.length * 20 - warnings.length * 10);

  return {
    name: 'Bundle Size Test',
    passes: errors.length === 0,
    score,
    metrics,
    errors,
    warnings,
    recommendations: getRecommendations(errors, warnings),
  };
}

/**
 * Test Core Web Vitals against budget
 */
export function testWebVitals(
  vitals: Partial<Record<keyof typeof performanceBudget.vitals, number>>
): PerformanceTestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const metrics: Record<string, number> = {};

  for (const [metric, value] of Object.entries(vitals)) {
    const check = checkWebVital(metric as keyof typeof performanceBudget.vitals, value!);
    metrics[metric] = value!;

    if (!check.passes && check.error) {
      errors.push(check.error);
    }
  }

  const score = calculateVitalsScore(vitals);

  return {
    name: 'Core Web Vitals Test',
    passes: errors.length === 0,
    score,
    metrics,
    errors,
    warnings,
    recommendations: getVitalsRecommendations(vitals),
  };
}

/**
 * Test asset optimization
 */
export function testAssetOptimization(assets: {
  images: Array<{ size: number; format: string; hasWebP: boolean }>;
  fonts: Array<{ size: number }>;
}): PerformanceTestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const metrics: Record<string, number> = {};

  // Check image sizes
  let totalImageSize = 0;
  let imagesWithoutWebP = 0;

  for (const image of assets.images) {
    totalImageSize += image.size;

    if (!image.hasWebP && image.format !== 'svg') {
      imagesWithoutWebP++;
    }
  }

  metrics.total_image_size = totalImageSize;
  metrics.images_count = assets.images.length;
  metrics.images_without_webp = imagesWithoutWebP;

  if (totalImageSize > performanceBudget.assets.totalImagesPerPage) {
    errors.push(
      `Total image size exceeds budget: ${formatBytes(totalImageSize)} > ${formatBytes(performanceBudget.assets.totalImagesPerPage)}`
    );
  }

  if (imagesWithoutWebP > 0) {
    warnings.push(
      `${imagesWithoutWebP} images don't have WebP versions. Converting to WebP can reduce size by 30%.`
    );
  }

  // Check font sizes
  let totalFontSize = 0;
  for (const font of assets.fonts) {
    totalFontSize += font.size;
  }

  metrics.total_font_size = totalFontSize;

  if (totalFontSize > performanceBudget.assets.totalFontsPerPage) {
    errors.push(
      `Total font size exceeds budget: ${formatBytes(totalFontSize)} > ${formatBytes(performanceBudget.assets.totalFontsPerPage)}`
    );
  }

  const score = Math.max(0, 100 - errors.length * 20 - warnings.length * 10);

  return {
    name: 'Asset Optimization Test',
    passes: errors.length === 0,
    score,
    metrics,
    errors,
    warnings,
    recommendations: getAssetRecommendations(errors, warnings),
  };
}

/**
 * Test code splitting quality
 */
export function testCodeSplitting(metrics: {
  totalChunks: number;
  averageChunkSize: number;
  largestChunkSize: number;
  initialLoadChunks: number;
}): PerformanceTestResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if code is split properly
  if (metrics.totalChunks < 5) {
    warnings.push('Consider splitting into more chunks for better caching.');
  }

  // Check average chunk size
  const MAX_AVG_CHUNK_SIZE = 100 * 1024; // 100 KB
  if (metrics.averageChunkSize > MAX_AVG_CHUNK_SIZE) {
    errors.push(
      `Average chunk size is too large: ${formatBytes(metrics.averageChunkSize)} > ${formatBytes(MAX_AVG_CHUNK_SIZE)}`
    );
  }

  // Check largest chunk
  const MAX_CHUNK_SIZE = 300 * 1024; // 300 KB
  if (metrics.largestChunkSize > MAX_CHUNK_SIZE) {
    errors.push(
      `Largest chunk exceeds recommended size: ${formatBytes(metrics.largestChunkSize)} > ${formatBytes(MAX_CHUNK_SIZE)}`
    );
  }

  // Check initial load
  const MAX_INITIAL_CHUNKS = 5;
  if (metrics.initialLoadChunks > MAX_INITIAL_CHUNKS) {
    warnings.push(
      `Initial load has ${metrics.initialLoadChunks} chunks. Consider lazy loading more.`
    );
  }

  const score = Math.max(0, 100 - errors.length * 20 - warnings.length * 10);

  return {
    name: 'Code Splitting Test',
    passes: errors.length === 0,
    score,
    metrics,
    errors,
    warnings,
    recommendations: getCodeSplittingRecommendations(errors, warnings),
  };
}

/**
 * Run all performance tests
 */
export async function runAllPerformanceTests(): Promise<{
  results: PerformanceTestResult[];
  overallScore: number;
  passes: boolean;
}> {
  const results: PerformanceTestResult[] = [];

  // Note: These tests would need actual data from your build
  // This is a template for the test suite

  // Example: Test bundle sizes
  // const bundleResult = testBundleSizes(bundlesFromBuild);
  // results.push(bundleResult);

  // Example: Test Web Vitals
  // const vitalsResult = testWebVitals(measuredVitals);
  // results.push(vitalsResult);

  const overallScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length
      : 100;

  const passes = results.every((r) => r.passes);

  return {
    results,
    overallScore,
    passes,
  };
}

/**
 * Calculate Web Vitals score
 */
function calculateVitalsScore(
  vitals: Partial<Record<keyof typeof performanceBudget.vitals, number>>
): number {
  let score = 100;
  let metricCount = 0;

  for (const [metric, value] of Object.entries(vitals)) {
    const budget = performanceBudget.vitals[metric as keyof typeof performanceBudget.vitals];
    metricCount++;

    // Calculate score based on how far over/under budget we are
    const ratio = value / budget;
    if (ratio <= 0.5) {
      // Excellent: well under budget
      score += 10;
    } else if (ratio <= 1) {
      // Good: within budget
      score += 5;
    } else if (ratio <= 1.5) {
      // Warning: slightly over budget
      score -= 10;
    } else {
      // Poor: significantly over budget
      score -= 20;
    }
  }

  return Math.max(0, Math.min(100, score / metricCount));
}

/**
 * Get recommendations based on errors and warnings
 */
function getRecommendations(errors: string[], warnings: string[]): string[] {
  const recommendations: string[] = [];

  if (errors.some((e) => e.includes('exceeds budget'))) {
    recommendations.push('Analyze bundle using `npm run build:analyze` to find large modules.');
    recommendations.push('Consider lazy loading heavy dependencies.');
    recommendations.push('Remove unused dependencies.');
  }

  if (warnings.some((w) => w.includes('gzipped size'))) {
    recommendations.push('Enable Brotli compression for better compression ratios.');
  }

  return recommendations;
}

/**
 * Get Web Vitals recommendations
 */
function getVitalsRecommendations(
  vitals: Partial<Record<keyof typeof performanceBudget.vitals, number>>
): string[] {
  const recommendations: string[] = [];

  if (vitals.LCP && vitals.LCP > 2500) {
    recommendations.push('Optimize LCP: Preload critical images, reduce render-blocking resources.');
  }

  if (vitals.FID && vitals.FID > 100) {
    recommendations.push('Optimize FID: Reduce JavaScript execution time, break up long tasks.');
  }

  if (vitals.CLS && vitals.CLS > 0.1) {
    recommendations.push('Optimize CLS: Add size attributes to images, reserve space for dynamic content.');
  }

  if (vitals.INP && vitals.INP > 200) {
    recommendations.push('Optimize INP: Minimize JavaScript work, optimize event handlers.');
  }

  return recommendations;
}

/**
 * Get asset optimization recommendations
 */
function getAssetRecommendations(errors: string[], warnings: string[]): string[] {
  const recommendations: string[] = [];

  if (warnings.some((w) => w.includes('WebP'))) {
    recommendations.push('Convert images to WebP using build tools like imagemin or sharp.');
  }

  if (errors.some((e) => e.includes('image size'))) {
    recommendations.push('Compress images using modern formats (WebP, AVIF).');
    recommendations.push('Implement responsive images with srcset for different screen sizes.');
    recommendations.push('Lazy load below-fold images.');
  }

  if (errors.some((e) => e.includes('font size'))) {
    recommendations.push('Subset fonts to include only used characters.');
    recommendations.push('Consider using system fonts as fallback.');
    recommendations.push('Use WOFF2 format for best compression.');
  }

  return recommendations;
}

/**
 * Get code splitting recommendations
 */
function getCodeSplittingRecommendations(errors: string[], warnings: string[]): string[] {
  const recommendations: string[] = [];

  if (errors.some((e) => e.includes('chunk size'))) {
    recommendations.push('Split large chunks into smaller, focused modules.');
    recommendations.push('Use dynamic imports for route-based code splitting.');
  }

  if (warnings.some((w) => w.includes('Initial load'))) {
    recommendations.push('Move non-critical code to lazy-loaded chunks.');
    recommendations.push('Defer loading of analytics and third-party scripts.');
  }

  if (warnings.some((w) => w.includes('more chunks'))) {
    recommendations.push('Split vendor bundles by frequency of updates.');
    recommendations.push('Separate rarely used features into their own chunks.');
  }

  return recommendations;
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(results: PerformanceTestResult[]): string {
  let report = '\n📊 Performance Test Report\n';
  report += '═'.repeat(50) + '\n\n';

  for (const result of results) {
    const status = result.passes ? '✅ PASS' : '❌ FAIL';
    const score = `Score: ${result.score.toFixed(0)}/100`;

    report += `${status} ${result.name} (${score})\n`;

    if (result.errors.length > 0) {
      report += '\n  Errors:\n';
      for (const error of result.errors) {
        report += `    ❌ ${error}\n`;
      }
    }

    if (result.warnings.length > 0) {
      report += '\n  Warnings:\n';
      for (const warning of result.warnings) {
        report += `    ⚠️  ${warning}\n`;
      }
    }

    if (result.recommendations.length > 0) {
      report += '\n  Recommendations:\n';
      for (const rec of result.recommendations) {
        report += `    💡 ${rec}\n`;
      }
    }

    report += '\n' + '─'.repeat(50) + '\n\n';
  }

  const overallScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  report += `📈 Overall Score: ${overallScore.toFixed(0)}/100\n`;

  const allPass = results.every((r) => r.passes);
  report += allPass ? '✅ All tests passed!\n' : '❌ Some tests failed.\n';

  return report;
}
