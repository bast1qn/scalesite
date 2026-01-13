import type { ReactNode } from 'react';
import { SnailIcon, NoMobileIcon, LightBulbIcon, AnimatedSection } from './index';
import { useLanguage } from '../contexts';

const iconMap: { [key: string]: ReactNode } = {
  'SnailIcon': <SnailIcon />,
  'NoMobileIcon': <NoMobileIcon />,
  'LightBulbIcon': <LightBulbIcon />,
};

export const CommonErrors = () => {
  const { t } = useLanguage();

  const commonErrors = [
    { id: 1, name: t('common_errors.items.load_time.name'), description: t('common_errors.items.load_time.desc'), icon_name: "SnailIcon" },
    { id: 2, name: t('common_errors.items.mobile.name'), description: t('common_errors.items.mobile.desc'), icon_name: "NoMobileIcon" },
    { id: 3, name: t('common_errors.items.message.name'), description: t('common_errors.items.message.desc'), icon_name: "LightBulbIcon" },
  ];

  return (
    <AnimatedSection>
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight">
                {t('common_errors.title')}
              </h2>
              <p className="mt-4 text-lg text-dark-text/70 dark:text-light-text/70">
                {t('common_errors.subtitle')}
              </p>
            </div>
            <div className="space-y-8">
              {commonErrors.map((error) => (
                <div key={error.name} className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    {iconMap[error.icon_name] || <LightBulbIcon />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text dark:text-light-text">
                      {error.name}
                    </h3>
                    <p className="mt-1 text-dark-text/70 dark:text-light-text/70">
                      {error.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};
