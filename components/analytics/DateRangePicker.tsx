import { FC } from 'react';
import { CalendarDaysIcon } from '../Icons';

export type DateRangePreset = '7d' | '30d' | '90d' | 'custom';

export interface DateRange {
    from: Date;
    to: Date;
}

interface DateRangePickerProps {
    selectedPreset: DateRangePreset;
    onPresetChange: (preset: DateRangePreset) => void;
    customRange?: DateRange;
    onCustomRangeChange?: (range: DateRange) => void;
}

const presets = [
    { key: '7d' as const, label: '7 Tage', days: 7 },
    { key: '30d' as const, label: '30 Tage', days: 30 },
    { key: '90d' as const, label: '90 Tage', days: 90 },
    { key: 'custom' as const, label: 'Benutzerdefiniert', days: 0 },
];

const DateRangePicker: FC<DateRangePickerProps> = ({
    selectedPreset,
    onPresetChange,
    customRange,
    onCustomRangeChange,
}) => {
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getDateRange = (days: number): DateRange => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - days);
        return { from, to };
    };

    const getCurrentRange = (): DateRange => {
        if (selectedPreset === 'custom' && customRange) {
            return customRange;
        }
        const preset = presets.find(p => p.key === selectedPreset);
        if (preset && preset.key !== 'custom') {
            return getDateRange(preset.days);
        }
        return getDateRange(30);
    };

    const currentRange = getCurrentRange();

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CalendarDaysIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Zeitraum</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatDate(currentRange.from)} - {formatDate(currentRange.to)}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.key}
                        onClick={() => onPresetChange(preset.key)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            selectedPreset === preset.key
                                ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DateRangePicker;
