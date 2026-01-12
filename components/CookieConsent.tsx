
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
            setPreferences(JSON.parse(savedConsent));
        }
    }, []);

    const saveConsent = (prefs: CookiePreferences) => {
        localStorage.setItem('cookie-consent', JSON.stringify(prefs));
        setPreferences(prefs);
        setIsVisible(false);
        setShowSettings(false);
        // Analytics integration would go here when prefs.analytics is true
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
            {/* Main Banner */}
            <div className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <div className="max-w-5xl mx-auto bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-6 md:flex items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <CookieIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('cookie_consent.title')}</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {t('cookie_consent.description')}
                            <button onClick={() => window.open('/datenschutz', '_blank')} className="ml-1 text-primary hover:underline">
                                {t('cookie_consent.privacy_link')}
                            </button>
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3 shrink-0">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                            {t('cookie_consent.settings')}
                        </button>
                        <button
                            onClick={handleRejectAll}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            {t('cookie_consent.reject')}
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
                        >
                            {t('cookie_consent.accept_all')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('cookie_consent.settings_title')}</h3>
                            <button onClick={() => setShowSettings(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <XMarkIcon className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {t('cookie_consent.description_settings')}
                            </p>

                            {/* Essential */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-900 dark:text-white">{t('cookie_consent.essential.title')}</span>
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">{t('cookie_consent.essential.always_active')}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.essential.description')}</p>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary opacity-50 cursor-not-allowed">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="flex-1">
                                    <span className="block font-bold text-slate-900 dark:text-white mb-1">{t('cookie_consent.analytics.title')}</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.analytics.description')}</p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.analytics ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`${preferences.analytics ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}/>
                                </button>
                            </div>

                             {/* Marketing */}
                             <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="flex-1">
                                    <span className="block font-bold text-slate-900 dark:text-white mb-1">{t('cookie_consent.marketing.title')}</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.marketing.description')}</p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.marketing ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`${preferences.marketing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}/>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                {t('cookie_consent.cancel')}
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
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
