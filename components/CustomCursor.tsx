
import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [isVisible]);

    // Hide on mobile/touch devices
    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return null;
    }

    return (
        <>
            <div
                className="fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out hidden md:block mix-blend-difference"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
                }}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <div 
                className="fixed pointer-events-none z-[9999] transition-transform duration-300 ease-out hidden md:block"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%)`,
                }}
            >
                 <div className={`w-8 h-8 border border-primary rounded-full transition-all duration-300 ${isVisible ? 'opacity-40' : 'opacity-0'} ${isHovering ? 'scale-0 opacity-0' : 'scale-100'}`} />
            </div>
        </>
    );
};
