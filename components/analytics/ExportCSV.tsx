import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon, ArrowDownOnSquareIcon } from '../Icons';
import { DateRange } from './DateRangePicker';

interface ExportCSVProps {
    dateRange: DateRange;
    className?: string;
    onExport?: (format: 'csv' | 'json') => void;
}

interface ExportData {
    date: string;
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversions: number;
}

// Mock-Daten generieren
const generateMockExportData = (range: DateRange): ExportData[] => {
    const data: ExportData[] = [];
    const currentDate = new Date(range.from);

    while (currentDate <= range.to) {
        data.push({
            date: currentDate.toISOString().split('T')[0],
            pageViews: Math.round(500 + Math.random() * 500),
            uniqueVisitors: Math.round(300 + Math.random() * 300),
            bounceRate: Math.round(40 + Math.random() * 10),
            avgSessionDuration: Math.round((3 + Math.random() * 4) * 10) / 10,
            conversions: Math.round(10 + Math.random() * 20)
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
};

const downloadCSV = (data: ExportData[], filename: string): void => {
    const headers = ['Datum', 'Page Views', 'Unique Visitors', 'Bounce Rate %', 'Avg Session Duration (min)', 'Conversions'];
    const rows = data.map(row => [
        row.date,
        row.pageViews.toString(),
        row.uniqueVisitors.toString(),
        row.bounceRate.toString(),
        row.avgSessionDuration.toString(),
        row.conversions.toString()
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadJSON = (data: ExportData[], filename: string): void => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const ExportCSV: FC<ExportCSVProps> = ({ dateRange, className = '', onExport }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'csv' | 'json' | null>(null);

    const handleExport = async (format: 'csv' | 'json') => {
        setIsExporting(true);
        setExportFormat(format);

        try {
            // Simuliere Export-Delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const data = generateMockExportData(dateRange);
            const filename = `analytics-${dateRange.from.toISOString().split('T')[0]}-${dateRange.to.toISOString().split('T')[0]}`;

            if (format === 'csv') {
                downloadCSV(data, `${filename}.csv`);
            } else {
                downloadJSON(data, `${filename}.json`);
            }

            onExport?.(format);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
            setExportFormat(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-lg">
                    <ArrowDownOnSquareIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Daten exportieren
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Analytics-Daten herunterladen
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                    className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3">
                        <DocumentArrowDownIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                Als CSV exportieren
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Für Excel, Google Sheets etc.
                            </p>
                        </div>
                    </div>
                    {isExporting && exportFormat === 'csv' ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <DocumentArrowDownIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                    )}
                </button>

                <button
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                    className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3">
                        <DocumentArrowDownIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                Als JSON exportieren
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Für Entwickler und APIs
                            </p>
                        </div>
                    </div>
                    {isExporting && exportFormat === 'json' ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <DocumentArrowDownIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                    )}
                </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                    <strong>Zeitraum:</strong> {dateRange.from.toLocaleDateString('de-DE')} - {dateRange.to.toLocaleDateString('de-DE')}
                </p>
            </div>
        </motion.div>
    );
};

export default ExportCSV;
