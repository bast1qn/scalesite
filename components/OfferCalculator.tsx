import { useState, useEffect, useContext, useMemo, memo, type ChangeEvent } from 'react';
import { CalculatorIcon, GlobeAltIcon, SparklesIcon, CheckBadgeIcon, TicketIcon, XMarkIcon, CustomSelect, BorderSpinner } from './index';
import { AuthContext, useLanguage, useCurrency } from '../contexts';
import { api, triggerConfetti } from '../lib';

// Pricing Constants (€)
const PRICE_ONEPAGE = 29;
const PRICE_SMALL = 59;
const PRICE_BUSINESS = 89;
const PRICE_PER_PAGE = 10;
const PRICE_CONTACT_FORM = 10;
const PRICE_BLOG = 15;
const PRICE_HOSTING = 5;
const PRICE_DOMAIN = 2;
const PRICE_MAINTENANCE = 10;
const PRICE_MIN = 29;
const PRICE_MAX = 150;

interface OfferCalculatorProps {
    setCurrentPage?: (page: string) => void;
}

export const OfferCalculator = memo(({ setCurrentPage }: OfferCalculatorProps) => {
    const { user } = useContext(AuthContext);
    const { t, language } = useLanguage();
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
    ], [language]);

    // ✅ PERFORMANCE: Extract price calculation to useEffect body for cleaner dependency tracking
    // This is more efficient than useCallback since calculation is fast
    useEffect(() => {
        let basePrice = PRICE_ONEPAGE;

        switch(projectType) {
            case 'onepage': basePrice = PRICE_ONEPAGE; break;
            case 'small': basePrice = PRICE_SMALL; break;
            case 'business': basePrice = PRICE_BUSINESS; break;
        }

        const pagePrice = Math.max(0, pageCount - 1) * PRICE_PER_PAGE;
        const addOnsPrice = (contactForm ? PRICE_CONTACT_FORM : 0) + (blog ? PRICE_BLOG : 0);

        const totalOneTime = basePrice + pagePrice + addOnsPrice;
        const cappedTotal = Math.min(totalOneTime, PRICE_MAX);

        setOneTimePriceRange({
            min: Math.max(PRICE_MIN, Math.floor(cappedTotal * 0.9 / 10) * 10),
            max: Math.min(PRICE_MAX, Math.ceil(cappedTotal * 1.1 / 10) * 10),
        });

        let monthly = 0;
        if (hosting) monthly += PRICE_HOSTING;
        if (domain) monthly += PRICE_DOMAIN;
        if (maintenance) monthly += PRICE_MAINTENANCE;

        setMonthlyPrice(monthly);
    }, [projectType, pageCount, hosting, domain, maintenance, contactForm, blog]); // ✅ All dependencies are primitive values - no eslint-disable needed

    const getSelectedLabel = (val: string) => projectTypeOptions.find(o => o.value === val)?.label;

    const handleRequestClick = () => {
        setShowRequestModal(true);
        setRequestStep('confirm');
        setRequestError(null);
    };

    /**
     * Confirms and submits the calculator request as a support ticket
     * Creates a ticket with all selected options and pricing details
     */
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
            const { error } = await api.createTicket(
                `Anfrage: ${getSelectedLabel(projectType)}`,
                'Hoch',
                messageText
            );

            if (error) throw new Error(error);
            setRequestStep('success');
            triggerConfetti(); // TRIGGER CONFETTI
        } catch (e) {
            setRequestError(t('general.error') + ": " + (e instanceof Error ? e.message : String(e)));
            setRequestStep('confirm');
        }
    };

    const handlePageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val > 0 && val <= 50) {
            setPageCount(val);
        } else if (isNaN(val)) {
            // Allow clearing but reset on blur maybe, for now just don't update state
        }
    };

    return (
        <div className="mt-32">
            <div className="text-center mb-16">
                 <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight-plus">
                    {t('calculator.title')}
                 </h3>
                 <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('calculator.subtitle')}
                 </p>
            </div>
            <div className="max-w-6xl mx-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-premium-lg border border-slate-200/70 dark:border-slate-700/60 overflow-hidden">
                <div className="grid md:grid-cols-12">
                    {/* Inputs */}
                    <div className="md:col-span-7 p-8 sm:p-12 space-y-10">
                        <div>
                            <label htmlFor="projectType" className="block text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider-plus">{t('calculator.project_type')}</label>
                            <CustomSelect
                                id="projectType"
                                options={projectTypeOptions}
                                value={projectType}
                                onChange={setProjectType}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <label htmlFor="pageCount" className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider-plus">{t('calculator.scope')}</label>
                                <span className="inline-flex items-center justify-center px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25">
                                    {pageCount} {pageCount === 1 ? t('calculator.page') : t('calculator.pages')}
                                </span>
                            </div>
                            <div className="relative py-3">
                                <input
                                    id="pageCount"
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="1"
                                    value={pageCount}
                                    onChange={handlePageCountChange}
                                    className="w-full h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                    style={{
                                        backgroundImage: 'linear-gradient(to right, #3b82f6 0%, #3b82f6 ' + ((pageCount - 1) / 19 * 100) + '%, #cbd5e1 ' + ((pageCount - 1) / 19 * 100) + '%, #cbd5e1 100%)'
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium px-1">
                                <span>1 {t('calculator.page')}</span>
                                <span>10 {t('calculator.pages')}</span>
                                <span>20 {t('calculator.pages')}</span>
                            </div>
                        </div>

                        {/* Special Features Section */}
                        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider-plus mb-3 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4 text-violet-500" />
                                {language === 'de' ? 'Extras' : 'Extras'}
                            </p>
                            <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${contactForm ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/25 dark:to-violet-900/25 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600'}`}>
                                <input
                                    id="contactForm"
                                    type="checkbox"
                                    checked={contactForm}
                                    onChange={e => setContactForm(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{language === 'de' ? 'Kontaktformular' : 'Contact Form'} (+{formatPrice(10)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{language === 'de' ? 'Einfaches Formular fur Anfragen' : 'Simple inquiry form'}</span>
                                </div>
                            </label>
                            <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${blog ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/25 dark:to-violet-900/25 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600'}`}>
                                <input
                                    id="blog"
                                    type="checkbox"
                                    checked={blog}
                                    onChange={e => setBlog(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{language === 'de' ? 'Blog-Sektion' : 'Blog Section'} (+{formatPrice(15)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{language === 'de' ? 'Blog mit Beitragen' : 'Blog with posts'}</span>
                                </div>
                            </label>
                        </div>

                         <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider-plus mb-3 flex items-center gap-2">
                                <GlobeAltIcon className="w-4 h-4 text-blue-500" />
                                {t('calculator.monthly_services')}
                            </p>

                            <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${hosting ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/25 dark:to-violet-900/25 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600'}`}>
                                <input
                                    id="hosting"
                                    type="checkbox"
                                    checked={hosting}
                                    onChange={e => setHosting(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t('calculator.hosting')} (+{formatPrice(9)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{language === 'de' ? 'Schnelles & sicheres Hosting' : 'Fast & secure hosting'}</span>
                                </div>
                            </label>

                            <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${domain ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/25 dark:to-violet-900/25 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600'}`}>
                                <input
                                    id="domain"
                                    type="checkbox"
                                    checked={domain}
                                    onChange={e => setDomain(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t('calculator.domain')} (+{formatPrice(2)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{language === 'de' ? '.de Domain inklusive' : '.de domain included'}</span>
                                </div>
                                <GlobeAltIcon className="text-slate-400 w-5 h-5 ml-2" />
                            </label>

                             <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${maintenance ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/25 dark:to-violet-900/25 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600'}`}>
                                <input
                                    id="maintenance"
                                    type="checkbox"
                                    checked={maintenance}
                                    onChange={e => setMaintenance(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <div className="ml-4 flex-grow">
                                    <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t('calculator.maintenance')} (+{formatPrice(15)})</span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{language === 'de' ? 'Updates & Support' : 'Updates & support'}</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="md:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-950 p-8 sm:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 relative overflow-hidden">
                        {/* Animated background gradients */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-gradient-to-br from-blue-500/15 to-violet-500/15 rounded-full blur-3xl animate-morph-blob"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-gradient-to-br from-violet-500/15 to-purple-500/15 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '3s' }}></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8 text-slate-500 dark:text-slate-400">
                                <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl shadow-premium">
                                    <CalculatorIcon />
                                </div>
                                <span className="font-bold uppercase tracking-wider-plus text-xs">{t('calculator.your_estimate')}</span>
                            </div>

                            <div className="mb-10">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('calculator.one_time_costs')}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 tracking-tight-plus drop-shadow-sm">
                                        {formatPrice(oneTimePriceRange.min)}
                                    </p>
                                </div>
                                <p className="text-sm text-slate-400 mt-2">{t('calculator.up_to')} {formatPrice(oneTimePriceRange.max)} {t('calculator.depending_on')}</p>
                            </div>

                            {(monthlyPrice > 0 || contactForm || blog) && (
                                <div className="mb-10 pt-8 border-t border-slate-200/80 dark:border-slate-700/50 animate-fade-in">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('calculator.monthly_costs')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tracking-tight-plus">
                                            {formatPrice(monthlyPrice)}
                                        </p>
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">{t('pricing.per_month')}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {hosting && <span className="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">{t('calculator_labels.addon_hosting')}</span>}
                                        {domain && <span className="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">{t('calculator_labels.addon_domain')}</span>}
                                        {maintenance && <span className="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">{t('calculator_labels.addon_maintenance')}</span>}
                                        {contactForm && <span className="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">{language === 'de' ? 'Kontaktformular' : 'Contact Form'}</span>}
                                        {blog && <span className="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">{language === 'de' ? 'Blog' : 'Blog'}</span>}
                                    </div>
                                </div>
                            )}

                            <div className="w-full space-y-4 mt-auto">
                                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                                    {t('calculator.disclaimer')}
                                </p>
                                <button
                                    onClick={handleRequestClick}
                                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 font-bold py-4 px-6 rounded-2xl hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-white/20 hover:-translate-y-1 active:scale-[0.98] focus:ring-2 focus:ring-primary/50 transition-all duration-300 shadow-lg relative overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <TicketIcon className="w-4 h-4" />
                                        {t('calculator.request_btn')}
                                    </span>
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
                                <button onClick={() => setShowRequestModal(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 focus:ring-2 focus:ring-primary/50 transition-colors">
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
                                            <button onClick={() => setShowRequestModal(false)} className="flex-1 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 focus:ring-2 focus:ring-primary/50 transition-all min-h-11">{t('general.close')}</button>
                                            <button onClick={confirmRequest} className="flex-1 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover active:scale-[0.98] focus:ring-2 focus:ring-primary/50 transition-all min-h-11">{t('pricing.modal.btn_submit')}</button>
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
                                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover active:scale-[0.98] focus:ring-2 focus:ring-primary/50 shadow-lg transition-all"
                                        >
                                            {t('auth.to_login')}
                                        </button>
                                    </div>
                                )
                            )}

                            {requestStep === 'sending' && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <BorderSpinner size="md" color="primary" className="mb-4" />
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
                                    <button onClick={() => setCurrentPage && setCurrentPage('dashboard')} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] focus:ring-2 focus:ring-primary/50 transition-all">
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
});
