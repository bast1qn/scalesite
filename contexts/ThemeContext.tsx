import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'scaleSite-theme';
const DEFAULT_THEME: Theme = 'system';

const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): Theme => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }
    } catch (error) {
        console.warn('Failed to read theme from localStorage:', error);
    }
    return DEFAULT_THEME;
};

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
    return theme === 'system' ? getSystemTheme() : theme;
};

const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    // Set meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0b' : '#ffffff');
    }
};

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

export const ThemeProvider = ({
    children,
    defaultTheme = DEFAULT_THEME,
    storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) => {
    // SSR-safe initialization
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [isClient, setIsClient] = useState(false);

    // Initialize theme only on client side to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
        const storedTheme = getStoredTheme() || defaultTheme;
        const resolved = resolveTheme(storedTheme);

        setThemeState(storedTheme);
        setResolvedTheme(resolved);

        const root = document.documentElement;
        applyTheme(resolved);
        root.style.colorScheme = resolved;
    }, [defaultTheme]);

    // Listen for system theme changes
    useEffect(() => {
        if (!isClient || theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            const newResolvedTheme = getSystemTheme();
            setResolvedTheme(newResolvedTheme);
            applyTheme(newResolvedTheme);
            document.documentElement.style.colorScheme = newResolvedTheme;
        };

        // Add event listener with fallback for older browsers
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [theme, isClient]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);

        const newResolvedTheme = resolveTheme(newTheme);
        setResolvedTheme(newResolvedTheme);
        applyTheme(newResolvedTheme);

        document.documentElement.style.colorScheme = newResolvedTheme;

        try {
            localStorage.setItem(storageKey, newTheme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }, [storageKey]);

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }, [resolvedTheme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

// Hook for getting current theme without context
export const getCurrentTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};
