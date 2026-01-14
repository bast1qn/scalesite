// ============================================
// OPEN GRAPH TAGS COMPONENT - REFACTORED
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Image, Eye } from 'lucide-react';
import {
  OpenGraphData,
  OpenGraphType,
} from './types';
import {
  INITIAL_OG_DATA,
  DEFAULT_OG_TYPE,
  DEFAULT_OG_LOCALE,
  OG_DETERMINER_OPTIONS,
} from './constants';
import { OG_TRANSLATIONS, OpenGraphTranslations } from './translations';
import {
  generateOpenGraphTags,
  isValidUrl,
  validateRequiredField,
  validateUrlField,
} from './utils';
import { BasicInfoFields } from './OpenGraph/BasicInfoFields';
import { MediaFields } from './OpenGraph/MediaFields';
import { ArticleInfoFields } from './OpenGraph/ArticleInfoFields';
import { OGGeneratedPreview } from './OpenGraph/GeneratedPreview';

// ============================================
// TYPES
// ============================================

export interface OpenGraphTagsProps {
  language?: 'de' | 'en';
  initialData?: Partial<OpenGraphData>;
  onDataChange?: (data: OpenGraphData) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

// ============================================
// MAIN COMPONENT
// ============================================

export const OpenGraphTags: React.FC<OpenGraphTagsProps> = ({
  language = 'de',
  initialData,
  onDataChange,
  variant = 'default'
}) => {
  // State
  const [ogData, setOgData] = useState<OpenGraphData>({
    ogTitle: initialData?.ogTitle || '',
    ogType: initialData?.ogType || DEFAULT_OG_TYPE,
    ogUrl: initialData?.ogUrl || '',
    ogImage: initialData?.ogImage || '',
    ogDescription: initialData?.ogDescription || '',
    ogSiteName: initialData?.ogSiteName || '',
    ogLocale: initialData?.ogLocale || DEFAULT_OG_LOCALE,
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Translations
  const labels: OpenGraphTranslations = OG_TRANSLATIONS[language];

  // Validation
  const validateField = (name: string, value: string): string | null => {
    if (name === 'ogTitle' && !validateRequiredField(value)) {
      return labels.errors.titleRequired;
    }

    if (name === 'ogUrl') {
      if (!validateRequiredField(value)) {
        return labels.errors.urlRequired;
      }
      if (!isValidUrl(value)) {
        return labels.errors.urlInvalid;
      }
    }

    if (name === 'ogImage' && !validateRequiredField(value)) {
      return labels.errors.imageRequired;
    }

    if (name === 'ogDescription' && !validateRequiredField(value)) {
      return labels.errors.descriptionRequired;
    }

    return null;
  };

  // Event Handlers
  const handleChange = (field: keyof OpenGraphData, value: string | string[]) => {
    const updated = { ...ogData, [field]: value };
    setOgData(updated);

    if (field !== 'articleTag') {
      const error = validateField(field, value as string);
      if (error) {
        setErrors({ ...errors, [field]: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
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

  const handleClear = () => {
    setOgData({
      ogTitle: '',
      ogType: DEFAULT_OG_TYPE,
      ogUrl: '',
      ogImage: '',
      ogDescription: '',
      ogSiteName: '',
      ogLocale: DEFAULT_OG_LOCALE,
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

  const generateTags = () => {
    return generateOpenGraphTags(ogData);
  };

  // Conditional Rendering Flags
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';
  const isArticleType = ogData.ogType === 'article';

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
            <BasicInfoFields
              ogData={ogData}
              errors={errors}
              translations={labels}
              onChange={handleChange}
            />
          </div>

          {/* Media */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              {labels.media}
            </h4>
            <MediaFields
              ogData={ogData}
              errors={errors}
              translations={labels}
              onChange={handleChange}
            />
          </div>

          {/* Article Info (only for article type) */}
          {isArticleType && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{labels.articleInfo}</h4>
              <ArticleInfoFields
                ogData={ogData}
                translations={labels}
                onChange={handleChange}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                onTagChange={handleTagChange}
              />
            </div>
          )}

          {/* Advanced Options (detailed variant) */}
          {isDetailed && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{labels.advanced}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.determinerLabel}
                </label>
                <select
                  value={ogData.ogDeterminer || ''}
                  onChange={(e) => handleChange('ogDeterminer', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {OG_DETERMINER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
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

      {/* Generated Preview */}
      <OGGeneratedPreview
        generateTags={generateTags}
        showPreview={showPreview}
        labels={{
          generated: labels.generated,
          copyBtn: labels.copyBtn,
          downloadBtn: labels.downloadBtn,
        }}
      />
    </div>
  );
};

export default OpenGraphTags;
