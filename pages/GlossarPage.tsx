
import React from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const GlossarPage: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
    const { t } = useLanguage();
    const terms = t('glossary.terms') as { term: string; definition: string }[];

    return (
        <main className="py-24">
            <AnimatedSection>
                <div className="text-center pt-8 pb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight">
                        {t('glossary.title')}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/80 dark:text-light-text/80">
                        {t('glossary.subtitle')}
                    </p>
                </div>
            </AnimatedSection>

            <AnimatedSection>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {terms.map((item, idx) => (
                            <div key={idx} className="p-6 bg-surface dark:bg-dark-surface rounded-lg border border-dark-text/10 dark:border-light-text/10">
                                <h2 className="text-xl font-semibold text-dark-text dark:text-light-text">{item.term}</h2>
                                <p className="mt-2 text-dark-text/80 dark:text-light-text/80">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>
        </main>
    );
};

export default GlossarPage;
