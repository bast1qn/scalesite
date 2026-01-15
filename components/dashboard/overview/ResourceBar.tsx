// ============================================
// RESOURCE BAR COMPONENT
// Progress bar for server resource display
// ============================================

import React from 'react';

export interface ResourceBarProps {
    label: string;
    value: number;
    color: string;
}

/**
 * Resource Bar Component
 *
 * Displays a labeled progress bar for resource usage
 * Optimized with React.memo to prevent unnecessary re-renders
 */
export const ResourceBar = React.memo<ResourceBarProps>(({ label, value, color }) => (
    <div>
        <div className="flex justify-between text-xs mb-1.5 text-slate-600 dark:text-slate-400">
            <span className="font-medium">{label}</span>
            <span className="font-bold">{Math.round(value)}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
));

ResourceBar.displayName = 'ResourceBar';
