
import React, { useState, useMemo } from 'react';
import { ArrowTopRightOnSquareIcon, EyeIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface ShowcaseSectionProps {
  setCurrentPage: (page: string) => void;
  title?: string;
  subtitle?: string;
}

// Static showcase items
const staticShowcaseItems = [
  {
    id: 'restaurant',
    title: 'Café & Bistro',
    category: 'Gastronomie',
    excerpt: 'Moderne Website für ein lokales Café mit Speisekarte, Reservierungsformular und Galerie.',
    image_url: '',
    route: 'restaurant',
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    id: 'architecture',
    title: 'Richter Architekten',
    category: 'Architektur',
    excerpt: 'Minimalistisches Portfolio für ein Architekturbüro mit filterbarer Projekt-Galerie.',
    image_url: '',
    route: 'architecture',
    gradient: 'from-slate-400 to-slate-600'
  },
  {
    id: 'realestate',
    title: 'Premium Immobilien',
    category: 'Immobilien',
    excerpt: 'Immobilien-Website mit Suchfiltern, Property Cards und Besichtigungs-Anfrage.',
    image_url: '',
    route: 'realestate',
    gradient: 'from-blue-400 to-blue-600'
  }
];

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  setCurrentPage,
  title,
  subtitle
}) => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState(t('showcase.filter_all'));

  const items = useMemo(() => {
    const showcaseData = translations[language].showcase_items as Array<{
      id: number;
      title: string;
      category: string;
      excerpt: string;
      image_url: string;
    }>;
    return showcaseData;
  }, [language]);

  // Combine static items with database items
  const allItems = useMemo(() => {
    return [...staticShowcaseItems, ...items.map(item => ({ ...item, route: 'preise' }))];
  }, [items]);

  const categories = useMemo(() => {
    const cats = [t('showcase.filter_all'), ...Array.from(new Set(allItems.map(item => item.category)))];
    return cats;
  }, [allItems, t]);

  const displayTitle = title || t('showcase.title');
  const displaySubtitle = subtitle || t('showcase.subtitle');

  const filteredItems = allItems.filter(item =>
    activeFilter === t('showcase.filter_all') || item.category === activeFilter
  );

  return (
    <section className="py-24 sm:py-32 bg-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight">
              {displayTitle}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
              {displaySubtitle}
            </p>
          </div>
        </AnimatedSection>

        {allItems.length > 0 ? (
            <>
                <div className="my-12 flex justify-center flex-wrap gap-3">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`filter-btn px-6 py-2.5 font-semibold rounded-full border transition-all duration-300 ${
                                activeFilter === category
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105'
                                : 'bg-surface dark:bg-dark-surface border-dark-text/10 dark:border-light-text/10 text-dark-text/70 dark:text-light-text/70 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <AnimatedSection stagger key={activeFilter}>
                <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-container">
                    {filteredItems.map((item: any) => (
                    <div
                        key={item.id}
                        className="fancy-card group bg-light-bg dark:bg-dark-bg rounded-3xl shadow-lg shadow-dark-text/5 dark:shadow-black/30 overflow-hidden flex flex-col border-2 border-transparent hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
                    >
                        <div className="aspect-video w-full overflow-hidden relative">
                            {(item as any).gradient ? (
                                <div className={`w-full h-full bg-gradient-to-br ${(item as any).gradient}`}></div>
                            ) : (
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                    decoding="async"
                                />
                            )}
                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                <button onClick={() => setCurrentPage((item as any).route || 'preise')} className="bg-white text-slate-900 font-bold py-3 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                                    <EyeIcon className="w-5 h-5" />
                                    {t('showcase.view_btn')}
                                </button>
                            </div>
                        </div>
                        <div className="p-6 sm:p-8 flex flex-col flex-grow relative">
                            <div className="flex-grow">
                                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider">
                                    {item.category}
                                </span>
                                <h3 className="mt-4 text-2xl font-bold text-dark-text dark:text-light-text">{item.title}</h3>
                                <p className="mt-3 text-dark-text/70 dark:text-light-text/70 leading-relaxed">{item.excerpt}</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setCurrentPage((item as any).route || 'preise')}
                                    className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all"
                                >
                                {t('showcase.details_btn')}
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                </AnimatedSection>
            </>
        ) : (
            <div className="mt-16 text-center py-20 bg-light-bg dark:bg-dark-bg rounded-3xl border-2 border-dashed border-dark-text/10 dark:border-light-text/10 relative overflow-hidden">
                 <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                 <div className="relative z-10">
                    <p className="text-2xl font-bold text-dark-text dark:text-light-text mb-2">{t('showcase.loading')}</p>
                    <p className="text-dark-text/60 dark:text-light-text/60 max-w-md mx-auto">{t('showcase.loading_sub')}</p>
                    <div className="mt-8 flex justify-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </section>
  );
};
