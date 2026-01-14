// React imports
import { type FormEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Internal imports
import { AnimatedSection, ChevronDownIcon, CheckBadgeIcon, CountdownTimer, OfferCalculator, ShieldCheckIcon, TagIcon, TicketIcon, XMarkIcon } from './index';
import { AuthContext, useCurrency, useLanguage } from '../contexts';
import { api, validateEmail, validateName, validateString } from '../lib';
import { TIMING } from '../lib/constants';

interface PricingSectionProps {
  setCurrentPage: (page: string) => void;
}

interface PricingPackage {
  id: number;
  name: string;
  price: string;
  price_details: string;
  description: string;
  features: string[];
  popular: boolean;
  with_hosting: boolean;
  basePrice: number;
}

interface TranslationFunction {
  (key: string): string;
}

// Clean pricing card with subtle hover
const PricingCard = memo(({
    pkg,
    index,
    onClick,
    t,
}: {
    pkg: PricingPackage;
    index: number;
    onClick: (pkg: PricingPackage) => void;
    t: TranslationFunction;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Memoize click handler to prevent unnecessary re-renders
    const handlePackageClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(pkg);
    }, [pkg, onClick]);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer focus:ring-2 focus:ring-primary-500/50 ${
                    pkg.popular
                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xl lg:-translate-y-1 ring-1 ring-primary-500/50'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700/60 hover:border-primary-400 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }`}
                onClick={() => onClick(pkg)}
            >
                {/* Popular badge */}
                {pkg.popular && (
                     <div className="absolute -top-2.5 left-0 right-0 flex justify-center z-10">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-primary to-violet-600 text-white uppercase tracking-wider shadow-md">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            {t('pricing.popular')}
                        </span>
                    </div>
                )}

                <div className="mb-6 mt-2">
                    <h3 className={`text-lg font-semibold leading-snug ${pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {pkg.name}
                    </h3>
                    <p className={`mt-2 text-sm leading-relaxed ${pkg.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {pkg.description}
                    </p>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-4xl font-bold tracking-tight ${pkg.popular ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600'}`}>
                        {pkg.price}
                    </span>
                    <span className={`text-sm font-medium ${pkg.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {pkg.price_details}
                    </span>
                </div>

                <div className={`h-px w-full mb-6 ${pkg.popular ? 'bg-slate-700/50' : 'bg-slate-200 dark:bg-slate-700/50'}`}></div>

                <ul className="space-y-3 flex-grow mb-6">
                    {pkg.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-4 h-4 rounded-md flex items-center justify-center ${
                                pkg.popular
                                ? 'bg-primary/20 text-primary-300'
                                : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400'
                            }`}>
                                <CheckBadgeIcon className="w-2.5 h-2.5" />
                            </div>
                            <span className={`text-sm leading-relaxed ${pkg.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handlePackageClick}
                    className={`w-full py-3 min-h-11 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        pkg.popular
                        ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50'
                        : 'bg-gradient-to-r from-primary-600 to-violet-600 text-white hover:from-primary-500 hover:to-violet-500 shadow-md hover:shadow-lg hover:shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50'
                    }`}
                >
                    {pkg.popular ? 'Jetzt starten' : 'Auswählen'}
                </button>

                {/* Trust footer */}
                 <div className={`mt-4 flex items-center justify-center gap-2 text-xs ${pkg.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>48h Lieferung • Garantie</span>
                 </div>
            </div>
        </div>
    );
});

PricingCard.displayName = 'PricingCard';

export const PricingSection = ({ setCurrentPage }: PricingSectionProps) => {
  const { user } = useContext(AuthContext);
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [withHosting, setWithHosting] = useState(false);
  const [isOfferActive, setIsOfferActive] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dbServices, setDbServices] = useState<Array<{id: number; name: string; name_en?: string; description?: string; description_en?: string; price: number; price_details?: string; price_details_en?: string}>>([]);

  useEffect(() => {
    api.getServices().then(res => {
        if(res.data) setDbServices(res.data);
    }).catch(() => {
        // Silently fail - using default pricing
    });
  }, []);

  const pricingPackages = useMemo(() => {
    const defaults = [
        { id: 1, name: "Basic", price: formatPrice(29), price_details: t('pricing.one_time'), description: language === 'de' ? "Perfekte One-Page Website fur kleine Projekte" : "Perfect one-page website for small projects", features: [language === 'de' ? "1 Seite (One-Pager)" : "1 page (One-Pager)", language === 'de' ? "Mobiles Design" : "Mobile responsive", language === 'de' ? "Kontaktformular" : "Contact form", language === 'de' ? "Impressum" : "Legal imprint", language === 'de' ? "Fast fertig in 48h" : "Ready in 48h"], popular: false, with_hosting: false, basePrice: 29 },
        { id: 2, name: "Starter", price: formatPrice(59), price_details: t('pricing.one_time'), description: language === 'de' ? "Kleine Website fur Startups & Solopreneure" : "Small website for startups & solopreneurs", features: [language === 'de' ? "3-5 Seiten" : "3-5 pages", language === 'de' ? "Responsive Design" : "Responsive design", language === 'de' ? "Kontaktformular" : "Contact form", language === 'de' ? "Google Maps Integration" : "Google Maps integration", language === 'de' ? "Basis SEO" : "Basic SEO"], popular: true, with_hosting: false, basePrice: 59 },
        { id: 3, name: "Business", price: formatPrice(89), price_details: t('pricing.one_time'), description: language === 'de' ? "Professionelle Website fur kleine Unternehmen" : "Professional website for small businesses", features: [language === 'de' ? "5-8 Seiten" : "5-8 pages", language === 'de' ? "Blog-Sektion" : "Blog section", language === 'de' ? "Social Media Links" : "Social media links", language === 'de' ? "Erweitertes SEO" : "Extended SEO", language === 'de' ? "1 Monat Support" : "1 month support"], popular: false, with_hosting: false, basePrice: 89 },
        { id: 4, name: "Basic+", price: formatPrice(5), price_details: t('pricing.per_month'), description: language === 'de' ? "Hosting fur deine Basic Website" : "Hosting for your Basic website", features: [language === 'de' ? "Schnelles Hosting" : "Fast hosting", language === 'de' ? "SSL Zertifikat" : "SSL certificate", language === 'de' ? "E-Mail Support" : "Email support"], popular: false, with_hosting: true, basePrice: 5 },
        { id: 5, name: "Starter+", price: formatPrice(9), price_details: t('pricing.per_month'), description: language === 'de' ? "All-Inclusive Hosting Paket" : "All-inclusive hosting package", features: [language === 'de' ? "Schnelles Hosting" : "Fast hosting", language === 'de' ? "Tagliche Backups" : "Daily backups", language === 'de' ? "SSL Zertifikat" : "SSL certificate", language === 'de' ? "Software Updates" : "Software updates"], popular: true, with_hosting: true, basePrice: 9 },
        { id: 6, name: "Business+", price: formatPrice(15), price_details: t('pricing.per_month'), description: language === 'de' ? "Premium Hosting mit Support" : "Premium hosting with support", features: [language === 'de' ? "Priority Hosting" : "Priority hosting", language === 'de' ? "Tagliche Backups" : "Daily backups", language === 'de' ? "SSL & Updates" : "SSL & updates", language === 'de' ? "Priority Support" : "Priority support"], popular: false, with_hosting: true, basePrice: 15 },
    ];

    return defaults.map(pkg => {
        const dbPkg = dbServices.find(s => s.id === pkg.id);
        if (!dbPkg) return pkg;

        const isEn = language === 'en';
        const useEnName = isEn && dbPkg.name_en;
        const useEnDesc = isEn && dbPkg.description_en;
        const useEnPrice = isEn && dbPkg.price_details_en;

        return {
            ...pkg,
            name: useEnName ? dbPkg.name_en : dbPkg.name,
            description: useEnDesc ? dbPkg.description_en : (dbPkg.description || pkg.description),
            price: dbPkg.price > 0 ? formatPrice(dbPkg.price) : pkg.price,
            price_details: useEnPrice ? dbPkg.price_details_en : (dbPkg.price_details || pkg.price_details),
        };
    });
  }, [t, dbServices, language, formatPrice]);

  const faqItems = useMemo(() => [
      { id: 1, question: t('pricing.faq.1.q'), answer: t('pricing.faq.1.a') },
      { id: 2, question: t('pricing.faq.2.q'), answer: t('pricing.faq.2.a') },
      { id: 3, question: t('pricing.faq.3.q'), answer: t('pricing.faq.3.a') },
      { id: 4, question: t('pricing.faq.4.q'), answer: t('pricing.faq.4.a') },
  ], [t]);

  const displayedPackages = pricingPackages.filter(p => p.with_hosting === withHosting);
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + TIMING.offerDays);

  const handlePackageClick = (pkg: PricingPackage) => {
      setSelectedPackage(pkg);
      setSubmitSuccess(false);
      setShowModal(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const rawName = formData.get('name') as string;
      const rawEmail = formData.get('email') as string;
      const rawMessage = formData.get('message') as string;

      // Validate inputs if user is not logged in
      if (!user) {
          const nameValidation = validateName(rawName);
          const emailValidation = validateEmail(rawEmail);
          const messageValidation = validateString(rawMessage, { maxLength: 2000, allowEmpty: true });

          if (!nameValidation.isValid || !emailValidation.isValid || !messageValidation.isValid) {
              alert(t('general.error') + ': Invalid input. Please check your data.');
              setIsSubmitting(false);
              return;
          }
      }

      const name = user?.name || rawName;
      const email = user?.email || rawEmail;
      const message = rawMessage;

      const requestText = `
ANFRAGE WEBSITE PAKET:
----------------------
Paket: ${selectedPackage.name}
Preis: ${selectedPackage.price} (${selectedPackage.price_details})
Modus: ${withHosting ? 'Service' : 'Projekt'}

Kunden-Nachricht:
${message}
      `.trim();

      try {
          if (user) {
              await api.createTicket(
                  `Anfrage: ${selectedPackage.name} Paket`,
                  'Hoch',
                  requestText
              );
          } else {
              await api.sendContact(
                  name ?? '',
                  email ?? '',
                  `Anfrage: ${selectedPackage.name} Paket`,
                  requestText
              );
          }
          setSubmitSuccess(true);
      } catch (error) {
          // Defensive error logging - only in development
          if (import.meta.env.DEV) {
              console.error('Pricing form submission error:', error);
          }
          alert(t('general.error'));
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/4 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            {/* Trust Badge */}
            <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                30 Tage Geld-zurück Garantie
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-6">
              {t('pricing.title_prefix')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">
                {t('pricing.title_highlight')}
              </span>
            </h2>
            <p className="mt-4 md:mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('pricing.subtitle')}
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-8 md:mt-12 flex justify-center">
              <div className="relative inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/50">
                <button
                    onClick={() => setWithHosting(false)}
                    className={`relative px-4 md:px-6 py-2 sm:py-3 min-h-11 rounded-full text-sm font-medium transition-all duration-300 ${
                        !withHosting
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50'
                    }`}
                >
                    {t('pricing.toggle_project')}
                </button>
                <button
                    onClick={() => setWithHosting(true)}
                    className={`relative px-4 md:px-6 py-2 sm:py-3 min-h-11 rounded-full text-sm font-medium transition-all duration-300 ${
                        withHosting
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50'
                    }`}
                >
                     {t('pricing.toggle_service')}
                </button>
              </div>
          </div>

          {/* Limited offer banner */}
          {isOfferActive && (
              <div className="mt-6 md:mt-8 max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 shadow-sm border border-slate-200/60 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 font-semibold text-primary dark:text-primary-400 text-sm">
                      <TagIcon className="w-3.5 h-3.5" />
                      <span>{t('pricing.offer')}</span>
                  </div>
                  <CountdownTimer targetDate={offerEndDate} onComplete={() => setIsOfferActive(false)} />
              </div>
          )}
        </AnimatedSection>

        {/* Pricing Cards */}
        <AnimatedSection stagger>
          <div className="mt-12 md:mt-16 grid gap-4 md:gap-6 lg:grid-cols-3 items-stretch">
            {displayedPackages.map((pkg, index) => (
                <PricingCard
                    key={pkg.name}
                    pkg={pkg}
                    index={index}
                    onClick={handlePackageClick}
                    t={t}
                />
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6 md:mt-8 flex items-center justify-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Keine Kreditkarte erforderlich. Kostenloses Beratungsgespräch inklusive.</span>
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <OfferCalculator setCurrentPage={setCurrentPage} />
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection>
          <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
               <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200/60 dark:border-primary-800/30 text-sm font-semibold text-primary-600 dark:text-primary-400 mb-4">
                        {t('pricing.faq_title')}
                    </div>
               </div>
               <div className="space-y-4">
                  {faqItems.map((item) => (
                    <details key={item.question} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                        <summary className="flex justify-between items-center p-4 md:p-6 font-medium text-slate-900 dark:text-white cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 min-h-11 hover:scale-[1.01] focus:ring-2 focus:ring-primary-500/50 focus-visible:ring-inset">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 opacity-0 group-open:opacity-100 transition-all duration-300"></span>
                                <span className="text-sm md:text-base">{item.question}</span>
                            </span>
                            <span className="ml-4 flex-shrink-0 w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-300 group-open:rotate-180 text-slate-500 group-open:bg-gradient-to-br group-open:from-primary-500 group-open:to-violet-500 group-open:text-white">
                                <ChevronDownIcon className="w-4 h-4" />
                            </span>
                        </summary>
                        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 text-slate-600 dark:text-slate-400 text-sm border-t border-slate-100 dark:border-slate-700 ml-6 md:ml-8 leading-relaxed">
                            {item.answer}
                        </div>
                    </details>
                  ))}
               </div>
          </div>
        </AnimatedSection>
      </div>

        {/* BOOKING MODAL */}
        {showModal && selectedPackage && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                    <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        {!submitSuccess ? (
                            <>
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-500 rounded-xl flex items-center justify-center mb-6 shadow-md">
                                    <TicketIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {t('pricing.modal.title').replace('{package}', selectedPackage.name)}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                    {t('pricing.modal.subtitle')
                                        .replace('{package}', selectedPackage.name)
                                        .replace('{price}', selectedPackage.price)
                                        .replace('{details}', selectedPackage.price_details)
                                    }
                                </p>

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    {!user && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('pricing.modal.name')}</label>
                                                <input name="name" type="text" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all min-h-11" placeholder="Max Mustermann" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('pricing.modal.email')}</label>
                                                <input name="email" type="email" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all min-h-11" placeholder="ihre@email.de" />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('pricing.modal.message')}</label>
                                        <textarea name="message" rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none min-h-11" placeholder={t('pricing.modal.message_placeholder')}></textarea>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 min-h-11">
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        ) : t('pricing.modal.btn_submit')}
                                    </button>
                                    <p className="text-[10px] text-slate-400 text-center">{t('pricing.modal.disclaimer')}</p>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                                    <CheckBadgeIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('pricing.modal.success_title')}</h3>
                                <p className="text-slate-500 mb-8">
                                    {t('pricing.modal.success_desc')}
                                </p>
                                <div className="flex flex-col gap-3">
                                    {user && (
                                        <button onClick={() => setCurrentPage('dashboard')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3 px-8 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md min-h-11 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50">
                                            <TicketIcon className="w-4 h-4" /> {t('pricing.modal.to_dashboard')}
                                        </button>
                                    )}
                                    <button onClick={() => setShowModal(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all min-h-11 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50">
                                        {t('general.close')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

    </section>
  );
};
