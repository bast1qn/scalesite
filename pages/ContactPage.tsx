
import React, { useState } from 'react';
import { AnimatedSection, EnvelopeIcon, CheckBadgeIcon, TicketIcon, SparklesIcon, ArrowRightIcon } from '../components';
import { api, validateEmail, validateName, validateString } from '../lib';
import { useLanguage } from '../contexts';

const ContactPage: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
    const { t } = useLanguage();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const rawName = formData.get('name') as string;
        const rawEmail = formData.get('email') as string;
        const rawSubject = formData.get('subject') as string;
        const rawMessage = formData.get('message') as string;

        // Validate all inputs
        const nameValidation = validateName(rawName);
        const emailValidation = validateEmail(rawEmail);
        const subjectValidation = validateString(rawSubject, { maxLength: 200 });
        const messageValidation = validateString(rawMessage, { minLength: 10, maxLength: 5000 });

        if (!nameValidation.isValid) {
            setError(t('general.error') + ': ' + (nameValidation.errors[0] ?? 'Invalid name'));
            setLoading(false);
            return;
        }

        if (!emailValidation.isValid) {
            setError(t('general.error') + ': ' + (emailValidation.errors[0] ?? 'Invalid email'));
            setLoading(false);
            return;
        }

        if (!subjectValidation.isValid) {
            setError(t('general.error') + ': ' + (subjectValidation.errors[0] ?? 'Invalid subject'));
            setLoading(false);
            return;
        }

        if (!messageValidation.isValid) {
            setError(t('general.error') + ': ' + (messageValidation.errors[0] ?? 'Invalid message'));
            setLoading(false);
            return;
        }

        // Use sanitized values
        const data = {
            name: nameValidation.sanitized || rawName,
            email: emailValidation.sanitized || rawEmail,
            subject: subjectValidation.sanitized || rawSubject,
            message: messageValidation.sanitized || rawMessage
        };

        try {
            await api.sendContact(data.name, data.email, data.subject, data.message);
            setIsSubmitted(true);
            form.reset();
        } catch (err: unknown) {
            setError(t('general.error'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[15%] left-[5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 via-violet-400/8 to-indigo-400/6 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] bg-gradient-to-br from-violet-400/8 via-purple-400/6 to-pink-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                ></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <AnimatedSection>
                        <div className="text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200/60 dark:border-blue-800/30 mb-8 shadow-lg">
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
                                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-700">
                                    <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('contact_page.send_msg')}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">{t('contact_page.form_sub')}</p>

                                    {isSubmitted ? (
                                        <div className="py-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/30 rounded-2xl text-center flex flex-col items-center justify-center animate-fade-in">
                                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25">
                                                <CheckBadgeIcon className="w-10 h-10 text-white" />
                                            </div>
                                            <p className="font-bold text-2xl mb-2 text-slate-900 dark:text-white">{t('contact_page.success_title')}</p>
                                            <p className="text-slate-600 dark:text-slate-400">{t('contact_page.success_desc')}</p>
                                            <button onClick={() => setIsSubmitted(false)} className="mt-8 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-all">
                                                {t('contact_page.new_msg')}
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="relative">
                                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t('contact_page.name')}</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        required
                                                        onFocus={() => setFocusedField('name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="w-full bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                                        placeholder={t('placeholders.name_example')}
                                                    />
                                                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ${focusedField === 'name' ? 'w-full' : 'w-0'}`}></div>
                                                </div>
                                                <div className="relative">
                                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t('contact_page.email')}</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        required
                                                        onFocus={() => setFocusedField('email')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="w-full bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                                        placeholder={t('placeholders.email_example_alt')}
                                                    />
                                                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'}`}></div>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t('contact_page.subject')}</label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    name="subject"
                                                    required
                                                    onFocus={() => setFocusedField('subject')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="w-full bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                                    placeholder={t('contact_page.subject_placeholder')}
                                                />
                                                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ${focusedField === 'subject' ? 'w-full' : 'w-0'}`}></div>
                                            </div>
                                            <div className="relative">
                                                <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t('contact_page.message')}</label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={5}
                                                    required
                                                    onFocus={() => setFocusedField('message')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="w-full bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-none"
                                                    placeholder={t('contact_page.message_placeholder')}
                                                ></textarea>
                                                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ${focusedField === 'message' ? 'w-full' : 'w-0'}`}></div>
                                            </div>

                                            {error && (
                                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800/30 animate-slide-up">
                                                    {error}
                                                </div>
                                            )}

                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 px-10 rounded-xl hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                            {t('contact_page.btn_sending')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{t('contact_page.btn_send')}</span>
                                                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                                        </>
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
                                <div className="group bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/50 relative overflow-hidden border border-slate-800 dark:border-slate-700">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-indigo-500/20 rounded-full blur-[60px] -mr-10 -mt-10 group-hover:opacity-50 transition-opacity duration-500"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-[50px] -ml-10 -mb-10"></div>

                                    {/* Animated border */}
                                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-3xl blur-xl animate-gradient-xy"></div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-xl">
                                            <TicketIcon className="w-7 h-7" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold mb-2">{t('contact_page.box_title')}</h3>
                                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                            {t('contact_page.box_text')}
                                        </p>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setCurrentPage('preise')}
                                                className="w-full group bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 text-sm hover:-translate-y-0.5 hover:shadow-lg btn-press"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    {t('contact_page.box_btn_calc')}
                                                    <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage('login')}
                                                className="group w-full bg-transparent border-2 border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-sm btn-press"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    {t('contact_page.box_btn_dash')}
                                                    <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-200 dark:border-slate-700">
                                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-6">{t('contact_page.info_title')}</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 shadow-lg">
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
