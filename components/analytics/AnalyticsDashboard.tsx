// React imports
import { FC, useState, useMemo } from 'react';

// Internal imports - Components
import { ChartBarIcon } from '../Icons';
import DateRangePicker, { DateRangePreset, DateRange } from './DateRangePicker';
import VisitorChart from './VisitorChart';
import PageViewsChart from './PageViewsChart';
import ConversionRate from './ConversionRate';

interface AnalyticsDashboardProps {
    className?: string;
}

const AnalyticsDashboard: FC<AnalyticsDashboardProps> = ({ className = '' }) => {
    const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('30d');
    const [customRange, setCustomRange] = useState<DateRange | undefined>();

    // ✅ PERFORMANCE: Memoize date range calculation to prevent recalculation on every render
    const currentDateRange = useMemo<DateRange>(() => {
        if (selectedPreset === 'custom' && customRange) {
            return customRange;
        }

        const to = new Date();
        const from = new Date();

        switch (selectedPreset) {
            case '7d':
                from.setDate(from.getDate() - 7);
                break;
            case '30d':
                from.setDate(from.getDate() - 30);
                break;
            case '90d':
                from.setDate(from.getDate() - 90);
                break;
            case 'custom':
            default:
                from.setDate(from.getDate() - 30);
                break;
        }

        return { from, to };
    }, [selectedPreset, customRange]);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl">
                        <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Analytics</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Verfolgen Sie Ihre Website-Performance
                        </p>
                    </div>
                </div>
            </div>

            {/* Date Range Picker */}
            <DateRangePicker
                selectedPreset={selectedPreset}
                onPresetChange={setSelectedPreset}
                customRange={customRange}
                onCustomRangeChange={setCustomRange}
            />

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <ConversionRate dateRange={currentDateRange} />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                <VisitorChart dateRange={currentDateRange} />
                <PageViewsChart dateRange={currentDateRange} />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
