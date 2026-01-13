import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import BounceRate from '../components/analytics/BounceRate';
import AvgSessionDuration from '../components/analytics/AvgSessionDuration';
import TopPages from '../components/analytics/TopPages';
import TopReferrers from '../components/analytics/TopReferrers';
import ExportCSV from '../components/analytics/ExportCSV';
import ExportPDF from '../components/analytics/ExportPDF';
import RealtimeAnalytics from '../components/analytics/RealtimeAnalytics';
import DateRangePicker, { DateRangePreset, DateRange } from '../components/analytics/DateRangePicker';
import { setupAutoTracking } from '../lib/analytics';

interface AnalyticsPageProps {
    setCurrentPage?: (page: string) => void;
}

const AnalyticsPage: FC<AnalyticsPageProps> = ({ setCurrentPage }) => {
    const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('30d');
    const [customRange, setCustomRange] = useState<DateRange | undefined>();

    useEffect(() => {
        // Auto-Tracking initialisieren
        setupAutoTracking();

        // Page View tracken
        if (setCurrentPage) {
            setCurrentPage('analytics');
        }
    }, [setCurrentPage]);

    const getCurrentDateRange = (): DateRange => {
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
    };

    const currentDateRange = getCurrentDateRange();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-slate-50 dark:bg-slate-900"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        Analytics Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Verfolgen Sie Ihre Website-Performance und Besucher-Statistiken
                    </p>
                </div>

                {/* Date Range Picker */}
                <div className="mb-6">
                    <DateRangePicker
                        selectedPreset={selectedPreset}
                        onPresetChange={setSelectedPreset}
                        customRange={customRange}
                        onCustomRangeChange={setCustomRange}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 mb-6">
                    {/* KPI Cards Row */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <BounceRate dateRange={currentDateRange} />
                        <AvgSessionDuration dateRange={currentDateRange} />
                    </div>

                    {/* Live Activity & Charts Row */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <RealtimeAnalytics />
                        </div>
                        <div className="lg:col-span-2 grid gap-6">
                            <TopPages dateRange={currentDateRange} />
                            <TopReferrers dateRange={currentDateRange} />
                        </div>
                    </div>

                    {/* Analytics Dashboard mit Charts */}
                    <AnalyticsDashboard />
                </div>

                {/* Export Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <ExportCSV dateRange={currentDateRange} />
                    <ExportPDF dateRange={currentDateRange} />
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;
