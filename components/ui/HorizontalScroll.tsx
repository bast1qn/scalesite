// React
import { useRef, useState, useEffect, memo, type ReactNode, type MouseEvent, type TouchEvent } from 'react';

/**
 * HorizontalScroll Component - Premium horizontal scroll with snap points
 *
 * Linear/Vercel-inspired smooth horizontal scrolling with:
 * - Momentum scrolling (physics-based)
 * - Snap points for precise alignment
 * - Touch gestures (swipe, drag)
 * - Scroll indicators
 * - GPU-accelerated animations
 *
 * @example
 * ```tsx
 * <HorizontalScroll snap="center" className="gap-6">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </HorizontalScroll>
 * ```
 */

export interface HorizontalScrollProps {
  children: ReactNode;
  /**
   * Scroll snap behavior
   * @default 'start'
   */
  snap?: 'start' | 'center' | 'end' | 'none';
  /**
   * Show scroll indicators
   * @default true
   */
  showIndicators?: boolean;
  /**
   * Enable momentum scrolling
   * @default true
   */
  momentum?: boolean;
  /**
   * Scroll animation duration (ms)
   * @default 500
   */
  scrollDuration?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const HorizontalScroll = memo(({
  children,
  snap = 'start',
  showIndicators = true,
  momentum = true,
  scrollDuration = 500,
  className = '',
}: HorizontalScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check scroll availability
  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Initial check
    checkScroll();

    // Add resize observer
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(scrollElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const targetScroll = direction === 'left'
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  // Mouse drag handlers (for desktop)
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = '';
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = '';
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch handlers (for mobile)
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!scrollRef.current || !momentum) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Scroll snap mapping
  const snapMap = {
    start: 'x mandatory',
    center: 'x mandatory',
    end: 'x mandatory',
    none: 'none',
  };

  const snapAlignMap = {
    start: 'start',
    center: 'center',
    end: 'end',
    none: 'none',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: snapMap[snap],
          scrollBehavior: momentum ? 'smooth' : 'auto',
          WebkitOverflowScrolling: 'touch',
          cursor: isDragging ? 'grabbing' : 'grab',
          // GPU acceleration
          willChange: isDragging ? 'scroll-position' : 'auto',
          // Hide scrollbar
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onScroll={checkScroll}
      >
        {children}
      </div>

      {/* Scroll indicators */}
      {showIndicators && (
        <>
          {/* Left indicator */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-premium hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-12"
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5 text-slate-700 dark:text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Right indicator */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-premium hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-12"
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5 text-slate-700 dark:text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Gradient overlays for scroll indication */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-slate-900 dark:to-transparent pointer-events-none transition-opacity duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-slate-900 dark:to-transparent pointer-events-none transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
});

HorizontalScroll.displayName = 'HorizontalScroll';

/**
 * HorizontalScrollItem - Individual item with snap alignment
 *
 * @example
 * ```tsx
 * <HorizontalScrollItem className="min-w-[300px]">
 *   <Card>Content</Card>
 * </HorizontalScrollItem>
 * ```
 */

export interface HorizontalScrollItemProps {
  children: ReactNode;
  /**
   * Snap alignment for this item
   * @default 'start'
   */
  snapAlign?: 'start' | 'center' | 'end';
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const HorizontalScrollItem = memo(({
  children,
  snapAlign = 'start',
  className = '',
}: HorizontalScrollItemProps) => {
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{
        scrollSnapAlign: snapAlign,
      }}
    >
      {children}
    </div>
  );
});

HorizontalScrollItem.displayName = 'HorizontalScrollItem';

export default HorizontalScroll;
