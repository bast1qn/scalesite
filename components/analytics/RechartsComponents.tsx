import { FC } from 'react';
import {
    LazyBarChart,
    LazyResponsiveContainer,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    Legend
} from '../../lib/performance/lazyCharts';

interface PageViewData {
    page: string;
    views: number;
    path: string;
}

interface RechartsComponentsProps {
    chartData: PageViewData[];
    COLORS: string[];
}

/**
 * ✅ PERFORMANCE: Separate Recharts component for lazy loading
 * This allows the heavy recharts library to be loaded only when analytics pages are viewed
 */
export const RechartsComponents: FC<RechartsComponentsProps> = ({ chartData, COLORS }) => {
    return (
        <LazyResponsiveContainer width="100%" height="100%">
            <LazyBarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
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
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </LazyBarChart>
        </LazyResponsiveContainer>
    );
};
