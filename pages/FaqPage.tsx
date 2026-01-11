
import React, { useMemo } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { ChevronDownIcon } from '../components/Icons';
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
            { id: 2, question: t('faq.q2'), answer: t('faq.a2'), category: t('faq.category_costs') },
            { id: 3, question: t('faq.q3'), answer: t('faq.a3'), category: t('faq.category_costs') },
            { id: 4, question: t('faq.q4'), answer: t('faq.a4'), category: t('faq.category_process') },
            { id: 5, question: t('faq.q5'), answer: t('faq.a5'), category: t('faq.category_services') },
            { id: 6, question: t('faq.q6'), answer: t('faq.a6'), category: t('faq.category_costs') },
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
        <main className="py-24">
            <AnimatedSection>
                <div className="text-center pt-8 pb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight">
                        {t('faq.title')}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/80 dark:text-light-text/80">
                        {t('faq.subtitle')}
                    </p>
                </div>
            </AnimatedSection>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {faqCategories.map(cat => (
                    <AnimatedSection key={cat.category}>
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-dark-text dark:text-light-text mb-6">{cat.category}</h2>
                            <div className="space-y-4">
                                {cat.questions.map((item, idx) => (
                                    <details key={idx} className="group p-6 bg-surface dark:bg-dark-surface rounded-lg border border-dark-text/10 dark:border-light-text/10 cursor-pointer transition-colors hover:border-primary/50">
                                        <summary className="flex justify-between items-center font-semibold text-dark-text dark:text-light-text list-none">
                                            <span>{item.q}</span>
                                            <ChevronDownIcon className="w-5 h-5 faq-summary-icon text-dark-text/60 dark:text-light-text/60 group-hover:text-primary" />
                                        </summary>
                                        <p className="mt-4 text-dark-text/80 dark:text-light-text/80 whitespace-pre-line">
                                            {item.a}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </main>
    );
};

export default FaqPage;
