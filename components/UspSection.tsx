
import React from 'react';
import { ChatBubbleBottomCenterTextIcon, CheckBadgeIcon, ReactIcon, RocketLaunchIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: { [key: string]: React.ReactNode } = {
  'ChatBubbleBottomCenterTextIcon': <ChatBubbleBottomCenterTextIcon />,
  'CheckBadgeIcon': <CheckBadgeIcon />,
  'ReactIcon': <ReactIcon className="w-6 h-6 text-primary" />,
  'RocketLaunchIcon': <RocketLaunchIcon />,
};

export const UspSection: React.FC = () => {
  const { t } = useLanguage();

  const usps = [
      { id: 1, name: t('usps.items.personal.name'), description: t('usps.items.personal.desc'), icon_name: "ChatBubbleBottomCenterTextIcon" },
      { id: 2, name: t('usps.items.quality.name'), description: t('usps.items.quality.desc'), icon_name: "CheckBadgeIcon" },
      { id: 3, name: t('usps.items.tech.name'), description: t('usps.items.tech.desc'), icon_name: "ReactIcon" },
      { id: 4, name: t('usps.items.goals.name'), description: t('usps.items.goals.desc'), icon_name: "RocketLaunchIcon" },
  ];

  return (
    <section className="py-24 sm:py-32 bg-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight">
              {t('usps.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
              {t('usps.subtitle')}
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection stagger>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 stagger-container">
            {usps.map((usp) => (
              <div key={usp.name} className="text-center p-6">
                <div className="inline-flex flex-shrink-0 w-16 h-16 bg-light-bg dark:bg-dark-bg text-primary rounded-full items-center justify-center">
                  {iconMap[usp.icon_name] || <CheckBadgeIcon />}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-dark-text dark:text-light-text">
                  {usp.name}
                </h3>
                <p className="mt-2 text-dark-text/70 dark:text-light-text/70">
                  {usp.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
