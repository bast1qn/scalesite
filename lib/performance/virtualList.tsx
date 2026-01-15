/**
 * VIRTUAL SCROLLING SYSTEM
 * Renders only visible items in large lists for massive performance gains
 * Reduces DOM nodes from thousands to ~20-30 visible items
 *
 * @performance
 * - 1000 items: 1000 DOM nodes → ~30 DOM nodes (97% reduction)
 * - Scroll performance: O(n) → O(1) constant time
 * - Memory usage: Drastically reduced
 */

import { useRef, useEffect, useState, useMemo, useCallback, type ReactNode, type CSSProperties } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * Virtual List Component
 * Only renders items visible in viewport + overscan buffer
 */
export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const { visibleRange, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    );

    return {
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [scrollTop, itemHeight, height, overscan, items.length]);

  // Handle scroll with requestAnimationFrame for smooth 60fps
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    requestAnimationFrame(() => {
      setScrollTop(scrollTop);
    });
  }, []);

  // Render visible items
  const visibleItems = useMemo(() => {
    const itemsToRender: ReactNode[] = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      itemsToRender.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${i * itemHeight}px`,
            left: 0,
            right: 0,
            height: `${itemHeight}px`,
          }}
        >
          {renderItem(items[i], i)}
        </div>
      );
    }
    return itemsToRender;
  }, [items, visibleRange, itemHeight, renderItem]);

  return (
    <div
      ref={scrollContainerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        style={{
          position: 'relative',
          height: `${totalHeight}px`,
        }}
      >
        <div
          style={{
            transform: `translateY(-${offsetY}px)`,
          }}
        >
          {visibleItems}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for automatic virtualization
 * Automatically switches to virtual list when item count exceeds threshold
 */
export function useVirtualList<T>(
  items: T[],
  threshold: number = 100
): { shouldVirtualize: boolean; VirtualList: typeof VirtualList<T> } {
  const shouldVirtualize = items.length > threshold;

  return {
    shouldVirtualize,
    VirtualList: shouldVirtualize ? VirtualList : (null as any),
  };
}

/**
 * Virtual Grid Component
 * Two-dimensional virtualization for grid layouts
 */
interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  height: number;
  width: number;
  columns: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  height,
  width,
  columns,
  renderItem,
  overscan = 2,
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const rowHeight = itemHeight;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight;
  const totalWidth = width;

  const { visibleRows, visibleCols, offsetY, offsetX } = useMemo(() => {
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + height) / rowHeight) + overscan);
    const startCol = Math.max(0, Math.floor(scrollLeft / itemWidth) - overscan);
    const endCol = Math.min(columns - 1, Math.ceil((scrollLeft + width) / itemWidth) + overscan);

    return {
      visibleRows: { start: startRow, end: endRow },
      visibleCols: { start: startCol, end: endCol },
      offsetY: startRow * rowHeight,
      offsetX: startCol * itemWidth,
    };
  }, [scrollTop, scrollLeft, rowHeight, itemWidth, height, width, overscan, totalRows, columns]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollLeft = e.currentTarget.scrollLeft;
    requestAnimationFrame(() => {
      setScrollTop(scrollTop);
      setScrollLeft(scrollLeft);
    });
  }, []);

  const visibleItems = useMemo(() => {
    const itemsToRender: ReactNode[] = [];
    for (let row = visibleRows.start; row <= visibleRows.end; row++) {
      for (let col = visibleCols.start; col <= visibleCols.end; col++) {
        const index = row * columns + col;
        if (index < items.length) {
          itemsToRender.push(
            <div
              key={index}
              style={{
                position: 'absolute',
                top: `${row * rowHeight}px`,
                left: `${col * itemWidth}px`,
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
              }}
            >
              {renderItem(items[index], index)}
            </div>
          );
        }
      }
    }
    return itemsToRender;
  }, [items, visibleRows, visibleCols, rowHeight, itemWidth, columns, renderItem]);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-auto"
      style={{ height, width }}
      onScroll={handleScroll}
    >
      <div
        style={{
          position: 'relative',
          height: `${totalHeight}px`,
          width: `${totalWidth}px`,
        }}
      >
        <div
          style={{
            transform: `translate(-${offsetX}px, -${offsetY}px)`,
          }}
        >
          {visibleItems}
        </div>
      </div>
    </div>
  );
}
