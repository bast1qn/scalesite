/**
 * Performance Dashboard Component
 *
 * PERFORMANCE: Visualizes Core Web Vitals and performance metrics
 * - Real-time CWV monitoring (LCP, FID, CLS, INP)
 * - Performance score calculation
 * - Optimization recommendations
 * - Historical data tracking
 *
 * @performance
 * - Helps identify performance bottlenecks
 * - Tracks optimization progress
 * - Provides actionable insights
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePerformanceMonitoring, getPerformanceSummary, type CoreWebVitals } from '../../lib/performance/monitoring';

export function PerformanceDashboard() {
  const { vitals, summary } = usePerformanceMonitoring();
  const [showDetails, setShowDetails] = useState(false);

  // ✅ PERFORMANCE: Memoize metric calculations
  const metrics = useMemo(() => {
    return Object.entries(vitals).map(([name, metric]) => ({
      name,
      value: metric?.value || 0,
      rating: metric?.rating || 'good',
    }));
  }, [vitals]);

  // ✅ PERFORMANCE: Memoize score calculation
  const score = useMemo(() => {
    return summary.score;
  }, [summary.score]);

  // ✅ PERFORMANCE: Memoize rating color
  const getRatingColor = useCallback((rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'needs-improvement':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  }, []);

  // ✅ PERFORMANCE: Memoize score color
  const scoreColor = useMemo(() => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }, [score]);

  // ✅ PERFORMANCE: Memoize metric icon
  const getMetricIcon = useCallback((name: string) => {
    switch (name) {
      case 'LCP':
        return '⚡'; // Largest Contentful Paint
      case 'FID':
        return '👆'; // First Input Delay
      case 'CLS':
        return '📐'; // Cumulative Layout Shift
      case 'INP':
        return '🎯'; // Interaction to Next Paint
      case 'FCP':
        return '🎨'; // First Contentful Paint
      case 'TTFB':
        return '⏱️'; // Time to First Byte
      default:
        return '📊';
    }
  }, []);

  if (Object.keys(vitals).length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Performance data loading...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Performance Score
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className={`text-6xl font-bold ${scoreColor}`}>
            {score}
          </div>
        </div>

        {score < 80 && summary.issues.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
              Issues Detected:
            </h4>
            <ul className="space-y-1">
              {summary.issues.slice(0, 3).map((issue, index) => (
                <li key={index} className="text-xs text-red-700 dark:text-red-300">
                  • {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Metrics */}
      {showDetails && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Core Web Vitals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMetricIcon(metric.name)}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {metric.name}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${getRatingColor(metric.rating)}`}>
                    {metric.rating}
                  </span>
                </div>

                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {metric.name === 'CLS'
                    ? metric.value.toFixed(3)
                    : `${Math.round(metric.value)}ms`
                  }
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      metric.rating === 'good'
                        ? 'bg-green-500'
                        : metric.rating === 'needs-improvement'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (metric.value / getThreshold(metric.name)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {summary.recommendations.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Recommendations:
              </h4>
              <ul className="space-y-1">
                {summary.recommendations.slice(0, 5).map((rec, index) => (
                  <li key={index} className="text-xs text-blue-700 dark:text-blue-300">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Get threshold value for metric
 */
function getThreshold(name: string): number {
  const thresholds: Record<string, number> = {
    LCP: 4000, // 4s = poor
    FID: 300, // 300ms = poor
    CLS: 0.25, // 0.25 = poor
    INP: 500, // 500ms = poor
    FCP: 3000, // 3s = poor
    TTFB: 1800, // 1.8s = poor
  };

  return thresholds[name] || 100;
}

/**
 * Compact Performance Badge Component
 */
export function PerformanceBadge() {
  const { summary } = usePerformanceMonitoring();

  const score = summary.score;
  const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
        bg-${color}-100 dark:bg-${color}-900/20
        text-${color}-700 dark:text-${color}-300
      `}
    >
      <span className="text-lg">⚡</span>
      <span>Score: {score}</span>
    </div>
  );
}

/**
 * Real-time Performance Monitor (Dev Only)
 */
export function DevPerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(0);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // FPS counter
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFps = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFps);
    };

    const rafId = requestAnimationFrame(measureFps);

    // Memory monitor
    if ('memory' in performance) {
      const memInterval = setInterval(() => {
        const mem = (performance as any).memory;
        setMemory(Math.round(mem.usedJSHeapSize / 1048576)); // Convert to MB
      }, 1000);

      return () => {
        cancelAnimationFrame(rafId);
        clearInterval(memInterval);
      };
    }

    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-2 rounded-lg text-xs font-mono">
      <div>FPS: {fps}</div>
      {memory > 0 && <div>Memory: {memory}MB</div>}
    </div>
  );
}
