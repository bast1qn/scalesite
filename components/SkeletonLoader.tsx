
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={Object.keys(style).length > 0 ? style : undefined}
    />
  ));

  return <>{skeletons}</>;
};

// Card Skeleton
export const CardSkeleton: React.FC<{ showAvatar?: boolean }> = ({ showAvatar = false }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
    {showAvatar && (
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-1/2"></div>
        </div>
      </div>
    )}
    <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-full mb-3"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-5/6 mb-3"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-4/6"></div>
  </div>
);

// Pricing Card Skeleton
export const PricingCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
    <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse mb-6"></div>
    <div className="h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-full mb-8"></div>
    <div className="h-10 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-1/2 mb-8"></div>
    <div className="space-y-3 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-full"></div>
        </div>
      ))}
    </div>
    <div className="h-14 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl"></div>
  </div>
);

// Blog Card Skeleton
export const BlogCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700">
    <div className="aspect-video bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full w-20"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-16"></div>
      </div>
      <div className="h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-full mb-3"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-5/6 mb-4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-4/6"></div>
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
    {/* Header */}
    <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded flex-1"></div>
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={colIndex} className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);
