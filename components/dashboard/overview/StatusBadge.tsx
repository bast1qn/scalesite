// ============================================
// PROJECT STATUS BADGE COMPONENT
// Displays project status with color coding
// ============================================

import React from 'react';
import type { ProjectStatus } from '../../../../types/dashboard';

export interface StatusBadgeProps {
    status: ProjectStatus;
}

/**
 * Project Status Badge Component
 *
 * Renders a colored badge for project status
 * Optimized with React.memo to prevent unnecessary re-renders
 */
export const StatusBadge = React.memo<StatusBadgeProps>(({ status }) => {
    switch (status) {
        case 'pending': return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Geplant
            </span>
        );
        case 'active': return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Aktiv
            </span>
        );
        case 'completed': return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
                <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Fertig
            </span>
        );
        case 'cancelled': return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Storniert
            </span>
        );
        default: return null;
    }
});

StatusBadge.displayName = 'StatusBadge';
