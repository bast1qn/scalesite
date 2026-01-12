
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
      {/* COSMIC Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[5%] w-[700px] h-[700px] bg-gradient-to-br from-blue-400/10 to-violet-400/8 rounded-full blur-3xl animate-nebula-cloud shadow-glow-cosmic"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[700px] h-[700px] bg-gradient-to-br from-emerald-400/10 to-teal-400/8 rounded-full blur-3xl animate-nebula-cloud shadow-glow-aurora" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[50%] left-[40%] w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-400/8 to-pink-400/6 rounded-full blur-3xl animate-quantum-shift" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* COSMIC STARDUST FIELD */}
      <div className="absolute inset-0 stardust-field opacity-30 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          {/* COSMIC Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-quantum border border-blue-200/60 dark:border-blue-800/40 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:shadow-glow-cosmic transition-all duration-500 hover:scale-105 relative overflow-hidden group hover-prismatic-shine">
              <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <span className="relative z-10">{t('process.badge')}</span>
            </span>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 animate-cosmic-shimmer">
                {t('process.title')}
              </span>
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
                {/* COSMIC Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[3px] bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 animate-cosmic-shimmer shadow-glow-cosmic-sm"></div>
                )}

                {/* COSMIC Card */}
                <div className="relative glass-quantum rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-glow-cosmic hover:-translate-y-2 transition-all duration-500 h-full overflow-hidden hover-prismatic-shine">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  {/* Holographic overlay */}
                  <div className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>

                  {/* COSMIC gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 animate-cosmic-shimmer`}></div>

                  {/* COSMIC Step number badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 text-white dark:text-slate-900 text-sm font-bold flex items-center justify-center shadow-glow-cosmic-sm animate-crystal-sparkle border-2 border-slate-800 dark:border-white/20 z-10">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-xl ${step.bg} ${step.textColor} flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg hover:shadow-glow-cosmic-md`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-glow-breathe`}></div>
                    <div className="relative z-10">{step.icon}</div>
                  </div>

                  {/* Emoji badge */}
                  <div className="absolute top-4 right-4 text-2xl opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 animate-antigravity">
                    {step.emoji}
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, ${step.color.split(' ')[0].replace('from-', '#')}, ${step.color.split(' ')[1].replace('to-', '#')})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t(step.nameKey)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                    {t(step.descKey)}
                  </p>

                  {/* COSMIC corner accent */}
                  <div className={`absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-tl-3xl animate-nebula-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* COSMIC Timeline for mobile */}
        <div className="md:hidden mt-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500 animate-cosmic-shimmer shadow-glow-cosmic"></div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`relative z-10 w-12 h-12 rounded-full ${step.bg} ${step.textColor} flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-slate-900 shadow-glow-cosmic-sm hover:scale-125 transition-transform duration-500 animate-crystal-sparkle`}>
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
