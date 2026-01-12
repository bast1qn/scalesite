
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatBubbleBottomCenterTextIcon, ClipboardDocumentCheckIcon, RocketLaunchIcon, SparklesIcon } from './Icons';

const steps = [
  {
    icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
    emoji: '💬',
    nameKey: 'process.steps.1.name',
    descKey: 'process.steps.1.desc',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />,
    emoji: '📋',
    nameKey: 'process.steps.2.name',
    descKey: 'process.steps.2.desc',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    textColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: <RocketLaunchIcon className="w-6 h-6" />,
    emoji: '🚀',
    nameKey: 'process.steps.3.name',
    descKey: 'process.steps.3.desc',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    textColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    emoji: '✨',
    nameKey: 'process.steps.4.name',
    descKey: 'process.steps.4.desc',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

export const ProcessSteps: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/5 to-violet-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('process.badge')}
            </span>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('process.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              {t('process.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
                )}

                {/* Card */}
                <div className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 text-white dark:text-slate-900 text-sm font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${step.bg} ${step.textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>

                  {/* Emoji badge */}
                  <div className="absolute top-4 right-4 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {step.emoji}
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {t(step.nameKey)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Timeline for mobile */}
        <div className="md:hidden mt-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500"></div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`relative z-10 w-12 h-12 rounded-full ${step.bg} ${step.textColor} flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-slate-900`}>
                  {step.icon}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {t(step.nameKey)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
