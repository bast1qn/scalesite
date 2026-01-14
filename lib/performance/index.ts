/**
 * Performance Optimization Library
 *
 * Comprehensive collection of performance utilities for ScaleSite
 *
 * @module lib/performance
 */

// Core Web Vitals Monitoring
export {
  initPerformanceMonitoring,
  getPerformanceSummary,
  usePerformanceMonitoring,
  type Metric,
  type CoreWebVitals
} from './monitoring';

// Virtual Scrolling
export {
  VirtualList,
  VirtualGrid,
  useVirtualScroll,
  type VirtualListProps,
  type VirtualGridProps
} from './virtualScroll';

// Web Workers
export {
  useWebWorker,
  createPDFWorker,
  usePDFWorker,
  createChartWorker,
  useChartWorker
} from './webWorker';

// Context Optimization
export {
  createOptimizedContext,
  createSplitContext,
  useContextSelector,
  createOptimizedStore,
  createAtom
} from './contextOptimization';

// Progressive Image Loading
export {
  ProgressiveImage,
  ResponsiveImage,
  useBlurPlaceholder,
  useCriticalImages,
  AspectRatioContainer,
  type ProgressiveImageProps,
  type ResponsiveImageProps
} from './imageOptimization';

// Idle Task Scheduling
export {
  scheduleIdleTask,
  addIdleTask,
  useIdleCallback,
  useIdleEffect,
  lazyLoadResources,
  setupDeferredAnalytics,
  useProgressiveHydration,
  useIdleStateUpdate,
  measureTaskPerformance,
  processInChunks
} from './idleTasks';

// Performance Hooks
export {
  useRenderCount,
  usePrefersReducedMotion,
  useNetworkStatus,
  useDeferredRender,
  useLazyInit,
  useRenderTime,
  useInViewport,
  useViewportLoad,
  useEventListener,
  useLocalStorage,
  usePrevious,
  useConditionalHook,
  useRAFLoop,
  useIsMobile,
  useThrottledValue,
  useComponentLifecycle,
  useDeepMemo
} from './hooks';
