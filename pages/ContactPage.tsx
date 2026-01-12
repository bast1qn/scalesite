
import React, { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { EnvelopeIcon, CheckBadgeIcon, TicketIcon, SparklesIcon } from '../components/Icons';
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
            await api.sendContact(data.name, data.email, data.subject, data.message);
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
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/8 to-violet-400/6 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/6 to-teal-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <AnimatedSection>
                        <div className="text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 mb-8">
                                <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                    {t('contact_page.subtitle') || 'Kontaktieren Sie uns'}
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                                {t('contact_page.title')}
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                {t('contact_page.subtitle')}
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Main Content */}
            <section className="pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedSection stagger>
                        <div className="grid lg:grid-cols-3 gap-8 stagger-container">
                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-700">
                                    <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('contact_page.send_msg')}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">{t('contact_page.form_sub')}</p>

                                    {isSubmitted ? (
                                        <div className="py-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl text-center flex flex-col items-center justify-center animate-fade-in">
                                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6">
                                                <CheckBadgeIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <p className="font-bold text-2xl mb-2 text-slate-900 dark:text-white">{t('contact_page.success_title')}</p>
                                            <p className="text-slate-600 dark:text-slate-400">{t('contact_page.success_desc')}</p>
                                            <button onClick={() => setIsSubmitted(false)} className="mt-8 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                                                {t('contact_page.new_msg')}
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('contact_page.name')}</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        required
                                                        className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        placeholder={t('placeholders.name_example')}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('contact_page.email')}</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        required
                                                        className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        placeholder={t('placeholders.email_example_alt')}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('contact_page.subject')}</label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    name="subject"
                                                    required
                                                    className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder={t('contact_page.subject_placeholder')}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="message" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('contact_page.message')}</label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={5}
                                                    required
                                                    className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                                                    placeholder={t('contact_page.message_placeholder')}
                                                ></textarea>
                                            </div>

                                            {error && (
                                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800/30">
                                                    {error}
                                                </div>
                                            )}

                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-4 px-10 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                            {t('contact_page.btn_sending')}
                                                        </>
                                                    ) : (
                                                        <>{t('contact_page.btn_send')}</>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Pricing CTA Box */}
                                <div className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/20 dark:shadow-black/50 relative overflow-hidden group border border-slate-800 dark:border-slate-700">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-[50px] opacity-10 -ml-10 -mb-10"></div>

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                                            <TicketIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold mb-2">{t('contact_page.box_title')}</h3>
                                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                            {t('contact_page.box_text')}
                                        </p>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setCurrentPage('preise')}
                                                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm"
                                            >
                                                {t('contact_page.box_btn_calc')}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage('login')}
                                                className="w-full bg-transparent border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
                                            >
                                                {t('contact_page.box_btn_dash')}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-200 dark:border-slate-700">
                                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-6">{t('contact_page.info_title')}</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                                                <EnvelopeIcon />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">E-Mail</p>
                                                <a href="mailto:info.scalesite@gmail.com" className="text-base font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">
                                                    info.scalesite@gmail.com
                                                </a>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-6">
                                            {t('contact_page.response_time')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;
