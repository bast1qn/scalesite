
import React from 'react';
import { ChatBubbleBottomCenterTextIcon, CheckBadgeIcon, RocketLaunchIcon, SparklesIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const usps = [
  {
    icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
    emoji: '💬',
    nameKey: 'usps.items.personal.name',
    descKey: 'usps.items.personal.desc',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <CheckBadgeIcon className="w-6 h-6" />,
    emoji: '✓',
    nameKey: 'usps.items.quality.name',
    descKey: 'usps.items.quality.desc',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    emoji: '⚡',
    nameKey: 'usps.items.tech.name',
    descKey: 'usps.items.tech.desc',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: <RocketLaunchIcon className="w-6 h-6" />,
    emoji: '🚀',
    nameKey: 'usps.items.goals.name',
    descKey: 'usps.items.goals.desc',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    gradient: 'from-orange-500 to-amber-500',
  },
];

export const UspSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/5 to-violet-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/4 to-teal-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              {t('usps.title')}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              {t('usps.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
            {usps.map((usp, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top gradient line */}
                <div className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r ${usp.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${usp.bg} ${usp.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {usp.icon}
                </div>

                {/* Emoji */}
                <div className="absolute top-4 right-4 text-xl opacity-30 group-hover:opacity-60 transition-opacity">
                  {usp.emoji}
                </div>

                {/* Content */}
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {t(usp.nameKey)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(usp.descKey)}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
