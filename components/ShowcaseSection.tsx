
import { useState, useMemo, useCallback, memo } from 'react';
import { ArrowTopRightOnSquareIcon, EyeIcon, AnimatedSection } from './index';
import { useLanguage } from '../contexts';
import { translations } from '../lib/translations';

interface ShowcaseSectionProps {
  setCurrentPage: (page: string) => void;
  title?: string;
  subtitle?: string;
}

interface ShowcaseItem {
  id: string | number;
  title: string;
  category: string;
  excerpt: string;
  image_url?: string;
  route?: string;
  gradient?: string;
}

// Static showcase items
const staticShowcaseItems: ShowcaseItem[] = [
  {
    id: 'restaurant',
    title: 'The Coffee House',
    category: 'Restaurant',
    excerpt: 'Modern café website with menu, reservations, and photo gallery.',
    image_url: '',
    route: 'restaurant',
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    id: 'architecture',
    title: 'Richter Architects',
    category: 'Architecture',
    excerpt: 'Minimalist portfolio with filterable project gallery and team section.',
    image_url: '',
    route: 'architecture',
    gradient: 'from-slate-400 to-slate-600'
  },
  {
    id: 'realestate',
    title: 'Premium Properties',
    category: 'Real Estate',
    excerpt: 'Property listings with search filters, detail views, and viewing requests.',
    image_url: '',
    route: 'realestate',
    gradient: 'from-blue-400 to-blue-600'
  }
];

export const ShowcaseSection = ({
  setCurrentPage,
  title,
  subtitle
}: ShowcaseSectionProps) => {
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

  const filteredItems = useMemo(() => {
    return allItems.filter(item =>
      activeFilter === t('showcase.filter_all') || item.category === activeFilter
    );
  }, [allItems, activeFilter, t]);

  const displayTitle = title || t('showcase.title');
  const displaySubtitle = subtitle || t('showcase.subtitle');

  // Memoize filter handler to prevent inline function creation in loop
  const handleFilterChange = useCallback((category: string) => {
    setActiveFilter(category);
  }, []);

  // Memoize ShowcaseItem card component to prevent unnecessary re-renders
  const ShowcaseItemCard = memo(({ item, setCurrentPage, t }: {
    item: typeof allItems[0];
    setCurrentPage: (page: string) => void;
    t: (key: string) => string;
  }) => (
    <div className="fancy-card group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-premium overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400/60 dark:hover:border-violet-500/60 hover:shadow-premium-lg hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
      <div className="aspect-video w-full overflow-hidden relative">
        {item.gradient ? (
          <div className={`w-full h-full bg-gradient-to-br ${item.gradient} group-hover:scale-[1.02] transition-transform duration-700`}></div>
        ) : (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
          <button onClick={() => setCurrentPage(item.route || 'preise')} className="bg-white text-slate-900 font-bold py-4 px-8 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] btn-micro-press relative overflow-hidden group/btn-2">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover/btn-2:opacity-20 transition-opacity duration-500"></span>
            <EyeIcon className="w-5 h-5" />
            {t('showcase.view_btn')}
          </button>
        </div>
        <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
      </div>
      <div className="p-7 flex flex-col flex-grow relative">
        <div className="absolute inset-0 card-shimmer rounded-b-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"></div>
        <div className="flex-grow relative z-10">
          <span className="text-xs font-bold bg-gradient-to-r from-blue-500/15 to-violet-500/15 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full uppercase tracking-wider-plus border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
            {item.category}
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white font-serif group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 transition-all duration-300">{item.title}</h3>
          <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed-plus text-sm">{item.excerpt}</p>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
          <button
            onClick={() => setCurrentPage(item.route || 'preise')}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-violet-400 font-bold group-hover:gap-3 transition-all hover:text-blue-700 dark:hover:text-violet-300"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              {t('showcase.details_btn')}
            </span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-[1.02]" />
          </button>
        </div>
      </div>
    </div>
  ));
  ShowcaseItemCard.displayName = 'ShowcaseItemCard';

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none noise-bg"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 via-violet-400/6 to-indigo-400/4 rounded-full blur-3xl animate-morph-blob"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-violet-400/6 via-purple-400/4 to-pink-400/3 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200/60 dark:border-blue-800/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider-plus mb-8 shadow-premium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {t('showcase.portfolio')}
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight-plus">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:300%_auto] animate-gradient-shimmer drop-shadow-sm">
                {displayTitle}
              </span>
            </h2>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed-plus">
              {displaySubtitle}
            </p>
          </div>
        </AnimatedSection>

        {allItems.length > 0 ? (
          <>
            <div className="mt-14 flex justify-center flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`filter-btn px-6 py-3 font-semibold rounded-2xl border-2 transition-all duration-300 ${
                    activeFilter === category
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-xl shadow-blue-500/25 scale-105'
                      : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-blue-300/50 dark:hover:border-violet-500/50 hover:bg-slate-50/80 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <AnimatedSection stagger key={activeFilter}>
              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-container">
                {filteredItems.map((item) => (
                  <ShowcaseItemCard
                    key={item.id}
                    item={item}
                    setCurrentPage={setCurrentPage}
                    t={t}
                  />
                ))}
              </div>
            </AnimatedSection>
          </>
        ) : (
          <div className="mt-16 text-center py-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-premium">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-serif">{t('showcase.loading')}</p>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed-plus">{t('showcase.loading_sub')}</p>
              <div className="mt-10 flex justify-center gap-3">
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full animate-bounce shadow-lg shadow-blue-500/30"></span>
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full animate-bounce shadow-lg shadow-blue-500/30" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full animate-bounce shadow-lg shadow-blue-500/30" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowcaseSection;