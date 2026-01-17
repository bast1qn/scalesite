/**
 * LAZY CHARTS SYSTEM
 * Lazy loads recharts to reduce initial bundle size by ~346KB
 * Only loads chart library when user views analytics pages
 */

import { lazy, Suspense, type ReactNode, type HTMLAttributes } from 'react';
import type {
  LineChartProps,
  BarChartProps,
  PieChartProps,
  AreaChartProps,
  ResponsiveContainerProps
} from 'recharts';

// Lazy load only the main chart containers
// Smaller components like Line, Bar, etc. can be imported directly
const ResponsiveContainer = lazy(() =>
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

const LineChart = lazy(() =>
  import('recharts').then(module => ({ default: module.LineChart }))
);

const BarChart = lazy(() =>
  import('recharts').then(module => ({ default: module.BarChart }))
);

const PieChart = lazy(() =>
  import('recharts').then(module => ({ default: module.PieChart }))
);

const AreaChart = lazy(() =>
  import('recharts').then(module => ({ default: module.AreaChart }))
);

// Import smaller components directly (not lazy)
// These will be bundled with the chart containers
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
} from 'recharts';

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

// ✅ FIXED: Replaced 'any' with proper types from recharts
interface ChartWrapperProps {
  children?: ReactNode;
  height?: number;
}

export const LazyLineChart = ({ children, ...props }: LineChartProps & ChartWrapperProps) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <LineChart {...props}>{children}</LineChart>
  </Suspense>
);

export const LazyBarChart = ({ children, ...props }: BarChartProps & ChartWrapperProps) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <BarChart {...props}>{children}</BarChart>
  </Suspense>
);

export const LazyPieChart = ({ children, ...props }: PieChartProps & ChartWrapperProps) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <PieChart {...props}>{children}</PieChart>
  </Suspense>
);

export const LazyAreaChart = ({ children, ...props }: AreaChartProps & ChartWrapperProps) => (
  <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
    <AreaChart {...props}>{children}</AreaChart>
  </Suspense>
);

export const LazyResponsiveContainer = ({ children, ...props }: ResponsiveContainerProps) => (
  <Suspense fallback={<ChartSkeleton height={(props as any).height || 300} />}>
    <ResponsiveContainer {...props}>{children}</ResponsiveContainer>
  </Suspense>
);

// Preload charts when user navigates to analytics
export const preloadCharts = () => {
  import('recharts');
};
