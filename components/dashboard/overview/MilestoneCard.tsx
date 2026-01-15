// ============================================
// MILESTONE CARD COMPONENT
// Displays upcoming milestone
// ============================================

import React from 'react';
import { CalendarDaysIcon } from '../../../Icons';
import type { Milestone } from '../../../../types/dashboard';

export interface MilestoneCardProps {
    milestone: Milestone | null;
    nextMilestoneLabel: string;
    dateLabel: string;
    daysRemainingLabel: (days: number) => string;
    noMilestonesText: string;
}

/**
 * Milestone Card Component
 *
 * Displays the next upcoming milestone with countdown
 */
export const MilestoneCard = React.memo<MilestoneCardProps>(({
    milestone,
    nextMilestoneLabel,
    dateLabel,
    daysRemainingLabel,
    noMilestonesText
}) => {
    if (milestone) {
        return (
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
                <div className="flex items-center gap-2 mb-3 text-white/80 text-sm">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{nextMilestoneLabel}</span>
                </div>
                <h3 className="font-bold mb-1">{milestone.title}</h3>
                <p className="text-sm text-white/80 mb-3">{milestone.description}</p>
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-center">
                        <span className="block text-lg font-black">{milestone.date ? milestone.date.split('.')[0] : 'N/A'}</span>
                        <span className="text-[10px] uppercase text-white/60 font-semibold">{dateLabel}</span>
                    </div>
                    <div className="h-6 w-px bg-white/20"></div>
                    <div className="text-sm">
                        {daysRemainingLabel(milestone.daysLeft)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <CalendarDaysIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">{noMilestonesText}</p>
        </div>
    );
});

MilestoneCard.displayName = 'MilestoneCard';
