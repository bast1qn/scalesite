import { FC, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { UsersIcon } from '../Icons';
import type { DateRange } from './DateRangePicker';

interface VisitorData {
    date: string;
    visitors: number;
    uniqueVisitors: number;
}

interface VisitorChartProps {
    dateRange: DateRange;
    data?: VisitorData[];
}

const VisitorChart: FC<VisitorChartProps> = ({ dateRange, data }) => {
    // Generate demo data if no data provided
    const chartData = useMemo(() => {
        if (data && data.length > 0) return data;

        const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        const demoData: VisitorData[] = [];

        for (let i = 0; i <= days; i++) {
            const date = new Date(dateRange.from);
            date.setDate(date.getDate() + i);

            // Generate realistic-looking data with some randomness
            const baseVisitors = 100 + Math.floor(Math.random() * 200);
            const trend = Math.sin(i / 7) * 50; // Weekly pattern
            const visitors = Math.max(50, baseVisitors + trend);
            const uniqueVisitors = Math.floor(visitors * (0.6 + Math.random() * 0.3));

            demoData.push({
                date: date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
                visitors: Math.floor(visitors),
                uniqueVisitors,
            });
        }

        return demoData;
    }, [dateRange, data]);

    // Calculate totals
    const totals = useMemo(() => {
        return chartData.reduce(
            (acc, item) => ({
                totalVisitors: acc.totalVisitors + item.visitors,
                totalUnique: acc.totalUnique + item.uniqueVisitors,
            }),
            { totalVisitors: 0, totalUnique: 0 }
        );
    }, [chartData]);

    const averageVisitors = Math.round(totals.totalVisitors / chartData.length);
    const averageUnique = Math.round(totals.totalUnique / chartData.length);

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl">
                        <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Besucher</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Ø {averageVisitors} / Tag · {averageUnique} Eindeutige
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgb(59 130 246)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="rgb(59 130 246)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                        <XAxis
                            dataKey="date"
                            className="text-xs text-slate-500 dark:text-slate-400"
                            tick={{ fill: 'currentColor' }}
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
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            iconType="circle"
                        />
                        <Line
                            type="monotone"
                            dataKey="visitors"
                            stroke="rgb(59 130 246)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                            name="Besucher"
                            fill="url(#visitorsGradient)"
                        />
                        <Line
                            type="monotone"
                            dataKey="uniqueVisitors"
                            stroke="rgb(139 92 246)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                            name="Eindeutige Besucher"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VisitorChart;
