
import React from 'react';
import { ArrowRightIcon, CheckBadgeIcon, ClockIcon, ShieldCheckIcon, CreditCardIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FinalCtaSectionProps {
  setCurrentPage: (page: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* COSMIC gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>

      {/* COSMIC gradient mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur-3xl animate-nebula-cloud shadow-glow-cosmic"></div>
        <div className="absolute bottom-0 left-1/4 w-[900px] h-[900px] bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-nebula-cloud shadow-glow-aurora" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-nebula-cloud shadow-glow-nebula" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/15 to-blue-400/10 rounded-full blur-3xl animate-quantum-shift" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-400/12 to-pink-400/10 rounded-full blur-3xl animate-magnetic-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] animate-starfield"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>

      {/* COSMIC floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-antigravity shadow-glow-cosmic-sm"
          style={{
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            left: `${5 + Math.random() * 90}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            background: Math.random() > 0.5
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)',
            boxShadow: `0 0 ${6 + Math.random() * 8}px ${Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(139, 92, 246, 0.6)'}`,
          }}
        ></div>
      ))}

      {/* COSMIC STARDUST FIELD */}
      <div className="absolute inset-0 stardust-field opacity-40 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center">
          {/* COSMIC Badge */}
          <div className="inline-flex items-center gap-2.5 glass-nebula border border-emerald-400/30 px-6 py-3 rounded-full text-sm font-semibold text-emerald-400 mb-12 group hover:shadow-glow-cosmic hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 relative overflow-hidden hover-prismatic-shine">
            <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative">
              <CheckBadgeIcon className="w-4 h-4 animate-crystal-sparkle" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="relative z-10">{t('hero_final_cta.guarantee')}</span>
          </div>

          {/* COSMIC Heading with animated gradient */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t('hero_final_cta.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 via-cyan-400 to-emerald-400 bg-[length:300%_auto] animate-cosmic-shimmer text-glow-cosmic-lg relative">
              {t('hero_final_cta.title_highlight')}
              {/* COSMIC glow effect */}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 blur-2xl opacity-70 animate-cosmic-energy"></span>
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero_final_cta.subtitle')}
          </p>

          {/* COSMIC Price hint */}
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl glass-quantum border border-white/20 mb-14 group hover:shadow-glow-cosmic hover:shadow-white/20 transition-all duration-500 hover:scale-105 relative overflow-hidden hover-prismatic-shine">
            <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute inset-0 holographic-base opacity-20"></div>
            <span className="text-slate-500 line-through text-lg group-hover:text-slate-400 transition-colors relative z-10">99€ - 299€</span>
            <div className="h-6 w-px bg-white/20 relative z-10"></div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-slate-400">Ab</span>
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 animate-cosmic-shimmer">
                29€
              </span>
              <span className="text-slate-400">/Monat</span>
            </div>
          </div>

          {/* COSMIC CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setCurrentPage('preise')}
              className="group relative px-12 py-5 bg-white dark:bg-white text-slate-900 font-semibold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-glow-cosmic hover:shadow-white/30 hover:-translate-y-1 hover-prismatic-shine"
            >
              {/* COSMIC Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-20 flex items-center gap-2.5 text-lg">
                <span>{t('hero_final_cta.cta_primary')}</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="group px-12 py-5 bg-transparent border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-cosmic hover:shadow-white/10 text-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              {t('hero_final_cta.cta_secondary')}
            </button>
          </div>

          {/* COSMIC Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full glass-aurora border border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-glow-aurora hover:shadow-emerald-500/30 transition-all duration-500 relative overflow-hidden hover-prismatic-shine">
              <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-emerald-400 animate-crystal-sparkle" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="font-medium text-slate-300 relative z-10">48h Lieferung</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full glass-nebula border border-blue-500/30 hover:border-blue-500/60 hover:shadow-glow-cosmic hover:shadow-blue-500/30 transition-all duration-500 relative overflow-hidden hover-prismatic-shine">
              <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <ShieldCheckIcon className="w-4 h-4 text-blue-400 animate-crystal-sparkle" />
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="font-medium text-slate-300 relative z-10">100% Zufriedenheitsgarantie</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full glass-plasma border border-violet-500/30 hover:border-violet-500/60 hover:shadow-glow-plasma hover:shadow-violet-500/30 transition-all duration-500 relative overflow-hidden hover-prismatic-shine">
              <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <CreditCardIcon className="w-4 h-4 text-violet-400 animate-crystal-sparkle" />
                <div className="absolute inset-0 bg-violet-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="font-medium text-slate-300 relative z-10">Keine Kreditkarte erforderlich</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};
