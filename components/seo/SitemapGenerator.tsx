import { useState } from 'react';
import { motion } from '@/lib/motion';
import { generateSitemap, type SitemapEntry } from '../../lib/seo';

interface SitemapGeneratorProps {
  language?: 'de' | 'en';
}

export const SitemapGenerator: React.FC<SitemapGeneratorProps> = ({ language = 'de' }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [entries, setEntries] = useState<SitemapEntry[]>([
    { url: '/', changeFrequency: 'weekly', priority: 1.0 }
  ]);
  const [generatedSitemap, setGeneratedSitemap] = useState('');

  const t = {
    de: {
      title: 'Sitemap Generator',
      description: 'Erstelle XML-Sitemaps für deine Website',
      baseUrlLabel: 'Base URL',
      baseUrlPlaceholder: 'https://deine-website.de',
      addUrlBtn: 'URL hinzufügen',
      generateBtn: 'Sitemap Generieren',
      copyBtn: 'XML Kopieren',
      downloadBtn: 'Herunterladen',
      urlLabel: 'URL Pfad',
      urlPlaceholder: '/seite',
      priorityLabel: 'Priorität',
      changeFrequencyLabel: 'Häufigkeit',
      removeBtn: 'Entfernen',
      lastModifiedLabel: 'Zuletzt bearbeitet',
      frequencies: {
        always: 'Immer',
        hourly: 'Stündlich',
        daily: 'Täglich',
        weekly: 'Wöchentlich',
        monthly: 'Monatlich',
        yearly: 'Jährlich',
        never: 'Nie'
      },
      preview: 'Vorschau',
      noEntries: 'Keine Einträge',
      urls: 'URLs'
    },
    en: {
      title: 'Sitemap Generator',
      description: 'Create XML sitemaps for your website',
      baseUrlLabel: 'Base URL',
      baseUrlPlaceholder: 'https://your-website.com',
      addUrlBtn: 'Add URL',
      generateBtn: 'Generate Sitemap',
      copyBtn: 'Copy XML',
      downloadBtn: 'Download',
      urlLabel: 'URL Path',
      urlPlaceholder: '/page',
      priorityLabel: 'Priority',
      changeFrequencyLabel: 'Change Frequency',
      removeBtn: 'Remove',
      lastModifiedLabel: 'Last Modified',
      frequencies: {
        always: 'Always',
        hourly: 'Hourly',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly',
        never: 'Never'
      },
      preview: 'Preview',
      noEntries: 'No entries',
      urls: 'URLs'
    }
  };

  const labels = t[language];

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        url: '',
        changeFrequency: 'weekly',
        priority: 0.5
      }
    ]);
  };

  const updateEntry = (index: number, field: keyof SitemapEntry, value: string | number) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    const sitemap = generateSitemap(entries, baseUrl);
    setGeneratedSitemap(sitemap);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSitemap);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedSitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{labels.title}</h3>
        <p className="text-gray-400">{labels.description}</p>
        <p className="text-sm text-gray-500 mt-2">{entries.length} {labels.urls}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        {/* Base URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {labels.baseUrlLabel}
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder={labels.baseUrlPlaceholder}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Entries */}
        <div className="space-y-4 mb-6">
          {entries.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-400">
                  {labels.urlLabel} #{index + 1}
                </span>
                {entries.length > 1 && (
                  <button
                    onClick={() => removeEntry(index)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    {labels.removeBtn}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {labels.urlLabel}
                  </label>
                  <input
                    type="text"
                    value={entry.url}
                    onChange={(e) => updateEntry(index, 'url', e.target.value)}
                    placeholder={labels.urlPlaceholder}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {labels.priorityLabel}
                  </label>
                  <select
                    value={entry.priority}
                    onChange={(e) => updateEntry(index, 'priority', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="1.0" className="bg-gray-900">1.0 - {language === 'de' ? 'Höchste' : 'Highest'}</option>
                    <option value="0.9" className="bg-gray-900">0.9</option>
                    <option value="0.8" className="bg-gray-900">0.8</option>
                    <option value="0.7" className="bg-gray-900">0.7</option>
                    <option value="0.6" className="bg-gray-900">0.6</option>
                    <option value="0.5" className="bg-gray-900">0.5 - {language === 'de' ? 'Normal' : 'Normal'}</option>
                    <option value="0.4" className="bg-gray-900">0.4</option>
                    <option value="0.3" className="bg-gray-900">0.3</option>
                    <option value="0.2" className="bg-gray-900">0.2</option>
                    <option value="0.1" className="bg-gray-900">0.1 - {language === 'de' ? 'Niedrigste' : 'Lowest'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {labels.changeFrequencyLabel}
                  </label>
                  <select
                    value={entry.changeFrequency}
                    onChange={(e) => updateEntry(index, 'changeFrequency', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {Object.entries(labels.frequencies).map(([key, value]) => (
                      <option key={key} value={key} className="bg-gray-900">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {labels.lastModifiedLabel}
                  </label>
                  <input
                    type="date"
                    value={entry.lastModified ? entry.lastModified.toISOString().split('T')[0] : ''}
                    onChange={(e) => updateEntry(index, 'lastModified', e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {labels.noEntries}
            </div>
          )}
        </div>

        {/* Add URL Button */}
        <button
          onClick={addEntry}
          className="w-full py-3 px-6 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 mb-4"
        >
          + {labels.addUrlBtn}
        </button>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!baseUrl || entries.length === 0}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {labels.generateBtn}
        </button>
      </motion.div>

      {/* Generated Sitemap */}
      {generatedSitemap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">{labels.preview}</h4>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {labels.copyBtn}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                {labels.downloadBtn}
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto max-h-96">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {generatedSitemap}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};
