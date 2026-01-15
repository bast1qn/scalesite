import { type FC } from 'react';

interface TextSkeletonProps {
  lines?: number;
  width?: string | number | 'random';
  className?: string;
  variant?: 'default' | 'heading' | 'subheading';
}

/**
 * TextSkeleton - Ladezustand für Text
 *
 * Features:
 * - Konfigurierbare Zeilenanzahl
 * - Flexible Breite (Pixel, Prozent, oder Random)
 * - 3 Varianten: default, heading, subheading
 * - Shimmer Animation
 * - Dark Mode Support
 */
export const TextSkeleton: FC<TextSkeletonProps> = ({
  lines = 1,
  width = '100%',
  className = '',
  variant = 'default'
}) => {
  // Enhanced shimmer effect (premium loading state)
  const baseClass = 'skeleton-shimmer bg-slate-200 dark:bg-slate-800 rounded';

  const heights = {
    default: 'h-4',
    heading: 'h-6',
    subheading: 'h-5'
  };

  const getHeight = (index: number) => {
    if (variant === 'heading' && index === 0) return 'h-7';
    return heights[variant];
  };

  const getWidth = (index: number, total: number) => {
    if (width === 'random') {
      // Random width between 60% and 100%
      const randomWidth = 60 + Math.random() * 40;
      return index === total - 1 ? `${randomWidth}%` : '100%';
    }
    if (index === total - 1) {
      // Last line is shorter
      return typeof width === 'number' ? `${width * 0.7}px` : '70%';
    }
    return typeof width === 'number' ? `${width}px` : width;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${getHeight(i)}`}
          style={{
            width: getWidth(i, lines),
            animationDelay: `${i * 50}ms`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  );
};

/**
 * ParagraphSkeleton - Für Absätze mit mehreren Zeilen
 */
interface ParagraphSkeletonProps {
  paragraphs?: number;
  linesPerParagraph?: number;
  className?: string;
}

export const ParagraphSkeleton: FC<ParagraphSkeletonProps> = ({
  paragraphs = 2,
  linesPerParagraph = 4,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: paragraphs }).map((_, pIndex) => (
        <TextSkeleton
          key={pIndex}
          lines={linesPerParagraph}
          width="random"
        />
      ))}
    </div>
  );
};

/**
 * HeadingSkeleton - Für Überschriften mit Abschnitten
 */
interface HeadingSkeletonProps {
  showSubheading?: boolean;
  showParagraph?: boolean;
  paragraphLines?: number;
  className?: string;
}

export const HeadingSkeleton: FC<HeadingSkeletonProps> = ({
  showSubheading = true,
  showParagraph = true,
  paragraphLines = 3,
  className = ''
}) => {
  // Enhanced shimmer effect (premium loading state)
  const baseClass = 'skeleton-shimmer bg-slate-200 dark:bg-slate-800 rounded';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Heading */}
      <div className={`${baseClass} h-7 w-3/4`} style={{ animationDelay: '100ms' }} />

      {/* Subheading */}
      {showSubheading && (
        <div className={`${baseClass} h-5 w-1/2`} style={{ animationDelay: '150ms' }} />
      )}

      {/* Paragraph */}
      {showParagraph && (
        <div className="space-y-2 pt-2">
          {Array.from({ length: paragraphLines }).map((_, i) => (
            <div
              key={i}
              className={`${baseClass} h-4`}
              style={{
                width: i === paragraphLines - 1 ? '60%' : '100%',
                animationDelay: `${200 + (i * 50)}ms`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * ListSkeleton - Für Listeneinträge
 */
interface ListSkeletonProps {
  items?: number;
  showIcon?: boolean;
  className?: string;
}

export const ListSkeleton: FC<ListSkeletonProps> = ({
  items = 5,
  showIcon = true,
  className = ''
}) => {
  // Enhanced shimmer effect (premium loading state)
  const baseClass = 'skeleton-shimmer bg-slate-200 dark:bg-slate-800 rounded';

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3" style={{ animationDelay: `${i * 50}ms` }}>
          {/* Icon/Bullet */}
          {showIcon && (
            <div
              className={`${baseClass} w-5 h-5 flex-shrink-0`}
              style={{ animationDelay: `${i * 50 + 25}ms` }}
            />
          )}

          {/* Text */}
          <div className={`${baseClass} h-4 flex-1`} style={{ animationDelay: `${i * 50 + 50}ms` }} />
        </div>
      ))}
    </div>
  );
};

/**
 * MetadataSkeleton - Für Metadaten (Labels mit Werten)
 */
interface MetadataSkeletonProps {
  items?: number;
  className?: string;
}

export const MetadataSkeleton: FC<MetadataSkeletonProps> = ({
  items = 3,
  className = ''
}) => {
  // Enhanced shimmer effect (premium loading state)
  const baseClass = 'skeleton-shimmer bg-slate-200 dark:bg-slate-800 rounded';

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`${baseClass} h-3 w-24`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
          <div className="text-slate-400">:</div>
          <div
            className={`${baseClass} h-3 flex-1`}
            style={{ animationDelay: `${i * 100 + 50}ms` }}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * CommentSkeleton - Für Kommentare/Chat-Nachrichten
 */
interface CommentSkeletonProps {
  showAvatar?: boolean;
  showActions?: boolean;
  className?: string;
}

export const CommentSkeleton: FC<CommentSkeletonProps> = ({
  showAvatar = true,
  showActions = true,
  className = ''
}) => {
  // Enhanced shimmer effect (premium loading state)
  const baseClass = 'skeleton-shimmer bg-slate-200 dark:bg-slate-800 rounded';

  return (
    <div className={`flex gap-3 ${className}`}>
      {/* Avatar */}
      {showAvatar && (
        <div
          className={`${baseClass} w-10 h-10 rounded-full flex-shrink-0`}
          style={{ animationDelay: '100ms' }}
        />
      )}

      {/* Content */}
      <div className="flex-1 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className={`${baseClass} h-4 w-24`}
            style={{ animationDelay: '150ms' }}
          />
          <div
            className={`${baseClass} h-3 w-16`}
            style={{ animationDelay: '200ms' }}
          />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div
            className={`${baseClass} h-4 w-full`}
            style={{ animationDelay: '250ms' }}
          />
          <div
            className={`${baseClass} h-4 w-4/5`}
            style={{ animationDelay: '300ms' }}
          />
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <div
              className={`${baseClass} h-6 w-12 rounded-full`}
              style={{ animationDelay: '350ms' }}
            />
            <div
              className={`${baseClass} h-6 w-16 rounded-full`}
              style={{ animationDelay: '400ms' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSkeleton;
