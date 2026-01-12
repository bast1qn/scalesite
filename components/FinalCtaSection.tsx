
import React from 'react';
import { ArrowRightIcon, CheckBadgeIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FinalCtaSectionProps {
  setCurrentPage: (page: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>

      {/* Animated decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full text-sm font-semibold text-emerald-400 mb-12">
            <CheckBadgeIcon className="w-4 h-4" />
            <span>{t('hero_final_cta.guarantee')}</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t('hero_final_cta.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-[length:200%_auto] animate-gradient">
              {t('hero_final_cta.title_highlight')}
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero_final_cta.subtitle')}
          </p>

          {/* Price hint */}
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-14">
            <span className="text-slate-500 line-through text-lg">99€ - 299€</span>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ab</span>
              <span className="text-2xl font-bold text-white">
                29€
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setCurrentPage('preise')}
              className="group relative px-12 py-4.5 bg-white dark:bg-white text-slate-900 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2.5 text-lg">
                <span>{t('hero_final_cta.cta_primary')}</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-12 py-4.5 bg-transparent border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              {t('hero_final_cta.cta_secondary')}
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="font-medium">48h Lieferung</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="font-medium">100% Zufriedenheitsgarantie</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-violet-400"></div>
              <span className="font-medium">Keine Kreditkarte erforderlich</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
