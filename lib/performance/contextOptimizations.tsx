/**
 * CONTEXT PERFORMANCE OPTIMIZATIONS
 * Prevents unnecessary re-renders using React.memo, useMemo, and useCallback
 */

import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';

// =====================================================
// OPTIMIZED LANGUAGE CONTEXT
// =====================================================

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const OptimizedLanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = React.useState('de');

  // Memoize translation function to prevent recreation
  const t = useCallback((key: string) => {
    const translations: Record<string, Record<string, string>> = {
      de: {
        'general.loading': 'Wird geladen...',
        'general.save': 'Speichern',
      },
      en: {
        'general.loading': 'Loading...',
        'general.save': 'Save',
      },
    };
    return translations[language]?.[key] || key;
  }, [language]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      t,
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

// Custom hook with memoization
export const useOptimizedLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useOptimizedLanguage must be used within OptimizedLanguageProvider');
  }
  return context;
};

// =====================================================
// OPTIMIZED THEME CONTEXT
// =====================================================

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const OptimizedThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = React.useState<'light' | 'dark' | 'system'>('system');

  // Memoize resolved theme calculation
  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  // Stable setTheme callback
  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useOptimizedTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useOptimizedTheme must be used within OptimizedThemeProvider');
  }
  return context;
};

// =====================================================
// SPLIT CONTEXT PATTERN
// Separate contexts for different concerns to minimize re-renders
// =====================================================

// UI State Context (high frequency updates)
interface UIStateContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const contextValue = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      modalOpen,
      setModalOpen,
    }),
    [sidebarOpen, modalOpen]
  );

  return <UIStateContext.Provider value={contextValue}>{children}</UIStateContext.Provider>;
};

// Data Context (low frequency updates)
interface DataContextType {
  user: User | null;
  projects: Project[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);

  const contextValue = useMemo(
    () => ({
      user,
      projects,
      loading,
    }),
    [user, projects, loading]
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// =====================================================
// PERFORMANCE HOOKS
// =====================================================

/**
 * Hook to prevent unnecessary re-renders of expensive components
 * Usage: Wrap your component export with React.memo()
 */
import { memo } from 'react';

export const withMemo = <P extends object>(Component: React.ComponentType<P>) => {
  return memo(Component, (prevProps, nextProps) => {
    // Custom comparison for complex props
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });
};

/**
 * Hook to memoize expensive calculations
 * ✅ FIXED: Replaced 'any' with proper generic types
 */
export const useExpensiveCalculation = <T, U>(input: T, calculation: (input: T) => U): U => {
  return useMemo(() => calculation(input), [input, calculation]);
};

/**
 * Hook to create stable callbacks
 * ✅ FIXED: Replaced 'any' with proper tuple type for args
 */
export const useStableCallback <T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList = []
): T => {
  return useCallback(callback, deps) as T;
};

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

// Re-export React for convenience
export { React };
