/**
 * Translation Barrel Export
 * Domain: Internationalization (i18n)
 *
 * Translations are now organized by domain for better maintainability.
 * This module re-exports all translation domains and provides legacy compatibility.
 */

// Domain-specific translation modules
export { general } from './general';
export { navigation } from './navigation';
export { auth } from './auth';
export { validation } from './validation';
export { errors } from './errors';

// Legacy export: Maintains backward compatibility with existing code
// TODO: Gradually migrate to domain-specific imports
export const translations = {
  de: {
    general: general.de,
    nav: navigation.de,
    auth: auth.de,
    validation: validation.de,
    errors: errors.de,
    // Additional domains can be added here
  },
  en: {
    general: general.en,
    nav: navigation.en,
    auth: auth.en,
    validation: validation.en,
    errors: errors.en,
    // Additional domains can be added here
  }
};

// Type definitions for translation domains
export type TranslationDomain = 'general' | 'nav' | 'auth' | 'validation' | 'errors';
export type Language = 'de' | 'en';

export interface TranslationKeys {
  general: keyof typeof general.de;
  navigation: keyof typeof navigation.de;
  auth: keyof typeof auth.de;
  validation: keyof typeof validation.de;
  errors: keyof typeof errors.de;
}

/**
 * Helper function to get translation by domain
 * @param domain - Translation domain
 * @param key - Translation key
 * @param lang - Language (default: 'de')
 */
export function getTranslation<K extends TranslationKeys[TranslationDomain]>(
  domain: TranslationDomain,
  key: K,
  lang: Language = 'de'
): string {
  const domains = {
    general: lang === 'de' ? general.de : general.en,
    navigation: lang === 'de' ? navigation.de : navigation.en,
    auth: lang === 'de' ? auth.de : auth.en,
    validation: lang === 'de' ? validation.de : validation.en,
    errors: lang === 'de' ? errors.de : errors.en,
  };

  return domains[domain][key as keyof typeof domains[typeof domain]] || key;
}
