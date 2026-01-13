import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlobeAltIcon } from '../Icons';
import { DateRange } from './DateRangePicker';

interface TopReferrersProps {
    dateRange: DateRange;
    className?: string;
}

interface ReferrerData {
    source: string;
    icon: string;
    visits: number;
    percentage: number;
}

const generateMockReferrers = (range: DateRange): ReferrerData[] => {
    const referrers = [
        { source: 'Google', icon: '🔍' },
        { source: 'Direct', icon: '🔗' },
        { source: 'LinkedIn', icon: '💼' },
        { source: 'Facebook', icon: '📘' },
        { source: 'Twitter', icon: '🐦' }
    ];

    const baseVisits = 200 + Math.random() * 300;
    const data = referrers.map(ref => ({
        ...ref,
        visits: Math.round(baseVisits * (0.3 + Math.random()))
    }));

    const totalVisits = data.reduce((sum, ref) => sum + ref.visits, 0);
    return data
        .sort((a, b) => b.visits - a.visits)
        .map(ref => ({
            ...ref,
            percentage: Math.round((ref.visits / totalVisits) * 100)
        }));
};

const TopReferrers: FC<TopReferrersProps> = ({ dateRange, className = '' }) => {
    const referrers = useMemo(() => generateMockReferrers(dateRange), [dateRange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-lg">
                    <GlobeAltIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Top Quellen
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Besucherquellen
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {referrers.map((referrer, index) => (
                    <motion.div
                        key={referrer.source}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{referrer.icon}</span>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {referrer.source}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {referrer.percentage}% aller Besucher
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {referrer.visits.toLocaleString('de-DE')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Besuche</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default TopReferrers;
