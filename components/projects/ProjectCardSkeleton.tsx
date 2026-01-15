/**
 * ProjectCardSkeleton - Premium Loading State for Project Cards
 * Matches the exact structure of ProjectCard component
 * Uses shimmer effect for professional loading experience
 */

import React, { type FC } from 'react';
import { Skeleton } from '../SkeletonLoader';

interface ProjectCardSkeletonProps {
  variant?: 'default' | 'compact';
  count?: number;
}

/**
 * Single ProjectCard Skeleton
 */
export const ProjectCardSkeletonItem: FC<ProjectCardSkeletonProps> = ({
  variant = 'default'
}) => (
  <div className="animate-fade-in">
    <div
      className={`
        bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
        relative overflow-hidden group
        ${variant === 'default' ? 'p-6' : 'p-4'}
      `}
    >
      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative">
        <div className="flex-1 min-w-0">
          <Skeleton width="70%" height="18px" className="mb-2" />
          {variant === 'default' && (
            <>
              <Skeleton width="100%" height="12px" className="mb-1" />
              <Skeleton width="60%" height="12px" />
            </>
          )}
        </div>

        {/* Status Badge Skeleton */}
        <Skeleton variant="rounded" width="70px" height="22px" className="ml-2 flex-shrink-0" />
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton width="80px" height="12px" />
          <Skeleton width="35px" height="14px" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <Skeleton className="h-full w-3/4 rounded-full" shimmer />
        </div>
      </div>

      {/* Footer */}
      {variant === 'default' && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1">
              <Skeleton variant="circular" width="14px" height="14px" />
              <Skeleton width="60px" height="10px" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton variant="circular" width="14px" height="14px" />
              <Skeleton width="40px" height="10px" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Skeleton width="40px" height="12px" />
            <Skeleton variant="circular" width="16px" height="16px" />
          </div>
        </div>
      )}

      {/* Compact Variant Footer */}
      {variant === 'compact' && (
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Skeleton variant="circular" width="14px" height="14px" />
              <Skeleton width="40px" height="10px" />
            </div>
          </div>
          <Skeleton variant="circular" width="16px" height="16px" />
        </div>
      )}
    </div>
  </div>
);

/**
 * Multiple ProjectCard Skeletons
 */
export const ProjectCardSkeleton: FC<ProjectCardSkeletonProps> = ({
  variant = 'default',
  count = 1
}) => (
  <>
    {Array.from({ length: count }, () => {
      const stableId = crypto.randomUUID();
      return (
        <div key={stableId} className="mb-4">
          <ProjectCardSkeletonItem variant={variant} />
        </div>
      );
    })}
  </>
);

export default ProjectCardSkeleton;
