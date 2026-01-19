import { memo } from 'react';

interface LoadingStateProps {
  /**
   * Number of skeleton cards to display
   * @default 3
   */
  cards?: number;
  /**
   * Whether to show full card layout
   * @default true
   */
  showHeader?: boolean;
}

/**
 * LoadingState - Premium loading skeleton (Vercel-inspired)
 *
 * Features:
 * - GPU-accelerated shimmer animation
 * - Consistent spacing (4px scale)
 * - Multiple layout variants
 * - Accessible (with aria-busy)
 */
export const LoadingState = memo(({ cards = 3, showHeader = true }: LoadingStateProps) => {
  return (
    <div className="loading-state" aria-busy="true" aria-label="Loading content">
      {/* Generate skeleton cards */}
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="loading-skeleton-card mb-6 last:mb-0"
        >
          {/* Optional header image */}
          {showHeader && (
            <div className="loading-skeleton-header" aria-hidden="true"></div>
          )}

          {/* Content skeleton */}
          <div className="loading-skeleton-content" aria-hidden="true">
            {/* Title skeleton */}
            <div className="loading-skeleton-line-short mb-4"></div>

            {/* Text line skeletons */}
            <div className="loading-skeleton-line mb-2"></div>
            <div className="loading-skeleton-line mb-2"></div>
            <div className="loading-skeleton-line mb-4"></div>

            {/* Action button skeleton */}
            <div className="loading-skeleton-line-short w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
});

LoadingState.displayName = 'LoadingState';
