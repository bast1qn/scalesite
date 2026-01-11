
import React from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const ImpressumPage: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
    const { t } = useLanguage();

    return (
        <main className="py-32 sm:py-40">
            <AnimatedSection>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight">
                            {t('impressum.title')}
                        </h1>
                        <p className="mt-4 text-lg text-dark-text/70 dark:text-light-text/70">{t('impressum.subtitle')}</p>
                    </div>

                    <div className="space-y-8 bg-surface dark:bg-dark-surface p-8 sm:p-12 rounded-2xl border border-dark-text/10 dark:border-light-text/10 text-dark-text/80 dark:text-light-text/80">
                        <section>
                            <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text border-b border-dark-text/10 dark:border-light-text/10 pb-2 mb-4">{t('impressum.section_tmg')}</h2>
                            <p style={{ whiteSpace: 'pre-line' }}>
                                {t('impressum.address')}
                            </p>
                        </section>

                        <section>
                             <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text border-b border-dark-text/10 dark:border-light-text/10 pb-2 mb-4">{t('impressum.section_contact')}</h2>
                            <p>
                                {t('impressum.phone')}<br />
                                {t('impressum.email_label')} {t('impressum.email')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text border-b border-dark-text/10 dark:border-light-text/10 pb-2 mb-4">{t('impressum.section_vat')}</h2>
                            <p>
                                {t('impressum.section_vat_text')}<br />
                                {t('impressum.vat_number')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text border-b border-dark-text/10 dark:border-light-text/10 pb-2 mb-4">{t('impressum.section_responsible')}</h2>
                            <p style={{ whiteSpace: 'pre-line' }}>
                                {t('impressum.responsible_text')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text border-b border-dark-text/10 dark:border-light-text/10 pb-2 mb-4">{t('impressum.section_disclaimer')}</h2>
                            <h3 className="font-semibold text-dark-text dark:text-light-text mt-4">{t('impressum.liability_content')}</h3>
                            <p>
                                {t('impressum.liability_content_text')}
                            </p>
                            <h3 className="font-semibold text-dark-text dark:text-light-text mt-4">{t('impressum.liability_links')}</h3>
                            <p>
                                {t('impressum.liability_links_text')}
                            </p>
                            <h3 className="font-semibold text-dark-text dark:text-light-text mt-4">{t('impressum.copyright')}</h3>
                            <p>
                                {t('impressum.copyright_text')}
                            </p>
                        </section>
                    </div>
                </div>
            </AnimatedSection>
        </main>
    );
};

export default ImpressumPage;
