import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, FileSearch, Download, TrendingUp, Globe, Shield, Smartphone, Zap, Loader2 } from 'lucide-react';

interface AuditIssue {
  category: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  recommendation?: string;
  resource?: string;
}

interface AuditResult {
  url: string;
  score: number;
  maxScore: number;
  timestamp: Date;
  issues: AuditIssue[];
  warnings: AuditIssue[];
  passes: AuditIssue[];
}

interface SEOAuditReportProps {
  language?: 'de' | 'en';
  url?: string;
  autoRun?: boolean;
  onAuditComplete?: (result: AuditResult) => void;
}

export const SEOAuditReport: React.FC<SEOAuditReportProps> = ({
  language = 'de',
  url: initialUrl = '',
  autoRun = false,
  onAuditComplete
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [progress, setProgress] = useState(0);

  const t = {
    de: {
      title: 'SEO Audit Bericht',
      description: 'Umfassende SEO-Analyse für deine Website',
      urlLabel: 'Website URL',
      urlPlaceholder: 'https://example.com',
      startAudit: 'Audit starten',
      downloadReport: 'Bericht herunterladen',
      auditing: 'Auditing läuft...',
      overallScore: 'Gesamtpunktzahl',
      criticalIssues: 'Kritische Probleme',
      warnings: 'Warnungen',
      passedChecks: 'Bestandene Prüfungen',
      performance: 'Leistung',
      mobile: 'Mobile-Freundlichkeit',
      security: 'Sicherheit',
      technical: 'Technisch',
      content: 'Inhalt',
      recommendations: 'Empfehlungen',
      noIssues: 'Keine Probleme gefunden',
      auditComplete: 'Audit abgeschlossen',
      errorAuditing: 'Fehler beim Audit',
      invalidUrl: 'Ungültige URL',
      categories: {
        performance: 'Leistung',
        mobile: 'Mobile',
        security: 'Sicherheit',
        ssl: 'SSL/HTTPS',
        meta: 'Meta-Tags',
        headings: 'Überschriften',
        images: 'Bilder',
        links: 'Links',
        speed: 'Geschwindigkeit',
        accessibility: 'Barrierefreiheit'
      }
    },
    en: {
      title: 'SEO Audit Report',
      description: 'Comprehensive SEO analysis for your website',
      urlLabel: 'Website URL',
      urlPlaceholder: 'https://example.com',
      startAudit: 'Start Audit',
      downloadReport: 'Download Report',
      auditing: 'Auditing...',
      overallScore: 'Overall Score',
      criticalIssues: 'Critical Issues',
      warnings: 'Warnings',
      passedChecks: 'Passed Checks',
      performance: 'Performance',
      mobile: 'Mobile-Friendly',
      security: 'Security',
      technical: 'Technical',
      content: 'Content',
      recommendations: 'Recommendations',
      noIssues: 'No issues found',
      auditComplete: 'Audit complete',
      errorAuditing: 'Error auditing',
      invalidUrl: 'Invalid URL',
      categories: {
        performance: 'Performance',
        mobile: 'Mobile',
        security: 'Security',
        ssl: 'SSL/HTTPS',
        meta: 'Meta Tags',
        headings: 'Headings',
        images: 'Images',
        links: 'Links',
        speed: 'Speed',
        accessibility: 'Accessibility'
      }
    }
  };

  const labels = t[language];

  useEffect(() => {
    if (autoRun && url) {
      handleAudit();
    }
  }, []);

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const simulateAudit = async (auditUrl: string): Promise<AuditResult> => {
    const issues: AuditIssue[] = [];
    const warnings: AuditIssue[] = [];
    const passes: AuditIssue[] = [];
    let score = 0;
    const maxScore = 100;

    // Simulate progressive checks
    const steps = [
      { check: 'SSL', delay: 500 },
      { check: 'Meta Tags', delay: 800 },
      { check: 'Performance', delay: 1200 },
      { check: 'Mobile', delay: 1000 },
      { check: 'Headings', delay: 600 },
      { check: 'Images', delay: 700 },
      { check: 'Links', delay: 500 },
      { check: 'Speed', delay: 900 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // SSL Check
    if (auditUrl.startsWith('https://')) {
      passes.push({
        category: labels.categories.ssl,
        message: 'SSL certificate is valid',
        severity: 'info'
      });
      score += 15;
    } else {
      issues.push({
        category: labels.categories.ssl,
        message: 'Website is not using HTTPS',
        severity: 'critical',
        recommendation: 'Install an SSL certificate to secure your website and improve search rankings'
      });
    }

    // Performance simulation
    const performanceScore = Math.floor(Math.random() * 30) + 50;
    if (performanceScore < 60) {
      warnings.push({
        category: labels.categories.performance,
        message: `Performance score is ${performanceScore}/100`,
        severity: 'warning',
        recommendation: 'Optimize images, minify CSS/JS, and enable compression'
      });
      score += 5;
    } else if (performanceScore < 80) {
      warnings.push({
        category: labels.categories.performance,
        message: `Performance score is ${performanceScore}/100`,
        severity: 'warning',
        recommendation: 'Further optimization can improve user experience'
      });
      score += 10;
    } else {
      passes.push({
        category: labels.categories.performance,
        message: `Performance score is ${performanceScore}/100`,
        severity: 'info'
      });
      score += 15;
    }

    // Mobile friendliness
    const mobileFriendly = Math.random() > 0.3;
    if (mobileFriendly) {
      passes.push({
        category: labels.categories.mobile,
        message: 'Website is mobile-friendly',
        severity: 'info'
      });
      score += 15;
    } else {
      issues.push({
        category: labels.categories.mobile,
        message: 'Website is not mobile-friendly',
        severity: 'critical',
        recommendation: 'Implement responsive design and optimize for mobile devices'
      });
    }

    // Meta tags simulation
    if (Math.random() > 0.4) {
      passes.push({
        category: labels.categories.meta,
        message: 'Meta tags are properly configured',
        severity: 'info'
      });
      score += 10;
    } else {
      warnings.push({
        category: labels.categories.meta,
        message: 'Missing or incomplete meta tags',
        severity: 'warning',
        recommendation: 'Add title, description, and Open Graph tags to all pages'
      });
      score += 5;
    }

    // Headings structure
    if (Math.random() > 0.3) {
      passes.push({
        category: labels.categories.headings,
        message: 'Proper heading structure found',
        severity: 'info'
      });
      score += 10;
    } else {
      warnings.push({
        category: labels.categories.headings,
        message: 'Heading structure could be improved',
        severity: 'warning',
        recommendation: 'Use H1 for main title, H2-H6 for subheadings in hierarchy'
      });
      score += 5;
    }

    // Images
    const hasAltText = Math.random() > 0.4;
    if (hasAltText) {
      passes.push({
        category: labels.categories.images,
        message: 'Images have alt text',
        severity: 'info'
      });
      score += 10;
    } else {
      warnings.push({
        category: labels.categories.images,
        message: 'Some images missing alt text',
        severity: 'warning',
        recommendation: 'Add descriptive alt text to all images for accessibility and SEO'
      });
      score += 5;
    }

    // Links
    const brokenLinks = Math.random() > 0.8;
    if (!brokenLinks) {
      passes.push({
        category: labels.categories.links,
        message: 'No broken links detected',
        severity: 'info'
      });
      score += 10;
    } else {
      warnings.push({
        category: labels.categories.links,
        message: 'Some broken links found',
        severity: 'warning',
        recommendation: 'Fix broken internal and external links'
      });
      score += 5;
    }

    // Speed
    const loadTime = Math.floor(Math.random() * 3000) + 1000;
    if (loadTime < 2000) {
      passes.push({
        category: labels.categories.speed,
        message: `Page load time: ${Math.round(loadTime / 1000)}s (Good)`,
        severity: 'info'
      });
      score += 15;
    } else if (loadTime < 4000) {
      warnings.push({
        category: labels.categories.speed,
        message: `Page load time: ${Math.round(loadTime / 1000)}s (Needs improvement)`,
        severity: 'warning',
        recommendation: 'Optimize images and reduce server response time'
      });
      score += 8;
    } else {
      issues.push({
        category: labels.categories.speed,
        message: `Page load time: ${Math.round(loadTime / 1000)}s (Poor)`,
        severity: 'critical',
        recommendation: 'Significant optimization needed to improve load time'
      });
      score += 3;
    }

    return {
      url: auditUrl,
      score,
      maxScore,
      timestamp: new Date(),
      issues,
      warnings,
      passes
    };
  };

  const handleAudit = async () => {
    if (!url.trim() || !isValidUrl(url)) {
      alert(labels.invalidUrl);
      return;
    }

    setIsAuditing(true);
    setProgress(0);
    setAuditResult(null);

    try {
      const result = await simulateAudit(url);
      setAuditResult(result);
      if (onAuditComplete) {
        onAuditComplete(result);
      }
    } catch (error) {
      console.error('Audit error:', error);
      alert(labels.errorAuditing);
    } finally {
      setIsAuditing(false);
      setProgress(100);
    }
  };

  const handleDownload = () => {
    if (!auditResult) return;

    const report = {
      url: auditResult.url,
      score: auditResult.score,
      maxScore: auditResult.maxScore,
      percentage: Math.round((auditResult.score / auditResult.maxScore) * 100),
      timestamp: auditResult.timestamp.toISOString(),
      criticalIssues: auditResult.issues,
      warnings: auditResult.warnings,
      passedChecks: auditResult.passes
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `seo-audit-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score: number): string => {
    if (score >= 80) return 'from-green-500/20 to-green-600/20 border-green-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    return 'from-red-500/20 to-red-600/20 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <FileSearch className="w-6 h-6 text-blue-400" />
          {labels.title}
        </h3>
        <p className="text-gray-400">{labels.description}</p>
      </div>

      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={labels.urlPlaceholder}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAudit()}
          />
          <button
            onClick={handleAudit}
            disabled={isAuditing || !url}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAuditing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {labels.auditing}
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                {labels.startAudit}
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isAuditing && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{labels.auditing}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Audit Results */}
      <AnimatePresence>
        {auditResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <div className={`bg-gradient-to-br ${getScoreBackground(auditResult.score)} backdrop-blur-lg rounded-2xl p-8 border-2`}>
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(auditResult.score)} mb-2`}>
                  {auditResult.score}
                </div>
                <div className="text-gray-300 text-lg mb-4">
                  {labels.overallScore}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{auditResult.issues.length}</div>
                    <div className="text-sm text-gray-400">{labels.criticalIssues}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{auditResult.warnings.length}</div>
                    <div className="text-sm text-gray-400">{labels.warnings}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{auditResult.passes.length}</div>
                    <div className="text-sm text-gray-400">{labels.passedChecks}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues */}
            {auditResult.issues.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  {labels.criticalIssues} ({auditResult.issues.length})
                </h4>
                <div className="space-y-3">
                  {auditResult.issues.map((issue, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">{issue.message}</div>
                          <div className="text-sm text-gray-400">{issue.category}</div>
                          {issue.recommendation && (
                            <div className="mt-2 text-sm text-blue-400">{issue.recommendation}</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {auditResult.warnings.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  {labels.warnings} ({auditResult.warnings.length})
                </h4>
                <div className="space-y-3">
                  {auditResult.warnings.map((warning, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">{warning.message}</div>
                          <div className="text-sm text-gray-400">{warning.category}</div>
                          {warning.recommendation && (
                            <div className="mt-2 text-sm text-blue-400">{warning.recommendation}</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Passed Checks */}
            {auditResult.passes.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {labels.passedChecks} ({auditResult.passes.length})
                </h4>
                <div className="space-y-3">
                  {auditResult.passes.map((pass, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">{pass.message}</div>
                          <div className="text-sm text-gray-400">{pass.category}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {labels.downloadReport}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
