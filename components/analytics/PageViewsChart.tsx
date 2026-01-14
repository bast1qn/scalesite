import { FC, useMemo, lazy, Suspense } from 'react';
import { EyeIcon, ArrowUpIcon } from '../Icons';
import type { DateRange } from './DateRangePicker';

// ✅ PERFORMANCE: Lazy load Recharts to reduce initial bundle size
const RechartsComponents = lazy(() => import('./RechartsComponents'));

interface RechartsComponentsProps {
    chartData: PageViewData[];
    COLORS: string[];
}

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
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                    </div>
                }>
                    <RechartsComponents chartData={chartData} COLORS={COLORS} />
                </Suspense>
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
