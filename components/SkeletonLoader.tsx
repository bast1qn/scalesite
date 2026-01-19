import { type FC, type CSSProperties } from 'react';
import { Card } from './ui/Card';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  shimmer?: boolean; // Enable/disable shimmer effect
  'aria-label'?: string; // Optional label for accessibility
}

/**
 * Premium Skeleton Component with Shimmer Effect (Linear/Stripe-style)
 * Uses shimmer animation instead of simple pulse for more polished loading state
 * WCAG 2.1 AA Compliant with proper ARIA labels
 */
export const Skeleton: FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
  shimmer = true,
  'aria-label': ariaLabel
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
        aria-busy="true"
        role="status"
        aria-label={ariaLabel || 'Loading content...'}
      />
    );
  });

  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{ariaLabel || 'Loading content...'}</span>
      {skeletons}
    </div>
  );
};

// Card Skeleton with Shimmer Effect - Enhanced Accessibility
export const CardSkeleton: FC<{ showAvatar?: boolean }> = ({ showAvatar = false }) => (
  <Card aria-label="Loading card..." aria-busy="true">
    {showAvatar && (
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-shimmer" aria-hidden="true"></div>
        <div className="flex-1 space-y-2">
          <Skeleton width="75%" aria-label="Loading title..." />
          <Skeleton width="50%" height="12px" aria-label="Loading subtitle..." />
        </div>
      </div>
    )}
    <div className="space-y-3">
      <Skeleton className="h-4" aria-label="Loading content line..." />
      <Skeleton width="83%" className="h-4" aria-label="Loading content line..." />
      <Skeleton width="66%" className="h-4" aria-label="Loading content line..." />
    </div>
  </Card>
);

// Pricing Card Skeleton with Shimmer Effect - Enhanced Accessibility
export const PricingCardSkeleton: FC = () => (
  <Card aria-label="Loading pricing card..." aria-busy="true" className="p-8">
    <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-shimmer mb-6" aria-hidden="true"></div>
    <Skeleton height="24px" width="75%" className="mb-4" aria-label="Loading plan name..." />
    <Skeleton className="mb-8 h-4" aria-label="Loading plan description..." />
    <Skeleton height="40px" width="50%" className="mb-8" aria-label="Loading price..." />
    <div className="space-y-3 mb-8" role="list" aria-label="Loading features...">
      {[1, 2, 3, 4].map(() => {
        // ✅ FIX: Generate stable unique ID instead of using index
        const stableId = crypto.randomUUID();
        return (
          <div key={stableId} className="flex items-center gap-3" role="listitem">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-shimmer flex-shrink-0" aria-hidden="true"></div>
            <Skeleton aria-label="Loading feature..." />
          </div>
        );
      })}
    </div>
    <Skeleton height="56px" variant="rounded" aria-label="Loading button..." />
  </Card>
);

// Blog Card Skeleton with Shimmer Effect - Enhanced Accessibility
export const BlogCardSkeleton: FC = () => (
  <Card aria-label="Loading blog post..." aria-busy="true" className="overflow-hidden">
    <div className="aspect-video bg-slate-200 dark:bg-slate-700 animate-shimmer" aria-hidden="true"></div>
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton height="32px" width="80px" variant="rounded" aria-label="Loading category..." />
        <Skeleton width="64px" aria-label="Loading date..." />
      </div>
      <Skeleton height="24px" className="mb-3" aria-label="Loading title..." />
      <Skeleton height="24px" width="83%" className="mb-4" aria-label="Loading title continued..." />
      <div className="space-y-2">
        <Skeleton className="h-4" aria-label="Loading excerpt..." />
        <Skeleton width="66%" className="h-4" aria-label="Loading excerpt continued..." />
      </div>
    </div>
  </Card>
);

// Table Skeleton with Shimmer Effect - Enhanced Accessibility
export const TableSkeleton: FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in" role="status" aria-label="Loading table..." aria-busy="true">
    {/* Header */}
    <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700" role="row">
      {Array.from({ length: cols }).map(() => {
        // ✅ FIX: Generate stable unique ID instead of using index
        const stableId = crypto.randomUUID();
        return <Skeleton key={stableId} aria-label="Loading column header..." />;
      })}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map(() => {
      // ✅ FIX: Generate stable unique ID for each row
      const rowId = crypto.randomUUID();
      return (
        <div key={rowId} className="flex gap-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0" role="row">
          {Array.from({ length: cols }).map(() => {
            // ✅ FIX: Generate stable unique ID for each column
            const colId = crypto.randomUUID();
            return <Skeleton key={colId} aria-label="Loading cell data..." />;
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
