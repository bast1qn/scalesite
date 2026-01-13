import { type FC } from 'react';

interface CardSkeletonProps {
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * CardSkeleton - Ladezustand für Karten
 *
 * Features:
 * - Avatar optional
 * - Bild optional
 * - Konfigurierbare Textzeilen
 * - 3 Varianten: default, compact, detailed
 * - Shimmer Animation
 * - Dark Mode Support
 */
export const CardSkeleton: FC<CardSkeletonProps> = ({
  showAvatar = false,
  showImage = false,
  lines = 3,
  className = '',
  variant = 'default'
}) => {
  const baseClass = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  const paddingClass = {
    default: 'p-6',
    compact: 'p-4',
    detailed: 'p-8'
  }[variant];

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 ${paddingClass} ${className}`}>
      {/* Image */}
      {showImage && (
        <div className={`${baseClass} aspect-video mb-4`} style={{ animationDelay: '100ms' }} />
      )}

      {/* Avatar */}
      {showAvatar && (
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`${baseClass} w-12 h-12 rounded-full flex-shrink-0`}
            style={{ animationDelay: '150ms' }}
          />
          <div className="flex-1 space-y-2">
            <div
              className={`${baseClass} h-4 w-3/4`}
              style={{ animationDelay: '200ms' }}
            />
            <div
              className={`${baseClass} h-3 w-1/2`}
              style={{ animationDelay: '250ms' }}
            />
          </div>
        </div>
      )}

      {/* Title */}
      <div
        className={`${baseClass} h-6 w-full mb-3`}
        style={{ animationDelay: '300ms' }}
      />

      {/* Text Lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-4`}
            style={{
              width: i === lines - 1 ? '70%' : '100%',
              animationDelay: `${350 + (i * 50)}ms`
            }}
          />
        ))}
      </div>

      {/* Button (optional for detailed variant) */}
      {variant === 'detailed' && (
        <div
          className={`${baseClass} h-10 w-1/2 mt-6`}
          style={{ animationDelay: '600ms' }}
        />
      )}
    </div>
  );
};

/**
 * ProjectCardSkeleton - Spezieller Skeleton für Projektkarten
 */
export const ProjectCardSkeleton: FC<{ className?: string }> = ({ className = '' }) => {
  const baseClass = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header with icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${baseClass} w-10 h-10 rounded-xl`} style={{ animationDelay: '100ms' }} />
          <div className={`${baseClass} h-5 w-32`} style={{ animationDelay: '150ms' }} />
        </div>
        <div className={`${baseClass} h-6 w-20 rounded-full`} style={{ animationDelay: '200ms' }} />
      </div>

      {/* Title */}
      <div className={`${baseClass} h-6 w-full mb-2`} style={{ animationDelay: '250ms' }} />
      <div className={`${baseClass} h-4 w-3/4 mb-4`} style={{ animationDelay: '300ms' }} />

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <div className={`${baseClass} h-3 w-16`} style={{ animationDelay: '350ms' }} />
          <div className={`${baseClass} h-3 w-12`} style={{ animationDelay: '400ms' }} />
        </div>
        <div className={`${baseClass} h-2 w-full`} style={{ animationDelay: '450ms' }} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className={`${baseClass} h-3 w-24`} style={{ animationDelay: '500ms' }} />
        <div className={`${baseClass} h-8 w-8 rounded-lg`} style={{ animationDelay: '550ms' }} />
      </div>
    </div>
  );
};

/**
 * TicketCardSkeleton - Spezieller Skeleton für Ticketkarten
 */
export const TicketCardSkeleton: FC<{ className?: string }> = ({ className = '' }) => {
  const baseClass = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={`${baseClass} h-5 w-20 mb-2`} style={{ animationDelay: '100ms' }} />
          <div className={`${baseClass} h-6 w-full mb-1`} style={{ animationDelay: '150ms' }} />
          <div className={`${baseClass} h-4 w-2/3`} style={{ animationDelay: '200ms' }} />
        </div>
        <div className={`${baseClass} w-16 h-6 rounded-full ml-4`} style={{ animationDelay: '250ms' }} />
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`${baseClass} h-4 w-24`} style={{ animationDelay: '300ms' }} />
        <div className={`${baseClass} h-4 w-20`} style={{ animationDelay: '350ms' }} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className={`${baseClass} w-6 h-6 rounded-full`} style={{ animationDelay: '400ms' }} />
          <div className={`${baseClass} h-3 w-20`} style={{ animationDelay: '450ms' }} />
        </div>
        <div className={`${baseClass} h-8 w-8 rounded-lg`} style={{ animationDelay: '500ms' }} />
      </div>
    </div>
  );
};

/**
 * InvoiceCardSkeleton - Spezieller Skeleton für Rechnungskarten
 */
export const InvoiceCardSkeleton: FC<{ className?: string }> = ({ className = '' }) => {
  const baseClass = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={`${baseClass} h-5 w-24 mb-2`} style={{ animationDelay: '100ms' }} />
          <div className={`${baseClass} h-4 w-32`} style={{ animationDelay: '150ms' }} />
        </div>
        <div className={`${baseClass} w-20 h-6 rounded-full`} style={{ animationDelay: '200ms' }} />
      </div>

      {/* Amount */}
      <div className={`${baseClass} h-8 w-32 mb-4`} style={{ animationDelay: '250ms' }} />

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className={`${baseClass} h-3 w-full`} style={{ animationDelay: '300ms' }} />
        <div className={`${baseClass} h-3 w-2/3`} style={{ animationDelay: '350ms' }} />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className={`${baseClass} h-8 w-8 rounded-lg`} style={{ animationDelay: '400ms' }} />
        <div className={`${baseClass} h-8 w-8 rounded-lg`} style={{ animationDelay: '450ms' }} />
      </div>
    </div>
  );
};

/**
 * TeamCardSkeleton - Spezieller Skeleton für Teamkarten
 */
export const TeamCardSkeleton: FC<{ className?: string }> = ({ className = '' }) => {
  const baseClass = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div
          className={`${baseClass} w-20 h-20 rounded-full mb-3`}
          style={{ animationDelay: '100ms' }}
        />
        <div
          className={`${baseClass} h-5 w-32 mb-1`}
          style={{ animationDelay: '150ms' }}
        />
        <div
          className={`${baseClass} h-4 w-40 mb-2`}
          style={{ animationDelay: '200ms' }}
        />
        <div
          className={`${baseClass} h-6 w-24 rounded-full`}
          style={{ animationDelay: '250ms' }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 py-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <div className={`${baseClass} h-6 w-12 mx-auto mb-1`} style={{ animationDelay: '300ms' }} />
          <div className={`${baseClass} h-3 w-16 mx-auto`} style={{ animationDelay: '350ms' }} />
        </div>
        <div className="text-center">
          <div className={`${baseClass} h-6 w-12 mx-auto mb-1`} style={{ animationDelay: '400ms' }} />
          <div className={`${baseClass} h-3 w-16 mx-auto`} style={{ animationDelay: '450ms' }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <div
          className={`${baseClass} h-10 flex-1`}
          style={{ animationDelay: '500ms' }}
        />
        <div
          className={`${baseClass} h-10 w-10`}
          style={{ animationDelay: '550ms' }}
        />
      </div>
    </div>
  );
};

export default CardSkeleton;
