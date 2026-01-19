// React imports
import React from 'react';

// Third-party imports
import { motion } from '@/lib/motion';

// Internal imports
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';

type Theme = 'light' | 'dark' | 'system';

const ThemeOption = ({
    value,
    label,
    description,
    icon,
    isSelected,
    onClick
}: {
    value: Theme;
    label: string;
    description: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}) => (
    <motion.button
        onClick={onClick}
        className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
            isSelected
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-premium'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-soft'
        } focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 p-3 rounded-xl ${
                isSelected
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className={`font-semibold mb-1 ${
                    isSelected
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-slate-900 dark:text-slate-100'
                }`}>
                    {label}
                </h3>
                <p className={`text-sm ${
                    isSelected
                        ? 'text-primary-600/80 dark:text-primary-400/80'
                        : 'text-slate-600 dark:text-slate-400'
                }`}>
                    {description}
                </p>
            </div>
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
                >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </motion.div>
            )}
        </div>
    </motion.button>
);

export const ThemeSettings = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const themes: { value: Theme; label: string; description: string; icon: React.ReactNode }[] = [
        {
            value: 'light',
            label: 'Hell',
            description: 'Helles Erscheinungsbild für den Tag',
            icon: <SunIcon className="w-5 h-5" />,
        },
        {
            value: 'dark',
            label: 'Dunkel',
            description: 'Dunkles Erscheinungsbild für die Nacht',
            icon: <MoonIcon className="w-5 h-5" />,
        },
        {
            value: 'system',
            label: 'System',
            description: `Folgt Systemeinstellung (Aktuell: ${resolvedTheme === 'dark' ? 'Dunkel' : 'Hell'})`,
            icon: <ComputerDesktopIcon className="w-5 h-5" />,
        },
    ];

    const handleThemeChange = (themeValue: Theme) => {
        setTheme(themeValue);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-semibold leading-tight text-slate-900 dark:text-white">Design</h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Wähle dein bevorzugtes Erscheinungsbild
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {themes.map((themeOption) => (
                    <ThemeOption
                        key={themeOption.value}
                        value={themeOption.value}
                        label={themeOption.label}
                        description={themeOption.description}
                        icon={themeOption.icon}
                        isSelected={theme === themeOption.value}
                        onClick={() => handleThemeChange(themeOption.value)}
                    />
                ))}
            </div>

            {/* Preview Section */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">Vorschau</p>
                <div className="flex gap-4">
                    <div className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-2"></div>
                        <div className="w-3/4 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-primary-500 text-white">
                        <div className="w-full h-2 rounded-full bg-white/30 mb-2"></div>
                        <div className="w-3/4 h-2 rounded-full bg-white/30"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettings;
