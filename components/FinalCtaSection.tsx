import React from 'react';
import { ArrowRightIcon, CheckBadgeIcon, ClockIcon, ShieldCheckIcon, CreditCardIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FinalCtaSectionProps {
  setCurrentPage: (page: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>

      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/8 to-teal-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }}></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-full text-sm font-semibold text-emerald-400 mb-12">
            <CheckBadgeIcon className="w-4 h-4" />
            <span>{t('hero_final_cta.guarantee')}</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('hero_final_cta.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400">
              {t('hero_final_cta.title_highlight')}
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero_final_cta.subtitle')}
          </p>

          {/* Price hint */}
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 mb-12 backdrop-blur-xl">
            <span className="text-slate-400 line-through text-lg">99€ - 299€</span>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ab</span>
              <span className="text-3xl font-bold text-white">
                29€
              </span>
              <span className="text-slate-400">/Monat</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setCurrentPage('preise')}
              className="group px-10 py-4 bg-white dark:bg-white text-slate-900 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2.5 text-lg">
                <span>{t('hero_final_cta.cta_primary')}</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5 text-lg"
            >
              {t('hero_final_cta.cta_secondary')}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-emerald-500/30">
              <ClockIcon className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-300">48h Lieferung</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-blue-500/30">
              <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-slate-300">100% Zufriedenheitsgarantie</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-violet-500/30">
              <CreditCardIcon className="w-4 h-4 text-violet-400" />
              <span className="font-medium text-slate-300">Keine Kreditkarte erforderlich</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
