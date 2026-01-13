import type { ReactNode } from 'react';
import { DocumentArrowDownIcon, ClipboardDocumentCheckIcon, PaintBrushIcon, AnimatedSection } from './index';
import { useLanguage } from '../contexts';

const iconMap: { [key: string]: ReactNode } = {
  'ClipboardDocumentCheckIcon': <ClipboardDocumentCheckIcon />,
  'PaintBrushIcon': <PaintBrushIcon />,
  'DocumentArrowDownIcon': <DocumentArrowDownIcon />,
};

export const ResourcesSection = () => {
  const { t } = useLanguage();

  const resources = [
    { id: 1, icon_name: "ClipboardDocumentCheckIcon", title: t('resources_section.items.checklist.title'), description: t('resources_section.items.checklist.desc'), is_available: true },
    { id: 2, icon_name: "PaintBrushIcon", title: t('resources_section.items.briefing.title'), description: t('resources_section.items.briefing.desc'), is_available: true },
    { id: 3, icon_name: "DocumentArrowDownIcon", title: t('resources_section.items.guide.title'), description: t('resources_section.items.guide.desc'), is_available: true },
  ];

  return (
    <section id="ressourcen" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight">
              {t('resources_section.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
              {t('resources_section.subtitle')}
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection stagger>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-container">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="fancy-card group bg-surface dark:bg-dark-surface rounded-2xl shadow-md shadow-dark-text/5 dark:shadow-black/20 p-8 flex flex-col border-2 border-transparent hover:border-primary/50"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  {iconMap[resource.icon_name] || <DocumentArrowDownIcon />}
                </div>
                <div className="flex-grow mt-6">
                  <h3 className="text-xl font-semibold text-dark-text dark:text-light-text">{resource.title}</h3>
                  <p className="mt-2 text-dark-text/70 dark:text-light-text/70">{resource.description}</p>
                </div>
                <div className="mt-6">
                   <button
                    disabled
                    title={t('resources_section.download_available_soon')}
                    className="inline-flex items-center gap-2 text-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed group-hover:underline"
                  >
                    {t('resources_section.btn_download')}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
