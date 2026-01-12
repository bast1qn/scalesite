
import React, { useState, useRef, useEffect } from 'react';
import { ArrowsRightLeftIcon } from './Icons';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Vorher",
  afterLabel = "Nachher"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    // Defensively check for touches array existence before accessing [0]
    const clientX = 'touches' in event && event.touches[0]
      ? event.touches[0].clientX
      : event.clientX;

    let position = ((clientX - containerRect.left) / containerRect.width) * 100;
    position = Math.max(0, Math.min(100, position));

    setSliderPosition(position);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) handleMove(e);
    };
    const handleWindowUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleWindowMove);
    window.addEventListener('touchmove', handleWindowMove);
    window.addEventListener('mouseup', handleWindowUp);
    window.addEventListener('touchend', handleWindowUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowUp);
      window.removeEventListener('touchend', handleWindowUp);
    };
  }, [isDragging]);

  return (
    <div
      className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden select-none shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-700 group cursor-ew-resize"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="Nachher"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"></div>

      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg pointer-events-none">
        {afterLabel}
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Vorher"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current?.offsetWidth ?? '100%' }}
          draggable={false}
        />
        {/* Grayscale filter to emphasize 'bad' website */}
        <div className="absolute inset-0 bg-slate-400/20 mix-blend-multiply pointer-events-none"></div>

        <div className="absolute top-4 left-4 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg pointer-events-none">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white dark:bg-slate-200 cursor-ew-resize z-10 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-200 rounded-full shadow-xl shadow-black/20 flex items-center justify-center text-slate-700 dark:text-slate-900 transition-transform transform hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-300">
          <ArrowsRightLeftIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
