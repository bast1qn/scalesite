import { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { calculateSEOScore, type SEOScoreResult } from '../../lib/seo';

interface SEOScoreProps {
  language?: 'de' | 'en';
}

export const SEOScore: React.FC<SEOScoreProps> = ({ language = 'de' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [headingsInput, setHeadingsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<SEOScoreResult | null>(null);

  const t = {
    de: {
      title: 'SEO Score Analyzer',
      description: 'Analysiere deine Seite auf SEO-Optimierung',
      analyzeBtn: 'Analysieren',
      titleLabel: 'Seitentitel',
      titlePlaceholder: 'Deine Seite | ScaleSite',
      descriptionLabel: 'Meta-Beschreibung',
      descriptionPlaceholder: 'Beschreibe deine Seite...',
      contentLabel: 'Inhalt',
      contentPlaceholder: 'Füge den Hauptinhalt deiner Seite hier ein...',
      headingsLabel: 'Überschriften (eine pro Zeile: Level|Text)',
      headingsPlaceholder: '1|Hauptüberschrift\n2|Unterüberschrift',
      imagesLabel: 'Bilder (eine pro Zeile: Alt|Src)',
      imagesPlaceholder: 'Bild Beschreibung|image.jpg',
      urlLabel: 'URL (optional)',
      urlPlaceholder: 'https://deine-website.de/seite',
      score: 'SEO-Score',
      issues: 'Kritische Probleme',
      warnings: 'Warnungen',
      passes: 'Bestanden',
      recommendation: 'Empfehlung',
      noIssues: 'Keine kritischen Probleme',
      noWarnings: 'Keine Warnungen',
      category: 'Kategorie',
      message: 'Nachricht',
      severity: 'Dringlichkeit',
      critical: 'Kritisch',
      warning: 'Warnung',
      info: 'Info'
    },
    en: {
      title: 'SEO Score Analyzer',
      description: 'Analyze your page for SEO optimization',
      analyzeBtn: 'Analyze',
      titleLabel: 'Page Title',
      titlePlaceholder: 'Your Page | ScaleSite',
      descriptionLabel: 'Meta Description',
      descriptionPlaceholder: 'Describe your page...',
      contentLabel: 'Content',
      contentPlaceholder: 'Paste the main content of your page here...',
      headingsLabel: 'Headings (one per line: Level|Text)',
      headingsPlaceholder: '1|Main Heading\n2|Sub Heading',
      imagesLabel: 'Images (one per line: Alt|Src)',
      imagesPlaceholder: 'Image description|image.jpg',
      urlLabel: 'URL (optional)',
      urlPlaceholder: 'https://your-website.com/page',
      score: 'SEO Score',
      issues: 'Critical Issues',
      warnings: 'Warnings',
      passes: 'Passed Checks',
      recommendation: 'Recommendation',
      noIssues: 'No critical issues',
      noWarnings: 'No warnings',
      category: 'Category',
      message: 'Message',
      severity: 'Severity',
      critical: 'Critical',
      warning: 'Warning',
      info: 'Info'
    }
  };

  const labels = t[language];

  const handleAnalyze = () => {
    // Parse headings
    const headings = headingsInput
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [level, ...textParts] = line.split('|');
        return {
          level: parseInt(level) || 1,
          text: textParts.join('|').trim()
        };
      })
      .filter(h => h.text);

    // Parse images
    const images = imagesInput
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [alt, src] = line.split('|');
        return {
          alt: alt?.trim(),
          src: src?.trim()
        };
      });

    const scoreResult = calculateSEOScore({
      title: title || undefined,
      description: description || undefined,
      content: content || undefined,
      headings: headings.length > 0 ? headings : undefined,
      images: images.length > 0 ? images : undefined,
      url: url || undefined
    });

    setResult(scoreResult);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    if (percentage >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
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
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={labels.titlePlaceholder}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.descriptionLabel}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={labels.descriptionPlaceholder}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.contentLabel}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={labels.contentPlaceholder}
              rows={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Headings */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.headingsLabel}
            </label>
            <textarea
              value={headingsInput}
              onChange={(e) => setHeadingsInput(e.target.value)}
              placeholder={labels.headingsPlaceholder}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.imagesLabel}
            </label>
            <textarea
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              placeholder={labels.imagesPlaceholder}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.urlLabel}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={labels.urlPlaceholder}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            {labels.analyzeBtn}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Score Overview */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBackground(result.percentage)} shadow-lg mb-4`}>
                <span className={`text-4xl font-bold text-white`}>
                  {result.percentage}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {result.score} / {result.maxScore}
              </h3>
              <p className={`text-lg font-semibold ${getScoreColor(result.percentage)}`}>
                {result.percentage >= 80 ? language === 'de' ? 'Ausgezeichnet' : 'Excellent' :
                 result.percentage >= 60 ? language === 'de' ? 'Gut' : 'Good' :
                 result.percentage >= 40 ? language === 'de' ? 'Akzeptabel' : 'Fair' :
                 language === 'de' ? 'Verbesserungsbedarf' : 'Needs Improvement'}
              </p>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  {labels.issues} ({result.issues.length})
                </h4>
                <div className="space-y-3">
                  {result.issues.map((issue, index) => (
                    <motion.div
                      key={`${issue.category}-${issue.message}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-red-500/5 rounded-lg p-4 border border-red-500/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-red-300">
                          {issue.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">
                          {labels.critical}
                        </span>
                      </div>
                      <p className="text-white mb-2">{issue.message}</p>
                      {issue.recommendation && (
                        <p className="text-sm text-gray-400">
                          <strong>{labels.recommendation}:</strong> {issue.recommendation}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/20">
                <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  {labels.warnings} ({result.warnings.length})
                </h4>
                <div className="space-y-3">
                  {result.warnings.map((warning, index) => (
                    <motion.div
                      key={`${warning.category}-${warning.message}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-300">
                          {warning.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                          {labels.warning}
                        </span>
                      </div>
                      <p className="text-white mb-2">{warning.message}</p>
                      {warning.recommendation && (
                        <p className="text-sm text-gray-400">
                          <strong>{labels.recommendation}:</strong> {warning.recommendation}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Passes */}
            {result.passes.length > 0 && (
              <div className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20">
                <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  {labels.passes} ({result.passes.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.passes.map((pass, index) => (
                    <motion.div
                      key={`${pass.category}-${pass.message}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/5 rounded-lg p-3 border border-green-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-sm font-medium text-green-300">
                          {pass.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-6">{pass.message}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
