import { useState } from 'react';
import { motion } from '@/lib/motion'; // ✅ PERFORMANCE: Use centralized import for tree-shaking
import { MetaTagGenerator, SitemapGenerator, RobotsEditor, SEOScore } from '../components/seo';
import { useLanguage } from '../contexts';

const SEOPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'meta' | 'sitemap' | 'robots' | 'score'>('meta');

  const t = {
    de: {
      title: 'SEO Tools',
      subtitle: 'Optimiere deine Website für Suchmaschinen',
      tabs: {
        meta: 'Meta Tags',
        sitemap: 'Sitemap',
        robots: 'Robots.txt',
        score: 'SEO Score'
      }
    },
    en: {
      title: 'SEO Tools',
      subtitle: 'Optimize your website for search engines',
      tabs: {
        meta: 'Meta Tags',
        sitemap: 'Sitemap',
        robots: 'Robots.txt',
        score: 'SEO Score'
      }
    }
  };

  const labels = t[language as 'de' | 'en'];

  const tabs = [
    { id: 'meta' as const, label: labels.tabs.meta },
    { id: 'sitemap' as const, label: labels.tabs.sitemap },
    { id: 'robots' as const, label: labels.tabs.robots },
    { id: 'score' as const, label: labels.tabs.score }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {labels.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {labels.subtitle}
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'meta' && <MetaTagGenerator language={language as 'de' | 'en'} />}
            {activeTab === 'sitemap' && <SitemapGenerator language={language as 'de' | 'en'} />}
            {activeTab === 'robots' && <RobotsEditor language={language as 'de' | 'en'} />}
            {activeTab === 'score' && <SEOScore language={language as 'de' | 'en'} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SEOPage;
