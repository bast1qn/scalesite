
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
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-blue-500/15 to-violet-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

      {/* Floating particles */}
      <div className="absolute top-20 left-[10%] w-1 h-1 bg-blue-400/60 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-[30%] w-1 h-1 bg-emerald-400/60 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full text-sm font-semibold text-emerald-400 mb-12 group hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
            <div className="relative">
              <CheckBadgeIcon className="w-4 h-4" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span>{t('hero_final_cta.guarantee')}</span>
          </div>

          {/* Heading with animated gradient */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t('hero_final_cta.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-[length:200%_auto] animate-gradient relative">
              {t('hero_final_cta.title_highlight')}
              {/* Animated glow effect */}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 blur-xl opacity-50 animate-gradient"></span>
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero_final_cta.subtitle')}
          </p>

          {/* Enhanced Price hint */}
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-14 group hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <span className="text-slate-500 line-through text-lg group-hover:text-slate-400 transition-colors">99€ - 299€</span>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ab</span>
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
                29€
              </span>
              <span className="text-slate-400">/Monat</span>
            </div>
          </div>

          {/* Enhanced CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setCurrentPage('preise')}
              className="group relative px-12 py-5 bg-white dark:bg-white text-slate-900 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
              <span className="relative z-20 flex items-center gap-2.5 text-lg">
                <span>{t('hero_final_cta.cta_primary')}</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="group px-12 py-5 bg-transparent border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 text-lg"
            >
              {t('hero_final_cta.cta_secondary')}
            </button>
          </div>

          {/* Enhanced Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-300">
              <div className="relative w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-emerald-400" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="font-medium text-slate-300">48h Lieferung</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all duration-300">
              <div className="relative w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="font-medium text-slate-300">100% Zufriedenheitsgarantie</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-300">
              <div className="relative w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <CreditCardIcon className="w-4 h-4 text-violet-400" />
                <div className="absolute inset-0 bg-violet-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="font-medium text-slate-300">Keine Kreditkarte erforderlich</span>
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
