
import React, { useState } from 'react';
import { EnvelopeIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

export const NewsletterSection: React.FC = () => {
    const { t } = useLanguage();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        } catch (err: any) {
            console.error("Newsletter Error", err);
            setError(t('newsletter.form.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedSection>
            <section className="py-24 sm:py-32 bg-surface dark:bg-dark-surface">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary dark:bg-primary/20 dark:border dark:border-primary/30 text-white dark:text-light-text rounded-2xl p-8 md:p-12 text-center shadow-2xl shadow-primary/20">
                        <div className="inline-flex justify-center items-center w-14 h-14 bg-white/20 dark:bg-white/10 rounded-full mb-6">
                            <EnvelopeIcon />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            {t('newsletter.title')}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80 dark:text-light-text/80">
                            {t('newsletter.subtitle')}
                        </p>

                        {isSubmitted ? (
                            <div className="mt-8 bg-white/20 dark:bg-white/10 p-6 rounded-xl font-semibold animate-scale-in">
                                <p className="text-xl mb-2">{t('newsletter.success_title')}</p>
                                <p className="text-sm opacity-90">{t('newsletter.success_desc')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label htmlFor="newsletter-name" className="sr-only">Name</label>
                                    <input
                                        type="text"
                                        id="newsletter-name"
                                        name="name"
                                        required
                                        placeholder={t('newsletter.form.name_placeholder')}
                                        className="flex-1 px-5 py-3 rounded-lg border-0 bg-white/20 dark:bg-white/10 placeholder-white/70 dark:placeholder-light-text/50 focus:ring-2 focus:ring-inset focus:ring-white outline-none text-white dark:text-light-text"
                                    />
                                    <label htmlFor="newsletter-email" className="sr-only">{t('newsletter.form.email_label')}</label>
                                    <input
                                        type="email"
                                        id="newsletter-email"
                                        name="email"
                                        required
                                        placeholder={t('newsletter.form.email_placeholder')}
                                        className="flex-1 px-5 py-3 rounded-lg border-0 bg-white/20 dark:bg-white/10 placeholder-white/70 dark:placeholder-light-text/50 focus:ring-2 focus:ring-inset focus:ring-white outline-none text-white dark:text-light-text"
                                    />
                                </div>
                                
                                {error && (
                                    <div className="mt-4 text-sm bg-red-500/20 p-2 rounded text-white border border-red-500/30">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 w-full sm:w-auto bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-light-bg/90 transition-colors duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? t('newsletter.form.loading') : t('newsletter.form.btn')}
                                </button>
                                <p className="mt-4 text-xs text-white/80 dark:text-light-text/60">
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
