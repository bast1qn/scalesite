// Central exports for all contexts
export { AuthContext, AuthProvider, useAuth } from './AuthContext';
export { LanguageContext, LanguageProvider, useLanguage } from './LanguageContext';
export { CurrencyContext, CurrencyProvider, useCurrency } from './CurrencyContext';

// Re-export types
export type { AppUser } from './AuthContext';
export type { Currency, CurrencyCode } from './CurrencyContext';
export type { Language } from '../lib/translations';
