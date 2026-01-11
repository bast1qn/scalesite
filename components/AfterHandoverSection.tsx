
import React from 'react';
import { ShieldCheckIcon, LifebuoyIcon, PlusCircleIcon, ClockIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: { [key: string]: React.ReactNode } = {
    'ShieldCheckIcon': <ShieldCheckIcon />,
    'LifebuoyIcon': <LifebuoyIcon />,
    'PlusCircleIcon': <PlusCircleIcon />,
    'ClockIcon': <ClockIcon />,
};

export const AfterHandoverSection: React.FC = () => {
    const { t } = useLanguage();

    const supportItems = [
        { id: 1, title: t('after_handover.items.maintenance.title'), description: t('after_handover.items.maintenance.desc'), icon_name: "ShieldCheckIcon" },
        { id: 2, title: t('after_handover.items.support.title'), description: t('after_handover.items.support.desc'), icon_name: "LifebuoyIcon" },
        { id: 3, title: t('after_handover.items.content.title'), description: t('after_handover.items.content.desc'), icon_name: "ClockIcon" },
        { id: 4, title: t('after_handover.items.growth.title'), description: t('after_handover.items.growth.desc'), icon_name: "PlusCircleIcon" },
    ];

    return (
        <section className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="lg:text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight">
                            {t('after_handover.title')}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
                            {t('after_handover.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>
                <AnimatedSection stagger>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 stagger-container">
                        {supportItems.map(item => (
                            <div key={item.title} className="fancy-card bg-surface dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-md shadow-dark-text/5 dark:shadow-black/20 border-2 border-transparent hover:border-primary/50">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    {iconMap[item.icon_name] || <LifebuoyIcon />}
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-dark-text dark:text-light-text">{item.title}</h3>
                                <p className="mt-2 text-dark-text/70 dark:text-light-text/70">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
