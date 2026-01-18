import React, { createContext, useState, useContext, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { translations, Language } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'app_language' as const;
const DEFAULT_LANGUAGE: Language = 'en';

function createTranslationFunction(lang: Language) {
  const translationData = translations[lang];

  return (path: string): string => {
    const keys = path.split('.');
    let current: unknown = translationData;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
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

  // PERFORMANCE: Stable memoized function using useCallback
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
    document.documentElement.lang = lang;
  }, []);

  const t = useMemo(() => createTranslationFunction(language), [language]);

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
<<<<<<< HEAD:contexts/LanguageContext.tsx
=======
// Cache bust: So 18. Jan 19:40:00 CET 2026 - useMemo pattern instead of useCallback
>>>>>>> fix-language-callback:contexts/LanguageContextV2.tsx
