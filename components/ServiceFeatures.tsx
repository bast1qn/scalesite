
import React from 'react';
import { CheckBadgeIcon, XCircleIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

export const ServiceFeatures: React.FC = () => {
  const { t } = useLanguage();

  const includedFeatures = t('service_features.included') as string[];
  const excludedFeatures = t('service_features.excluded') as string[];

  return (
        <section className="py-24 bg-surface dark:bg-dark-surface border-t border-dark-text/5 dark:border-light-text/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-dark-text dark:text-light-text font-serif">
                            {t('service_features.title')}
                        </h2>
                        <p className="mt-4 text-lg text-dark-text/70 dark:text-light-text/70 max-w-2xl mx-auto">
                            {t('service_features.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-2 gap-12 stagger-container">
                        {/* Included */}
                        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl shadow-lg border border-green-500/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                            <h3 className="text-xl font-bold text-dark-text dark:text-light-text mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                </span>
                                {t('service_features.included_title')}
                            </h3>
                            <ul className="space-y-4">
                                {includedFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-dark-text/80 dark:text-light-text/80">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Excluded */}
                        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                            <h3 className="text-xl font-bold text-dark-text dark:text-light-text mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    <XCircleIcon className="w-5 h-5" />
                                </span>
                                {t('service_features.excluded_title')}
                            </h3>
                            <ul className="space-y-4">
                                {excludedFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
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
