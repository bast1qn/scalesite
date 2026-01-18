// Central exports for all contexts
export { AuthContext, AuthProvider, useAuth } from './AuthContext';
export { LanguageContext, LanguageProvider, useLanguage } from './LanguageContextV2';
export { CurrencyContext, CurrencyProvider, useCurrency } from './CurrencyContext';
export { NotificationContext, NotificationProvider, useNotifications } from './NotificationContext';
export { ThemeContext, ThemeProvider, useTheme, getCurrentTheme } from './ThemeContext';

// Re-export types
export type { AppUser } from './AuthContext';
export type { Currency, CurrencyCode } from './CurrencyContext';
export type { Language } from '../lib/translations';
export type { AppNotification, NotificationType, NotificationPreferences } from './NotificationContext';
