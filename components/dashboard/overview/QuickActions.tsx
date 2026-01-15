// ============================================
// QUICK ACTIONS COMPONENT
// Displays quick action buttons
// ============================================

import React from 'react';
import { ArrowRightIcon } from '../../../Icons';

export interface QuickAction {
    label: string;
    onClick: () => void;
}

export interface QuickActionsProps {
    title: string;
    actions: QuickAction[];
}

/**
 * Quick Actions Component
 *
 * Displays a list of quick action buttons
 */
export const QuickActions = React.memo<QuickActionsProps>(({ title, actions }) => {
    return (
        <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={action.onClick}
                    className="group w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-500/50 min-h-11"
                >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{action.label}</span>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all" />
                </button>
            ))}
        </div>
    );
});

QuickActions.displayName = 'QuickActions';
