
import React, { useEffect, useState } from 'react';
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

// Floating particle component
const FloatingParticle: React.FC<{ delay: number; duration: number; left: string; size: string }> = ({ delay, duration, left, size }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left,
        animation: `float-up ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      <div
        className="rounded-full bg-gradient-to-br from-blue-400/30 to-violet-400/30 blur-sm"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30"></div>

      {/* Animated gradient orbs with mouse tracking */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[15%] left-[5%] w-[700px] h-[700px] bg-gradient-to-br from-blue-500/15 via-violet-500/12 to-indigo-500/10 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
            animation: 'gradient-orb-1 8s ease-in-out infinite alternate',
          }}
        ></div>
        <div
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-violet-500/12 via-purple-500/10 to-pink-500/8 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            animation: 'gradient-orb-2 10s ease-in-out infinite alternate',
          }}
        ></div>
        <div
          className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/8 to-teal-400/6 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            animation: 'gradient-orb-3 12s ease-in-out infinite alternate',
          }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticle delay={0} duration={15} left="10%" size="8px" />
        <FloatingParticle delay={2} duration={18} left="20%" size="6px" />
        <FloatingParticle delay={4} duration={20} left="35%" size="10px" />
        <FloatingParticle delay={1} duration={16} left="50%" size="7px" />
        <FloatingParticle delay={3} duration={19} left="65%" size="9px" />
        <FloatingParticle delay={5} duration={17} left="75%" size="5px" />
        <FloatingParticle delay={2.5} duration={21} left="85%" size="8px" />
        <FloatingParticle delay={1.5} duration={14} left="90%" size="6px" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-black/20 mb-16 animate-fade-in hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-default">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-500/30"></div>
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
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path
                d="M0 16C50 4 150 4 200 10C250 16 350 16 400 4"
                stroke="url(#hero-underline)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="#6366f1" stopOpacity="0.5" />
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
            className="group relative px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-white/25"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 animate-gradient-xy opacity-0 group-hover:opacity-30"></span>
            <span className="relative z-10 flex items-center gap-2">
              <span>Projekt starten</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
          <button
            onClick={() => setCurrentPage('projekte')}
            className="group px-10 py-4 text-slate-700 dark:text-slate-300 font-semibold rounded-full border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/30"
          >
            <span className="flex items-center gap-2">
              Beispiele ansehen
              <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </span>
          </button>
        </div>

        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {guarantees.map((g, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-default">
              <span className="text-lg filter drop-shadow-sm">{g.icon}</span>
              <span className="font-medium">{g.text}</span>
            </div>
          ))}
        </div>

        {/* Price hint */}
        <div className="mt-12 inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-black/30 animate-fade-in hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500 line-through text-lg">99€ - 299€</span>
            <ArrowRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              29€
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Startpreis</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 to-transparent pointer-events-none"></div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
