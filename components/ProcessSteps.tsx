
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

export const ProcessSteps: React.FC = () => {
  const { t } = useLanguage();

  const processSteps = [
    { id: 1, name: t('process.steps.1.name'), description: t('process.steps.1.desc') },
    { id: 2, name: t('process.steps.2.name'), description: t('process.steps.2.desc') },
    { id: 3, name: t('process.steps.3.name'), description: t('process.steps.3.desc') },
    { id: 4, name: t('process.steps.4.name'), description: t('process.steps.4.desc') },
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">{t('process.badge')}</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
              {t('process.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
              {t('process.subtitle')}
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection stagger>
          <div className="mt-20 relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 hidden md:block" aria-hidden="true"></div>
            
            <div className="space-y-12 md:space-y-0 grid md:grid-cols-2 md:gap-x-12 lg:gap-x-24 stagger-container">
              {processSteps.map((step, index) => (
                <div 
                  key={step.name} 
                  className={`relative group ${index % 2 !== 0 ? 'md:ml-auto md:text-right' : ''} ${index > 0 ? 'mt-12 md:mt-24' : ''}`}
                >
                   <div className="md:hidden absolute top-0 h-full w-0.5 bg-dark-text/10 dark:bg-light-text/10 left-5" aria-hidden="true"></div>
                  
                  <div className={`relative flex items-center gap-6 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                     {/* Number Bubble */}
                     <div className={`z-10 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-dark-surface border-2 border-primary text-primary font-bold rounded-full shadow-glow-sm group-hover:scale-110 transition-transform duration-300 ${index % 2 !== 0 ? 'md:ml-auto' : ''}`}>
                      {index + 1}
                    </div>
                     <h3 className="text-2xl font-bold text-dark-text dark:text-light-text md:hidden">
                      {step.name}
                    </h3>
                  </div>
                  
                  <div className={`mt-4 pl-16 md:pl-0 p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-900/50 transition-colors duration-300 ${index % 2 !== 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                      <h3 className="text-2xl font-bold text-dark-text dark:text-light-text hidden md:block mb-2">
                          {step.name}
                      </h3>
                    <p className="text-lg text-dark-text/70 dark:text-light-text/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
