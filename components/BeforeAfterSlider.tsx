
import { useState, useRef, useEffect } from 'react';
import { ArrowsRightLeftIcon } from './Icons';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Vorher",
  afterLabel = "Nachher"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // ✅ FIXED: Removed useCallback - move handler inside useEffect to avoid stale closure issues
  // The event listener is re-attached on isDragging change, so no performance penalty

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    // ✅ FIXED: Move handler inside useEffect to avoid useCallback complexity
    const handleWindowMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      // Cancel any pending animation frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame for throttling
      rafRef.current = requestAnimationFrame(() => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        // Defensively check for touches array existence before accessing [0]
        const clientX = 'touches' in event && event.touches?.[0]
          ? event.touches[0].clientX
          : (event as MouseEvent).clientX;

        let position = ((clientX - containerRect.left) / containerRect.width) * 100;
        position = Math.max(0, Math.min(100, position));

        setSliderPosition(position);
        rafRef.current = null;
      });
    };

    const handleWindowUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMove, { passive: true });
      window.addEventListener('touchmove', handleWindowMove, { passive: true });
      window.addEventListener('mouseup', handleWindowUp);
      window.addEventListener('touchend', handleWindowUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowUp);
      window.removeEventListener('touchend', handleWindowUp);
      // Clean up any pending animation frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDragging]); // ✅ FIXED: Only depends on isDragging, no external handler

  return (
    <div
      className="relative w-full aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden select-none shadow-lg dark:shadow-black/40 border border-slate-200/60 dark:border-white/8 group cursor-ew-resize transition-all duration-500 hover:shadow-xl hover:shadow-primary/8"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="Nachher"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/6 via-transparent to-transparent pointer-events-none"></div>

      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shadow-md dark:shadow-black/30 pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:bg-white/95">
        {afterLabel}
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden transition-all duration-100 ease-out"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Vorher"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          loading="lazy"
          decoding="async"
          style={{ width: containerRef.current?.offsetWidth ?? '100%' }}
          draggable={false}
        />
        {/* Subtle desaturated overlay to emphasize difference */}
        <div className="absolute inset-0 bg-slate-400/8 mix-blend-multiply pointer-events-none"></div>

        <div className="absolute top-4 left-4 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shadow-md dark:shadow-black/30 pointer-events-none transition-all duration-300">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-[1.5px] bg-white dark:bg-white/70 cursor-ew-resize z-10 shadow-sm"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-white rounded-full shadow-xl shadow-black/15 dark:shadow-black/40 flex items-center justify-center text-slate-700 dark:text-slate-900 transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-primary/20 active:scale-95 border-[3px] border-white dark:border-slate-200">
          <ArrowsRightLeftIcon className="w-4 h-4 transition-transform duration-500 ease-out group-hover:rotate-180" />
        </div>
      </div>

      {/* Interactive hint - shown on first load */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 dark:bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
        <span>Zum Vergleichen ziehen</span>
      </div>
    </div>
  );
};
