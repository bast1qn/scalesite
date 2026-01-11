
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
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    
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
      className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden select-none shadow-2xl border border-slate-200 dark:border-slate-800 group cursor-ew-resize"
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
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider pointer-events-none">
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
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
          draggable={false}
        />
         {/* Darken the 'bad' website slightly to enhance effect */}
        <div className="absolute inset-0 bg-sepia/20 mix-blend-multiply pointer-events-none"></div>
        
        <div className="absolute top-4 left-4 bg-white/80 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm pointer-events-none">
            {beforeLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary transition-transform transform hover:scale-110 active:scale-95">
          <ArrowsRightLeftIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
