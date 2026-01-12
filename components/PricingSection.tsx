
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { CountdownTimer } from './CountdownTimer';
import { OfferCalculator } from './OfferCalculator';
import { TagIcon, ChevronDownIcon, CheckBadgeIcon, ShieldCheckIcon, XMarkIcon, TicketIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface PricingSectionProps {
  setCurrentPage: (page: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ setCurrentPage }) => {
  const { user } = useContext(AuthContext);
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [withHosting, setWithHosting] = useState(false);
  const [isOfferActive, setIsOfferActive] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dbServices, setDbServices] = useState<any[]>([]);

  useEffect(() => {
    api.getServices().then(res => {
        if(res.data) setDbServices(res.data);
    }).catch(err => console.warn("Pricing fetch error", err));
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
  offerEndDate.setDate(offerEndDate.getDate() + 7);

  const handlePackageClick = (pkg: any) => {
      setSelectedPackage(pkg);
      setSubmitSuccess(false);
      setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const message = formData.get('message') as string;

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
                  name,
                  email,
                  `Anfrage: ${selectedPackage.name} Paket`,
                  requestText
              );
          }
          setSubmitSuccess(true);
      } catch (error) {
          console.error(error);
          alert(t('general.error'));
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <section className="py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[0%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 via-violet-400/6 to-indigo-400/4 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[0%] w-[600px] h-[600px] bg-gradient-to-br from-violet-400/6 via-purple-400/4 to-pink-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/4 to-teal-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            {/* Trust Badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/60 dark:border-emerald-800/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  30 Tage Geld-zuruck Garantie
                </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              {t('pricing.title_prefix')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">
                  {t('pricing.title_highlight')}
              </span>
            </h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>

          {/* Modern Hosting Toggle */}
          <div className="mt-12 flex justify-center">
              <div className="relative bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-xl p-1.5 rounded-2xl inline-flex shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60">
                {/* Animated slider background */}
                <div
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl shadow-lg transition-all duration-500 ease-out ${!withHosting ? 'left-1.5' : 'left-[calc(50%+4.5px)]'}`}
                ></div>
                <button
                    onClick={() => setWithHosting(false)}
                    className={`relative z-10 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${!withHosting ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}
                >
                    {t('pricing.toggle_project')}
                </button>
                <button
                    onClick={() => setWithHosting(true)}
                    className={`relative z-10 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${withHosting ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}
                >
                     {t('pricing.toggle_service')}
                </button>
            </div>
          </div>

          {/* Limited Offer Banner */}
          {isOfferActive && (
              <div className="mt-8 max-w-xl mx-auto bg-gradient-to-r from-blue-50 via-violet-50 to-blue-50 dark:from-blue-900/20 dark:via-violet-900/20 dark:to-blue-900/20 border border-blue-200/60 dark:border-blue-800/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-lg shadow-blue-500/5">
                  <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 text-sm">
                      <TagIcon className="w-4 h-4" />
                      <span>{t('pricing.offer')}</span>
                  </div>
                  <CountdownTimer targetDate={offerEndDate} onComplete={() => setIsOfferActive(false)} />
              </div>
          )}
        </AnimatedSection>

        {/* Pricing Cards */}
        <AnimatedSection stagger>
          <div className="mt-16 grid gap-6 lg:grid-cols-3 items-start">
            {displayedPackages.map((pkg, index) => (
                <div
                    key={pkg.name}
                    className={`group relative flex flex-col p-8 rounded-3xl transition-all duration-500 ${
                        pkg.popular
                        ? 'bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white shadow-2xl shadow-slate-900/30 lg:-translate-y-4 hover:-translate-y-6'
                        : index === 1
                        ? 'bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:shadow-xl hover:-translate-y-2'
                        : 'bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-200/50 dark:hover:border-blue-700/50 hover:shadow-xl hover:-translate-y-1'
                    }`}
                >
                    {/* Animated gradient border for popular */}
                    {pkg.popular && (
                        <>
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-3xl opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy"></div>
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                        </>
                    )}

                    {/* Glow effect for popular card */}
                    {pkg.popular && (
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-indigo-500/10 rounded-3xl blur-2xl -z-10"></div>
                    )}

                    {pkg.popular && (
                         <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                            <span className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-violet-500 text-white uppercase tracking-wider shadow-xl shadow-blue-500/30 animate-pulse-slow">
                                {t('pricing.popular')}
                            </span>
                        </div>
                    )}

                    <div className="mb-6 relative z-10">
                        <h3 className={`text-xl font-bold font-serif ${pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{pkg.name}</h3>
                        <p className={`mt-3 text-sm leading-relaxed ${pkg.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                            {pkg.description}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-6 relative z-10">
                        <span className={`text-5xl font-bold tracking-tight ${pkg.popular ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600'}`}>
                            {pkg.price}
                        </span>
                        <span className={`text-sm font-medium ${pkg.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{pkg.price_details}</span>
                    </div>

                    <div className={`h-px w-full mb-6 ${pkg.popular ? 'bg-gradient-to-r from-transparent via-slate-600 to-transparent' : 'bg-slate-100 dark:bg-slate-700/50'}`}></div>

                    <ul className="space-y-3.5 flex-grow mb-8 relative z-10">
                        {pkg.features.map((feature: string) => (
                            <li key={feature} className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                                pkg.popular
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-600 dark:text-blue-400'
                            }`}>
                                 <CheckBadgeIcon className="w-3 h-3" />
                            </div>
                            <span className={`text-sm leading-tight ${pkg.popular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handlePackageClick(pkg)}
                        className={`w-full py-4 rounded-xl text-sm font-semibold transition-all relative z-10 overflow-hidden btn-press ${
                            pkg.popular
                            ? 'bg-white text-slate-900 hover:bg-gray-50 shadow-lg hover:shadow-xl hover:shadow-white/20'
                            : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
                        }`}
                    >
                        {pkg.popular ? 'Jetzt starten' : 'Auswahlen'}
                    </button>

                    {/* Trust footer */}
                     <div className={`mt-6 flex items-center justify-center gap-2 text-xs ${pkg.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                        <span>48h Lieferung • Garantie</span>
                     </div>

                  </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto flex items-center justify-center gap-2">
             <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
             Keine Kreditkarte erforderlich. Kostenloses Beratungsgesprach inklusive.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <OfferCalculator setCurrentPage={setCurrentPage} />
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection>
          <div className="mt-24 max-w-3xl mx-auto">
               <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200/60 dark:border-blue-800/30 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
                        {t('pricing.faq_title')}
                    </div>
               </div>
               <div className="space-y-3">
                  {faqItems.map((item, idx) => (
                    <details key={item.question} className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-300 shadow-sm hover:shadow-md" style={{ animationDelay: `${idx * 50}ms` }}>
                        <summary className="flex justify-between items-center p-5 font-medium text-slate-900 dark:text-white cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                            <span className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-open:opacity-100 transition-all duration-300 group-open:scale-150 shadow-lg shadow-blue-500/50"></span>
                                <span className="group-open:translate-x-1 transition-transform duration-300">{item.question}</span>
                            </span>
                            <span className="ml-4 flex-shrink-0 w-9 h-9 bg-slate-100 dark:bg-slate-700/50 rounded-xl flex items-center justify-center transition-all duration-300 group-open:rotate-180 text-slate-500 group-open:bg-gradient-to-br group-open:from-blue-500 group-open:to-violet-500 group-open:text-white group-open:shadow-lg group-open:shadow-blue-500/30">
                                <ChevronDownIcon className="w-4 h-4" />
                            </span>
                        </summary>
                        <div className="px-5 pb-5 pt-2 text-slate-600 dark:text-slate-400 text-sm border-t border-slate-100/50 dark:border-slate-700/50 ml-8 leading-relaxed animate-slide-down">
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in relative">
                    <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all hover:scale-110">
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        {!submitSuccess ? (
                            <>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                                    <TicketIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('pricing.modal.title').replace('{package}', selectedPackage.name)}</h3>
                                <p className="text-sm text-slate-500 mb-6" dangerouslySetInnerHTML={{ __html: t('pricing.modal.subtitle').replace('{package}', selectedPackage.name).replace('{price}', selectedPackage.price).replace('{details}', selectedPackage.price_details) }}></p>

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    {!user && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('pricing.modal.name')}</label>
                                                <input name="name" type="text" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Max Mustermann" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('pricing.modal.email')}</label>
                                                <input name="email" type="email" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="ihre@email.de" />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('pricing.modal.message')}</label>
                                        <textarea name="message" rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" placeholder={t('pricing.modal.message_placeholder')}></textarea>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl transition-all mt-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 flex justify-center items-center">
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        ) : t('pricing.modal.btn_submit')}
                                    </button>
                                    <p className="text-[10px] text-slate-400 text-center">{t('pricing.modal.disclaimer')}</p>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in shadow-lg shadow-emerald-500/25">
                                    <CheckBadgeIcon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('pricing.modal.success_title')}</h3>
                                <p className="text-slate-500 mb-8">
                                    {t('pricing.modal.success_desc')}
                                </p>
                                <div className="flex flex-col gap-3">
                                    {user && (
                                        <button onClick={() => setCurrentPage('dashboard')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg">
                                            <TicketIcon className="w-4 h-4" /> {t('pricing.modal.to_dashboard')}
                                        </button>
                                    )}
                                    <button onClick={() => setShowModal(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
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
