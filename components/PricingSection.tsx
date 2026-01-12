
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
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

// Transcendent 3D Tilt Card with insane effects
const PricingCard: React.FC<{
    pkg: any;
    index: number;
    onClick: (pkg: any) => void;
    t: any;
}> = ({ pkg, index, onClick, t }) => {
    const [transform, setTransform] = useState('');
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState<Array<{x: number; y: number; id: number}>>([]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
        setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
        setIsHovered(false);
    };

    const handleMouseEnter = () => setIsHovered(true);

    const handleClick = () => {
        // Create particle burst
        const newParticles = Array.from({ length: 12 }, (_, i) => ({
            x: 50 + (Math.random() - 0.5) * 30,
            y: 50 + (Math.random() - 0.5) * 30,
            id: Date.now() + i,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
        onClick(pkg);
    };

    return (
        <div
            className="relative"
            style={{ transform, transition: 'transform 0.1s ease-out' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {/* 3D glow effect following cursor */}
            <div
                className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${pkg.popular ? 'rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1)'}, transparent 60%)`,
                    opacity: isHovered ? 1 : 0,
                }}
            />

            {/* Card */}
            <div
                className={`relative flex flex-col p-8 rounded-3xl transition-all duration-500 overflow-hidden cursor-pointer ${
                    pkg.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-white shadow-glow-legendary-lg lg:-translate-y-4 hover:shadow-glow-legendary-xl animate-glow-breathe btn-holographic'
                    : index === 1
                    ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl text-slate-900 dark:text-white border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400/80 dark:hover:border-blue-600/80 hover:shadow-glow-legendary-md hover:shadow-blue-500/20'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg text-slate-900 dark:text-white border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300/70 dark:hover:border-blue-700/70 hover:shadow-legendary'
                }`}
                onClick={handleClick}
            >
                {/* Multi-layer shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 shimmer-sweep"></div>
                </div>

                {/* Holographic overlay */}
                {pkg.popular && (
                    <div className="absolute inset-0 holographic-base opacity-30 rounded-3xl animate-holographic-shift"></div>
                )}

                {/* Animated gradient border for popular */}
                {pkg.popular && (
                    <>
                        <div className="absolute -inset-[3px] bg-gradient-to-r from-blue-500 via-violet-500 via-cyan-500 to-blue-500 rounded-3xl opacity-80 blur-md animate-gradient-flow"></div>
                        <div className="absolute -inset-[3px] bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-500"></div>
                    </>
                )}

                {/* Enhanced glow effect for popular card */}
                {pkg.popular && (
                    <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/40 via-violet-500/30 via-cyan-500/30 to-blue-500/40 rounded-3xl blur-3xl -z-10 animate-morph-deluxe shadow-glow-legendary-xl"></div>
                )}

                {/* Particle burst on click */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute w-2 h-2 rounded-full bg-blue-400/60 dark:bg-blue-300/60 animate-particle-burst pointer-events-none"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    ></div>
                ))}

                {/* Corner accents */}
                {pkg.popular && (
                    <>
                        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/60 rounded-tl-3xl animate-pulse-slow"></span>
                        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-violet-400/60 rounded-tr-3xl animate-pulse-slow" style={{ animationDelay: '0.5s' }}></span>
                        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></span>
                        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400/60 rounded-br-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></span>
                    </>
                )}

                {/* Popular badge */}
                {pkg.popular && (
                     <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 text-white uppercase tracking-wider shadow-glow-legendary-md shadow-blue-500/40 relative overflow-hidden animate-gradient-deluxe">
                            <span className="absolute inset-0 shimmer-sweep"></span>
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-4 h-4 animate-icon-bounce" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                {t('pricing.popular')}
                            </span>
                        </span>
                    </div>
                )}

                <div className="mb-6 relative z-10">
                    <h3 className={`text-xl font-bold font-serif ${pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 transition-all duration-300`}>{pkg.name}</h3>
                    <p className={`mt-3 text-sm leading-relaxed-plus ${pkg.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                        {pkg.description}
                    </p>
                </div>

                <div className="flex items-baseline gap-1.5 mb-6 relative z-10">
                    <span className={`text-5xl font-bold tracking-tight ${pkg.popular ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 animate-gradient-deluxe'}`}>
                        {pkg.price}
                    </span>
                    <span className={`text-sm font-medium ${pkg.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{pkg.price_details}</span>
                </div>

                <div className={`h-px w-full mb-6 ${pkg.popular ? 'bg-gradient-to-r from-transparent via-blue-400/60 to-transparent' : 'bg-slate-100 dark:bg-slate-700/50'}`}></div>

                <ul className="space-y-4 flex-grow mb-8 relative z-10">
                    {pkg.features.map((feature: string, idx: number) => (
                        <li key={feature} className="flex items-start gap-3 group/feature" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className={`flex-shrink-0 w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/feature:scale-125 group-hover/feature:rotate-12 ${
                                pkg.popular
                                ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/40 glow-blue'
                                : 'bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                            }`}>
                                 <CheckBadgeIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-sm leading-tight ${pkg.popular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'} group-hover/feature:text-transparent group-hover/feature:bg-clip-text group-hover/feature:bg-gradient-to-r group-hover/feature:from-blue-600 group-hover/feature:to-violet-600 transition-all duration-300`}>{feature}</span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={(e) => { e.stopPropagation(); onClick(pkg); }}
                    className={`w-full py-4 rounded-xl text-sm font-bold transition-all relative z-10 overflow-hidden group/btn ${
                        pkg.popular
                        ? 'bg-white text-slate-900 hover:bg-gray-50 shadow-xl hover:shadow-2xl hover:shadow-white/40 hover:-translate-y-1 btn-micro-press'
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 shadow-xl hover:shadow-glow-legendary-md hover:shadow-blue-500/40 hover:-translate-y-1 btn-micro-press btn-legendary btn-holographic'
                    }`}
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 opacity-0 group-hover/btn:opacity-60 transition-opacity duration-500 animate-gradient-deluxe"></span>
                    <span className="absolute inset-0 shimmer-sweep opacity-0 group-hover/btn:opacity-50 transition-opacity"></span>
                    <span className="absolute inset-0 hover-shine-effect"></span>
                    {/* Corner accents */}
                    {!pkg.popular && (
                        <>
                            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 rounded-tl-lg"></span>
                            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 rounded-br-lg"></span>
                        </>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {pkg.popular ? 'Jetzt starten' : 'Auswählen'}
                        <svg className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300 group-hover/btn:scale-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </button>

                {/* Trust footer */}
                 <div className={`mt-6 flex items-center justify-center gap-2 text-xs ${pkg.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                    <ShieldCheckIcon className="w-3.5 h-3.5 glow-emerald" />
                    <span>48h Lieferung • Garantie</span>
                 </div>

              </div>
        </div>
    );
};

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
    <section className="py-32 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950/80 relative overflow-hidden">
      {/* Enhanced noise texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none noise-bg"></div>

      {/* Legendary animated mesh gradient overlay */}
      <div className="absolute inset-0 bg-aurora-legendary opacity-15 pointer-events-none"></div>

      {/* Enhanced animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[0%] w-[800px] h-[800px] bg-gradient-to-br from-blue-400/12 via-violet-400/10 to-indigo-400/8 rounded-full blur-3xl animate-morph-deluxe shadow-glow-legendary-sm"></div>
        <div className="absolute bottom-[10%] right-[0%] w-[800px] h-[800px] bg-gradient-to-br from-violet-400/10 via-purple-400/8 to-pink-400/6 rounded-full blur-3xl animate-morph-deluxe shadow-glow-legendary-sm" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[50%] left-[30%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/8 to-teal-400/6 rounded-full blur-3xl animate-float-deluxe" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[30%] left-[20%] w-[400px] h-[400px] bg-gradient-to-br from-rose-400/6 to-pink-400/4 rounded-full blur-3xl animate-float-deluxe" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Enhanced grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            {/* Legendary Trust Badge */}
            <div className="mb-10 inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-200/60 dark:border-emerald-800/40 shadow-legendary hover:shadow-glow-legendary-md hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 relative overflow-hidden group">
              <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-glow-legendary-sm animate-glow-breathe relative z-10"></div>
              <ShieldCheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 relative z-10" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase relative z-10">
                30 Tage Geld-zuruck Garantie
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight-plus mb-6">
              {t('pricing.title_prefix')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:300%_auto] animate-gradient-deluxe drop-shadow-md text-glow-sm">
                  {t('pricing.title_highlight')}
              </span>
            </h2>
            <p className="mt-8 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed-plus">
              {t('pricing.subtitle')}
            </p>
          </div>

          {/* Enhanced Hosting Toggle */}
          <div className="mt-14 flex justify-center">
              <div className="relative bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-2xl p-2 rounded-3xl inline-flex shadow-legendary border-2 border-slate-200/70 dark:border-slate-700/60">
                {/* Enhanced animated slider background */}
                <div
                    className={`absolute top-2 bottom-2 w-[calc(50%-8px)] bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl shadow-glow-legendary-sm transition-all duration-500 ease-out ${!withHosting ? 'left-2' : 'left-[calc(50%+6px)]'}`}
                ></div>
                <button
                    onClick={() => setWithHosting(false)}
                    className={`relative z-10 px-10 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${!withHosting ? 'text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    {t('pricing.toggle_project')}
                </button>
                <button
                    onClick={() => setWithHosting(true)}
                    className={`relative z-10 px-10 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${withHosting ? 'text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                     {t('pricing.toggle_service')}
                </button>
            </div>
          </div>

          {/* Enhanced Limited Offer Banner */}
          {isOfferActive && (
              <div className="mt-10 max-w-xl mx-auto bg-gradient-to-r from-blue-50 via-violet-50 to-blue-50 dark:from-blue-900/25 dark:via-violet-900/25 dark:to-blue-900/25 border-2 border-blue-200/60 dark:border-blue-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-legendary hover:shadow-glow-legendary-md hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 relative overflow-hidden group">
                <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-deluxe"></div>
                  <div className="flex items-center gap-2.5 font-bold text-blue-600 dark:text-blue-400 text-sm relative z-10">
                      <TagIcon className="w-5 h-5 animate-icon-bounce" />
                      <span>{t('pricing.offer')}</span>
                  </div>
                  <CountdownTimer targetDate={offerEndDate} onComplete={() => setIsOfferActive(false)} />
              </div>
          )}
        </AnimatedSection>

        {/* Pricing Cards */}
        <AnimatedSection stagger>
          <div className="mt-20 grid gap-8 lg:grid-cols-3 items-start">
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
          <p className="text-center text-sm text-slate-500 mt-10 max-w-2xl mx-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
            <span className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></span>
             <ShieldCheckIcon className="w-4 h-4 text-emerald-500 glow-emerald relative z-10" />
             <span className="relative z-10">Keine Kreditkarte erforderlich. Kostenloses Beratungsgesprach inklusive.</span>
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
