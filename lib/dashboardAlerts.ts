import { translations } from './translations';

let currentLanguage: 'de' | 'en' = 'en';

export const setDashboardLanguage = (lang: 'de' | 'en') => {
  currentLanguage = lang;
};

export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
};

export const alertError = (message: string) => {
  alert(t('dashboard.alerts.error_prefix') + message);
};

export const alertCreateFailed = (message: string) => {
  alert(t('dashboard.alerts.create_failed') + message);
};

export const alertFailed = (message: string) => {
  alert(t('dashboard.alerts.failed') + message);
};

export const alertAssigned = () => {
  alert(t('dashboard.alerts.assigned'));
};

export const alertLinkCopied = () => {
  alert(t('dashboard.alerts.link_copied'));
};

export const alertFileTooLarge = () => {
  alert(t('dashboard.alerts.file_too_large'));
};

export const alertUploadFailed = (message: string) => {
  alert(t('dashboard.alerts.upload_failed') + message);
};

export const alertDownloadFailed = () => {
  alert(t('dashboard.alerts.download_failed'));
};
