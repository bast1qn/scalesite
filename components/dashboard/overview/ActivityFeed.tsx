// ============================================
// ACTIVITY FEED COMPONENT
// Displays recent activity timeline
// ============================================

import React from 'react';
import { BellIcon } from '../../../Icons';
import type { Activity } from '../../../../types/dashboard';

export interface ActivityFeedProps {
    activities: Activity[];
    title: string;
    emptyText: string;
}

/**
 * Activity Feed Component
 *
 * Displays a timeline of recent activities
 */
export const ActivityFeed = React.memo<ActivityFeedProps>(({ activities, title, emptyText }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BellIcon className="w-4 h-4 text-slate-400" />
                {title}
            </h3>
            <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-4">
                {activities.length > 0 ? activities.map((act) => (
                    <div key={act.id} className="relative group">
                        <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-300 ${
                            act.type === 'success' ? 'bg-green-500 group-hover:scale-125' :
                            act.type === 'warning' ? 'bg-red-500 group-hover:scale-125' :
                            act.type === 'system' ? 'bg-slate-400 group-hover:scale-125' : 'bg-blue-500 group-hover:scale-125'
                        }`}></div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{act.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                )) : (
                    <div className="py-4 text-center text-xs text-slate-400">{emptyText}</div>
                )}
            </div>
        </div>
    );
});

ActivityFeed.displayName = 'ActivityFeed';
