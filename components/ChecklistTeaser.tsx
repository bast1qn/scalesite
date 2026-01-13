import { ClipboardDocumentCheckIcon, DocumentArrowDownIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

export const ChecklistTeaser = () => {
    const { t } = useLanguage();

    const checklistItems = [
        { id: 1, text: t('checklist.items.1') },
        { id: 2, text: t('checklist.items.2') },
        { id: 3, text: t('checklist.items.3') },
        { id: 4, text: t('checklist.items.4') },
    ];

    return (
        <AnimatedSection>
            <section className="py-24 sm:py-32 bg-surface dark:bg-dark-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-light-bg dark:bg-dark-bg rounded-2xl p-8 lg:p-12 overflow-hidden">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-3 bg-accent-2/20 text-accent-2/90 font-semibold px-4 py-2 rounded-full text-sm">
                                    <ClipboardDocumentCheckIcon />
                                    {t('checklist.badge')}
                                </div>
                                <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight">
                                    {t('checklist.title')}
                                </h2>
                                <p className="mt-4 text-lg text-dark-text/70 dark:text-light-text/70">
                                    {t('checklist.subtitle')}
                                </p>
                                <ul className="mt-6 space-y-4">
                                    {checklistItems.map((item) => (
                                        <li key={item.id} className="flex items-start">
                                            <svg className="flex-shrink-0 h-6 w-6 text-accent-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                            <span className="ml-3 text-dark-text/90 dark:text-light-text/90">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 lg:mt-0 flex flex-col items-center justify-center bg-surface dark:bg-dark-surface p-8 rounded-lg text-center border border-dark-text/10 dark:border-light-text/10">
                                <h3 className="text-xl font-semibold text-dark-text dark:text-light-text">{t('checklist.cta_title')}</h3>
                                <p className="mt-2 text-dark-text/70 dark:text-light-text/70">{t('checklist.cta_desc')}</p>
                                <button
                                    disabled
                                    title={t('resources_section.download_available_soon')}
                                    className="mt-6 inline-flex items-center gap-3 bg-primary text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform shadow-lg disabled:bg-primary/70 disabled:cursor-not-allowed"
                                >
                                    <DocumentArrowDownIcon />
                                    {t('checklist.cta_btn')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
