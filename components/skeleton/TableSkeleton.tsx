import { type FC } from 'react';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * TableSkeleton - Ladezustand für Tabellen
 *
 * Features:
 * - Konfigurierbare Zeilen und Spalten
 * - Optionale Header-Zeile
 * - Shimmer Animation
 * - Responsive Design
 * - Dark Mode Support
 */
export const TableSkeleton: FC<TableSkeletonProps> = ({
  rows = 5,
  cols = 4,
  showHeader = true,
  className = ''
}) => {
  // Enhanced shimmer effect (premium loading state)
  const baseClass = 'skeleton-shimmer bg-slate-200 dark:bg-slate-800 rounded';

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={`header-${i}`}
              className={`${baseClass} h-4 flex-1`}
              style={{
                animationDelay: `${i * 100}ms`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex gap-4 p-4"
            style={{
              animationDelay: `${rowIndex * 50}ms`
            }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`${baseClass} h-4 flex-1`}
                style={{
                  width: colIndex === 0 ? '60%' : undefined,
                  animationDelay: `${(rowIndex * 50) + (colIndex * 30)}ms`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CompactTableSkeleton - Kleinere Variante für dichtere Tabellen
 */
interface CompactTableSkeletonProps extends Omit<TableSkeletonProps, 'className'> {
  variant?: 'default' | 'compact';
}

export const CompactTableSkeleton: FC<CompactTableSkeletonProps> = ({
  rows = 8,
  cols = 3,
  showHeader = true,
  variant = 'compact'
}) => {
  const padding = variant === 'compact' ? 'p-2' : 'p-4';
  const height = variant === 'compact' ? 'h-3' : 'h-4';

  return (
    <TableSkeleton
      rows={rows}
      cols={cols}
      showHeader={showHeader}
      className={padding}
    />
  );
};

/**
 * DataTableSkeleton - Für Data-Tabellen mit Aktionen
 */
export const DataTableSkeleton: FC<Omit<TableSkeletonProps, 'cols'>> = ({
  rows = 5,
  showHeader = true,
  className = ''
}) => {
  // Enhanced shimmer effect (premium loading state)
  const baseClass = 'skeleton-shimmer bg-slate-200 dark:bg-slate-800 rounded';

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <div className={`${baseClass} h-4 flex-[2]`} />
          <div className={`${baseClass} h-4 flex-1`} />
          <div className={`${baseClass} h-4 flex-1`} />
          <div className={`${baseClass} h-4 flex-1`} />
          <div className={`${baseClass} h-4 w-24`} /> {/* Actions */}
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex gap-4 p-4 items-center"
            style={{
              animationDelay: `${rowIndex * 50}ms`
            }}
          >
            <div className={`${baseClass} h-4 flex-[2]`} />
            <div className={`${baseClass} h-4 flex-1`} />
            <div className={`${baseClass} h-4 flex-1`} />
            <div className={`${baseClass} h-4 flex-1`} />
            <div className={`${baseClass} h-8 w-8 rounded-full`} /> {/* Action button */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
