
import React, { useEffect, useRef, useState } from 'react';
import { ChevronRightIcon, ReactIcon, TypeScriptIcon, SupabaseIcon, TailwindIcon, FramerMotionIcon, VercelIcon, ArrowRightIcon, CheckBadgeIcon } from './Icons';
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
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!heroRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const x = (clientX / innerWidth - 0.5) * 2;
        const y = (clientY / innerHeight - 0.5) * 2;

        heroRef.current.style.setProperty('--mouse-x', x.toString());
        heroRef.current.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-light-bg dark:bg-dark-bg selection:bg-primary/30 perspective-1000">

      {/* Elegant Background Elements with Parallax */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Subtle Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

         {/* Organic Spotlights */}
         <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-gradient-to-b from-primary/10 to-purple-500/10 rounded-[100%] blur-[120px] opacity-70 transition-transform duration-100 ease-out will-change-transform"
            style={{ transform: 'translate(calc(-50% + var(--mouse-x) * -20px), calc(var(--mouse-y) * -20px))' }}
         ></div>
         <div
            className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] opacity-40 transition-transform duration-200 ease-out will-change-transform"
            style={{ transform: 'translate(calc(var(--mouse-x) * -40px), calc(var(--mouse-y) * -40px))' }}
         ></div>
         <div
            className="absolute top-[20%] left-[-10%] w-[30vw] h-[30vw] bg-pink-500/5 rounded-full blur-[100px] opacity-30 transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: 'translate(calc(var(--mouse-x) * 30px), calc(var(--mouse-y) * 30px))' }}
         ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

            {/* Trust Badge */}
            <div className="mb-8 animate-fade-up opacity-0" style={{ animationDelay: '0.05s' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CheckBadgeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {t('hero.guarantee_badge')}
                    </span>
                </div>
            </div>

            {/* Main Headline - Value Proposition */}
            <h1 className="max-w-5xl mx-auto font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
              {t('hero.title_prefix')} <br className="hidden md:block" />
              <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-orange-500 drop-shadow-sm">
                {t('hero.title_highlight')}
              </span>
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl text-slate-700 dark:text-slate-300 font-normal">
                {t('hero.price_anchor')}
              </span>
            </h1>

            {/* Subtitle - Focus on benefits, not features */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 animate-fade-up opacity-0" style={{ animationDelay: '0.25s' }}>
              {t('hero.subtitle')}
            </p>

            {/* Trust Elements - Risk Reduction */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <CheckBadgeIcon className="w-4 h-4 text-green-500" />
                    <span>{t('hero.delivery_badge')}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <CheckBadgeIcon className="w-4 h-4 text-green-500" />
                    <span>{t('hero.no_hidden_costs')}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <CheckBadgeIcon className="w-4 h-4 text-green-500" />
                    <span>{t('hero.free_consultation')}</span>
                </div>
            </div>

            {/* CTAs - Primary and Secondary */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-8 animate-fade-up opacity-0" style={{ animationDelay: '0.35s' }}>
              <button
                onClick={() => setCurrentPage('preise')}
                className="btn-glow group relative w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>{t('hero.cta_secure')}</span>
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
               <button
                onClick={() => setCurrentPage('projekte')}
                className="w-full sm:w-auto bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold px-6 py-4 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 group hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg"
              >
                <span>{t('hero.cta_examples')}</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Price Anchor - Show value comparison */}
            <div className="mb-12 animate-fade-up opacity-0" style={{ animationDelay: '0.4s' }}>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="line-through text-slate-400">99€ - 299€</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-500 font-semibold">{t('hero.price_savings')}</span>
                </p>
            </div>

            {/* Tech Stack */}
             <div
                className="animate-fade-in opacity-0 transition-transform duration-500 ease-out"
                style={{ animationDelay: '0.5s', transform: 'translate(calc(var(--mouse-x) * 15px), calc(var(--mouse-y) * 15px))' }}
            >
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Gebaut mit modernster Technologie</p>

                <div className="inline-flex items-center justify-center p-1.5 rounded-2xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-6 py-3">
                        {techStack.map((tech, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group cursor-default">
                                <span className="grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100 scale-90 group-hover:scale-110">{tech.icon}</span>
                                <span className="font-semibold text-sm">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
      </div>
    </section>
  );
};
