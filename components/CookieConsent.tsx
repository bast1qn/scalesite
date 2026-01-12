import React, { useState, useEffect } from 'react';
import { XMarkIcon, CookieIcon, AdjustmentsHorizontalIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const CookieConsent: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const savedConsent = localStorage.getItem('cookie-consent');
        if (!savedConsent) {
            setTimeout(() => setIsVisible(true), 1000);
        } else {
            try {
                const parsed = JSON.parse(savedConsent);
                // Validate the parsed object has expected structure
                if (parsed && typeof parsed === 'object' && 'essential' in parsed) {
                    setPreferences(parsed as CookiePreferences);
                }
            } catch {
                // Invalid JSON in localStorage, ignore and use defaults
                console.warn('Invalid cookie consent data in localStorage');
            }
        }
    }, []);

    const saveConsent = (prefs: CookiePreferences) => {
        localStorage.setItem('cookie-consent', JSON.stringify(prefs));
        setPreferences(prefs);
        setIsVisible(false);
        setShowSettings(false);
    };

    const handleAcceptAll = () => {
        saveConsent({ essential: true, analytics: true, marketing: true });
    };

    const handleRejectAll = () => {
        saveConsent({ essential: true, analytics: false, marketing: false });
    };

    const handleSaveSettings = () => {
        saveConsent(preferences);
    };

    if (!isVisible) return null;

    return (
        <>
            <div className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <div className="max-w-5xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xl shadow-slate-200/30 dark:shadow-black/30 rounded-3xl p-6 md:flex items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500"></div>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex-1 relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/30 dark:to-violet-900/30 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm">
                                <CookieIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('cookie_consent.title')}</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {t('cookie_consent.description')}
                            <button onClick={() => window.open('/datenschutz', '_blank')} className="ml-1 text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                                {t('cookie_consent.privacy_link')}
                            </button>
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3 shrink-0 relative">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="group px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md"
                        >
                            <AdjustmentsHorizontalIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            {t('cookie_consent.settings')}
                        </button>
                        <button
                            onClick={handleRejectAll}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300"
                        >
                            {t('cookie_consent.reject')}
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="group px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 overflow-hidden relative"
                        >
                            <span className="relative flex items-center gap-2">
                                {t('cookie_consent.accept_all')}
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200/70 dark:border-slate-700/70 overflow-hidden animate-scale-in relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500"></div>

                        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center bg-gradient-to-r from-slate-50/80 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-900/10">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('cookie_consent.settings_title')}</h3>
                            <button onClick={() => setShowSettings(false)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                                <XMarkIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {t('cookie_consent.description_settings')}
                            </p>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-900/10 border border-slate-200 dark:border-slate-700">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-900 dark:text-white">{t('cookie_consent.essential.title')}</span>
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">{t('cookie_consent.essential.always_active')}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.essential.description')}</p>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-50 cursor-not-allowed shadow-inner">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition"/>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-colors">
                                <div className="flex-1">
                                    <span className="block font-bold text-slate-900 dark:text-white mb-1">{t('cookie_consent.analytics.title')}</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.analytics.description')}</p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 shadow-inner ${preferences.analytics ? 'bg-gradient-to-r from-blue-500 to-violet-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`${preferences.analytics ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200`}/>
                                </button>
                            </div>
                             <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-violet-300/50 dark:hover:border-violet-700/50 transition-colors">
                                <div className="flex-1">
                                    <span className="block font-bold text-slate-900 dark:text-white mb-1">{t('cookie_consent.marketing.title')}</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.marketing.description')}</p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 shadow-inner ${preferences.marketing ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`${preferences.marketing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200`}/>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end gap-3 bg-gradient-to-r from-slate-50/80 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-900/10">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                {t('cookie_consent.cancel')}
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                            >
                                {t('cookie_consent.save_selection')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
