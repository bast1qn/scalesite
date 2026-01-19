import { FC, useMemo } from 'react';
import { motion } from '@/lib/motion';
import { ChartBarIcon } from '../Icons';
import { DateRange } from './DateRangePicker';
import { PAGE_VIEWS, ANALYTICS_DELAYS } from '../../lib/analytics-constants';

interface TopPagesProps {
    dateRange: DateRange;
    className?: string;
}

interface PageData {
    path: string;
    title: string;
    views: number;
    percentage: number;
}

const generateMockTopPages = (range: DateRange): PageData[] => {
    const pages = [
        { path: '/', title: 'Startseite' },
        { path: '/leistungen', title: 'Leistungen' },
        { path: '/preise', title: 'Preise' },
        { path: '/projekte', title: 'Projekte' },
        { path: '/kontakt', title: 'Kontakt' }
    ];

    const baseViews = PAGE_VIEWS.BASE_MIN + Math.random() * (PAGE_VIEWS.BASE_MAX - PAGE_VIEWS.BASE_MIN);
    const data = pages.map(page => ({
        ...page,
        views: Math.round(baseViews * (PAGE_VIEWS.MULTIPLIER_MIN + Math.random() * (PAGE_VIEWS.MULTIPLIER_MAX - PAGE_VIEWS.MULTIPLIER_MIN)))
    }));

    // Sortiere nach Views und berechne Prozentsatz
    const totalViews = data.reduce((sum, page) => sum + page.views, 0);
    return data
        .sort((a, b) => b.views - a.views)
        .slice(0, PAGE_VIEWS.TOP_PAGES_COUNT)
        .map(page => ({
            ...page,
            percentage: Math.round((page.views / totalViews) * 100)
        }));
};

const TopPages: FC<TopPagesProps> = ({ dateRange, className = '' }) => {
    const pages = useMemo(() => generateMockTopPages(dateRange), [dateRange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ANALYTICS_DELAYS.TOP_PAGES_DELAY }}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Top Seiten
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Meistbesuchte Seiten
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {pages.map((page, index) => (
                    <div key={page.path} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {page.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {page.path}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 ml-4 text-right">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {page.views.toLocaleString('de-DE')}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {page.percentage}%
                                </p>
                            </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ml-9">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${page.percentage}%` }}
                                transition={{ duration: ANALYTICS_DELAYS.BAR_DURATION, delay: index * ANALYTICS_DELAYS.ITEM_DELAY }}
                                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default TopPages;
