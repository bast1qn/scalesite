import { translations } from './translations';

let currentLanguage: 'de' | 'en' = 'en';

export const setDashboardLanguage = (lang: 'de' | 'en') => {
  currentLanguage = lang;
};

export const t = (key: string): string => {
  const keys = key.split('.');
  let value: unknown = translations[currentLanguage];
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  return typeof value === 'string' ? value : key;
};

// Alert functions using translations
export const alertError = (message?: string) => {
  alert(message ? t('dashboard.alerts.error_prefix') + message : t('dashboard.alerts.failed'));
};

export const alertCreateFailed = (message: string) => {
  alert(t('dashboard.alerts.create_failed') + message);
};

export const alertFailed = (message?: string) => {
  alert(message ? t('dashboard.alerts.failed') + message : t('dashboard.alerts.failed'));
};

export const alertUserNotAdded = () => {
  alert(t('dashboard.alerts.user_not_added'));
};

export const alertAssigned = () => {
  alert(t('dashboard.alerts.assigned'));
};

export const alertAssignFailed = (message: string) => {
  alert(t('dashboard.alerts.assign_failed') + message);
};

export const alertLinkCopied = () => {
  alert(t('dashboard.alerts.link_copied'));
};

export const alertFileTooLarge = () => {
  alert(t('dashboard.alerts.file_too_large'));
};

export const alertUploadFailed = (message?: string) => {
  alert(message ? t('dashboard.alerts.upload_failed') + message : t('dashboard.alerts.upload_failed'));
};

export const alertFileReadError = () => {
  alert(t('dashboard.alerts.file_read_error'));
};

export const alertDownloadFailed = () => {
  alert(t('dashboard.alerts.download_failed'));
};

export const alertDeleteFailed = (message: string) => {
  alert(t('dashboard.alerts.delete_failed') + message);
};

export const alertSaveFailed = (message: string) => {
  alert(t('dashboard.alerts.save_failed') + message);
};
