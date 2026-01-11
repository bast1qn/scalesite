
import React, { useEffect, useState } from 'react';
import { ChartBarIcon, UsersIcon, EyeIcon, CursorArrowRaysIcon, ArrowRightIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '../Icons';
import { api } from '../../lib/api';

const Analytics: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await api.get('/admin/analytics');
            if (data) {
                setStats(data);
            }
            setLoading(false);
        };

        fetchStats();
        
        // Live-Update alle 10 Sekunden
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !stats) {
        return (
            <div className="p-12 text-center flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-dark-text/60 dark:text-light-text/60">Lade Live-Daten aus der Datenbank...</p>
            </div>
        );
    }

    const { visitorStats, pageViews, clickHeatmap, chartData, exitPages } = stats;
    const maxChartVal = Math.max(...chartData, 5); 

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Website Analyse</h1>
                    <p className="mt-2 text-dark-text/80 dark:text-light-text/80">
                        Echtzeit-Daten basierend auf Datenbank-Events.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full animate-pulse">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live-Verbindung
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-dark-text/5 dark:border-light-text/5">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                        <UsersIcon className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">Besucher Heute</span>
                    </div>
                    <p className="text-3xl font-bold text-dark-text dark:text-light-text">{visitorStats.today}</p>
                    {visitorStats.today > visitorStats.yesterday && (
                         <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                            <ArrowRightIcon className="w-3 h-3 -rotate-45" />
                            Steigend vs. Gestern
                        </p>
                    )}
                </div>
                <div className="bg-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-dark-text/5 dark:border-light-text/5">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                        <ClockIcon className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">Gestern</span>
                    </div>
                    <p className="text-3xl font-bold text-dark-text dark:text-light-text">{visitorStats.yesterday}</p>
                </div>
                <div className="bg-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-dark-text/5 dark:border-light-text/5">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                        <ChartBarIcon className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">Letzte 7 Tage</span>
                    </div>
                    <p className="text-3xl font-bold text-dark-text dark:text-light-text">{visitorStats.lastWeek}</p>
                </div>
                <div className="bg-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-dark-text/5 dark:border-light-text/5">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                        <EyeIcon className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">Sessions Gesamt</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">{visitorStats.total.toLocaleString('de-DE')}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-dark-text dark:text-light-text mb-6">Seitenaufrufe (Letzte 7 Tage)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                        {chartData.map((val: number, idx: number) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden h-full flex items-end">
                                    <div 
                                        style={{ height: `${Math.max((val / maxChartVal) * 100, 2)}%` }} 
                                        className={`w-full transition-all duration-500 rounded-t-lg relative ${val > 0 ? 'bg-primary opacity-80 group-hover:opacity-100' : 'bg-slate-200 dark:bg-slate-700 opacity-50'}`}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-text text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {val} Aufrufe
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tag {7 - idx}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Exit Pages (Currently static or empty as backend calculation is complex for SQLlite mock) */}
                <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-dark-text dark:text-light-text mb-6 flex items-center gap-2">
                        <ArrowRightIcon className="w-5 h-5 text-red-500" />
                        Seiten-Ausstiege
                    </h3>
                    <div className="space-y-4">
                         <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                            Detaillierte Ausstiegs-Analyse wird gesammelt...
                         </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Page Views Table */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                         <h3 className="text-lg font-bold text-dark-text dark:text-light-text">Beliebteste Seiten</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seite</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aufrufe</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {pageViews.length > 0 ? pageViews.map((page: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-dark-text dark:text-light-text">
                                            {page.name}
                                            <span className="block text-xs text-slate-400 font-normal">{page.path}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-slate-600 dark:text-slate-300 font-mono">{page.views}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={2} className="text-center py-8 text-sm text-slate-500">Keine Daten.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Click Heatmap List */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-dark-text dark:text-light-text flex items-center gap-2">
                            <CursorArrowRaysIcon className="w-5 h-5 text-primary" />
                            Top Interaktionen (Klicks)
                        </h3>
                    </div>
                    <div className="p-0">
                        {clickHeatmap.length > 0 ? clickHeatmap.map((item: any, idx: number) => (
                            <div key={idx} className="relative p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                {/* Visual Bar Background */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-primary/5 dark:bg-primary/10 transition-all duration-500" 
                                    style={{ width: `${Math.min((item.clicks / (clickHeatmap[0].clicks || 1)) * 100, 100)}%` }}
                                />
                                <div className="relative flex justify-between items-center z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {idx + 1}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-dark-text dark:text-light-text truncate max-w-[180px] sm:max-w-xs" title={item.element}>{item.element}</p>
                                            <p className="text-xs text-slate-400">auf {item.path}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-mono font-semibold text-primary whitespace-nowrap">{item.clicks} Klicks</span>
                                </div>
                            </div>
                        )) : (
                             <p className="text-sm text-slate-500 text-center py-8">Warten auf Interaktionen...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
