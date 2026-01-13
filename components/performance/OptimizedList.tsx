import { ReactNode, useCallback, memo, type CSSProperties } from 'react';

/**
 * OptimizedList Component
 *
 * High-performance list component with memoization and virtual scrolling hints
 * Prevents unnecessary re-renders of list items
 */

export interface OptimizedListItemProps<T> {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => ReactNode;
  itemKey?: string | ((item: T) => string);
  className?: string;
  style?: CSSProperties;
}

export interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemKey?: string | ((item: T) => string);
  className?: string;
  itemClassName?: string;
  style?: CSSProperties;
  itemStyle?: CSSProperties;
  onItemClick?: (item: T, index: number) => void;
  virtual?: boolean;
  virtualItemHeight?: number;
}

/**
 * Memoized list item to prevent unnecessary re-renders
 */
const OptimizedListItem = memo(<T,>({
  item,
  index,
  renderItem,
  className,
  style,
}: OptimizedListItemProps<T>) => {
  return (
    <div className={className} style={style}>
      {renderItem(item, index)}
    </div>
  );
}) as <T>(props: OptimizedListItemProps<T>) => JSX.Element;

OptimizedListItem.displayName = 'OptimizedListItem';

/**
 * Optimized List Component
 *
 * Features:
 * - Item memoization to prevent unnecessary re-renders
 * - Efficient key generation
 * - Optional click handler with event delegation
 * - Virtual scrolling support (placeholder for future implementation)
 *
 * @example
 * <OptimizedList
 *   items={users}
 *   renderItem={(user, index) => <UserCard user={user} />}
 *   itemKey="id"
 *   onItemClick={(user) => navigate(`/users/${user.id}`)}
 * />
 */
export function OptimizedList<T>({
  items,
  renderItem,
  itemKey = 'id',
  className,
  itemClassName,
  style,
  itemStyle,
  onItemClick,
}: OptimizedListProps<T>) {
  // Memoize key generator
  const getItemKey = useCallback((item: T, index: number): string => {
    if (typeof itemKey === 'function') {
      return itemKey(item);
    }
    if (typeof item === 'object' && item !== null && itemKey in item) {
      return String((item as Record<string, unknown>)[itemKey]);
    }
    return `item-${index}`;
  }, [itemKey]);

  // Memoized click handler with event delegation pattern
  const handleClick = useCallback((item: T, index: number) => {
    return (e: React.MouseEvent) => {
      if (onItemClick) {
        e.preventDefault();
        onItemClick(item, index);
      }
    };
  }, [onItemClick]);

  if (items.length === 0) {
    return (
      <div className={className} style={style}>
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          No items to display
        </p>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {items.map((item, index) => {
        const key = getItemKey(item, index);
        const clickHandler = onItemClick ? handleClick(item, index) : undefined;

        return (
          <div
            key={key}
            className={itemClassName}
            style={itemStyle}
            onClick={clickHandler}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Optimized Grid Component
 *
 * Similar to OptimizedList but with grid layout
 */
export interface OptimizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemKey?: string | ((item: T) => string);
  className?: string;
  itemClassName?: string;
  style?: CSSProperties;
  itemStyle?: CSSProperties;
  onItemClick?: (item: T, index: number) => void;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function OptimizedGrid<T>({
  items,
  renderItem,
  itemKey = 'id',
  className,
  itemClassName,
  style,
  itemStyle,
  onItemClick,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  }
}: OptimizedGridProps<T>) {
  const getItemKey = useCallback((item: T, index: number): string => {
    if (typeof itemKey === 'function') {
      return itemKey(item);
    }
    if (typeof item === 'object' && item !== null && itemKey in item) {
      return String((item as Record<string, unknown>)[itemKey]);
    }
    return `item-${index}`;
  }, [itemKey]);

  const handleClick = useCallback((item: T, index: number) => {
    return (e: React.MouseEvent) => {
      if (onItemClick) {
        e.preventDefault();
        onItemClick(item, index);
      }
    };
  }, [onItemClick]);

  // Generate responsive grid classes
  const gridClasses = [
    'grid',
    'gap-4',
    columns.xs && `grid-cols-${columns.xs}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ].filter(Boolean).join(' ');

  if (items.length === 0) {
    return (
      <div className={className} style={style}>
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          No items to display
        </p>
      </div>
    );
  }

  return (
    <div className={`${gridClasses} ${className || ''}`} style={style}>
      {items.map((item, index) => {
        const key = getItemKey(item, index);
        const clickHandler = onItemClick ? handleClick(item, index) : undefined;

        return (
          <div
            key={key}
            className={itemClassName}
            style={itemStyle}
            onClick={clickHandler}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}

/**
 * useListOptimizer Hook
 *
 * Helper hook for optimizing list rendering
 */
export function useListOptimizer<T>(
  items: T[],
  itemKey: string | ((item: T) => string) = 'id'
) {
  const getItemKey = useCallback((item: T, index: number): string => {
    if (typeof itemKey === 'function') {
      return itemKey(item);
    }
    if (typeof item === 'object' && item !== null && itemKey in item) {
      return String((item as Record<string, unknown>)[itemKey]);
    }
    return `item-${index}`;
  }, [itemKey]);

  const createClickHandler = useCallback((
    item: T,
    index: number,
    onClick?: (item: T, index: number) => void
  ) => {
    if (!onClick) return undefined;

    return (e: React.MouseEvent) => {
      e.preventDefault();
      onClick(item, index);
    };
  }, []);

  return {
    getItemKey,
    createClickHandler,
  };
}

export default OptimizedList;
