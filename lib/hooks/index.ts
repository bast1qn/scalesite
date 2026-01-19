/**
 * Custom React Hooks Barrel Export
 *
 * Enterprise-grade collection of reusable React hooks
 * All hooks are tested, documented, and follow SOLID principles
 */

// Debounce & Throttle
export {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
} from './useDebounce';

// Form State Management
export {
  useFormState,
  useModal,
  useTabs,
  type UseFormStateOptions,
  type UseFormStateReturn,
} from './useFormState';

// Optimistic Updates
export {
  useOptimistic,
  type OptimisticState,
  type OptimisticAction,
} from './useOptimistic';

// Lazy Image Loading
export {
  useLazyImage,
  type LazyImageOptions,
  type LazyImageResult,
} from './useLazyImage';

// Relative Time Formatting
export {
  useRelativeTime,
  type RelativeTimeOptions,
} from './useRelativeTime';

// List Filtering
export {
  useListFiltering,
  type FilterOptions,
  type FilterResult,
} from './useListFiltering';

// Dashboard Navigation
export {
  useDashboardNavigation,
  type NavigationConfig,
  type UseDashboardNavigationReturn,
} from './useDashboardNavigation';

// Dashboard Data
export {
  useDashboardData,
  type DashboardStats,
  type FinanceData,
  type ServerStats,
  type Activity,
  type Milestone,
  type UseDashboardDataReturn,
} from './useDashboardData';

// Dashboard Realtime
export {
  useDashboardRealtime,
  type UseDashboardRealtimeOptions,
} from './useDashboardRealtime';

// Re-export from performance hooks
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
  useDeepMemo,
  useIdleCallback,
  useIdleEffect,
  useAsyncEffect,
  useAbortController,
  useDeferredValue,
  useTransition,
  useReservedSpace,
  useProgressiveImage,
  usePerfTrack,
  useWebWorker,
  usePDFWorker,
  useChartWorker,
  usePerformanceMonitoring,
  useVirtualScroll,
  useBlurPlaceholder,
  useCriticalImages,
} from '../performance';
