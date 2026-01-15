// ============================================
// KPI CARD COMPONENT
// Reusable card component for dashboard metrics
// ============================================

import React, { type ReactNode } from 'react';
import { ArrowRightIcon } from '../../Icons';

export interface KPICardProps {
    title?: string;
    value: string | number;
    icon: ReactNode;
    subtext?: ReactNode;
    onClick?: () => void;
}

/**
 * KPI Card Component
 *
 * Displays a single key performance indicator with optional click navigation
 * Optimized with React.memo to prevent unnecessary re-renders
 */
export const KPICard = React.memo<KPICardProps>(({ title, value, icon, subtext, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-glow' : ''}`}
        >
            {/* Hover gradient overlay */}
            {onClick && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-violet-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:via-violet-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
            )}

            <div className="relative flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 shadow-sm transition-all duration-300 ${onClick ? 'group-hover:scale-[1.02] group-hover:rotate-3' : ''}`}>
                    {icon}
                </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 relative">
                {subtext}
                {onClick && <ArrowRightIcon className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500 transition-all duration-300" />}
            </p>
        </div>
    );
});

KPICard.displayName = 'KPICard';
