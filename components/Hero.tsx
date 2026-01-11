
import React, { useEffect, useRef, useState } from 'react';
import { ReactIcon, TypeScriptIcon, SupabaseIcon, TailwindIcon, FramerMotionIcon, VercelIcon, ArrowRightIcon, CheckBadgeIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  setCurrentPage: (page: string) => void;
}

const techStack = [
    { name: 'React', icon: <ReactIcon className="w-5 h-5 text-[#61dafb]" /> },
    { name: 'TypeScript', icon: <TypeScriptIcon className="w-5 h-5 text-blue-600" /> },
    { name: 'Supabase', icon: <SupabaseIcon className="w-5 h-5 text-green-500" /> },
    { name: 'Tailwind', icon: <TailwindIcon className="w-5 h-5 text-cyan-400" /> },
    { name: 'Framer', icon: <FramerMotionIcon className="w-5 h-5 text-black dark:text-white" /> },
    { name: 'Vercel', icon: <VercelIcon className="w-4 h-4 text-black dark:text-white" /> },
];

export const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-12 bg-light-bg dark:bg-dark-bg">

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

            {/* Simple Trust Badge */}
            <div className="mb-10 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CheckBadgeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('hero.guarantee_badge')}
                    </span>
                </div>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-5xl mx-auto font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
              <span className="block mb-2">{t('hero.title_prefix')}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                {t('hero.title_highlight')}
              </span>
              <span className="block mt-6 text-2xl sm:text-3xl lg:text-4xl text-slate-600 dark:text-slate-400 font-medium">
                {t('hero.price_anchor')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
              {t('hero.subtitle')}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-5 mb-12 animate-fade-up opacity-0" style={{ animationDelay: '0.4s' }}>
                {[
                    { icon: <CheckBadgeIcon className="w-4 h-4" />, text: t('hero.delivery_badge') },
                    { icon: <CheckBadgeIcon className="w-4 h-4" />, text: t('hero.no_hidden_costs') },
                    { icon: <CheckBadgeIcon className="w-4 h-4" />, text: t('hero.free_consultation') }
                ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.text}</span>
                    </div>
                ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10 animate-fade-up opacity-0" style={{ animationDelay: '0.5s' }}>
              <button
                onClick={() => setCurrentPage('preise')}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t('hero.cta_secure')}
              </button>
              <button
                onClick={() => setCurrentPage('projekte')}
                className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{t('hero.cta_examples')}</span>
                <ArrowRightIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Price Anchor */}
            <div className="mb-12 animate-fade-up opacity-0" style={{ animationDelay: '0.6s' }}>
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="line-through text-lg">99€ - 299€</span>
                    </span>
                    <div className="h-5 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {t('hero.price_savings')}
                    </span>
                </div>
            </div>

            {/* Tech Stack */}
             <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.7s' }}>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-4">
                    Gebaut mit modernster Technologie
                </p>

                <div className="inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                        {techStack.map((tech, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 transition-colors"
                            >
                                {tech.icon}
                                <span className="text-sm font-medium">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-light-bg dark:from-dark-bg to-transparent pointer-events-none"></div>
    </section>
  );
};
