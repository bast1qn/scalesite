
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
        <section className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-gradient-to-br from-blue-400/4 to-violet-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            {t('service_features.title')}
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            {t('service_features.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-2 gap-8 stagger-container">
                        {/* Included */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-emerald-200 dark:border-emerald-900/30 relative overflow-hidden">
                            {/* Gradient line at top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                </span>
                                {t('service_features.included_title')}
                            </h3>
                            <ul className="space-y-4">
                                {includedFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mt-0.5">
                                            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Excluded */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                            {/* Gradient line at top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600"></div>

                            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500">
                                    <XCircleIcon className="w-5 h-5" />
                                </span>
                                {t('service_features.excluded_title')}
                            </h3>
                            <ul className="space-y-4">
                                {excludedFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mt-0.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span>{feature}</span>
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
