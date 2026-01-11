
import React, { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { EnvelopeIcon, CheckBadgeIcon, TicketIcon } from '../components/Icons';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
    const { t } = useLanguage();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string
        };

        try {
            await api.post('/contact', data);
            setIsSubmitted(true);
            form.reset();
        } catch (err: any) {
            console.error("Kontaktfehler:", err);
            setError(t('general.error'));
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <main className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="text-center pt-8 pb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
                            {t('contact_page.title')}
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/80 dark:text-light-text/80">
                            {t('contact_page.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid lg:grid-cols-3 gap-12 stagger-container">
                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                            <h2 className="text-2xl font-bold text-dark-text dark:text-light-text mb-1">{t('contact_page.send_msg')}</h2>
                            <p className="text-slate-500 dark:text-slate-300 text-sm mb-8">{t('contact_page.form_sub')}</p>
                            
                            {isSubmitted ? (
                                <div className="mt-6 p-8 bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 rounded-2xl text-center flex flex-col items-center justify-center h-64 animate-fade-in">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                                        <CheckBadgeIcon className="w-8 h-8 text-green-600 dark:text-green-300" />
                                    </div>
                                    <p className="font-bold text-xl mb-2">{t('contact_page.success_title')}</p>
                                    <p className="opacity-90">{t('contact_page.success_desc')}</p>
                                    <button onClick={() => setIsSubmitted(false)} className="mt-6 text-sm font-semibold underline hover:no-underline">
                                        {t('contact_page.new_msg')}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-bold text-dark-text dark:text-light-text mb-2">{t('contact_page.name')}</label>
                                            <input type="text" id="name" name="name" required className="input-premium" placeholder={t('placeholders.name_example')} />
                                        </div>
                                         <div>
                                            <label htmlFor="email" className="block text-sm font-bold text-dark-text dark:text-light-text mb-2">{t('contact_page.email')}</label>
                                            <input type="email" id="email" name="email" required className="input-premium" placeholder={t('placeholders.email_example_alt')} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-bold text-dark-text dark:text-light-text mb-2">{t('contact_page.subject')}</label>
                                        <input type="text" id="subject" name="subject" required className="input-premium" placeholder="" />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-dark-text dark:text-light-text mb-2">{t('contact_page.message')}</label>
                                        <textarea id="message" name="message" rows={5} required className="input-premium resize-none" placeholder=""></textarea>
                                    </div>
                                    
                                    {error && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full sm:w-auto bg-primary text-white font-bold py-4 px-10 rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/25 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    {t('contact_page.btn_sending')}
                                                </>
                                            ) : t('contact_page.btn_send')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        {/* Info Sidebar */}
                        <div className="space-y-6">
                             {/* Redirect Box */}
                            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group border border-slate-800">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                                        <TicketIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{t('contact_page.box_title')}</h3>
                                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                        {t('contact_page.box_text')}
                                    </p>
                                    <button onClick={() => setCurrentPage('preise')} className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm mb-3">
                                        {t('contact_page.box_btn_calc')}
                                    </button>
                                    <button onClick={() => setCurrentPage('login')} className="w-full bg-transparent border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
                                        {t('contact_page.box_btn_dash')}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold text-dark-text dark:text-light-text mb-6">{t('contact_page.info_title')}</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                            <EnvelopeIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">E-Mail</p>
                                            <a href="mailto:info.scalesite@gmail.com" className="text-lg font-medium text-dark-text dark:text-light-text hover:text-primary transition-colors break-all">info.scalesite@gmail.com</a>
                                        </div>
                                    </div>
                                     <p className="text-dark-text/70 dark:text-light-text/70 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
                                        {t('contact_page.response_time')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </main>
    );
};

export default ContactPage;