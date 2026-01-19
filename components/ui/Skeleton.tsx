// ============================================
// Skeleton Loading Components
// Premium Loading States mit Shimmer Effects
// ============================================

import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'wave';
}

/**
 * Base Skeleton Component mit Premium Shimmer Effect
 *
 * @example
 * <Skeleton variant="text" width="100%" height={20} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
 */
export const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
  className = '',
  ...props
}: SkeletonProps) => {
  const baseClasses = 'bg-slate-200 dark:bg-slate-800';

  const variantClasses = {
    text: 'rounded-sm',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    wave: 'animate-loading-shimmer',
  };

  const style: Record<string, string> = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`.trim()}
      style={style}
      {...props}
    />
  );
};

/**
 * Text Skeleton für verschiedene Text-Größen
 */
export const TextSkeleton = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '70%' : '100%'}
          height={i === 0 ? 24 : 20}
          animation="shimmer"
        />
      ))}
    </div>
  );
};

/**
 * Card Skeleton für Content Cards
 */
export const CardSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 ${className}`.trim()}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} animation="shimmer" />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={20} animation="shimmer" />
          <Skeleton variant="text" width="40%" height={16} animation="shimmer" className="mt-2" />
        </div>
      </div>

      {/* Content */}
      <TextSkeleton lines={3} />

      {/* Footer */}
      <div className="flex items-center gap-2 mt-4">
        <Skeleton variant="rounded" width={80} height={32} animation="shimmer" />
        <Skeleton variant="rounded" width={80} height={32} animation="shimmer" />
      </div>
    </div>
  );
};

/**
 * Hero Skeleton für Hero Section
 */
export const HeroSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Badge */}
      <div className="flex justify-center">
        <Skeleton variant="rounded" width={200} height={44} animation="shimmer" />
      </div>

      {/* Headline */}
      <div className="space-y-3">
        <Skeleton variant="text" width="90%" height={48} animation="shimmer" className="mx-auto" />
        <Skeleton variant="text" width="70%" height={48} animation="shimmer" className="mx-auto" />
      </div>

      {/* Subtitle */}
      <div className="flex justify-center">
        <Skeleton variant="text" width="60%" height={24} animation="shimmer" />
      </div>

      {/* CTAs */}
      <div className="flex items-center justify-center gap-4">
        <Skeleton variant="rounded" width={180} height={48} animation="shimmer" />
        <Skeleton variant="rounded" width={180} height={48} animation="shimmer" />
      </div>
    </div>
  );
};

/**
 * List Skeleton für Listen
 */
export const ListSkeleton = ({ items = 5, className = '' }: { items?: number; className?: string }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} animation="shimmer" />
          <div className="flex-1">
            <Skeleton variant="text" width="80%" height={18} animation="shimmer" />
            <Skeleton variant="text" width="50%" height={14} animation="shimmer" className="mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Table Skeleton für Tabellen
 */
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="15%" height={20} animation="shimmer" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="15%" height={16} animation="shimmer" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Grid Skeleton für Card Grids
 */
export const GridSkeleton = ({ items = 6, className = '' }: { items?: number; className?: string }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Form Skeleton für Formulare
 */
export const FormSkeleton = ({ fields = 4, className = '' }: { fields?: number; className?: string }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width="30%" height={16} animation="shimmer" />
          <Skeleton variant="rounded" width="100%" height={48} animation="shimmer" />
        </div>
      ))}
      <div className="flex gap-4">
        <Skeleton variant="rounded" width={120} height={48} animation="shimmer" />
        <Skeleton variant="rounded" width={120} height={48} animation="shimmer" />
      </div>
    </div>
  );
};

/**
 * Avatar Skeleton für User Avatars
 */
export const AvatarSkeleton = ({ size = 40, className = '' }: { size?: number; className?: string }) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      animation="shimmer"
      className={className}
    />
  );
};

/**
 * Image Skeleton für Bilder
 */
export const ImageSkeleton = ({ width = '100%', height = 200, className = '' }: { width?: string | number; height?: string | number; className?: string }) => {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      animation="shimmer"
      className={className}
    />
  );
};

/**
 * Button Skeleton für Buttons
 */
export const ButtonSkeleton = ({ width = 120, height = 48, className = '' }: { width?: string | number; height?: string | number; className?: string }) => {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      animation="shimmer"
      className={className}
    />
  );
};

/**
 * Loading Wrapper mit Kompletten Skeletts
 */
export const SkeletonWrapper = ({
  loading,
  children,
  skeleton,
  className = '',
}: {
  loading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
  className?: string;
}) => {
  if (loading) {
    return <div className={className}>{skeleton}</div>;
  }
  return <>{children}</>;
};
