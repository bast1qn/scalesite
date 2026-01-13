import { FC, useMemo } from 'react';
import { ArrowTrendingUpIcon } from '../Icons';
import type { DateRange } from './DateRangePicker';

interface ConversionRateProps {
    dateRange: DateRange;
    currentRate?: number;
    previousRate?: number;
}

const ConversionRate: FC<ConversionRateProps> = ({
    dateRange,
    currentRate,
    previousRate,
}) => {
    // Generate demo data if no data provided
    const rate = useMemo(() => {
        if (currentRate !== undefined) return currentRate;
        return 2.5 + Math.random() * 3; // 2.5% - 5.5%
    }, [currentRate]);

    const previousRateValue = useMemo(() => {
        if (previousRate !== undefined) return previousRate;
        return rate - (Math.random() * 2 - 0.5); // Previous period +/- 1%
    }, [previousRate, rate]);

    const change = useMemo(() => {
        return ((rate - previousRateValue) / previousRateValue) * 100;
    }, [rate, previousRateValue]);

    const isPositive = change >= 0;
    const changeText = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;

    // Calculate goal progress
    const goalRate = 5.0;
    const goalProgress = Math.min((rate / goalRate) * 100, 100);

    // Period comparison
    const periodText = useMemo(() => {
        const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        return `Letzte ${days} Tage`;
    }, [dateRange]);

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                        isPositive
                            ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20'
                            : 'bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20'
                    }`}>
                        {isPositive ? (
                            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <ArrowTrendingUpIcon className="w-5 h-5 text-rose-600 dark:text-rose-400 rotate-180" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Konversionsrate</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{periodText}</p>
                    </div>
                </div>
            </div>

            {/* Main Rate Display */}
            <div className="flex items-end gap-3 mb-4">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    {rate.toFixed(2)}%
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-bold mb-2 ${
                    isPositive
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                }`}>
                    {isPositive ? (
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                        <ArrowTrendingUpIcon className="w-4 h-4 rotate-180" />
                    )}
                    <span>{changeText}</span>
                </div>
            </div>

            {/* Goal Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Ziel: {goalRate}%</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{goalProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${
                            goalProgress >= 100
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                : 'bg-gradient-to-r from-blue-500 to-violet-500'
                        }`}
                        style={{ width: `${goalProgress}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1">
                        Vorheriger Zeitraum
                    </span>
                    <span className="block text-sm font-black text-slate-900 dark:text-white">
                        {previousRateValue.toFixed(2)}%
                    </span>
                </div>
                <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1">
                        Aktueller Zeitraum
                    </span>
                    <span className="block text-sm font-black text-blue-600 dark:text-blue-400">
                        {rate.toFixed(2)}%
                    </span>
                </div>
                <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1">
                        Ziel
                    </span>
                    <span className="block text-sm font-black text-violet-600 dark:text-violet-400">
                        {goalRate}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ConversionRate;
