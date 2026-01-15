import { FC, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeAnalyticsProps {
    className?: string;
    onUpdate?: (data: AnalyticsUpdate) => void;
}

interface AnalyticsUpdate {
    type: 'page_view' | 'conversion' | 'form_submit' | 'button_click';
    count: number;
    timestamp: Date;
    page?: string;
}

interface LiveVisitor {
    id: string;
    page: string;
    timestamp: Date;
}

const RealtimeAnalytics: FC<RealtimeAnalyticsProps> = ({ className = '', onUpdate }) => {
    const [currentVisitors, setCurrentVisitors] = useState(0);
    const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
    const [recentActivity, setRecentActivity] = useState<AnalyticsUpdate[]>([]);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    // Simuliere Live-Besucher (in Produktion durch echte Realtime-Daten ersetzen)
    useEffect(() => {
        // Initialer Wert
        const initialVisitors = Math.floor(10 + Math.random() * 20);
        setCurrentVisitors(initialVisitors);

        // Simuliere Besucher-Änderungen alle 5-10 Sekunden
        const interval = setInterval(() => {
            const change = Math.floor(Math.random() * 5) - 2; // -2 bis +2
            setCurrentVisitors(prev => Math.max(0, prev + change));

            // Manchmal neue Aktivität hinzufügen
            if (Math.random() > 0.7) {
                const activities: AnalyticsUpdate['type'][] = ['page_view', 'conversion', 'form_submit', 'button_click'];
                const activity: AnalyticsUpdate = {
                    type: activities[Math.floor(Math.random() * activities.length)],
                    count: 1,
                    timestamp: new Date(),
                    page: ['/', '/leistungen', '/preise', '/kontakt'][Math.floor(Math.random() * 4)]
                };

                setRecentActivity(prev => [activity, ...prev].slice(0, 10));
                onUpdate?.(activity);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [onUpdate]); // ✅ BUG FIX: Removed setters from dependencies - they are stable

    // In Produktion: Supabase Realtime Subscription
    useEffect(() => {
        const analyticsChannel = supabase
            .channel('analytics_events')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'analytics_events'
                },
                (payload) => {
                    const newEvent = payload.new as AnalyticsUpdate;
                    setRecentActivity(prev => [newEvent, ...prev].slice(0, 10));

                    // Besucher-Zahl aktualisieren
                    if (newEvent.type === 'page_view') {
                        setCurrentVisitors(prev => prev + 1);
                    }

                    onUpdate?.(newEvent);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // Analytics realtime channel connected
                }
            });

        setChannel(analyticsChannel);

        return () => {
            supabase.removeChannel(analyticsChannel);
        };
    }, [onUpdate]);

    const getActivityIcon = (type: AnalyticsUpdate['type']): string => {
        switch (type) {
            case 'page_view':
                return '👁️';
            case 'conversion':
                return '💰';
            case 'form_submit':
                return '📝';
            case 'button_click':
                return '🖱️';
            default:
                return '📊';
        }
    };

    const getActivityLabel = (type: AnalyticsUpdate['type']): string => {
        switch (type) {
            case 'page_view':
                return 'Seitenaufruf';
            case 'conversion':
                return 'Konversion';
            case 'form_submit':
                return 'Formular';
            case 'button_click':
                return 'Klick';
            default:
                return 'Ereignis';
        }
    };

    const getTimeAgo = (timestamp: Date): string => {
        const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);

        if (seconds < 60) return 'Gerade eben';
        if (seconds < 120) return 'Vor 1 Minute';
        if (seconds < 3600) return `Vor ${Math.floor(seconds / 60)} Minuten`;
        return `Vor ${Math.floor(seconds / 3600)} Stunden`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
        >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            Live-Aktivität
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Echtzeit-Analytics
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                        {currentVisitors}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Besucher online
                    </p>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {recentActivity.length === 0 ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-slate-500 dark:text-slate-400 text-center py-8"
                        >
                            Warte auf Aktivität...
                        </motion.p>
                    ) : (
                        recentActivity.map((activity, index) => (
                            <motion.div
                                key={`activity-${activity.type}-${activity.timestamp.getTime()}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-11"
                            >
                                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate leading-relaxed">
                                        {getActivityLabel(activity.type)}
                                        {activity.page && <span className="text-slate-500 dark:text-slate-400 ml-2">{activity.page}</span>}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {getTimeAgo(activity.timestamp)}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Live Indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="font-medium">Echtzeit-Updates aktiv</span>
            </div>
        </motion.div>
    );
};

export default RealtimeAnalytics;
