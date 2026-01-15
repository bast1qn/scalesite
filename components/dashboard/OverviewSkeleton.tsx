/**
 * OverviewSkeleton - Premium Loading States for Dashboard Overview
 * Provides structured skeleton layouts that match the actual dashboard content
 * Uses shimmer effect for professional loading experience
 */

import React, { type FC } from 'react';
import { Skeleton } from '../SkeletonLoader';

/**
 * KPICard Skeleton - Matches the dashboard KPI card structure
 */
export const KPICardSkeleton: FC = () => (
  <div className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden animate-fade-in">
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent -translate-x-full animate-shimmer"></div>

    <div className="relative flex justify-between items-start mb-4">
      <div>
        <Skeleton width="60%" height="12px" className="mb-2" />
        <Skeleton width="40%" height="28px" />
      </div>
      <Skeleton variant="rounded" width="48px" height="48px" />
    </div>
    <Skeleton width="50%" height="12px" />
  </div>
);

/**
 * ProjectCard Skeleton - Matches the project card structure in dashboard
 */
export const ProjectCardSkeleton: FC = () => (
  <div className="group p-5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 animate-fade-in">
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent -translate-x-full animate-shimmer rounded-xl"></div>

    <div className="relative flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton width="40%" height="16px" />
          <Skeleton variant="rounded" width="60px" height="20px" />
        </div>
        <Skeleton width="30%" height="12px" />
      </div>
      <Skeleton width="40px" height="24px" />
    </div>

    <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <Skeleton className="h-full w-3/4 rounded-full" shimmer />
    </div>
  </div>
);

/**
 * ServerResources Skeleton - Matches the server resources card
 */
export const ServerResourcesSkeleton: FC = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 animate-fade-in">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width="20px" height="20px" />
        <Skeleton width="120px" height="16px" />
      </div>
      <Skeleton variant="rounded" width="40px" height="20px" />
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map(() => {
        const stableId = crypto.randomUUID();
        return (
          <div key={stableId}>
            <div className="flex justify-between mb-1.5">
              <Skeleton width="80px" height="10px" />
              <Skeleton width="30px" height="10px" />
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <Skeleton className="h-full w-2/3 rounded-full" shimmer />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/**
 * FinancialSnapshot Skeleton - Matches the financial card
 */
export const FinancialSnapshotSkeleton: FC = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 animate-fade-in">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width="20px" height="20px" />
        <Skeleton width="80px" height="16px" />
      </div>
      <Skeleton width="40px" height="14px" />
    </div>
    <div className="space-y-4">
      <Skeleton width="60%" height="24px" />
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
        <Skeleton className="h-full w-1/2 rounded-full shimmer" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3">
        <div className="text-center">
          <Skeleton width="100%" height="10px" className="mx-auto mb-1" />
          <Skeleton width="60%" height="14px" className="mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton width="100%" height="10px" className="mx-auto mb-1" />
          <Skeleton width="60%" height="14px" className="mx-auto" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * MilestoneCard Skeleton - Matches the milestone card
 */
export const MilestoneCardSkeleton: FC = () => (
  <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl p-5 text-white shadow-lg animate-fade-in">
    <div className="flex items-center gap-2 mb-3">
      <Skeleton variant="circular" width="16px" height="16px" className="bg-white/30" />
      <Skeleton width="120px" height="10px" className="bg-white/30" />
    </div>
    <Skeleton width="70%" height="18px" className="mb-2 bg-white/30" />
    <Skeleton width="90%" height="12px" className="mb-3 bg-white/20" />
    <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
      <div className="text-center">
        <Skeleton width="60px" height="16px" className="bg-white/30 mx-auto mb-1" />
        <Skeleton width="40px" height="8px" className="bg-white/20 mx-auto" />
      </div>
      <div className="h-6 w-px bg-white/20"></div>
      <Skeleton width="80px" height="12px" className="bg-white/20" />
    </div>
  </div>
);

/**
 * ActivityFeed Skeleton - Matches the activity feed
 */
export const ActivityFeedSkeleton: FC = () => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton variant="circular" width="16px" height="16px" />
      <Skeleton width="70px" height="14px" />
    </div>
    <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-4">
      {[1, 2, 3].map(() => {
        const stableId = crypto.randomUUID();
        return (
          <div key={stableId} className="relative">
            <Skeleton variant="circular" width="10px" height="10px" className="absolute -left-[21px] top-0.5" />
            <Skeleton width="80%" height="12px" className="mb-1" />
            <Skeleton width="40%" height="10px" />
          </div>
        );
      })}
    </div>
  </div>
);

/**
 * CompleteOverviewSkeleton - Full dashboard overview loading state
 * Combines all skeleton components for a complete loading experience
 */
export const CompleteOverviewSkeleton: FC = () => (
  <div className="space-y-8 animate-fade-in">
    {/* Header Skeleton */}
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-600 shadow-xl">
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton width="50%" height="28px" className="mb-2 bg-white/30" />
          <Skeleton width="60%" height="16px" className="bg-white/20" />
        </div>
        <div className="flex gap-3">
          <Skeleton variant="rounded" width="100px" height="40px" className="bg-white/20" />
          <Skeleton variant="rounded" width="120px" height="40px" className="bg-white/30" />
        </div>
      </div>
    </div>

    {/* KPI Grid Skeleton */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <KPICardSkeleton />
      <KPICardSkeleton />
      <KPICardSkeleton />
    </div>

    {/* Projects Section Skeleton */}
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width="20px" height="20px" />
          <Skeleton width="150px" height="18px" />
        </div>
        <Skeleton variant="rounded" width="80px" height="24px" />
      </div>
      <div className="space-y-4">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>

    {/* Main Content Grid Skeleton */}
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <ServerResourcesSkeleton />
          <FinancialSnapshotSkeleton />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <MilestoneCardSkeleton />
        <ActivityFeedSkeleton />

        {/* Tip Card Skeleton */}
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-xl flex gap-3">
          <Skeleton variant="rounded" width="32px" height="32px" />
          <div className="flex-1">
            <Skeleton width="100px" height="14px" className="mb-1" />
            <Skeleton width="100%" height="10px" />
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="space-y-2">
          <Skeleton width="100px" height="10px" />
          <Skeleton variant="rounded" width="100%" height="44px" />
          <Skeleton variant="rounded" width="100%" height="44px" />
        </div>
      </div>
    </div>
  </div>
);

export default CompleteOverviewSkeleton;
