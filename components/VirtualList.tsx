/**
 * Virtual Scrolling List Component
 *
 * Optimizes rendering of large lists by only rendering visible items
 * plus a small buffer. This dramatically reduces DOM nodes and improves
 * scroll performance.
 *
 * @performance
 * - Renders only ~10-20 items instead of thousands
 * - Maintains scroll position with padding
 * - Reuses component instances with stable keys
 *
 * @example
 * <VirtualList
 *   items={largeArray}
 *   renderItem={(item) => <div>{item.name}</div>}
 *   itemHeight={50}
 *   height={400}
 * />
 */

import { useRef, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemHeight: number;
  height: number;
  overscan?: number; // Number of items to render outside viewport
  className?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  height,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      offsetY: (startIndex + index) * itemHeight,
    }));

    return {
      visibleItems,
      totalHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, height, scrollTop, overscan]);

  // Handle scroll events with passive listener for better performance
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                boxSizing: 'border-box',
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized list item component for optimal performance
 * Prevents re-renders when parent list re-renders
 */
export const MemoizedListItem = <T,>({
  item,
  index,
  render,
}: {
  item: T;
  index: number;
  render: (item: T, index: number) => ReactNode;
}) => {
  return useMemo(() => {
    return <>{render(item, index)}</>;
  }, [item, index, render]);
};
