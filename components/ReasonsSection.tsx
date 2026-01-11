
import React from 'react';
import { ArrowTrendingUpIcon, SparklesIcon, DevicePhoneMobileIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: { [key: string]: React.ReactNode } = {
  'ArrowTrendingUpIcon': <ArrowTrendingUpIcon />,
  'SparklesIcon': <SparklesIcon />,
  'DevicePhoneMobileIcon': <DevicePhoneMobileIcon />,
};

export const ReasonsSection: React.FC = () => {
  const { t } = useLanguage();

  const reasons = [
    { id: 1, title: t('reasons.items.conversion.title'), description: t('reasons.items.conversion.desc'), icon_name: "ArrowTrendingUpIcon" },
    { id: 2, title: t('reasons.items.branding.title'), description: t('reasons.items.branding.desc'), icon_name: "SparklesIcon" },
    { id: 3, title: t('reasons.items.tech.title'), description: t('reasons.items.tech.desc'), icon_name: "DevicePhoneMobileIcon" },
  ];

  return (
    <section className="py-24 sm:py-32 bg-surface dark:bg-dark-surface relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="lg:text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
              {t('reasons.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70 leading-relaxed">
              {t('reasons.subtitle')}
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection stagger>
          <div className="grid gap-8 md:grid-cols-3 stagger-container">
            {reasons.map((reason) => (
              <div key={reason.title} className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/100 transition-all duration-500"></div>
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  {iconMap[reason.icon_name] || <SparklesIcon />}
                </div>
                <h3 className="text-xl font-bold text-dark-text dark:text-light-text mb-3 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-dark-text/70 dark:text-light-text/70 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
