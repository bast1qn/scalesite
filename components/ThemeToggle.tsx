import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { useHover } from '../lib/hooks';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme' as const;
const DEFAULT_THEME: Theme = 'dark';

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    try {
        const saved = localStorage.getItem(THEME_KEY) as Theme | null;
        return (saved === 'light' || saved === 'dark') ? saved : DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
};

const applyTheme = (theme: Theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [isAnimating, setIsAnimating] = useState(false);
    const hover = useHover();

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        setIsAnimating(true);
        const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }

        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        applyTheme(newTheme);

        setTimeout(() => {
            setIsAnimating(false);
            document.body.style.transition = '';
        }, 500);
    };

    return (
        <button
            onClick={toggleTheme}
            {...hover}
            className="relative w-16 h-8 min-h-11 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 group hover:scale-105 active:scale-95"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                theme === 'dark'
                    ? 'bg-gradient-to-r from-primary-600 to-violet-600 shadow-lg shadow-primary-500/25'
                    : 'bg-gradient-to-r from-slate-200 to-slate-300'
            }`}></div>

            {theme === 'dark' && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-lg animate-pulse"></div>
            )}

            <div className={`absolute top-1 bottom-1 w-6 rounded-full bg-white shadow-xl transform transition-all duration-300 ease-out flex items-center justify-center ${
                theme === 'dark' ? 'left-[calc(100%-1.875rem)]' : 'left-1'
            } ${isAnimating ? 'scale-90' : 'scale-100'}`}>
                {theme === 'dark' ? (
                    <MoonIcon className="w-3.5 h-3.5 text-violet-600 transition-transform duration-300" />
                ) : (
                    <SunIcon className="w-3.5 h-3.5 text-amber-500 transition-transform duration-300" />
                )}
            </div>

            <div className={`absolute inset-0 rounded-full overflow-hidden pointer-events-none ${
                theme === 'dark' ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-500`}>
                <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full top-1/2 left-1.5 transform -translate-y-1/2 animate-orbit"></div>
            </div>
        </button>
    );
};