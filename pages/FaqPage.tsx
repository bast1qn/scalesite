
import React, { useMemo } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FaqCategory {
    category: string;
    questions: { q: string; a: string }[];
}

const FaqPage: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
    const { t } = useLanguage();

    const faqCategories = useMemo<FaqCategory[]>(() => {
        const items = [
            { id: 1, question: t('faq.q1'), answer: t('faq.a1'), category: t('faq.category_process') },
            { id: 5, question: t('faq.q5'), answer: t('faq.a5'), category: t('faq.category_services') },
            { id: 6, question: t('faq.q6'), answer: t('faq.a6'), category: t('faq.category_services') },
            { id: 7, question: t('faq.q7'), answer: t('faq.a7'), category: t('faq.category_services') },
            { id: 8, question: t('faq.q8'), answer: t('faq.a8'), category: t('faq.category_services') },
            { id: 10, question: t('faq.q10'), answer: t('faq.a10'), category: t('faq.category_services') },
            { id: 11, question: t('faq.q11'), answer: t('faq.a11'), category: t('faq.category_services') },
            { id: 12, question: t('faq.q12'), answer: t('faq.a12'), category: t('faq.category_services') },
            { id: 2, question: t('faq.q2'), answer: t('faq.a2'), category: t('faq.category_costs') },
            { id: 3, question: t('faq.q3'), answer: t('faq.a3'), category: t('faq.category_costs') },
            { id: 4, question: t('faq.q4'), answer: t('faq.a4'), category: t('faq.category_costs') },
            { id: 9, question: t('faq.q9'), answer: t('faq.a9'), category: t('faq.category_costs') },
        ];

        const cats = items.reduce<FaqCategory[]>((acc, item) => {
            let category = acc.find(c => c.category === item.category);
            if (!category) {
                category = { category: item.category, questions: [] };
                acc.push(category);
            }
            category.questions.push({ q: item.question, a: item.answer });
            return acc;
        }, []);
        return cats;
    }, [t]);

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
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white mb-8 shadow-lg shadow-blue-500/25">
                                <QuestionMarkCircleIcon className="w-8 h-8" />
                            </div>

                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                                {t('faq.title')}
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                {t('faq.subtitle')}
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="pb-24">
                <div className="max-w-3xl mx-auto px-6">
                    {faqCategories.map((cat, catIdx) => (
                        <AnimatedSection key={cat.category}>
                            <div className="mb-12">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent flex-1"></div>
                                    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white px-4">
                                        {cat.category}
                                    </h2>
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent flex-1"></div>
                                </div>

                                {/* FAQ Items */}
                                <div className="space-y-3">
                                    {cat.questions.map((item, idx) => (
                                        <details
                                            key={idx}
                                            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:border-blue-200 dark:hover:border-blue-800"
                                        >
                                            <summary className="flex justify-between items-center p-6 font-semibold text-slate-900 dark:text-white cursor-pointer select-none list-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <span className="pr-4">{item.q}</span>
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-all duration-300 group-open:rotate-180">
                                                    <ChevronDownIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                </div>
                                            </summary>
                                            <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 whitespace-pre-line leading-relaxed">
                                                {item.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <AnimatedSection>
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                                    Noch Fragen?
                                </h3>
                                <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                                    Schreib uns einfach und wir melden uns schnellstmöglich bei dir.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage('contact')}
                                        className="px-8 py-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5"
                                    >
                                        Kontakt aufnehmen
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage('preise')}
                                        className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        Preise ansehen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </main>
    );
};

export default FaqPage;
