import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Hook for smooth theme transitions with animation
 * Prevents flash of wrong theme and adds smooth transition effect
 */
export const useThemeTransition = () => {
    const { resolvedTheme } = useTheme();
    const previousTheme = useRef<'light' | 'dark'>(resolvedTheme);
    const isTransitioning = useRef(false);

    useEffect(() => {
        // Skip if theme hasn't changed
        if (previousTheme.current === resolvedTheme) return;

        isTransitioning.current = true;

        // Add transition class to body
        document.body.classList.add('theme-transitioning');

        // Prevent scrolling during transition
        document.body.style.overflow = 'hidden';

        // Remove transition class after animation completes
        const timeout = setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
            document.body.style.overflow = '';
            isTransitioning.current = false;
            previousTheme.current = resolvedTheme;
        }, 300);

        return () => clearTimeout(timeout);
    }, [resolvedTheme]);

    return {
        theme: resolvedTheme,
        isTransitioning: isTransitioning.current,
    };
};

/**
 * Hook to prevent flash of wrong theme during SSR
 * Adds no-transition class during initial load
 */
export const useNoFlashTheme = () => {
    useEffect(() => {
        // Remove no-transition class after initial render
        const timeout = setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 100);

        return () => clearTimeout(timeout);
    }, []);
};
