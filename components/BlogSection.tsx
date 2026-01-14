
import { useMemo } from 'react';
import { ArrowRightIcon, CalendarDaysIcon, ClockIcon, AnimatedSection } from './index';
import { useLanguage } from '../contexts';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  gradient: string;
  image: string;
}

export const BlogSection = () => {
  const { t } = useLanguage();

  // Memoize blogPosts array to prevent recreation on every render
  const blogPosts = useMemo<BlogPost[]>(() => [
    {
      id: '1',
      title: 'Website-Optimierung: 5 Tipps für bessere Performance',
      excerpt: 'Lernen Sie, wie Sie Ihre Website schneller und effizienter machen können mit diesen bewährten Methoden.',
      category: 'Performance',
      date: '12. Jan 2025',
      readTime: '5 min',
      gradient: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'KI-gestütztes Webdesign: Die Zukunft ist jetzt',
      excerpt: 'Entdecken Sie, wie künstliche Intelligenz das Webdesign revolutioniert und Ihre Arbeit erleichtert.',
      category: 'KI & Technologie',
      date: '10. Jan 2025',
      readTime: '7 min',
      gradient: 'from-violet-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'Mobile-First Design: Warum es wichtig ist',
      excerpt: 'Warum Mobile-First Design keine Option mehr, sondern eine Notwendigkeit für moderne Websites ist.',
      category: 'Design',
      date: '8. Jan 2025',
      readTime: '4 min',
      gradient: 'from-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop'
    }
  ], []); // Empty dependency array - this data never changes

  return (
    <section className="py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/4 via-violet-400/3 to-indigo-400/2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] bg-gradient-to-br from-violet-400/3 via-purple-400/2 to-pink-400/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 border border-violet-200/60 dark:border-violet-800/30 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              Blog
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Aktuelle Artikel
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tipps, Tutorials und Einblicke in die Welt des Webdesigns und der Automatisierung.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 card-hover focus-within:ring-2 focus-within:ring-primary-500/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  ></div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-2 min-h-8 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-white shadow-lg group-hover:scale-105 active:scale-95 transition-transform duration-300`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-violet-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Read more link */}
                  <div className="flex items-center text-sm font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0">
                    <span>Weiterlesen</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Gradient line on bottom (appears on hover) */}
                <div className={`absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r ${post.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full transform scale-x-0 group-hover:scale-x-100`}></div>
              </article>
            ))}
          </div>
        </AnimatedSection>

        {/* View all link */}
        <AnimatedSection>
          <div className="text-center mt-12">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Alle Artikel ansehen</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Memoize BlogSection to prevent unnecessary re-renders
export const BlogSectionMemo = BlogSection;
