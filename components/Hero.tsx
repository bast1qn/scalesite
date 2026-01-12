
import React from 'react';
import { ArrowRightIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  setCurrentPage: (page: string) => void;
}

const guarantees = [
  { text: '48h Lieferung', icon: '⚡' },
  { text: '30 Tage Geld-zurück', icon: '🛡️' },
  { text: 'Alles inklusive', icon: '✨' },
];

export const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"></div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 to-violet-400/6 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/6 to-purple-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/4 to-teal-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-black/20 mb-16 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('hero.guarantee_badge')}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {t('hero.title_prefix')}{' '}
          <span className="relative inline-block px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">
              {t('hero.title_highlight')}
            </span>
            <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 400 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0 14C60 2 340 2 400 14" stroke="url(#hero-underline)" strokeWidth="4" strokeLinecap="round" fill="none"/>
              <defs>
                <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="15%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="85%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {t('hero.subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => setCurrentPage('preise')}
            className="group relative px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-900/20 dark:hover:shadow-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Projekt starten</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => setCurrentPage('projekte')}
            className="px-10 py-4 text-slate-700 dark:text-slate-300 font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
          >
            Beispiele ansehen
          </button>
        </div>

        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {guarantees.map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-lg">{g.icon}</span>
              <span className="font-medium">{g.text}</span>
            </div>
          ))}
        </div>

        {/* Price hint */}
        <div className="mt-12 inline-flex items-center gap-6 px-8 py-4 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500 line-through">99€ - 299€</span>
            <ArrowRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              29€
            </span>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Startpreis</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
    </section>
  );
};
