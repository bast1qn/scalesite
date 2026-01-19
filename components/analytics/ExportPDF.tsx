import { FC, useState } from 'react';
import { motion } from '@/lib/motion';
import { DocumentTextIcon, ArrowDownOnSquareIcon } from '../Icons';
import { DateRange } from './DateRangePicker';

interface ExportPDFProps {
    dateRange: DateRange;
    className?: string;
    onExport?: () => void;
}

const ExportPDF: FC<ExportPDFProps> = ({ dateRange, className = '', onExport }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handlePrint = () => {
        setIsExporting(true);

        try {
            // CSS-Klasse für Print-Layout hinzufügen
            document.body.classList.add('printing-analytics');

            // Druck-Dialog öffnen
            window.print();

            onExport?.();
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Print failed:', error);
            }
        } finally {
            setIsExporting(false);
            setTimeout(() => {
                document.body.classList.remove('printing-analytics');
            }, 1000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-lg">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Als PDF exportieren
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Analytics-Bericht als PDF
                    </p>
                </div>
            </div>

            <button
                onClick={handlePrint}
                disabled={isExporting}
                className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex items-center gap-3">
                    <DocumentTextIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    <div className="text-left">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            PDF-Bericht erstellen
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Druckansicht als PDF speichern
                        </p>
                    </div>
                </div>
                {isExporting ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <ArrowDownOnSquareIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                )}
            </button>

            <div className="mt-4 space-y-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <strong>Zeitraum:</strong>
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                        {dateRange.from.toLocaleDateString('de-DE')} - {dateRange.to.toLocaleDateString('de-DE')}
                    </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                        <strong>Tipp:</strong> Im Druck-Dialog "Als PDF speichern" auswählen
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ExportPDF;
