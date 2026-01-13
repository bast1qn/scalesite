import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateMetaTags, type SEOMetadata, type MetaTag } from '../../lib/seo';

interface MetaTagGeneratorProps {
  language?: 'de' | 'en';
}

export const MetaTagGenerator: React.FC<MetaTagGeneratorProps> = ({ language = 'de' }) => {
  const [metadata, setMetadata] = useState<SEOMetadata>({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonical: '',
    noindex: false,
    nofollow: false
  });

  const [generatedTags, setGeneratedTags] = useState<MetaTag[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const t = {
    de: {
      title: 'Meta Tag Generator',
      description: 'Erstelle optimierte Meta-Tags für deine Website',
      titleLabel: 'Seitentitel',
      titlePlaceholder: 'Deine Seite | ScaleSite (50-60 Zeichen)',
      descriptionLabel: 'Meta-Beschreibung',
      descriptionPlaceholder: 'Beschreibe deine Seite in 150-160 Zeichen...',
      keywordsLabel: 'Keywords (optional)',
      keywordsPlaceholder: 'keyword1, keyword2, keyword3',
      ogTitleLabel: 'OG Titel (optional)',
      ogDescriptionLabel: 'OG Beschreibung (optional)',
      ogImageLabel: 'OG Bild URL (optional)',
      twitterCardLabel: 'Twitter Card Typ',
      canonicalLabel: 'Canonical URL (optional)',
      robotsLabel: 'Robots Meta Tags',
      noindex: 'No Index',
      nofollow: 'No Follow',
      generateBtn: 'Meta Tags Generieren',
      copyBtn: 'HTML Kopieren',
      previewBtn: 'Vorschau',
      hidePreviewBtn: 'Vorschau Ausblenden',
      generatedTags: 'Generierte Tags',
      characterCount: 'Zeichen',
      optimalLength: 'Optimale Länge: 50-60 Zeichen',
      optimalDescLength: 'Optimale Länge: 150-160 Zeichen'
    },
    en: {
      title: 'Meta Tag Generator',
      description: 'Create optimized meta tags for your website',
      titleLabel: 'Page Title',
      titlePlaceholder: 'Your Page | ScaleSite (50-60 chars)',
      descriptionLabel: 'Meta Description',
      descriptionPlaceholder: 'Describe your page in 150-160 characters...',
      keywordsLabel: 'Keywords (optional)',
      keywordsPlaceholder: 'keyword1, keyword2, keyword3',
      ogTitleLabel: 'OG Title (optional)',
      ogDescriptionLabel: 'OG Description (optional)',
      ogImageLabel: 'OG Image URL (optional)',
      twitterCardLabel: 'Twitter Card Type',
      canonicalLabel: 'Canonical URL (optional)',
      robotsLabel: 'Robots Meta Tags',
      noindex: 'No Index',
      nofollow: 'No Follow',
      generateBtn: 'Generate Meta Tags',
      copyBtn: 'Copy HTML',
      previewBtn: 'Preview',
      hidePreviewBtn: 'Hide Preview',
      generatedTags: 'Generated Tags',
      characterCount: 'characters',
      optimalLength: 'Optimal length: 50-60 characters',
      optimalDescLength: 'Optimal length: 150-160 characters'
    }
  };

  const labels = t[language];

  const handleGenerate = () => {
    const tags = generateMetaTags(metadata);
    setGeneratedTags(tags);
    setShowPreview(true);
  };

  const handleCopy = () => {
    const html = generatedTags.map(tag => {
      if (tag.name) {
        return `<meta name="${tag.name}" content="${tag.content}" />`;
      } else if (tag.property) {
        return `<meta property="${tag.property}" content="${tag.content}" />`;
      } else if (tag.httpEquiv) {
        return `<meta http-equiv="${tag.httpEquiv}" content="${tag.content}" />`;
      }
      return '';
    }).join('\n');

    navigator.clipboard.writeText(html);
  };

  const getTagHtml = (tag: MetaTag): string => {
    if (tag.name) {
      return `<meta name="${tag.name}" content="${tag.content}" />`;
    } else if (tag.property) {
      return `<meta property="${tag.property}" content="${tag.content}" />`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{labels.title}</h3>
        <p className="text-gray-400">{labels.description}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.titleLabel}
              <span className="ml-2 text-xs text-gray-500">
                ({metadata.title.length} {labels.characterCount})
              </span>
            </label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              placeholder={labels.titlePlaceholder}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">{labels.optimalLength}</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.descriptionLabel}
              <span className="ml-2 text-xs text-gray-500">
                ({metadata.description.length} {labels.characterCount})
              </span>
            </label>
            <textarea
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              placeholder={labels.descriptionPlaceholder}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">{labels.optimalDescLength}</p>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.keywordsLabel}
            </label>
            <input
              type="text"
              value={metadata.keywords}
              onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
              placeholder={labels.keywordsPlaceholder}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Open Graph */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg font-semibold text-white mb-4">Open Graph</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.ogTitleLabel}
                </label>
                <input
                  type="text"
                  value={metadata.ogTitle}
                  onChange={(e) => setMetadata({ ...metadata, ogTitle: e.target.value })}
                  placeholder={labels.titleLabel}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.ogDescriptionLabel}
                </label>
                <input
                  type="text"
                  value={metadata.ogDescription}
                  onChange={(e) => setMetadata({ ...metadata, ogDescription: e.target.value })}
                  placeholder={labels.descriptionLabel}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.ogImageLabel}
                </label>
                <input
                  type="url"
                  value={metadata.ogImage}
                  onChange={(e) => setMetadata({ ...metadata, ogImage: e.target.value })}
                  placeholder="https://example.com/og-image.jpg"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg font-semibold text-white mb-4">Twitter Card</h4>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {labels.twitterCardLabel}
              </label>
              <select
                value={metadata.twitterCard}
                onChange={(e) => setMetadata({ ...metadata, twitterCard: e.target.value as 'summary' | 'summary_large_image' | 'app' | 'player' })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="summary" className="bg-gray-900">Summary</option>
                <option value="summary_large_image" className="bg-gray-900">Summary Large Image</option>
                <option value="app" className="bg-gray-900">App</option>
                <option value="player" className="bg-gray-900">Player</option>
              </select>
            </div>
          </div>

          {/* Canonical URL */}
          <div className="border-t border-white/10 pt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.canonicalLabel}
            </label>
            <input
              type="url"
              value={metadata.canonical}
              onChange={(e) => setMetadata({ ...metadata, canonical: e.target.value })}
              placeholder="https://example.com/page"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Robots */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg font-semibold text-white mb-4">{labels.robotsLabel}</h4>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={metadata.noindex}
                  onChange={(e) => setMetadata({ ...metadata, noindex: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500"
                />
                {labels.noindex}
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={metadata.nofollow}
                  onChange={(e) => setMetadata({ ...metadata, nofollow: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500"
                />
                {labels.nofollow}
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            {labels.generateBtn}
          </button>
        </div>
      </motion.div>

      {/* Generated Tags */}
      {showPreview && generatedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">{labels.generatedTags}</h4>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {labels.copyBtn}
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                {labels.hidePreviewBtn}
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {generatedTags.map((tag, index) => (
                <div key={index} className="mb-1">
                  {getTagHtml(tag)}
                </div>
              ))}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};
