import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    TrendingUpIcon,
    TrendingDownIcon,
    EyeIcon,
    MousePointerClickIcon,
    UserMinusIcon,
    CalendarIcon,
    RefreshCwIcon
} from 'lucide-react';
import { Campaign } from './CampaignList';

/**
 * AnalyticsCharts Component
 *
 * Advanced analytics dashboard for newsletter campaigns
 *
 * @param campaigns - List of campaigns with stats
 * @param dateRange - Date range for filtering
 * @param onDateRangeChange - Callback for date range change
 * @param onRefresh - Callback for refreshing data
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface CampaignAnalytics extends Campaign {
    stats: Campaign['stats'] & {
        forwarded?: number;
        spam_reports?: number;
    };
}

export interface AnalyticsChartsProps {
    campaigns: CampaignAnalytics[];
    dateRange?: { start: Date; end: Date };
    onDateRangeChange?: (range: { start: Date; end: Date }) => void;
    onRefresh?: () => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';
type ChartType = 'overview' | 'engagement' | 'growth' | 'devices';

const COLORS = {
    blue: '#3b82f6',
    green: '#10b981',
    violet: '#8b5cf6',
    red: '#ef4444',
    yellow: '#f59e0b',
    slate: '#64748b'
};

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
    campaigns,
    dateRange,
    onDateRangeChange,
    onRefresh,
    isLoading = false,
    className = ''
}) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');
    const [chartType, setChartType] = useState<ChartType>('overview');

    // Filter campaigns by date range
    const filteredCampaigns = useMemo(() => {
        if (!dateRange) return campaigns;

        return campaigns.filter((campaign) => {
            const sentDate = new Date(campaign.sent_at || campaign.created_at);
            return sentDate >= dateRange.start && sentDate <= dateRange.end;
        });
    }, [campaigns, dateRange]);

    // Calculate aggregate statistics
    const aggregateStats = useMemo(() => {
        const totalSent = filteredCampaigns.reduce((sum, c) => sum + c.stats.sent_count, 0);
        const totalOpened = filteredCampaigns.reduce((sum, c) => sum + c.stats.open_count, 0);
        const totalClicked = filteredCampaigns.reduce((sum, c) => sum + c.stats.click_count, 0);
        const totalUnsubscribed = filteredCampaigns.reduce((sum, c) => sum + c.stats.unsubscribe_count, 0);

        return {
            totalSent,
            totalOpened,
            totalClicked,
            totalUnsubscribed,
            openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
            clickRate: totalOpened > 0 ? Math.round((totalClicked / totalOpened) * 100) : 0,
            unsubscribeRate: totalSent > 0 ? Math.round((totalUnsubscribed / totalSent) * 100) : 0
        };
    }, [filteredCampaigns]);

    // Generate time series data
    const timeSeriesData = useMemo(() => {
        const data: { date: string; sent: number; opened: number; clicked: number }[] = [];
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

            const dayCampaigns = filteredCampaigns.filter((c) => {
                const sentDate = new Date(c.sent_at || c.created_at);
                return sentDate.toDateString() === date.toDateString();
            });

            data.push({
                date: dateStr,
                sent: dayCampaigns.reduce((sum, c) => sum + c.stats.sent_count, 0),
                opened: dayCampaigns.reduce((sum, c) => sum + c.stats.open_count, 0),
                clicked: dayCampaigns.reduce((sum, c) => sum + c.stats.click_count, 0)
            });
        }

        return data;
    }, [filteredCampaigns, timeRange]);

    // Generate campaign comparison data
    const campaignComparisonData = useMemo(() => {
        return filteredCampaigns.slice(0, 10).map((campaign) => ({
            name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name,
            sent: campaign.stats.sent_count,
            opened: campaign.stats.open_count,
            clicked: campaign.stats.click_count
        }));
    }, [filteredCampaigns]);

    // Generate engagement distribution data
    const engagementData = useMemo(() => {
        const high = filteredCampaigns.filter((c) => {
            const rate = c.stats.sent_count > 0 ? (c.stats.open_count / c.stats.sent_count) * 100 : 0;
            return rate >= 30;
        }).length;

        const medium = filteredCampaigns.filter((c) => {
            const rate = c.stats.sent_count > 0 ? (c.stats.open_count / c.stats.sent_count) * 100 : 0;
            return rate >= 15 && rate < 30;
        }).length;

        const low = filteredCampaigns.filter((c) => {
            const rate = c.stats.sent_count > 0 ? (c.stats.open_count / c.stats.sent_count) * 100 : 0;
            return rate < 15;
        }).length;

        return [
            { name: 'Hoch (30%+)', value: high, color: COLORS.green },
            { name: 'Mittel (15-30%)', value: medium, color: COLORS.blue },
            { name: 'Niedrig (<15%)', value: low, color: COLORS.slate }
        ];
    }, [filteredCampaigns]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Newsletter Analytics</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Leistungsmetriken und Kampagnen-Statistiken
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Time Range Selector */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="7d">Letzte 7 Tage</option>
                        <option value="30d">Letzte 30 Tage</option>
                        <option value="90d">Letzte 90 Tage</option>
                        <option value="all">Alle Zeit</option>
                    </select>

                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Aktualisieren"
                        >
                            <RefreshCwIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-slate-500">Gesamt</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{aggregateStats.totalSent}</p>
                    <p className="text-sm text-slate-500 mt-1">Gesendete E-Mails</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <EyeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className={`text-xs font-medium flex items-center gap-1 ${
                                                            aggregateStats.openRate > 20 ? 'text-green-600' : 'text-slate-500'
                                                        }`}
                                                    >
                                                        {aggregateStats.openRate > 20 ? <TrendingUpIcon className="w-3 h-3" /> : null}
                                                        {aggregateStats.openRate}%
                                                    </span>
                                                </div>
                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{aggregateStats.totalOpened}</p>
                                                <p className="text-sm text-slate-500 mt-1">Geöffnet</p>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                                                        <MousePointerClickIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                                    </div>
                                                    <span className={`text-xs font-medium flex items-center gap-1 ${
                                                        aggregateStats.clickRate > 5 ? 'text-green-600' : 'text-slate-500'
                                                    }`}
                                                >
                                                    {aggregateStats.clickRate > 5 ? <TrendingUpIcon className="w-3 h-3" /> : null}
                                                    {aggregateStats.clickRate}%
                                                </span>
                                            </div>
                                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{aggregateStats.totalClicked}</p>
                                            <p className="text-sm text-slate-500 mt-1">Geklickt</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                                    <UserMinusIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                                </div>
                                                <span className={`text-xs font-medium flex items-center gap-1 ${
                                                    aggregateStats.unsubscribeRate < 1 ? 'text-green-600' : 'text-red-600'
                                                }`}
                                                >
                                                    {aggregateStats.unsubscribeRate < 1 ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                                                    {aggregateStats.unsubscribeRate}%
                                                </span>
                                            </div>
                                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{aggregateStats.totalUnsubscribed}</p>
                                            <p className="text-sm text-slate-500 mt-1">Abgemeldet</p>
                                        </motion.div>
                                    </div>

                                    {/* Charts */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Performance Over Time */}
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                                Leistung über Zeit
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <AreaChart data={timeSeriesData}>
                                                    <defs>
                                                        <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={COLORS.violet} stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor={COLORS.violet} stopOpacity={0}/>
                                                        </linearGradient>
                                                        <linearGradient id="colorClicked" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#64748b"
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                    <YAxis
                                                        stroke="#64748b"
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="opened"
                                                        stroke={COLORS.violet}
                                                        fillOpacity={1}
                                                        fill="url(#colorOpened)"
                                                        name="Geöffnet"
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="clicked"
                                                        stroke={COLORS.blue}
                                                        fillOpacity={1}
                                                        fill="url(#colorClicked)"
                                                        name="Geklickt"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Campaign Comparison */}
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                                Kampagnen-Vergleich
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={campaignComparisonData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                                                    <XAxis
                                                        dataKey="name"
                                                        stroke="#64748b"
                                                        style={{ fontSize: '11px' }}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={60}
                                                    />
                                                    <YAxis
                                                        stroke="#64748b"
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                    <Bar dataKey="sent" fill={COLORS.slate} name="Gesendet" radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="opened" fill={COLORS.violet} name="Geöffnet" radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="clicked" fill={COLORS.blue} name="Geklickt" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Engagement Trend */}
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                                Öffnungsrate Trend
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={timeSeriesData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#64748b"
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                    <YAxis
                                                        stroke="#64748b"
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="opened"
                                                        stroke={COLORS.green}
                                                        strokeWidth={3}
                                                        dot={{ fill: COLORS.green, r: 4 }}
                                                        activeDot={{ r: 6 }}
                                                        name="Geöffnet"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Engagement Distribution */}
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                                Engagements-Verteilung
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={engagementData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {engagementData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            );
                        };

                        export default AnalyticsCharts;
