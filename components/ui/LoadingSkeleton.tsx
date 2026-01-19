// React
import { type ReactNode, type CSSProperties } from 'react';

// Types
export interface SkeletonProps {
  /**
   * Width of the skeleton
   * Can be a Tailwind class or a specific value
   * @default 'w-full'
   */
  width?: string;

  /**
   * Height of the skeleton
   * Can be a Tailwind class or a specific value
   * @default 'h-4'
   */
  height?: string;

  /**
   * Border radius of the skeleton
   * @default 'rounded'
   */
  variant?: 'rounded' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-full';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Animation type
   * @default 'shimmer'
   */
  animation?: 'shimmer' | 'pulse' | 'none';
}

/**
 * Skeleton Component - Vercel-inspired premium loading skeletons
 *
 * @example
 * ```tsx
 * <Skeleton width="w-full" height="h-4" />
 * <Skeleton width="w-2/3" height="h-4" variant="rounded-lg" />
 * ```
 */
export const Skeleton = ({
  width = 'w-full',
  height = 'h-4',
  variant = 'rounded',
  className = '',
  style = {},
  animation = 'shimmer',
}: SkeletonProps) => {
  const variantClasses = {
    'rounded-sm': 'rounded-sm',
    rounded: 'rounded',
    'rounded-md': 'rounded-md',
    'rounded-lg': 'rounded-lg',
    'rounded-xl': 'rounded-xl',
    'rounded-full': 'rounded-full',
  };

  const animationClasses = {
    shimmer: 'skeleton-shimmer',
    pulse: 'animate-pulse',
    none: '',
  };

  return (
    <div
      className={`
        relative overflow-hidden
        bg-slate-200 dark:bg-slate-800
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${width}
        ${height}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  );
};

// ============================================================================
// CARD SKELETON
// ============================================================================

export interface CardSkeletonProps {
  /**
   * Show header section
   * @default true
   */
  showHeader?: boolean;

  /**
   * Show footer section
   * @default true
   */
  showFooter?: boolean;

  /**
   * Number of content lines
   * @default 3
   */
  contentLines?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CardSkeleton Component - Realistic card loading state
 *
 * @example
 * ```tsx
 * <CardSkeleton />
 * <CardSkeleton contentLines={5} />
 * ```
 */
export const CardSkeleton = ({
  showHeader = true,
  showFooter = true,
  contentLines = 3,
  className = '',
}: CardSkeletonProps) => {
  return (
    <div
      className={`
        p-6 rounded-2xl border
        border-slate-200 dark:border-slate-700
        ${className}
      `}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-4 mb-6">
          <Skeleton width="w-12 h-12" variant="rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/3 h-4" />
            <Skeleton width="w-1/4 h-3" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {Array.from({ length: contentLines }).map((_, index) => (
          <Skeleton
            key={index}
            width={index === contentLines - 1 ? 'w-4/6' : 'w-full'}
            height="h-3"
          />
        ))}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="mt-6 flex items-center justify-between">
          <Skeleton width="w-24 h-8" variant="rounded-xl" />
          <Skeleton width="w-8 h-8" variant="rounded-full" />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// LIST SKELETON
// ============================================================================

export interface ListSkeletonProps {
  /**
   * Number of items to show
   * @default 5
   */
  count?: number;

  /**
   * Show avatar
   * @default true
   */
  showAvatar?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ListSkeleton Component - List item loading states
 *
 * @example
 * ```tsx
 * <ListSkeleton count={5} />
 * <ListSkeleton count={3} showAvatar={false} />
 * ```
 */
export const ListSkeleton = ({
  count = 5,
  showAvatar = true,
  className = '',
}: ListSkeletonProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4">
          {showAvatar && <Skeleton width="w-12 h-12" variant="rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton width="w-3/4 h-4" />
            <Skeleton width="w-1/2 h-3" />
          </div>
          <Skeleton width="w-20 h-8" variant="rounded-xl" />
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// TABLE SKELETON
// ============================================================================

export interface TableSkeletonProps {
  /**
   * Number of rows to show
   * @default 5
   */
  rows?: number;

  /**
   * Number of columns to show
   * @default 4
   */
  columns?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * TableSkeleton Component - Table loading state
 *
 * @example
 * ```tsx
 * <TableSkeleton rows={5} columns={4} />
 * ```
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  className = '',
}: TableSkeletonProps) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} width="w-24 h-4" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="w-full h-3" />
          ))}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// HERO SKELETON
// ============================================================================

export interface HeroSkeletonProps {
  /**
   * Show badge
   * @default true
   */
  showBadge?: boolean;

  /**
   * Show subtitle
   * @default true
   */
  showSubtitle?: boolean;

  /**
   * Show CTAs
   * @default true
   */
  showCTAs?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * HeroSkeleton Component - Hero section loading state
 *
 * @example
 * ```tsx
 * <HeroSkeleton />
 * ```
 */
export const HeroSkeleton = ({
  showBadge = true,
  showSubtitle = true,
  showCTAs = true,
  className = '',
}: HeroSkeletonProps) => {
  return (
    <div className={`text-center ${className}`}>
      {/* Badge */}
      {showBadge && (
        <div className="inline-flex items-center justify-center mb-12">
          <div className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
            <Skeleton width="w-32 h-4" />
          </div>
        </div>
      )}

      {/* Headline */}
      <div className="mb-8 space-y-3">
        <Skeleton width="w-3/4 mx-auto h-12" variant="rounded-lg" />
        <Skeleton width="w-1/2 mx-auto h-12" variant="rounded-lg" />
      </div>

      {/* Subtitle */}
      {showSubtitle && (
        <div className="max-w-2xl mx-auto mb-12">
          <Skeleton width="w-full h-6" />
          <Skeleton width="w-4/5 mx-auto h-6 mt-2" />
        </div>
      )}

      {/* CTAs */}
      {showCTAs && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Skeleton width="w-40 h-11" variant="rounded-xl" />
          <Skeleton width="w-40 h-11" variant="rounded-xl" />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PRICING CARD SKELETON
// ============================================================================

export interface PricingCardSkeletonProps {
  /**
   * Show popular badge
   * @default false
   */
  showBadge?: boolean;

  /**
   * Number of features to show
   * @default 5
   */
  featureCount?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PricingCardSkeleton Component - Pricing card loading state
 *
 * @example
 * ```tsx
 * <PricingCardSkeleton showBadge featureCount={6} />
 * ```
 */
export const PricingCardSkeleton = ({
  showBadge = false,
  featureCount = 5,
  className = '',
}: PricingCardSkeletonProps) => {
  return (
    <div
      className={`
        relative flex flex-col p-7 rounded-2xl
        border border-slate-200 dark:border-slate-700
        ${className}
      `}
    >
      {/* Popular badge */}
      {showBadge && (
        <div className="absolute -top-2.5 left-0 right-0 flex justify-center z-10">
          <Skeleton width="w-24 h-7" variant="rounded-full" />
        </div>
      )}

      {/* Header */}
      <div className="mb-6 mt-3 space-y-2">
        <Skeleton width="w-1/2 h-6" />
        <Skeleton width="w-3/4 h-4" />
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-6">
        <Skeleton width="w-20 h-10" />
        <Skeleton width="w-16 h-4" />
      </div>

      {/* Divider */}
      <div className="h-px w-full mb-6 bg-slate-200 dark:bg-slate-700"></div>

      {/* Features */}
      <div className="space-y-3 flex-grow mb-6">
        {Array.from({ length: featureCount }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton width="w-4 h-4" variant="rounded-md" />
            <Skeleton width="w-full h-3" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <Skeleton width="w-full h-11" variant="rounded-xl" />

      {/* Trust footer */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <Skeleton width="w-4 h-4" variant="rounded-full" />
        <Skeleton width="w-32 h-3" />
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default Skeleton;
