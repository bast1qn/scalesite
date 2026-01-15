// ============================================
// PROJECTS SECTION COMPONENT
// Displays list of projects with progress
// ============================================

import React from 'react';
import { BriefcaseIcon, ClockIcon, ArrowRightIcon } from '../../../Icons';
import { StatusBadge } from './StatusBadge';
import type { DashboardProject } from '../../../../types/dashboard';

export interface ProjectsSectionProps {
    projects: DashboardProject[];
    loading: boolean;
    title: string;
    countLabel: string;
    noProjectsText: string;
    startProjectText: string;
    lastUpdateText: string;
    onStartProject: () => void;
}

/**
 * Projects Section Component
 *
 * Displays a list of projects with progress bars and status badges
 */
export const ProjectsSection = React.memo<ProjectsSectionProps>(({
    projects,
    loading,
    title,
    countLabel,
    noProjectsText,
    startProjectText,
    lastUpdateText,
    onStartProject
}) => {
    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-lg shadow-slate-200/50 dark:shadow-black/30">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-blue-500" />
                    {title}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200/60 dark:border-blue-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {projects.length} {countLabel}
                </span>
            </div>

            <div className="space-y-4">
                {loading ? (
                    [1, 2].map(i => (
                        <div key={`skeleton-${i}`} className="skeleton h-28 rounded-xl"></div>
                    ))
                ) : projects.length > 0 ? projects.map((project) => (
                    <div key={project.id} className="group p-5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-blue-300/60 dark:hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{project.name}</h3>
                                    <StatusBadge status={project.status} />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 leading-relaxed">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    {lastUpdateText}: {project.latest_update || 'Keine Updates'}
                                </p>
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent leading-tight">{project.progress}%</span>
                        </div>

                        <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 10px)'
                            }}></div>
                            {/* Animated progress bar */}
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                                style={{ width: `${project.progress}%` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <BriefcaseIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 mb-3">{noProjectsText}</p>
                        <button onClick={onStartProject} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline group">
                            {startProjectText}
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

ProjectsSection.displayName = 'ProjectsSection';
