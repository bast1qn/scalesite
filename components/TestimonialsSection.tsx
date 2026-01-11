
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

// Star Icon Component
const StarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

export const TestimonialsSection: React.FC = () => {
    const { t, language } = useLanguage();
    const reviews = translations[language].testimonials_list.reviews;

    return (
        <section className="py-24 bg-surface dark:bg-dark-surface relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text font-serif tracking-tight">
                            {t('testimonials.title')}
                        </h2>
                        <p className="mt-4 text-lg text-dark-text/70 dark:text-light-text/70 max-w-2xl mx-auto">
                            {t('testimonials.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid gap-6 md:grid-cols-2 stagger-container">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-light-bg dark:bg-dark-bg p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} />
                                    ))}
                                </div>
                                <p className="text-dark-text/80 dark:text-light-text/80 leading-relaxed mb-6 italic">
                                    "{review.content}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark-text dark:text-light-text text-sm">{review.name}</h4>
                                        <p className="text-xs text-dark-text/50 dark:text-light-text/50">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
