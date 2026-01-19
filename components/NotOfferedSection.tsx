
import { AnimatedSection } from './AnimatedSection'; import { Icons } from './Icons';
import { useLanguage } from '../contexts';

export const NotOfferedSection = () => {
    const { t } = useLanguage();

    const notOfferedItems = [
        { id: 1, title: t('not_offered.items.dumping.title'), reason: t('not_offered.items.dumping.reason') },
        { id: 2, title: t('not_offered.items.builders.title'), reason: t('not_offered.items.builders.reason') },
        { id: 3, title: t('not_offered.items.print.title'), reason: t('not_offered.items.print.reason') },
        { id: 4, title: t('not_offered.items.shops.title'), reason: t('not_offered.items.shops.reason') },
    ];

    return (
        <section className="py-24 sm:py-32 bg-surface dark:bg-dark-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="lg:text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight">
                            {t('not_offered.title')}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
                            {t('not_offered.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>
                <AnimatedSection stagger>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 stagger-container">
                        {notOfferedItems.map(item => (
                            <div key={item.title} className="flex items-start gap-5 p-6 bg-light-bg dark:bg-dark-bg rounded-2xl">
                                <div className="flex-shrink-0 w-10 h-10 text-primary">
                                    <XCircleIcon />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-dark-text dark:text-light-text">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-dark-text/70 dark:text-light-text/70">
                                        {item.reason}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
