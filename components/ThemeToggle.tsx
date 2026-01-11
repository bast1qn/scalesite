import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './Icons';

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState('dark');

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
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-dark-text/10 dark:hover:bg-light-text/10 transition-colors"
            aria-label={`In den ${theme === 'light' ? 'Dunkel' : 'Hell'}-Modus wechseln`}
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};