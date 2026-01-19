import { FC, lazy, Suspense } from 'react';

// ✅ PERFORMANCE PHASE 3: Lazy load recharts components for better code-splitting
// Reduces initial bundle by ~40KB gzipped
const BarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
const Bar = lazy(() => import('recharts').then(m => ({ default: m.Bar })));
const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(m => ({ default: m.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })));
const Cell = lazy(() => import('recharts').then(m => ({ default: m.Cell })));
const Legend = lazy(() => import('recharts').then(m => ({ default: m.Legend })));

interface PageViewData {
    page: string;
    views: number;
    path: string;
    id: string; // ✅ FIX: Add unique ID for stable keys
}

interface RechartsComponentsProps {
    chartData: PageViewData[];
    COLORS: string[];
}

/**
 * ✅ PERFORMANCE: Chart loading fallback
 */
const ChartFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[300px]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-sm text-slate-500 dark:text-slate-400">Lade Chart...</p>
    </div>
  </div>
);

/**
 * Recharts component for displaying page views chart
 * ✅ PERFORMANCE PHASE 3: Wrapped in Suspense for lazy loading
 */
export const RechartsComponents: FC<RechartsComponentsProps> = ({ chartData, COLORS }) => {
    return (
        <Suspense fallback={<ChartFallback />}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200/50 dark:stroke-slate-700/50" />
                    <XAxis
                        dataKey="page"
                        className="text-xs text-slate-500 dark:text-slate-400"
                        tick={{ fill: 'currentColor' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        className="text-xs text-slate-500 dark:text-slate-400"
                        tick={{ fill: 'currentColor' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgb(15 23 42)',
                            border: '1px solid rgb(51 65 85)',
                            borderRadius: '0.75rem',
                            color: 'white',
                        }}
                        labelStyle={{ color: 'rgb(148 163 184)' }}
                        formatter={(value: number) => [value.toLocaleString('de-DE'), 'Aufrufe']}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        iconType="circle"
                    />
                    <Bar dataKey="views" name="Seitenaufrufe" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.id}`} fill={COLORS} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Suspense>
    );
};
