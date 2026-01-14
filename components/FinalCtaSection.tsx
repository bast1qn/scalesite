import { ArrowRightIcon, CheckBadgeIcon, ClockIcon, ShieldCheckIcon, CreditCardIcon } from './index';
import { useLanguage } from '../contexts';

interface FinalCtaSectionProps {
  setCurrentPage: (page: string) => void;
}

export const FinalCtaSection = ({ setCurrentPage }: FinalCtaSectionProps) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#030305] dark:via-slate-950 dark:to-[#030305]"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/12 to-violet-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/10 to-teal-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/8 to-primary-500/6 rounded-full blur-3xl animate-blob" style={{ animationDelay: '7s' }}></div>
      </div>

      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }}></div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/40 px-6 py-3 rounded-full text-sm font-semibold text-emerald-400 mb-14 shadow-premium backdrop-blur-xl">
            <CheckBadgeIcon className="w-4 h-4" />
            <span>{t('hero_final_cta.guarantee')}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-snug">
            {t('hero_final_cta.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400 bg-[length:200%_auto] animate-gradient-shimmer">
              {t('hero_final_cta.title_highlight')}
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto leading-relaxed">
            {t('hero_final_cta.subtitle')}
          </p>

          <div className="inline-flex items-center gap-6 px-9 py-5 rounded-2xl bg-white/10 border border-white/20 mb-14 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-premium">
            <span className="text-slate-400 line-through text-lg">99€ - 299€</span>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ab</span>
              <span className="text-4xl font-bold text-white">
                29€
              </span>
              <span className="text-slate-400">/Monat</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={() => setCurrentPage('preise')}
              className="group px-8 sm:px-11 py-4 min-h-11 bg-white dark:bg-white text-slate-900 font-semibold rounded-full overflow-hidden transition-all duration-300 ease-smooth hover:scale-[1.02] hover:shadow-premium-xl hover:-translate-y-1 active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50"
            >
              <span className="flex items-center gap-3 text-lg">
                <span>{t('hero_final_cta.cta_primary')}</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-8 sm:px-11 py-4 min-h-11 bg-transparent border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/15 hover:border-white/50 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50"
            >
              {t('hero_final_cta.cta_secondary')}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-emerald-500/40 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
              <ClockIcon className="w-4.5 h-4.5 text-emerald-400" />
              <span className="font-medium text-slate-200">48h Lieferung</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-primary-500/40 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
              <ShieldCheckIcon className="w-4.5 h-4.5 text-primary-400" />
              <span className="font-medium text-slate-200">100% Zufriedenheitsgarantie</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-violet-500/40 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
              <CreditCardIcon className="w-4.5 h-4.5 text-violet-400" />
              <span className="font-medium text-slate-200">Keine Kreditkarte erforderlich</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
