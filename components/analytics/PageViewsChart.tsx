import { FC, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from 'recharts';
import { EyeIcon, ArrowUpIcon } from '../Icons';
import type { DateRange } from './DateRangePicker';

interface PageViewData {
    page: string;
    views: number;
    path: string;
}

interface PageViewsChartProps {
    dateRange: DateRange;
    data?: PageViewData[];
}

const COLORS = [
    'rgb(59 130 246)',   // blue
    'rgb(139 92 246)',   // violet
    'rgb(99 102 241)',   // indigo
    'rgb(168 85 247)',   // purple
    'rgb(236 72 153)',   // pink
    'rgb(244 63 94)',    // rose
    'rgb(14 165 233)',   // sky
    'rgb(20 184 166)',   // teal
];

const PageViewsChart: FC<PageViewsChartProps> = ({ dateRange, data }) => {
    // Generate demo data if no data provided
    const chartData = useMemo(() => {
        if (data && data.length > 0) return data;

        const pages = [
            { page: 'Startseite', path: '/' },
            { page: 'Preise', path: '/preise' },
            { page: 'Über uns', path: '/ueber-uns' },
            { page: 'Kontakt', path: '/kontakt' },
            { page: 'Blog', path: '/blog' },
            { page: 'Projekte', path: '/projekte' },
            { page: 'Services', path: '/services' },
            { page: 'FAQ', path: '/faq' },
        ];

        return pages.map(p => ({
            ...p,
            views: Math.floor(Math.random() * 5000) + 500,
        })).sort((a, b) => b.views - a.views);
    }, [dateRange, data]);

    const totalViews = useMemo(() => {
        return chartData.reduce((acc, item) => acc + item.views, 0);
    }, [chartData]);

    const topPage = chartData[0];

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl">
                        <EyeIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Seitenaufrufe</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Gesamt: {totalViews.toLocaleString('de-DE')} · Top: {topPage?.page}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                    <ArrowUpIcon className="w-4 h-4" />
                    <span className="text-xs font-bold">+12.5%</span>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="horizontal">
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
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Pages List */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Top Seiten</h4>
                <div className="space-y-2">
                    {chartData.slice(0, 5).map((page, index) => {
                        const percentage = (page.views / totalViews) * 100;
                        return (
                            <div key={page.path} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 w-4">{index + 1}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{page.page}</span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{page.views.toLocaleString('de-DE')}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                        <div
                                            className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PageViewsChart;
