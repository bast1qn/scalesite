
import React from 'react';
import { ClockIcon, ShieldCheckIcon, SparklesIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const reasons = [
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: '48h Lieferung',
    description: 'Deine Website ist schneller fertig als bei anderen Agenturen.',
    gradient: 'from-blue-500 to-cyan-400',
    bgGradient: 'from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30',
    glowColor: 'group-hover:shadow-blue-500/25',
    borderColor: 'group-hover:border-blue-200 dark:group-hover:border-blue-800',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: '30 Tage Garantie',
    description: 'Volle Geld-zurück Garantie ohne Wenn und Aber.',
    gradient: 'from-emerald-500 to-teal-400',
    bgGradient: 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30',
    glowColor: 'group-hover:shadow-emerald-500/25',
    borderColor: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800',
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'Alles inklusive',
    description: 'SSL, Hosting, Domain, Impressum, Datenschutz – alles fertig.',
    gradient: 'from-violet-500 to-purple-400',
    bgGradient: 'from-violet-50/80 to-purple-50/80 dark:from-violet-900/30 dark:to-purple-900/30',
    glowColor: 'group-hover:shadow-violet-500/25',
    borderColor: 'group-hover:border-violet-200 dark:group-hover:border-violet-800',
  }
];

export const ReasonsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        color: 'rgb(148 163 184)'
      }}></div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-[5%] w-72 h-72 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-[5%] w-72 h-72 bg-gradient-to-br from-violet-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Warum ScaleSite?
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            {t('reasons.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('reasons.subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${reason.bgGradient} backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 ${reason.borderColor} shadow-lg shadow-slate-200/50 dark:shadow-black/20 ${reason.glowColor} hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
            >
              {/* Animated gradient line at top */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${reason.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

              {/* Animated icon background glow */}
              <div className={`absolute top-8 left-8 w-16 h-16 bg-gradient-to-br ${reason.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

              {/* Icon */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {reason.icon}
                </div>
              </div>

              <h3 className="relative font-serif text-xl font-bold text-slate-900 dark:text-white mb-3 mt-6">
                {reason.title}
              </h3>
              <p className="relative text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {reason.description}
              </p>

              {/* Decorative corner */}
              <div className={`absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
