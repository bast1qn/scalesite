
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';
import { StarIcon, CheckBadgeIcon } from './Icons';

const results = [
    { value: '47+', label: 'Zufriedene Kunden' },
    { value: '48h', label: 'Durchschnittliche Lieferzeit' },
    { value: '4.9★', label: 'Durchschnittsbewertung' },
    { value: '100%', label: 'Geld-zurück Garantie' }
];

export const TestimonialsSection: React.FC = () => {
    const { t, language } = useLanguage();
    const reviews = translations[language].testimonials_list.reviews;

    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 to-dark-bg relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                            <StarIcon className="w-4 h-4 fill-current" />
                            <span>4.9/5 Durchschnittsbewertung</span>
                        </div>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                            Was unsere Kunden sagen
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Echte Ergebnisse von echten Menschen
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-container">
                        {reviews.slice(0, 3).map((review) => (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1 mb-1">
                                            {[1,2,3,4,5].map(star => (
                                                <StarIcon key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{review.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                                    </div>
                                </div>

                                {/* Testimonial */}
                                <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
                                    "{review.content}"
                                </p>

                                {/* Result highlight - simulated */}
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
                                    <div className="flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold text-xs mb-1">
                                        <CheckBadgeIcon className="w-3 h-3" />
                                        Ergebnis
                                    </div>
                                    <p className="text-green-600 dark:text-green-400 font-medium text-xs">
                                        {review.id === 1 ? '30% mehr Anfragen im ersten Monat' :
                                         review.id === 2 ? '5 neue Mandanten in Woche 1' :
                                         'Website in nur 48 Stunden live'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Trust stats */}
                <AnimatedSection>
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {results.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-2">
                                    {stat.value}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
