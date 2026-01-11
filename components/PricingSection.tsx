
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
    api.get('/services').then(res => {
        if(res.data) setDbServices(res.data);
    }).catch(err => console.warn("Pricing fetch error", err));
  }, []);

  const pricingPackages = useMemo(() => {
    const defaults = [
        { id: 1, name: "Basic", price: formatPrice(29), price_details: t('pricing.one_time'), description: language === 'de' ? "Perfekte One-Page Website für kleine Projekte" : "Perfect one-page website for small projects", features: [language === 'de' ? "1 Seite (One-Pager)" : "1 page (One-Pager)", language === 'de' ? "Mobiles Design" : "Mobile responsive", language === 'de' ? "Kontaktformular" : "Contact form", language === 'de' ? "Impressum" : "Legal imprint", language === 'de' ? "Fast fertig in 48h" : "Ready in 48h"], popular: false, with_hosting: false, basePrice: 29 },
        { id: 2, name: "Starter", price: formatPrice(59), price_details: t('pricing.one_time'), description: language === 'de' ? "Kleine Website für Startups & Solopreneure" : "Small website for startups & solopreneurs", features: [language === 'de' ? "3-5 Seiten" : "3-5 pages", language === 'de' ? "Responsive Design" : "Responsive design", language === 'de' ? "Kontaktformular" : "Contact form", language === 'de' ? "Google Maps Integration" : "Google Maps integration", language === 'de' ? "Basis SEO" : "Basic SEO"], popular: true, with_hosting: false, basePrice: 59 },
        { id: 3, name: "Business", price: formatPrice(89), price_details: t('pricing.one_time'), description: language === 'de' ? "Professionelle Website für kleine Unternehmen" : "Professional website for small businesses", features: [language === 'de' ? "5-8 Seiten" : "5-8 pages", language === 'de' ? "Blog-Sektion" : "Blog section", language === 'de' ? "Social Media Links" : "Social media links", language === 'de' ? "Erweitertes SEO" : "Extended SEO", language === 'de' ? "1 Monat Support" : "1 month support"], popular: false, with_hosting: false, basePrice: 89 },
        { id: 4, name: "Basic+", price: formatPrice(5), price_details: t('pricing.per_month'), description: language === 'de' ? "Hosting für deine Basic Website" : "Hosting for your Basic website", features: [language === 'de' ? "Schnelles Hosting" : "Fast hosting", language === 'de' ? "SSL Zertifikat" : "SSL certificate", language === 'de' ? "E-Mail Support" : "Email support"], popular: false, with_hosting: true, basePrice: 5 },
        { id: 5, name: "Starter+", price: formatPrice(9), price_details: t('pricing.per_month'), description: language === 'de' ? "All-Inclusive Hosting Paket" : "All-inclusive hosting package", features: [language === 'de' ? "Schnelles Hosting" : "Fast hosting", language === 'de' ? "Tägliche Backups" : "Daily backups", language === 'de' ? "SSL Zertifikat" : "SSL certificate", language === 'de' ? "Software Updates" : "Software updates"], popular: true, with_hosting: true, basePrice: 9 },
        { id: 6, name: "Business+", price: formatPrice(15), price_details: t('pricing.per_month'), description: language === 'de' ? "Premium Hosting mit Support" : "Premium hosting with support", features: [language === 'de' ? "Priority Hosting" : "Priority hosting", language === 'de' ? "Tägliche Backups" : "Daily backups", language === 'de' ? "SSL & Updates" : "SSL & updates", language === 'de' ? "Priority Support" : "Priority support"], popular: false, with_hosting: true, basePrice: 15 },
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
              await api.post('/tickets', {
                  subject: `Anfrage: ${selectedPackage.name} Paket`,
                  priority: 'Hoch',
                  message: requestText
              });
          } else {
              await api.post('/contact', {
                  name,
                  email,
                  subject: `Anfrage: ${selectedPackage.name} Paket`,
                  message: requestText
              });
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
    <section className="py-32 bg-light-bg dark:bg-dark-bg relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('pricing.title_prefix')} <br/> <span className="text-gradient">{t('pricing.title_highlight')}</span>
            </h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              {t('pricing.subtitle')}
            </p>
          </div>

          {/* Hosting Toggle */}
          <div className="mt-12 flex justify-center">
              <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-full inline-flex shadow-inner relative ring-1 ring-slate-200 dark:ring-slate-700">
                <div 
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-primary rounded-full shadow-md transition-all duration-300 ease-in-out ${!withHosting ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
                ></div>
                <button 
                    onClick={() => setWithHosting(false)}
                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${!withHosting ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    {t('pricing.toggle_project')}
                </button>
                <button 
                    onClick={() => setWithHosting(true)}
                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${withHosting ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                     {t('pricing.toggle_service')}
                </button>
            </div>
          </div>

          {/* Limited Offer Banner */}
          {isOfferActive && (
              <div className="mt-10 max-w-xl mx-auto bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center backdrop-blur-sm animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <TagIcon className="animate-bounce" />
                      <span className="hidden sm:inline">{t('pricing.offer')}</span>
                  </div>
                  <CountdownTimer targetDate={offerEndDate} onComplete={() => setIsOfferActive(false)} />
              </div>
          )}
        </AnimatedSection>

        {/* Pricing Cards */}
        <AnimatedSection stagger>
          <div className="mt-20 grid gap-8 lg:grid-cols-3 items-start stagger-container">
            {displayedPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`flex flex-col p-8 rounded-3xl transition-all duration-500 relative group ${
                  pkg.popular 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-700 z-10 transform lg:-translate-y-4 hover:-translate-y-6' 
                  : 'bg-white dark:bg-dark-surface text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-2'
                }`}
              >
                {pkg.popular && (
                     <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-purple-600 text-white uppercase tracking-wide shadow-lg shadow-primary/30 animate-pulse-slow">
                            {t('pricing.popular')}
                        </span>
                    </div>
                )}
                
                {/* Glow Effect for Popular Card */}
                {pkg.popular && <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>}

                <div className="mb-8 relative z-10">
                    <h3 className="text-2xl font-bold font-serif">{pkg.name}</h3>
                    <p className={`mt-4 text-sm leading-relaxed ${pkg.popular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                        {pkg.description}
                    </p>
                </div>

                <div className="flex items-baseline gap-1 mb-8 relative z-10">
                    <span className="text-5xl font-extrabold tracking-tight">{pkg.price}</span>
                    <span className={`text-sm font-medium ${pkg.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{pkg.price_details}</span>
                </div>
                
                <div className={`h-px w-full mb-8 ${pkg.popular ? 'bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}></div>

                <ul className="space-y-4 flex-grow mb-10 relative z-10">
                    {pkg.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${pkg.popular ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                             <CheckBadgeIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-sm font-medium leading-tight pt-0.5 ${pkg.popular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>{feature}</span>
                        </li>
                    ))}
                </ul>
                
                <button 
                    onClick={() => handlePackageClick(pkg)}
                    className={`w-full py-4 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 overflow-hidden transform active:scale-95 ${
                        pkg.popular 
                        ? 'bg-white text-slate-900 hover:bg-gray-100' 
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-lg hover:shadow-xl'
                    }`}
                >
                    {pkg.popular ? t('pricing.start_btn') : t('pricing.select_btn')}
                </button>
                
                {/* Trust footer */}
                 <div className={`mt-6 flex items-center justify-center gap-2 text-xs ${pkg.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                    <ShieldCheckIcon className="w-3 h-3" />
                    <span>{t('pricing.secure')}</span>
                 </div>

              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">{t('pricing.ai_note')}</p>
        </AnimatedSection>
        
        <AnimatedSection>
          <OfferCalculator setCurrentPage={setCurrentPage} />
        </AnimatedSection>

        <AnimatedSection>
          <div className="mt-32 max-w-3xl mx-auto">
               <h3 className="text-center text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-12 font-serif">
                  {t('pricing.faq_title')}
               </h3>
               <div className="space-y-4">
                  {faqItems.map(item => (
                    <details key={item.question} className="group bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 open:shadow-md open:ring-1 open:ring-primary/20">
                        <summary className="flex justify-between items-center p-6 font-semibold text-slate-900 dark:text-white cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            {item.question}
                            <span className="ml-4 flex-shrink-0 w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center transition-transform duration-300 group-open:rotate-180 text-slate-500">
                                <ChevronDownIcon className="w-4 h-4" />
                            </span>
                        </summary>
                        <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed animate-fade-in border-t border-slate-100 dark:border-slate-800/50">
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
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in relative">
                    <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    <div className="p-8">
                        {!submitSuccess ? (
                            <>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('pricing.modal.title').replace('{package}', selectedPackage.name)}</h3>
                                <p className="text-sm text-slate-500 mb-6" dangerouslySetInnerHTML={{ __html: t('pricing.modal.subtitle').replace('{package}', selectedPackage.name).replace('{price}', selectedPackage.price).replace('{details}', selectedPackage.price_details) }}></p>

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    {!user && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('pricing.modal.name')}</label>
                                                <input name="name" type="text" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Max Mustermann" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('pricing.modal.email')}</label>
                                                <input name="email" type="email" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="ihre@email.de" />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('pricing.modal.message')}</label>
                                        <textarea name="message" rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder={t('pricing.modal.message_placeholder')}></textarea>
                                    </div>
                                    
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl transition-all mt-2 shadow-lg disabled:opacity-50 flex justify-center items-center">
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        ) : t('pricing.modal.btn_submit')}
                                    </button>
                                    <p className="text-[10px] text-slate-400 text-center">{t('pricing.modal.disclaimer')}</p>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                                    <CheckBadgeIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('pricing.modal.success_title')}</h3>
                                <p className="text-slate-500 mb-8">
                                    {t('pricing.modal.success_desc')}
                                </p>
                                <div className="flex flex-col gap-3">
                                    {user && (
                                        <button onClick={() => setCurrentPage('dashboard')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2">
                                            <TicketIcon className="w-4 h-4" /> {t('pricing.modal.to_dashboard')}
                                        </button>
                                    )}
                                    <button onClick={() => setShowModal(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
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
