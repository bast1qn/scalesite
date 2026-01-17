// ============================================
// QUICK ACTIONS COMPONENT
// Displays quick action buttons
// ============================================

import React from 'react';
import { ArrowRightIcon } from '../../../Icons';

export interface QuickAction {
    id: string; // ✅ FIX: Add unique ID for stable keys
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
 * ✅ FIXED: Use action.id as stable key instead of index
 */
export const QuickActions = React.memo<QuickActionsProps>(({ title, actions }) => {
    return (
        <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={action.onClick}
                    className="group w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-premium transition-all duration-300 flex items-center justify-between active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 min-h-11"
                >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{action.label}</span>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-primary-500 transition-all" />
                </button>
            ))}
        </div>
    );
});

QuickActions.displayName = 'QuickActions';
