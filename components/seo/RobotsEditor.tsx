import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateRobotsTxt, type RobotsRule } from '../../lib/seo';

interface RobotsEditorProps {
  language?: 'de' | 'en';
}

export const RobotsEditor: React.FC<RobotsEditorProps> = ({ language = 'de' }) => {
  const [rules, setRules] = useState<RobotsRule[]>([
    {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/admin', '/api'],
      crawlDelay: undefined
    }
  ]);
  const [sitemap, setSitemap] = useState('');
  const [generatedRobots, setGeneratedRobots] = useState('');

  const t = {
    de: {
      title: 'Robots.txt Editor',
      description: 'Erstelle und bearbeite deine robots.txt Datei',
      addRuleBtn: 'Regel hinzufügen',
      generateBtn: 'Robots.txt Generieren',
      copyBtn: 'Kopieren',
      downloadBtn: 'Herunterladen',
      userAgentLabel: 'User-Agent',
      userAgentPlaceholder: '* (alle Bots) oder Googlebot',
      allowLabel: 'Erlaubte Pfade',
      disallowLabel: 'Blockierte Pfade',
      addPathBtn: '+ Pfad',
      removeBtn: 'Entfernen',
      crawlDelayLabel: 'Crawl-Delay (Sekunden)',
      sitemapLabel: 'Sitemap URL (optional)',
      sitemapPlaceholder: 'https://deine-website.de/sitemap.xml',
      preview: 'Vorschau',
      paths: 'Pfade',
      allBots: 'Alle Bots (*)',
      googleBot: 'Googlebot',
      bingBot: 'Bingbot'
    },
    en: {
      title: 'Robots.txt Editor',
      description: 'Create and edit your robots.txt file',
      addRuleBtn: 'Add Rule',
      generateBtn: 'Generate Robots.txt',
      copyBtn: 'Copy',
      downloadBtn: 'Download',
      userAgentLabel: 'User-Agent',
      userAgentPlaceholder: '* (all bots) or Googlebot',
      allowLabel: 'Allowed Paths',
      disallowLabel: 'Blocked Paths',
      addPathBtn: '+ Path',
      removeBtn: 'Remove',
      crawlDelayLabel: 'Crawl Delay (seconds)',
      sitemapLabel: 'Sitemap URL (optional)',
      sitemapPlaceholder: 'https://your-website.com/sitemap.xml',
      preview: 'Preview',
      paths: 'Paths',
      allBots: 'All Bots (*)',
      googleBot: 'Googlebot',
      bingBot: 'Bingbot'
    }
  };

  const labels = t[language];

  const addRule = () => {
    setRules([
      ...rules,
      {
        userAgent: '*',
        allow: [],
        disallow: [],
        crawlDelay: undefined
      }
    ]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: keyof RobotsRule, value: string | number | string[] | undefined) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const addPath = (ruleIndex: number, type: 'allow' | 'disallow') => {
    const newRules = [...rules];
    const rule = { ...newRules[ruleIndex] };

    if (type === 'allow') {
      rule.allow = [...rule.allow, ''];
    } else {
      rule.disallow = [...rule.disallow, ''];
    }

    newRules[ruleIndex] = rule;
    setRules(newRules);
  };

  const updatePath = (ruleIndex: number, type: 'allow' | 'disallow', pathIndex: number, value: string) => {
    const newRules = [...rules];
    const rule = { ...newRules[ruleIndex] };

    if (type === 'allow') {
      rule.allow = [...rule.allow];
      rule.allow[pathIndex] = value;
    } else {
      rule.disallow = [...rule.disallow];
      rule.disallow[pathIndex] = value;
    }

    newRules[ruleIndex] = rule;
    setRules(newRules);
  };

  const removePath = (ruleIndex: number, type: 'allow' | 'disallow', pathIndex: number) => {
    const newRules = [...rules];
    const rule = { ...newRules[ruleIndex] };

    if (type === 'allow') {
      rule.allow = rule.allow.filter((_, i) => i !== pathIndex);
    } else {
      rule.disallow = rule.disallow.filter((_, i) => i !== pathIndex);
    }

    newRules[ruleIndex] = rule;
    setRules(newRules);
  };

  const handleGenerate = () => {
    // Add sitemap to first rule if provided
    const rulesWithSitemap = sitemap
      ? [{ ...rules[0], sitemap }, ...rules.slice(1)]
      : rules;

    const robots = generateRobotsTxt(rulesWithSitemap);
    setGeneratedRobots(robots);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedRobots);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedRobots], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {rules.map((rule, ruleIndex) => (
          <motion.div
            key={ruleIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-white">
                {labels.userAgentLabel} #{ruleIndex + 1}
              </h4>
              {rules.length > 1 && (
                <button
                  onClick={() => removeRule(ruleIndex)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  {labels.removeBtn}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* User-Agent */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.userAgentLabel}
                </label>
                <select
                  value={rule.userAgent}
                  onChange={(e) => updateRule(ruleIndex, 'userAgent', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="*" className="bg-gray-900">{labels.allBots}</option>
                  <option value="Googlebot" className="bg-gray-900">{labels.googleBot}</option>
                  <option value="Bingbot" className="bg-gray-900">{labels.bingBot}</option>
                </select>
              </div>

              {/* Allow Paths */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {labels.allowLabel}
                  </label>
                  <button
                    onClick={() => addPath(ruleIndex, 'allow')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {labels.addPathBtn}
                  </button>
                </div>
                <div className="space-y-2">
                  {rule.allow.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={path}
                        onChange={(e) => updatePath(ruleIndex, 'allow', pathIndex, e.target.value)}
                        placeholder="/pfad"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {rule.allow.length > 0 && (
                        <button
                          onClick={() => removePath(ruleIndex, 'allow', pathIndex)}
                          className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {rule.allow.length === 0 && (
                    <div className="text-sm text-gray-500 italic">
                      {language === 'de' ? 'Keine erlaubten Pfade' : 'No allowed paths'}
                    </div>
                  )}
                </div>
              </div>

              {/* Disallow Paths */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {labels.disallowLabel}
                  </label>
                  <button
                    onClick={() => addPath(ruleIndex, 'disallow')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {labels.addPathBtn}
                  </button>
                </div>
                <div className="space-y-2">
                  {rule.disallow.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={path}
                        onChange={(e) => updatePath(ruleIndex, 'disallow', pathIndex, e.target.value)}
                        placeholder="/geheimer-pfad"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {rule.disallow.length > 0 && (
                        <button
                          onClick={() => removePath(ruleIndex, 'disallow', pathIndex)}
                          className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {rule.disallow.length === 0 && (
                    <div className="text-sm text-gray-500 italic">
                      {language === 'de' ? 'Keine blockierten Pfade' : 'No blocked paths'}
                    </div>
                  )}
                </div>
              </div>

              {/* Crawl Delay */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.crawlDelayLabel}
                </label>
                <input
                  type="number"
                  value={rule.crawlDelay || ''}
                  onChange={(e) => updateRule(ruleIndex, 'crawlDelay', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="10"
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Rule Button */}
        <button
          onClick={addRule}
          className="w-full py-3 px-6 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
        >
          + {labels.addRuleBtn}
        </button>

        {/* Sitemap */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {labels.sitemapLabel}
          </label>
          <input
            type="url"
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder={labels.sitemapPlaceholder}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
        >
          {labels.generateBtn}
        </button>
      </motion.div>

      {/* Generated Robots.txt */}
      {generatedRobots && (
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

          <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {generatedRobots}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};
