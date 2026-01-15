import { useState, useEffect } from 'react';
import { XMarkIcon, CookieIcon, AdjustmentsHorizontalIcon } from './Icons';
import { useLanguage } from '../contexts';
import { TIMING } from '../lib/constants';

interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const CookieConsent = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // SSR-Safety: Check if window is defined (not server-side)
        if (typeof window === 'undefined') return;

        // 🐛 BUG FIX: Store timer reference and clean up on unmount
        const timers: NodeJS.Timeout[] = [];

        try {
            const savedConsent = localStorage.getItem('cookie-consent');
            if (!savedConsent) {
                const timer = setTimeout(() => setIsVisible(true), TIMING.typingDebounce);
                timers.push(timer);
            } else {
                const parsed = JSON.parse(savedConsent);
                // Type guard for CookiePreferences
                if (parsed && typeof parsed === 'object' && 'essential' in parsed && 'analytics' in parsed && 'marketing' in parsed) {
                    setPreferences({
                        essential: Boolean(parsed.essential),
                        analytics: Boolean(parsed.analytics),
                        marketing: Boolean(parsed.marketing)
                    });
                } else {
                    const timer = setTimeout(() => setIsVisible(true), TIMING.typingDebounce);
                    timers.push(timer);
                }
            }
        } catch (error) {
            // Failed to load cookie consent - show banner
            const timer = setTimeout(() => setIsVisible(true), TIMING.typingDebounce);
            timers.push(timer);
        }

        // Cleanup function to clear all timers
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, []);

    const saveConsent = (prefs: CookiePreferences) => {
        // SSR-Safety: Check if window is defined (not server-side)
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem('cookie-consent', JSON.stringify(prefs));
        } catch (error) {
            // Failed to save cookie consent - continue anyway
        }
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
            <div className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 transition-all duration-400 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <div className="max-w-5xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xl shadow-slate-200/30 dark:shadow-black/30 rounded-3xl p-6 md:flex items-center justify-between gap-6 relative overflow-hidden">
                    {/* Gradient accent border - Vercel inspired subtle top accent */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-violet-500 to-primary-600 rounded-t-3xl"></div>
                    {/* Subtle ambient glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-primary-400/8 to-violet-400/6 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex-1 relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-900/30 dark:to-violet-900/30 rounded-xl text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-primary-200/50 dark:ring-primary-800/30">
                                <CookieIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">{t('cookie_consent.title')}</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('cookie_consent.description')}
                            <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="ml-1 text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 underline decoration-primary-500/30 hover:decoration-primary-500 underline-offset-2 transition-all duration-200">
                                {t('cookie_consent.privacy_link')}
                            </a>
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-2.5 shrink-0 relative">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="group px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-250 flex items-center justify-center gap-2 hover:shadow-sm"
                        >
                            <AdjustmentsHorizontalIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 ease-out" />
                            {t('cookie_consent.settings')}
                        </button>
                        <button
                            onClick={handleRejectAll}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-250"
                        >
                            {t('cookie_consent.reject')}
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="group px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 shadow-md shadow-primary-500/20 transition-all duration-250 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-px active:translate-y-0 overflow-hidden relative"
                        >
                            <span className="relative flex items-center gap-2">
                                {t('cookie_consent.accept_all')}
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-250 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200/70 dark:border-slate-700/70 overflow-hidden animate-scale-in relative">
                        {/* Gradient accent border */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-violet-500 to-primary-600 rounded-t-3xl"></div>

                        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center bg-gradient-to-r from-slate-50/80 to-primary-50/30 dark:from-slate-800/50 dark:to-primary-900/10">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">{t('cookie_consent.settings_title')}</h3>
                            <button onClick={() => setShowSettings(false)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02] group">
                                <XMarkIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('cookie_consent.description_settings')}
                            </p>
                            {/* Essential Cookies - Always active */}
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-800/50 dark:to-primary-900/10 border border-slate-200 dark:border-slate-700">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-slate-900 dark:text-white">{t('cookie_consent.essential.title')}</span>
                                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">{t('cookie_consent.essential.always_active')}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.essential.description')}</p>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-50 cursor-not-allowed shadow-inner">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition"/>
                                </div>
                            </div>
                            {/* Analytics Toggle */}
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-primary-300/50 dark:hover:border-primary-700/50 transition-all duration-200 group">
                                <div className="flex-1">
                                    <span className="block font-semibold text-slate-900 dark:text-white mb-1">{t('cookie_consent.analytics.title')}</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.analytics.description')}</p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-250 shadow-inner ${preferences.analytics ? 'bg-gradient-to-r from-primary-500 to-violet-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`${preferences.analytics ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200`}/>
                                </button>
                            </div>
                            {/* Marketing Toggle */}
                             <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-violet-300/50 dark:hover:border-violet-700/50 transition-all duration-200 group">
                                <div className="flex-1">
                                    <span className="block font-semibold text-slate-900 dark:text-white mb-1">{t('cookie_consent.marketing.title')}</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cookie_consent.marketing.description')}</p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-250 shadow-inner ${preferences.marketing ? 'bg-gradient-to-r from-violet-500 to-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`${preferences.marketing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200`}/>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end gap-3 bg-gradient-to-r from-slate-50/80 to-primary-50/30 dark:from-slate-800/50 dark:to-primary-900/10">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                            >
                                {t('cookie_consent.cancel')}
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 shadow-md shadow-primary-500/20 transition-all duration-250 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-px active:translate-y-0"
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
