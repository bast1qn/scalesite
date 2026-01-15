import React from 'react';

interface ButtonSkeletonProps {
  className?: string;
  width?: string;
}

export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  className = '',
  width = '100%'
}) => {
  return (
    <div
      className={`skeleton-shimmer h-11 rounded-xl ${className}`}
      style={{ width }}
      aria-hidden="true"
    />
  );
};

interface InputSkeletonProps {
  className?: string;
}

export const InputSkeleton: React.FC<InputSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`skeleton-shimmer h-11 rounded-xl w-full ${className}`}
      aria-hidden="true"
    />
  );
};

interface TextSkeletonProps {
  className?: string;
  lines?: number;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  className = '',
  lines = 3
}) => {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer h-4 rounded"
          style={{
            width: i === lines - 1 ? '60%' : '100%'
          }}
        />
      ))}
    </div>
  );
};

interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-3xl p-6 ${className}`}
      aria-hidden="true"
    >
      <div className="space-y-4">
        <div className="skeleton-pulse h-6 w-3/4 rounded" />
        <div className="skeleton-pulse h-4 w-1/2 rounded" />
        <div className="space-y-2 pt-4">
          <div className="skeleton-pulse h-3 w-full rounded" />
          <div className="skeleton-pulse h-3 w-full rounded" />
          <div className="skeleton-pulse h-3 w-3/4 rounded" />
        </div>
        <div className="skeleton-pulse h-11 w-full rounded-xl" />
      </div>
    </div>
  );
};

interface AvatarSkeletonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div
      className={`skeleton-shimmer rounded-full ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );
};
