// ========================================================================
// IMPORTS - Organized by: React → External → Internal → Types
// ========================================================================

// React
import { type FC } from 'react';

// Internal - Components
import { AnimatedSection, ChatBubbleBottomCenterTextIcon, ClipboardDocumentCheckIcon, RocketLaunchIcon, SparklesIcon } from './index';

// Internal - Contexts
import { useLanguage } from '../contexts';

// Internal - Lib
import { TEXT_GRADIENT_PRIMARY } from '../lib/ui-patterns';

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

export const ProcessSteps: FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 to-violet-400/6 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/8 to-teal-400/6 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-3 min-h-11 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200/60 dark:border-primary-800/40 text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider leading-snug">
              {t('process.badge')}
            </span>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              <span className={TEXT_GRADIENT_PRIMARY}>
                {t('process.title')}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('process.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step, index) => (
              <div key={step.nameKey} className="group relative">
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400"></div>
                )}

                {/* Card */}
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-full focus-within:ring-2 focus-within:ring-primary-500/50">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 z-10">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-xl ${step.bg} ${step.textColor} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-[1.02]`}>
                    <div className="relative z-10">{step.icon}</div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white mb-2 leading-snug transition-all duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
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
        <div className="md:hidden mt-12 relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500"></div>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.nameKey} className="flex items-start gap-4">
                <div className={`relative z-10 w-12 h-12 rounded-full ${step.bg} ${step.textColor} flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-slate-900 shadow-sm`}>
                  {step.icon}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white mb-1 leading-snug">
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
