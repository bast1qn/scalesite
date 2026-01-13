
import { useState, type FormEvent } from 'react';
import { EnvelopeIcon, CheckBadgeIcon, SparklesIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

export const NewsletterSection = () => {
    const { t } = useLanguage();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        try {
            await api.subscribeNewsletter(name, email);
            setIsSubmitted(true);
            form.reset();
        } catch (err) {
            setError(t('newsletter.form.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedSection>
            <section className="py-24 sm:py-32 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-700 dark:from-blue-900 dark:via-violet-900 dark:to-indigo-950 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}></div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 text-white rounded-3xl p-8 md:p-12 text-center shadow-2xl">
                        {/* Icon */}
                        <div className="inline-flex justify-center items-center w-16 h-16 bg-white/20 rounded-2xl mb-6 shadow-lg animate-float">
                            <EnvelopeIcon className="w-8 h-8" />
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                            {t('newsletter.title')}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
                            {t('newsletter.subtitle')}
                        </p>

                        {isSubmitted ? (
                            <div className="mt-8 bg-white/20 backdrop-blur-sm p-8 rounded-2xl animate-scale-in">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                                    <CheckBadgeIcon className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-xl font-bold mb-2">{t('newsletter.success_title')}</p>
                                <p className="text-sm text-white/80">{t('newsletter.success_desc')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative group">
                                        <label htmlFor="newsletter-name" className="sr-only">Name</label>
                                        <input
                                            type="text"
                                            id="newsletter-name"
                                            name="name"
                                            required
                                            placeholder={t('newsletter.form.name_placeholder')}
                                            className="w-full px-5 py-4 rounded-xl border-2 border-white/30 bg-white/10 placeholder-white/60 text-white focus:border-white/60 focus:bg-white/20 focus:ring-0 outline-none transition-all duration-300"
                                        />
                                        <SparklesIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                                    </div>
                                    <div className="flex-1 relative group">
                                        <label htmlFor="newsletter-email" className="sr-only">{t('newsletter.form.email_label')}</label>
                                        <input
                                            type="email"
                                            id="newsletter-email"
                                            name="email"
                                            required
                                            placeholder={t('newsletter.form.email_placeholder')}
                                            className="w-full px-5 py-4 rounded-xl border-2 border-white/30 bg-white/10 placeholder-white/60 text-white focus:border-white/60 focus:bg-white/20 focus:ring-0 outline-none transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-4 text-sm bg-red-500/20 backdrop-blur-sm p-3 rounded-xl text-white border border-red-400/30 animate-slide-down">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 w-full sm:w-auto bg-white text-blue-600 dark:text-violet-700 font-bold px-10 py-4 rounded-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl btn-press inline-flex items-center justify-center gap-2 min-w-[160px]"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <span>{t('newsletter.form.btn')}</span>
                                            <EnvelopeIcon className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                                <p className="mt-4 text-xs text-white/60">
                                    {t('newsletter.form.disclaimer')}
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
