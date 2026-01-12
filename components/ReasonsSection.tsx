
import React from 'react';
import { ClockIcon, ShieldCheckIcon, SparklesIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const reasons = [
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: '48h Lieferung',
    description: 'Deine Website ist schneller fertig als bei anderen Agenturen.',
    gradient: 'from-blue-500 to-cyan-400',
    bgGradient: 'from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30',
    glowColor: 'group-hover:shadow-blue-500/25',
    borderColor: 'group-hover:border-blue-200 dark:group-hover:border-blue-800',
    number: '48',
    unit: 'h',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: '30 Tage Garantie',
    description: 'Volle Geld-zurck Garantie ohne Wenn und Aber.',
    gradient: 'from-emerald-500 to-teal-400',
    bgGradient: 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30',
    glowColor: 'group-hover:shadow-emerald-500/25',
    borderColor: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800',
    number: '30',
    unit: 'Tage',
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'Alles inklusive',
    description: 'SSL, Hosting, Domain, Impressum, Datenschutz – alles fertig.',
    gradient: 'from-violet-500 to-purple-400',
    bgGradient: 'from-violet-50/80 to-purple-50/80 dark:from-violet-900/30 dark:to-purple-900/30',
    glowColor: 'group-hover:shadow-violet-500/25',
    borderColor: 'group-hover:border-violet-200 dark:group-hover:border-violet-800',
    number: '∞',
    unit: 'Features',
  }
];

export const ReasonsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        color: 'rgb(148 163 184)'
      }}></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-[5%] w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-[5%] w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-violet-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            Warum ScaleSite?
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">
              {t('reasons.title')}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('reasons.subtitle')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className={`group relative bg-gradient-to-br ${reason.bgGradient} backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 ${reason.borderColor} shadow-lg shadow-slate-200/50 dark:shadow-black/20 ${reason.glowColor} hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
              >
                {/* Animated gradient line at top */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${reason.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                {/* Animated icon background glow */}
                <div className={`absolute top-8 left-8 w-16 h-16 bg-gradient-to-br ${reason.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

                {/* Background number */}
                <div className={`absolute top-4 right-4 text-6xl md:text-7xl font-bold bg-gradient-to-br ${reason.gradient} bg-clip-text text-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500`}>
                  {reason.number}
                </div>

                {/* Icon */}
                <div className="relative">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {reason.icon}
                  </div>
                </div>

                <h3 className="relative font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 mt-6">
                  {reason.title}
                </h3>
                <p className="relative text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {reason.description}
                </p>

                {/* Unit badge */}
                <div className={`absolute bottom-4 right-4 px-2 py-1 rounded-md bg-gradient-to-br ${reason.gradient} bg-opacity-10 text-xs font-bold text-transparent bg-clip-text opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}>
                  {reason.unit}
                </div>

                {/* Decorative corner dots */}
                <div className="absolute bottom-4 left-4 flex gap-1">
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75`}></div>
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100`}></div>
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150`}></div>
                </div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 border-2 border-white dark:border-slate-800"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 border-2 border-white dark:border-slate-800"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 border-2 border-white dark:border-slate-800"></div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    500+ zufriedene Kunden
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
