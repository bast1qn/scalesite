
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { CalculatorIcon, GlobeAltIcon, SparklesIcon, CheckBadgeIcon, TicketIcon, XMarkIcon } from './Icons';
import { CustomSelect } from './CustomSelect';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { triggerConfetti } from '../lib/confetti';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface OfferCalculatorProps {
    setCurrentPage?: (page: string) => void;
}

export const OfferCalculator: React.FC<OfferCalculatorProps> = ({ setCurrentPage }) => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const [projectType, setProjectType] = useState('new');
    const [pageCount, setPageCount] = useState(3);
    const [hosting, setHosting] = useState(false);
    const [domain, setDomain] = useState(false);
    const [maintenance, setMaintenance] = useState(false);
    const [contactForm, setContactForm] = useState(false);
    const [blog, setBlog] = useState(false);

    const [oneTimePriceRange, setOneTimePriceRange] = useState({ min: 0, max: 0 });
    const [monthlyPrice, setMonthlyPrice] = useState(0);

    // Request Flow State
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestStep, setRequestStep] = useState<'confirm' | 'sending' | 'success'>('confirm');
    const [requestError, setRequestError] = useState<string | null>(null);

    const projectTypeOptions = useMemo(() => [
        { value: 'onepage', label: language === 'de' ? 'One-Page Website' : 'One-Page Website' },
        { value: 'small', label: language === 'de' ? 'Kleine Website (3-5 Seiten)' : 'Small Website (3-5 pages)' },
        { value: 'business', label: language === 'de' ? 'Business Website (5-8 Seiten)' : 'Business Website (5-8 pages)' },
    ], [t, language]);

    const { language } = useLanguage();

    useEffect(() => {
        const calculatePrice = () => {
            // 1. Einmalige Kosten (Projekt)
            let basePrice = 49; // Starting price for basic one-pager

            switch(projectType) {
                case 'onepage': basePrice = 49; break;
                case 'small': basePrice = 99; break;
                case 'business': basePrice = 149; break;
            }

            const pagePrice = Math.max(0, pageCount - 1) * 20; // 20€ per additional page
            const addOnsPrice = (contactForm ? 15 : 0) + (blog ? 25 : 0);

            const totalOneTime = basePrice + pagePrice + addOnsPrice;

            // Cap at 200€ maximum
            const cappedTotal = Math.min(totalOneTime, 200);

            setOneTimePriceRange({
                min: Math.max(49, Math.floor(cappedTotal * 0.9 / 10) * 10),
                max: Math.min(200, Math.ceil(cappedTotal * 1.1 / 10) * 10),
            });

            // 2. Monatliche Kosten (Service)
            let monthly = 0;
            if (hosting) monthly += 9;
            if (domain) monthly += 2;
            if (maintenance) monthly += 15;

            setMonthlyPrice(monthly);
        };
        calculatePrice();
    }, [projectType, pageCount, hosting, domain, maintenance, contactForm, blog, language]);

    const getSelectedLabel = (val: string) => projectTypeOptions.find(o => o.value === val)?.label;

    const handleRequestClick = () => {
        setShowRequestModal(true);
        setRequestStep('confirm');
        setRequestError(null);
    };

    const confirmRequest = async () => {
        if (!user) return;
        setRequestStep('sending');
        
        const messageText = `
KALKULATOR ANFRAGE:
-------------------
Typ: ${getSelectedLabel(projectType)}
Umfang: ${pageCount} Seiten
Extras: ${contactForm ? 'Kontaktformular,' : ''} ${blog ? 'Blog,' : ''} ${hosting ? 'Hosting,' : ''} ${domain ? 'Domain,' : ''} ${maintenance ? 'Wartung' : ''}

Geschätztes Budget: ${formatPrice(oneTimePriceRange.min)} - ${formatPrice(oneTimePriceRange.max)}
Monatlich: ${formatPrice(monthlyPrice)}
        `.trim();

        try {
            const { error } = await api.post('/tickets', {
                subject: `Anfrage: ${getSelectedLabel(projectType)}`,
                priority: 'Hoch',
                message: messageText
            });

            if (error) throw new Error(error);
            setRequestStep('success');
            triggerConfetti(); // TRIGGER CONFETTI
        } catch (e: any) {
            setRequestError(t('general.error') + ": " + (e.message || String(e)));
            setRequestStep('confirm');
        }
    };

    const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val > 0 && val <= 50) {
            setPageCount(val);
        } else if (isNaN(val)) {
            // Allow clearing but reset on blur maybe, for now just don't update state
        }
    };

    return (
        <div className="mt-24">
            <div className="text-center mb-12">
                 <h3 className="text-3xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
                    {t('calculator.title')}
                 </h3>
                 <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
                    {t('calculator.subtitle')}
                 </p>
            </div>
            <div className="max-w-6xl mx-auto bg-white dark:bg-dark-surface rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="grid md:grid-cols-12">
                    {/* Inputs */}
                    <div className="md:col-span-7 p-8 sm:p-10 space-y-8">
                        <div>
                            <label htmlFor="projectType" className="block text-sm font-bold text-dark-text dark:text-light-text mb-3 uppercase tracking-wider">{t('calculator.project_type')}</label>
                            <CustomSelect
                                id="projectType"
                                options={projectTypeOptions}
                                value={projectType}
                                onChange={setProjectType}
                            />
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label htmlFor="pageCount" className="block text-sm font-bold text-dark-text dark:text-light-text uppercase tracking-wider">{t('calculator.scope')}</label>
                                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">
                                    {pageCount} {pageCount === 1 ? t('calculator.page') : t('calculator.pages')}
                                </span>
                            </div>
                            <div className="relative py-2">
                                <input
                                    id="pageCount"
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="1"
                                    value={pageCount}
                                    onChange={handlePageCountChange}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium px-1">
                                <span>1 {t('calculator.page')}</span>
                                <span>10 {t('calculator.pages')}</span>
                                <span>20 {t('calculator.pages')}</span>
                            </div>
                        </div>

                        {/* Special Features Section */}
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-bold text-dark-text dark:text-light-text uppercase tracking-wider mb-2">{language === 'de' ? 'Extras' : 'Extras'}</p>
                            <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${contactForm ? 'bg-primary/5 border-primary dark:bg-primary/10' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                                <input
                                    id="contactForm"
                                    type="checkbox"
                                    checked={contactForm}
                                    onChange={e => setContactForm(e.target.checked)}
                                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-dark-text dark:text-light-text group-hover:text-primary transition-colors">{language === 'de' ? 'Kontaktformular' : 'Contact Form'} (+{formatPrice(15)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{language === 'de' ? 'Einfaches Formular für Anfragen' : 'Simple inquiry form'}</span>
                                </div>
                            </label>
                            <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${blog ? 'bg-primary/5 border-primary dark:bg-primary/10' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                                <input
                                    id="blog"
                                    type="checkbox"
                                    checked={blog}
                                    onChange={e => setBlog(e.target.checked)}
                                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-dark-text dark:text-light-text group-hover:text-primary transition-colors">{language === 'de' ? 'Blog-Sektion' : 'Blog Section'} (+{formatPrice(25)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{language === 'de' ? 'Blog mit Beiträgen' : 'Blog with posts'}</span>
                                </div>
                            </label>
                        </div>

                         <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-bold text-dark-text dark:text-light-text uppercase tracking-wider mb-2">{t('calculator.monthly_services')}</p>

                            <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${hosting ? 'bg-primary/5 border-primary dark:bg-primary/10' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                                <input
                                    id="hosting"
                                    type="checkbox"
                                    checked={hosting}
                                    onChange={e => setHosting(e.target.checked)}
                                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-dark-text dark:text-light-text group-hover:text-primary transition-colors">{t('calculator.hosting')} (+{formatPrice(9)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{language === 'de' ? 'Schnelles & sicheres Hosting' : 'Fast & secure hosting'}</span>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${domain ? 'bg-primary/5 border-primary dark:bg-primary/10' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                                <input
                                    id="domain"
                                    type="checkbox"
                                    checked={domain}
                                    onChange={e => setDomain(e.target.checked)}
                                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-dark-text dark:text-light-text group-hover:text-primary transition-colors">{t('calculator.domain')} (+{formatPrice(2)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{language === 'de' ? '.de Domain inklusive' : '.de domain included'}</span>
                                </div>
                                <GlobeAltIcon className="text-slate-400 w-5 h-5" />
                            </label>

                             <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${maintenance ? 'bg-primary/5 border-primary dark:bg-primary/10' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                                <input
                                    id="maintenance"
                                    type="checkbox"
                                    checked={maintenance}
                                    onChange={e => setMaintenance(e.target.checked)}
                                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-dark-text dark:text-light-text group-hover:text-primary transition-colors">{t('calculator.maintenance')} (+{formatPrice(15)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{language === 'de' ? 'Updates & Support' : 'Updates & support'}</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900 p-8 sm:p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6 text-slate-500 dark:text-slate-400">
                                <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl shadow-sm">
                                    <CalculatorIcon />
                                </div>
                                <span className="font-bold uppercase tracking-wider text-xs">{t('calculator.your_estimate')}</span>
                            </div>
                            
                            <div className="mb-8">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('calculator.one_time_costs')}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                                        {formatPrice(oneTimePriceRange.min)}
                                    </p>
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{t('calculator.up_to')} {formatPrice(oneTimePriceRange.max)} {t('calculator.depending_on')}</p>
                            </div>

                            {(monthlyPrice > 0 || contactForm || blog) && (
                                <div className="mb-8 pt-6 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('calculator.monthly_costs')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-primary tracking-tight">
                                            {formatPrice(monthlyPrice)}
                                        </p>
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">{t('pricing.per_month')}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {hosting && <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{t('calculator_labels.addon_hosting')}</span>}
                                        {domain && <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{t('calculator_labels.addon_domain')}</span>}
                                        {maintenance && <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{t('calculator_labels.addon_maintenance')}</span>}
                                        {contactForm && <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{language === 'de' ? 'Kontaktformular' : 'Contact Form'}</span>}
                                        {blog && <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{language === 'de' ? 'Blog' : 'Blog'}</span>}
                                    </div>
                                </div>
                            )}

                            <div className="w-full space-y-3 mt-auto">
                                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                                    {t('calculator.disclaimer')}
                                </p>
                                <button 
                                    onClick={handleRequestClick}
                                    className="w-full btn-primary bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all shadow-lg transform hover:scale-[1.02]"
                                >
                                    {t('calculator.request_btn')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {requestStep === 'confirm' && t('calculator.modal_title')}
                                {requestStep === 'sending' && t('pricing.modal.btn_sending')}
                                {requestStep === 'success' && t('general.success')}
                            </h3>
                            {requestStep !== 'sending' && (
                                <button onClick={() => setShowRequestModal(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    <XMarkIcon className="w-5 h-5 text-slate-500" />
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {requestStep === 'confirm' && (
                                user ? (
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm space-y-2">
                                            <p><strong>{t('calculator.project_type')}:</strong> {getSelectedLabel(projectType)}</p>
                                            <p><strong>{t('calculator.scope')}:</strong> {pageCount} {t('calculator.pages')}</p>
                                            <p><strong>{t('calculator_labels.addons_label')}:</strong> {[contactForm && (language === 'de' ? 'Kontaktformular' : 'Contact Form'), blog && (language === 'de' ? 'Blog' : 'Blog'), hosting && t('calculator_labels.addon_hosting'), domain && t('calculator_labels.addon_domain'), maintenance && t('calculator_labels.addon_maintenance')].filter(Boolean).join(', ') || '-'}</p>
                                            <p className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                                <strong>{t('calculator.your_estimate')}:</strong> {formatPrice(oneTimePriceRange.min)}-{formatPrice(oneTimePriceRange.max)} ({t('pricing.one_time')}) + {formatPrice(monthlyPrice)}{t('pricing.per_month')}.
                                            </p>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {t('pricing.modal.subtitle').replace(/<[^>]*>/g, '')}
                                        </p>
                                        {requestError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{requestError}</p>}
                                        <div className="flex gap-3 pt-2">
                                            <button onClick={() => setShowRequestModal(false)} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">{t('general.close')}</button>
                                            <button onClick={confirmRequest} className="flex-1 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover">{t('pricing.modal.btn_submit')}</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <TicketIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('auth.login')} {t('general.error')}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                            {t('auth.login_subtitle')}
                                        </p>
                                        <button 
                                            onClick={() => setCurrentPage && setCurrentPage('login')} 
                                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg"
                                        >
                                            {t('auth.to_login')}
                                        </button>
                                    </div>
                                )
                            )}

                            {requestStep === 'sending' && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">{t('pricing.modal.btn_sending')}</p>
                                </div>
                            )}

                            {requestStep === 'success' && (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckBadgeIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('pricing.modal.success_title')}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                        {t('pricing.modal.success_desc')}
                                    </p>
                                    <button onClick={() => setCurrentPage && setCurrentPage('dashboard')} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90">
                                        {t('pricing.modal.to_dashboard')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
