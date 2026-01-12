import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './Icons';

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState('dark');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsAnimating(true);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Add transition class to body
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        setTimeout(() => {
            setIsAnimating(false);
            document.body.style.transition = '';
        }, 400);
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            aria-label={`In den ${theme === 'light' ? 'Dunkel' : 'Hell'}-Modus wechseln`}
        >
            {/* Animated track background */}
            <div className={`absolute inset-0 rounded-full transition-all duration-400 ${
                theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600'
                    : 'bg-slate-200'
            }`}></div>

            {/* Toggle knob */}
            <div className={`absolute top-1 bottom-1 w-5 rounded-full bg-white shadow-lg transform transition-all duration-400 ease-out flex items-center justify-center ${
                theme === 'dark' ? 'left-[calc(100%-1.625rem)]' : 'left-1'
            } ${isAnimating ? 'scale-90' : 'scale-100'}`}>
                {theme === 'dark' ? (
                    <MoonIcon className="w-3 h-3 text-violet-600" />
                ) : (
                    <SunIcon className="w-3 h-3 text-amber-500" />
                )}
            </div>

            {/* Glow effect when dark */}
            {theme === 'dark' && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-violet-400/30 blur-md -z-10 animate-pulse-slow"></div>
            )}
        </button>
    );
};