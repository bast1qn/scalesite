// ============================================
// OVERVIEW HEADER COMPONENT
// Main header section with actions
// ============================================

import React from 'react';
import { TicketIcon, PlusCircleIcon } from '../../../Icons';

export interface OverviewHeaderProps {
    userName: string;
    welcomeText: string;
    progressText: string;
    ticketsText: string;
    newProjectText: string;
    onTicketClick: () => void;
    onNewProjectClick: () => void;
}

/**
 * Overview Header Component
 *
 * Displays the main header with gradient background and action buttons
 */
export const OverviewHeader = React.memo<OverviewHeaderProps>(({
    userName,
    welcomeText,
    progressText,
    ticketsText,
    newProjectText,
    onTicketClick,
    onNewProjectClick
}) => {
    return (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-600 shadow-xl shadow-blue-500/20">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] [size:20px]"></div>
            </div>
            {/* Animated gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-gradient-orb-1"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl animate-gradient-orb-2"></div>

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {welcomeText} {userName}
                    </h1>
                    <p className="text-white/80 mt-1 font-medium">{progressText}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onTicketClick}
                        className="group px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-white/50 min-h-11"
                    >
                        <TicketIcon className="w-4 h-4 group-hover:scale-[1.02] transition-transform" />
                        {ticketsText}
                    </button>
                    <button
                        onClick={onNewProjectClick}
                        className="group px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-500/50 min-h-11"
                    >
                        <PlusCircleIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        {newProjectText}
                    </button>
                </div>
            </div>
        </div>
    );
});

OverviewHeader.displayName = 'OverviewHeader';
