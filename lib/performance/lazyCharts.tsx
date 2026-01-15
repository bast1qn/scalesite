/**
 * LAZY CHARTS SYSTEM
 * Lazy loads recharts to reduce initial bundle size by ~346KB
 * Only loads chart library when user views analytics pages
 */

import { lazy, Suspense, type ReactNode } from 'react';

// Lazy load all recharts components
const ResponsiveContainer = lazy(() =>
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

const LineChart = lazy(() =>
  import('recharts').then(module => ({ default: module.LineChart }))
);

const Line = lazy(() =>
  import('recharts').then(module => ({ default: module.Line }))
);

const BarChart = lazy(() =>
  import('recharts').then(module => ({ default: module.BarChart }))
);

const Bar = lazy(() =>
  import('recharts').then(module => ({ default: module.Bar }))
);

const PieChart = lazy(() =>
  import('recharts').then(module => ({ default: module.PieChart }))
);

const Pie = lazy(() =>
  import('recharts').then(module => ({ default: module.Pie }))
);

const AreaChart = lazy(() =>
  import('recharts').then(module => ({ default: module.AreaChart }))
);

const Area = lazy(() =>
  import('recharts').then(module => ({ default: module.Area }))
);

const XAxis = lazy(() =>
  import('recharts').then(module => ({ default: module.XAxis }))
);

const YAxis = lazy(() =>
  import('recharts').then(module => ({ default: module.YAxis }))
);

const CartesianGrid = lazy(() =>
  import('recharts').then(module => ({ default: module.CartesianGrid }))
);

const Tooltip = lazy(() =>
  import('recharts').then(module => ({ default: module.Tooltip }))
);

const Legend = lazy(() =>
  import('recharts').then(module => ({ default: module.Legend }))
);

const Cell = lazy(() =>
  import('recharts').then(module => ({ default: module.Cell }))
);

// Loading skeleton for charts
const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div
    className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg"
    style={{ height }}
  >
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-primary rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Loading chart...</p>
      </div>
    </div>
  </div>
);

// Wrapper component for lazy-loaded charts
export const LazyLineChart = ({ children, ...props }: any) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <LineChart {...props}>{children}</LineChart>
  </Suspense>
);

export const LazyBarChart = ({ children, ...props }: any) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <BarChart {...props}>{children}</BarChart>
  </Suspense>
);

export const LazyPieChart = ({ children, ...props }: any) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <PieChart {...props}>{children}</PieChart>
  </Suspense>
);

export const LazyAreaChart = ({ children, ...props }: any) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <AreaChart {...props}>{children}</AreaChart>
  </Suspense>
);

export const LazyResponsiveContainer = ({ children, ...props }: any) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <ResponsiveContainer {...props}>{children}</ResponsiveContainer>
  </Suspense>
);

// Export all lazy components
export {
  Line,
  Bar,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
};

// Preload charts when user navigates to analytics
export const preloadCharts = () => {
  import('recharts');
};
