import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Image, Link, Eye, Copy, Download } from 'lucide-react';

interface OpenGraphData {
  ogTitle: string;
  ogType: 'website' | 'article' | 'book' | 'profile';
  ogUrl: string;
  ogImage: string;
  ogDescription: string;
  ogSiteName: string;
  ogLocale: string;
  ogAudio?: string;
  ogVideo?: string;
  ogDeterminer?: string;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTag?: string[];
}

interface OpenGraphTagsProps {
  language?: 'de' | 'en';
  initialData?: Partial<OpenGraphData>;
  onDataChange?: (data: OpenGraphData) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export const OpenGraphTags: React.FC<OpenGraphTagsProps> = ({
  language = 'de',
  initialData,
  onDataChange,
  variant = 'default'
}) => {
  const [ogData, setOgData] = useState<OpenGraphData>({
    ogTitle: initialData?.ogTitle || '',
    ogType: initialData?.ogType || 'website',
    ogUrl: initialData?.ogUrl || '',
    ogImage: initialData?.ogImage || '',
    ogDescription: initialData?.ogDescription || '',
    ogSiteName: initialData?.ogSiteName || '',
    ogLocale: initialData?.ogLocale || 'de_DE',
    ogAudio: initialData?.ogAudio || '',
    ogVideo: initialData?.ogVideo || '',
    ogDeterminer: initialData?.ogDeterminer || '',
    articleAuthor: initialData?.articleAuthor || '',
    articlePublishedTime: initialData?.articlePublishedTime || '',
    articleModifiedTime: initialData?.articleModifiedTime || '',
    articleSection: initialData?.articleSection || '',
    articleTag: initialData?.articleTag || []
  });

  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = {
    de: {
      title: 'Open Graph Tags',
      description: 'Optimiere deine Seite für Social Media Plattformen',
      basicInfo: 'Grundlegende Informationen',
      media: 'Medien',
      articleInfo: 'Artikel-Informationen',
      advanced: 'Erweiterte Optionen',
      titleLabel: 'OG Titel',
      titlePlaceholder: 'Deine Seite | ScaleSite',
      typeLabel: 'OG Typ',
      urlLabel: 'OG URL',
      urlPlaceholder: 'https://example.com/page',
      imageLabel: 'OG Bild URL',
      imagePlaceholder: 'https://example.com/og-image.jpg',
      descriptionLabel: 'OG Beschreibung',
      descriptionPlaceholder: 'Beschreibe deine Seite in 1-2 Sätzen...',
      siteNameLabel: 'Seitenname',
      siteNamePlaceholder: 'ScaleSite',
      localeLabel: 'Sprache/Region',
      determinerLabel: 'Bestimmungswort',
      audioLabel: 'Audio URL (optional)',
      videoLabel: 'Video URL (optional)',
      articleAuthorLabel: 'Autor',
      articlePublishedLabel: 'Veröffentlichungsdatum',
      articleModifiedLabel: 'Zuletzt bearbeitet',
      articleSectionLabel: 'Sektion',
      articleTagLabel: 'Tags (kommagetrennt)',
      previewBtn: 'Vorschau',
      hidePreviewBtn: 'Ausblenden',
      copyBtn: 'Kopieren',
      downloadBtn: 'Herunterladen',
      generated: 'Generierte Tags',
      validate: 'Validieren',
      clear: 'Zurücksetzen',
      tags: 'Tags',
      addTag: 'Tag hinzufügen',
      removeTag: 'Tag entfernen',
      errors: {
        titleRequired: 'Titel ist erforderlich',
        urlRequired: 'URL ist erforderlich',
        urlInvalid: 'Ungültiges URL-Format',
        imageRequired: 'Bild ist erforderlich',
        descriptionRequired: 'Beschreibung ist erforderlich'
      }
    },
    en: {
      title: 'Open Graph Tags',
      description: 'Optimize your page for social media platforms',
      basicInfo: 'Basic Information',
      media: 'Media',
      articleInfo: 'Article Information',
      advanced: 'Advanced Options',
      titleLabel: 'OG Title',
      titlePlaceholder: 'Your Page | ScaleSite',
      typeLabel: 'OG Type',
      urlLabel: 'OG URL',
      urlPlaceholder: 'https://example.com/page',
      imageLabel: 'OG Image URL',
      imagePlaceholder: 'https://example.com/og-image.jpg',
      descriptionLabel: 'OG Description',
      descriptionPlaceholder: 'Describe your page in 1-2 sentences...',
      siteNameLabel: 'Site Name',
      siteNamePlaceholder: 'ScaleSite',
      localeLabel: 'Locale',
      determinerLabel: 'Determiner',
      audioLabel: 'Audio URL (optional)',
      videoLabel: 'Video URL (optional)',
      articleAuthorLabel: 'Author',
      articlePublishedLabel: 'Published Date',
      articleModifiedLabel: 'Last Modified',
      articleSectionLabel: 'Section',
      articleTagLabel: 'Tags (comma-separated)',
      previewBtn: 'Preview',
      hidePreviewBtn: 'Hide',
      copyBtn: 'Copy',
      downloadBtn: 'Download',
      generated: 'Generated Tags',
      validate: 'Validate',
      clear: 'Clear',
      tags: 'Tags',
      addTag: 'Add Tag',
      removeTag: 'Remove Tag',
      errors: {
        titleRequired: 'Title is required',
        urlRequired: 'URL is required',
        urlInvalid: 'Invalid URL format',
        imageRequired: 'Image is required',
        descriptionRequired: 'Description is required'
      }
    }
  };

  const labels = t[language];

  const validateField = (name: string, value: string): string | null => {
    if (name === 'ogTitle' && !value.trim()) {
      return labels.errors.titleRequired;
    }
    if (name === 'ogUrl' && !value.trim()) {
      return labels.errors.urlRequired;
    }
    if (name === 'ogUrl' && value && !isValidUrl(value)) {
      return labels.errors.urlInvalid;
    }
    if (name === 'ogImage' && !value.trim()) {
      return labels.errors.imageRequired;
    }
    if (name === 'ogDescription' && !value.trim()) {
      return labels.errors.descriptionRequired;
    }
    return null;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (field: keyof OpenGraphData, value: any) => {
    const updated = { ...ogData, [field]: value };
    setOgData(updated);

    const error = field !== 'articleTag' ? validateField(field, value as string) : null;
    if (error) {
      setErrors({ ...errors, [field]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    if (onDataChange) {
      onDataChange(updated);
    }
  };

  const handleAddTag = () => {
    const tags = [...(ogData.articleTag || []), ''];
    handleChange('articleTag', tags);
  };

  const handleRemoveTag = (index: number) => {
    const tags = (ogData.articleTag || []).filter((_, i) => i !== index);
    handleChange('articleTag', tags);
  };

  const handleTagChange = (index: number, value: string) => {
    const tags = [...(ogData.articleTag || [])];
    tags[index] = value;
    handleChange('articleTag', tags);
  };

  const generateTags = (): string[] => {
    const tags: string[] = [];

    if (ogData.ogTitle) tags.push(`<meta property="og:title" content="${ogData.ogTitle}" />`);
    tags.push(`<meta property="og:type" content="${ogData.ogType}" />`);
    if (ogData.ogUrl) tags.push(`<meta property="og:url" content="${ogData.ogUrl}" />`);
    if (ogData.ogImage) tags.push(`<meta property="og:image" content="${ogData.ogImage}" />`);
    if (ogData.ogDescription) tags.push(`<meta property="og:description" content="${ogData.ogDescription}" />`);
    if (ogData.ogSiteName) tags.push(`<meta property="og:site_name" content="${ogData.ogSiteName}" />`);
    if (ogData.ogLocale) tags.push(`<meta property="og:locale" content="${ogData.ogLocale}" />`);
    if (ogData.ogDeterminer) tags.push(`<meta property="og:determiner" content="${ogData.ogDeterminer}" />`);
    if (ogData.ogAudio) tags.push(`<meta property="og:audio" content="${ogData.ogAudio}" />`);
    if (ogData.ogVideo) tags.push(`<meta property="og:video" content="${ogData.ogVideo}" />`);

    if (ogData.ogType === 'article') {
      if (ogData.articleAuthor) tags.push(`<meta property="article:author" content="${ogData.articleAuthor}" />`);
      if (ogData.articlePublishedTime) tags.push(`<meta property="article:published_time" content="${ogData.articlePublishedTime}" />`);
      if (ogData.articleModifiedTime) tags.push(`<meta property="article:modified_time" content="${ogData.articleModifiedTime}" />`);
      if (ogData.articleSection) tags.push(`<meta property="article:section" content="${ogData.articleSection}" />`);
      (ogData.articleTag || []).forEach(tag => {
        if (tag) tags.push(`<meta property="article:tag" content="${tag}" />`);
      });
    }

    return tags;
  };

  const handleCopy = () => {
    const html = generateTags().join('\n');
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const html = generateTags().join('\n');
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opengraph-tags.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setOgData({
      ogTitle: '',
      ogType: 'website',
      ogUrl: '',
      ogImage: '',
      ogDescription: '',
      ogSiteName: '',
      ogLocale: 'de_DE',
      ogAudio: '',
      ogVideo: '',
      ogDeterminer: '',
      articleAuthor: '',
      articlePublishedTime: '',
      articleModifiedTime: '',
      articleSection: '',
      articleTag: []
    });
    setErrors({});
  };

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{labels.title}</h3>
        <p className="text-gray-400">{labels.description}</p>
      </div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Link className="w-5 h-5" />
              {labels.basicInfo}
            </h4>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.titleLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={ogData.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  placeholder={labels.titlePlaceholder}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.ogTitle ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.ogTitle && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ogTitle}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.typeLabel}
                </label>
                <select
                  value={ogData.ogType}
                  onChange={(e) => handleChange('ogType', e.target.value as OpenGraphData['ogType'])}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="website" className="bg-gray-900">Website</option>
                  <option value="article" className="bg-gray-900">Article</option>
                  <option value="book" className="bg-gray-900">Book</option>
                  <option value="profile" className="bg-gray-900">Profile</option>
                </select>
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.urlLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="url"
                  value={ogData.ogUrl}
                  onChange={(e) => handleChange('ogUrl', e.target.value)}
                  placeholder={labels.urlPlaceholder}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.ogUrl ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.ogUrl && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ogUrl}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.descriptionLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={ogData.ogDescription}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  placeholder={labels.descriptionPlaceholder}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.ogDescription ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                />
                {errors.ogDescription && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ogDescription}
                  </p>
                )}
              </div>

              {/* Site Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.siteNameLabel}
                </label>
                <input
                  type="text"
                  value={ogData.ogSiteName}
                  onChange={(e) => handleChange('ogSiteName', e.target.value)}
                  placeholder={labels.siteNamePlaceholder}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Locale */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.localeLabel}
                </label>
                <select
                  value={ogData.ogLocale}
                  onChange={(e) => handleChange('ogLocale', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="de_DE" className="bg-gray-900">Deutsch (Deutschland)</option>
                  <option value="de_AT" className="bg-gray-900">Deutsch (Österreich)</option>
                  <option value="de_CH" className="bg-gray-900">Deutsch (Schweiz)</option>
                  <option value="en_US" className="bg-gray-900">English (United States)</option>
                  <option value="en_GB" className="bg-gray-900">English (United Kingdom)</option>
                  <option value="fr_FR" className="bg-gray-900">Français (France)</option>
                  <option value="it_IT" className="bg-gray-900">Italiano (Italy)</option>
                  <option value="es_ES" className="bg-gray-900">Español (Spain)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              {labels.media}
            </h4>

            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.imageLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="url"
                  value={ogData.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  placeholder={labels.imagePlaceholder}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.ogImage ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.ogImage && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ogImage}
                  </p>
                )}
                {ogData.ogImage && !errors.ogImage && (
                  <div className="mt-2 p-2 bg-white/5 rounded border border-white/10">
                    <img
                      src={ogData.ogImage}
                      alt="OG Preview"
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23374151" width="400" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Audio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.audioLabel}
                </label>
                <input
                  type="url"
                  value={ogData.ogAudio}
                  onChange={(e) => handleChange('ogAudio', e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.videoLabel}
                </label>
                <input
                  type="url"
                  value={ogData.ogVideo}
                  onChange={(e) => handleChange('ogVideo', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Article Info (only show when type is article) */}
          {ogData.ogType === 'article' && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{labels.articleInfo}</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {labels.articleAuthorLabel}
                  </label>
                  <input
                    type="text"
                    value={ogData.articleAuthor}
                    onChange={(e) => handleChange('articleAuthor', e.target.value)}
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {labels.articlePublishedLabel}
                    </label>
                    <input
                      type="datetime-local"
                      value={ogData.articlePublishedTime}
                      onChange={(e) => handleChange('articlePublishedTime', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {labels.articleModifiedLabel}
                    </label>
                    <input
                      type="datetime-local"
                      value={ogData.articleModifiedTime}
                      onChange={(e) => handleChange('articleModifiedTime', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {labels.articleSectionLabel}
                  </label>
                  <input
                    type="text"
                    value={ogData.articleSection}
                    onChange={(e) => handleChange('articleSection', e.target.value)}
                    placeholder="Technology"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {labels.articleTagLabel}
                  </label>
                  <div className="space-y-2">
                    {(ogData.articleTag || []).map((tag, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          placeholder="Tag"
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          {labels.removeTag}
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddTag}
                      className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                    >
                      {labels.addTag}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced */}
          {isDetailed && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{labels.advanced}</h4>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.determinerLabel}
                </label>
                <select
                  value={ogData.ogDeterminer}
                  onChange={(e) => handleChange('ogDeterminer', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" className="bg-gray-900">None</option>
                  <option value="a" className="bg-gray-900">A</option>
                  <option value="an" className="bg-gray-900">An</option>
                  <option value="the" className="bg-gray-900">The</option>
                  <option value="auto" className="bg-gray-900">Auto</option>
                </select>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? labels.hidePreviewBtn : labels.previewBtn}
            </button>

            <button
              onClick={handleClear}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              {labels.clear}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Generated Tags Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {labels.generated}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? '✓' : labels.copyBtn}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {labels.downloadBtn}
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {generateTags().map((tag, index) => (
                  <div key={index} className="mb-1">
                    {tag}
                  </div>
                ))}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
