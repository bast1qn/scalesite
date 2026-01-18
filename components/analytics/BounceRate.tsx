import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowRightIcon } from '../Icons';
import { DateRange } from './DateRangePicker';
import { BOUNCE_RATE } from '../../lib/analytics-constants';

interface BounceRateProps {
    dateRange: DateRange;
    className?: string;
}

interface BounceRateData {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'neutral';
}

// Mock-Daten - In Produktion durch echte API-Daten ersetzen
const generateMockBounceRate = (range: DateRange): BounceRateData => {
    const baseRate = BOUNCE_RATE.MIN + Math.random() * (BOUNCE_RATE.MAX - BOUNCE_RATE.MIN);
    const previousRate = baseRate + (Math.random() - 0.5) * BOUNCE_RATE.VARIANCE;

    const trend: BounceRateData['trend'] =
        baseRate < previousRate ? 'down' : baseRate > previousRate ? 'up' : 'neutral';

    return {
        current: Math.round(baseRate),
        previous: Math.round(previousRate),
        trend
    };
};

const BounceRate: FC<BounceRateProps> = ({ dateRange, className = '' }) => {
    const data = useMemo(() => generateMockBounceRate(dateRange), [dateRange]);

    const percentageChange = data.previous !== 0
        ? Math.round(((data.current - data.previous) / data.previous) * 100)
        : 0;

    const isPositive = data.trend === 'down'; // Niedrigere Bounce Rate ist besser

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Absprungrate
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                        {data.current}%
                    </h3>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium ${
                    isPositive
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                    {data.trend === 'up' ? (
                        <ArrowUpIcon className="w-4 h-4" />
                    ) : data.trend === 'down' ? (
                        <ArrowRightIcon className="w-4 h-4 rotate-90" />
                    ) : null}
                    {Math.abs(percentageChange)}%
                </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
                {isPositive ? 'Besser als' : 'Schlechter als'} Vorzeitraum ({data.previous}%)
            </p>
        </motion.div>
    );
};

export default BounceRate;
