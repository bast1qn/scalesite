
import React from 'react';
import { CheckBadgeIcon, XCircleIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

export const ServiceFeatures: React.FC = () => {
  const { t } = useLanguage();

  // Defensive: Ensure translation returns array, fallback to empty array
  const getFeatureList = (key: string): string[] => {
    const value = t(key);
    if (Array.isArray(value)) {
      return value as string[];
    }
    // Fallback for string translations (comma-separated)
    if (typeof value === 'string') {
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    console.warn(`ServiceFeatures: Expected array for ${key}, got ${typeof value}`);
    return [];
  };

  const includedFeatures = getFeatureList('service_features.included');
  const excludedFeatures = getFeatureList('service_features.excluded');

  return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Animated background - subtle */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/3 to-teal-400/3 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-gradient-to-br from-blue-400/2 to-violet-400/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <AnimatedSection>
                    <div className="text-center mb-14">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            {t('service_features.title')}
                        </h2>
                        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            {t('service_features.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-2 gap-6 stagger-container">
                        {/* Included */}
                        <div className="group bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/30 transition-all duration-300">
                            <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                </span>
                                {t('service_features.included_title')}
                            </h3>
                            <ul className="space-y-3">
                                {includedFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 group/item">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                                            <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300 transition-colors">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Excluded */}
                        <div className="group bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
                            <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                                    <XCircleIcon className="w-5 h-5" />
                                </span>
                                {t('service_features.excluded_title')}
                            </h3>
                            <ul className="space-y-3">
                                {excludedFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-500 dark:text-slate-400 group/item">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mt-0.5">
                                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
  );
};
