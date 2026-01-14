import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { translations, Language } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'app_language' as const;
const DEFAULT_LANGUAGE: Language = 'en';

// PERFORMANCE: Memoize translation lookup to prevent unnecessary recalculations
function createTranslationFunction(lang: Language) {
  const translationData = translations[lang];

  return (path: string): string => {
    const keys = path.split('.');
    let current: unknown = translationData;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Return the path as fallback if translation key not found
        if (import.meta.env.DEV) {
          console.warn(`Translation key not found: ${path}`);
        }
        return path;
      }
    }
    return typeof current === 'string' ? current : path;
  };
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language | null;
      if (savedLang === 'de' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
    } catch (error) {
      console.warn('Failed to read language from localStorage:', error);
    }
  }, []);

  // PERFORMANCE: Stable callback function
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
    document.documentElement.lang = lang;
  }, []);

  // PERFORMANCE: Memoize translation function - only recreates when language changes
  const t = useMemo(() => createTranslationFunction(language), [language]);

  // PERFORMANCE: Memoize entire context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
