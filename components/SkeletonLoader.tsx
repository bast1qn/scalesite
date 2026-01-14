import { type FC, type CSSProperties } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  shimmer?: boolean; // Enable/disable shimmer effect
}

/**
 * Premium Skeleton Component with Shimmer Effect (Linear/Stripe-style)
 * Uses shimmer animation instead of simple pulse for more polished loading state
 */
export const Skeleton: FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
  shimmer = true
}) => {
  const baseClasses = shimmer
    ? 'bg-slate-200 dark:bg-slate-800 animate-shimmer'
    : 'animate-pulse bg-slate-200 dark:bg-slate-800';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl'
  };

  const style: CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  if (shimmer) {
    style.backgroundSize = '200% 100%';
    style.backgroundImage = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)';
  }

  // ✅ FIX: Use crypto.randomUUID() instead of index for stable keys
  // Index-based keys cause React to remount elements unnecessarily when list changes
  const skeletons = Array.from({ length: count }, () => {
    const stableId = crypto.randomUUID();
    return (
      <div
        key={stableId}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={Object.keys(style).length > 0 ? style : undefined}
        aria-hidden="true"
      />
    );
  });

  return <>{skeletons}</>;
};

// Card Skeleton with Shimmer Effect
export const CardSkeleton: FC<{ showAvatar?: boolean }> = ({ showAvatar = false }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in" role="status" aria-label="Loading card">
    {showAvatar && (
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-shimmer"></div>
        <div className="flex-1">
          <Skeleton width="75%" className="mb-2" />
          <Skeleton width="50%" height="12px" />
        </div>
      </div>
    )}
    <Skeleton className="mb-3" />
    <Skeleton width="83%" className="mb-3" />
    <Skeleton width="66%" />
  </div>
);

// Pricing Card Skeleton with Shimmer Effect
export const PricingCardSkeleton: FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 animate-fade-in" role="status" aria-label="Loading pricing card">
    <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-shimmer mb-6"></div>
    <Skeleton height="24px" width="75%" className="mb-4" />
    <Skeleton className="mb-8" />
    <Skeleton height="40px" width="50%" className="mb-8" />
    <div className="space-y-3 mb-8">
      {[1, 2, 3, 4].map(() => {
        // ✅ FIX: Generate stable unique ID instead of using index
        const stableId = crypto.randomUUID();
        return (
          <div key={stableId} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-shimmer flex-shrink-0"></div>
            <Skeleton />
          </div>
        );
      })}
    </div>
    <Skeleton height="56px" variant="rounded" />
  </div>
);

// Blog Card Skeleton with Shimmer Effect
export const BlogCardSkeleton: FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in" role="status" aria-label="Loading blog card">
    <div className="aspect-video bg-slate-200 dark:bg-slate-700 animate-shimmer"></div>
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton height="32px" width="80px" variant="rounded" />
        <Skeleton width="64px" />
      </div>
      <Skeleton height="24px" className="mb-3" />
      <Skeleton height="24px" width="83%" className="mb-4" />
      <Skeleton className="mb-2" />
      <Skeleton width="66%" />
    </div>
  </div>
);

// Table Skeleton with Shimmer Effect
export const TableSkeleton: FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in" role="status" aria-label="Loading table">
    {/* Header */}
    <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
      {Array.from({ length: cols }).map(() => {
        // ✅ FIX: Generate stable unique ID instead of using index
        const stableId = crypto.randomUUID();
        return <Skeleton key={stableId} />;
      })}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map(() => {
      // ✅ FIX: Generate stable unique ID for each row
      const rowId = crypto.randomUUID();
      return (
        <div key={rowId} className="flex gap-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
          {Array.from({ length: cols }).map(() => {
            // ✅ FIX: Generate stable unique ID for each column
            const colId = crypto.randomUUID();
            return <Skeleton key={colId} />;
          })}
        </div>
      );
    })}
  </div>
);

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'slate';
  className?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'white',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    white: 'text-white',
    primary: 'text-primary',
    slate: 'text-slate-500'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};
