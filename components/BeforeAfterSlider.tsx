
import { useState, useRef, useEffect, useCallback } from 'react';
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

  const handleMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;

    // Cancel any pending animation frame
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for throttling
    rafRef.current = requestAnimationFrame(() => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      // Defensively check for touches array existence before accessing [0]
      const clientX = 'touches' in event && event.touches[0]
        ? event.touches[0].clientX
        : (event as MouseEvent).clientX;

      let position = ((clientX - containerRect.left) / containerRect.width) * 100;
      position = Math.max(0, Math.min(100, position));

      setSliderPosition(position);
      rafRef.current = null;
    });
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) handleMove(e);
    };
    const handleWindowUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleWindowMove, { passive: true });
    window.addEventListener('touchmove', handleWindowMove, { passive: true });
    window.addEventListener('mouseup', handleWindowUp);
    window.addEventListener('touchend', handleWindowUp);

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
  }, [isDragging, handleMove]);

  return (
    <div
      className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden select-none shadow-xl dark:shadow-black/60 border border-slate-200/50 dark:border-white/10 group cursor-ew-resize transition-shadow duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="Nachher"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        draggable={false}
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="absolute top-5 right-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg dark:shadow-black/50 pointer-events-none transition-all duration-300 group-hover:scale-105">
        {afterLabel}
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden transition-all duration-75 ease-out"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Vorher"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current?.offsetWidth ?? '100%' }}
          draggable={false}
        />
        {/* Subtle desaturated overlay to emphasize difference */}
        <div className="absolute inset-0 bg-slate-500/10 mix-blend-multiply pointer-events-none"></div>

        <div className="absolute top-5 left-5 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg dark:shadow-black/50 pointer-events-none transition-all duration-300">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white dark:bg-white/80 cursor-ew-resize z-10 shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-slate-100 rounded-full shadow-2xl shadow-black/20 dark:shadow-black/50 flex items-center justify-center text-slate-700 dark:text-slate-900 transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-300">
          <ArrowsRightLeftIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
        </div>
      </div>
    </div>
  );
};
