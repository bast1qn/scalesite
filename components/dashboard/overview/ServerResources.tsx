// ============================================
// SERVER RESOURCES COMPONENT
// Displays server resource usage stats
// ============================================

import React from 'react';
import { ServerIcon } from '../../../Icons';
import { ResourceBar } from './ResourceBar';
import type { ServerStats } from '../../../../types/dashboard';

export interface ServerResourcesProps {
    serverStats: ServerStats;
    diskLabel: string;
    ramLabel: string;
    bandwidthLabel: string;
    uptimeLabel: string;
    demoLabel: string;
    title: string;
}

/**
 * Server Resources Component
 *
 * Displays server resource usage with progress bars
 */
export const ServerResources = React.memo<ServerResourcesProps>(({
    serverStats,
    diskLabel,
    ramLabel,
    bandwidthLabel,
    uptimeLabel,
    demoLabel,
    title
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ServerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">{demoLabel}</span>
            </div>
            <div className="space-y-4">
                <ResourceBar label={diskLabel} value={serverStats.diskUsage} color="bg-cyan-500" />
                <ResourceBar label={ramLabel} value={serverStats.ramUsage} color="bg-violet-500" />
                <ResourceBar label={bandwidthLabel} value={serverStats.bandwidth} color="bg-indigo-500" />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{uptimeLabel}</span>
                <span className="font-black text-slate-900 dark:text-white">{serverStats.uptime}</span>
            </div>
        </div>
    );
});

ServerResources.displayName = 'ServerResources';
