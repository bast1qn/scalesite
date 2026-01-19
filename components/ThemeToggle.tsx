import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useHover } from '../lib/hooks';

type Theme = 'light' | 'dark' | 'system';

const ThemeIcon = ({ theme }: { theme: 'light' | 'dark' | 'system' }) => {
    const iconVariants = {
        light: { rotate: 0, scale: 1 },
        dark: { rotate: 180, scale: 1 },
        system: { rotate: 360, scale: 1 },
    };

    return (
        <motion.div
            variants={iconVariants}
            initial="light"
            animate={theme}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="relative"
        >
            {theme === 'light' && <SunIcon className="w-3.5 h-3.5 text-amber-500" />}
            {theme === 'dark' && <MoonIcon className="w-3.5 h-3.5 text-violet-600" />}
            {theme === 'system' && <ComputerDesktopIcon className="w-3.5 h-3.5 text-primary-600" />}
        </motion.div>
    );
};

export const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const hover = useHover();

    const themes: { value: Theme; label: string; icon: typeof ThemeIcon }[] = [
        { value: 'light', label: 'Light', icon: () => <ThemeIcon theme="light" /> },
        { value: 'dark', label: 'Dark', icon: () => <ThemeIcon theme="dark" /> },
        { value: 'system', label: 'System', icon: () => <ThemeIcon theme="system" /> },
    ];

    const getCurrentIcon = () => {
        if (theme === 'system') return <ThemeIcon theme="system" />;
        return <ThemeIcon theme={resolvedTheme} />;
    };

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                {...hover}
                className="relative w-16 h-11 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 hover:scale-[1.02] active:scale-[0.98]"
                aria-label={`Theme auswählen. Aktuell: ${theme === 'light' ? 'Hell' : theme === 'dark' ? 'Dunkel' : 'System'}. ${isDropdownOpen ? 'Dropdown offen. Klicken zum Schließen.' : 'Klicken zum Wechseln.'}`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                role="combobox"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={false}
                    animate={{
                        background: resolvedTheme === 'dark'
                            ? 'linear-gradient(to right, rgb(75, 90, 237), rgb(139, 92, 246))'
                            : 'linear-gradient(to right, rgb(226, 232, 240), rgb(203, 213, 225))',
                    }}
                    transition={{ duration: 0.4 }}
                />

                {resolvedTheme === 'dark' && (
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                            filter: 'blur(8px)',
                        }}
                    />
                )}

                <motion.div
                    className="absolute top-1 bottom-1 w-6 rounded-full bg-white shadow-xl flex items-center justify-center"
                    initial={false}
                    animate={{
                        left: theme === 'dark' ? 'calc(100% - 1.875rem)' : '0.25rem',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={theme === 'system' ? 'system' : resolvedTheme}
                            initial={{ y: -20, opacity: 0, rotate: -180 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 20, opacity: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            {getCurrentIcon()}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {resolvedTheme === 'dark' && (
                    <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full top-1/2 left-1.5"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    </motion.div>
                )}
            </motion.button>

            <AnimatePresence>
                {isDropdownOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsDropdownOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-premium-lg border border-slate-200 dark:border-slate-700 overflow-hidden min-w-[140px]"
                            role="listbox"
                            aria-label="Theme auswählen"
                        >
                            {themes.map((themeOption) => {
                                const isActive = theme === themeOption.value;
                                const isSystemResolved = themeOption.value === 'system' && (
                                    <span className="text-xs text-slate-400 ml-1">
                                        ({resolvedTheme})
                                    </span>
                                );

                                return (
                                    <motion.button
                                        key={themeOption.value}
                                        onClick={() => {
                                            setTheme(themeOption.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 ${
                                            isActive
                                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                        role="option"
                                        aria-selected={isActive}
                                        aria-label={`${themeOption.label} Theme${isActive ? ' (aktiv)' : ''}`}
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="flex-shrink-0">{themeOption.icon()}</span>
                                        <span>{themeOption.label}</span>
                                        {isSystemResolved}
                                        {isActive && (
                                            <motion.svg
                                                className="w-4 h-4 ml-auto text-primary-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </motion.svg>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};