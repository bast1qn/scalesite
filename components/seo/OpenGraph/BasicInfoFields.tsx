// ============================================
// OPEN GRAPH TAGS - BASIC INFO FIELDS
// ============================================

import React from 'react';
import { Link, AlertCircle } from 'lucide-react';
import { OpenGraphData } from '../types';
import { OG_LOCALE_OPTIONS } from '../constants';
import { OpenGraphTranslations } from '../translations';

interface BasicInfoFieldsProps {
  ogData: OpenGraphData;
  errors: Record<string, string>;
  translations: OpenGraphTranslations;
  onChange: (field: keyof OpenGraphData, value: string | string[]) => void;
}

export const BasicInfoFields: FC<BasicInfoFieldsProps> = ({
  ogData,
  errors,
  translations,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.titleLabel}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={ogData.ogTitle}
          onChange={(e) => onChange('ogTitle', e.target.value)}
          placeholder={translations.titlePlaceholder}
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
          {translations.typeLabel}
        </label>
        <select
          value={ogData.ogType}
          onChange={(e) => onChange('ogType', e.target.value as OpenGraphData['ogType'])}
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
          {translations.urlLabel}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="url"
          value={ogData.ogUrl}
          onChange={(e) => onChange('ogUrl', e.target.value)}
          placeholder={translations.urlPlaceholder}
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
          {translations.descriptionLabel}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={ogData.ogDescription}
          onChange={(e) => onChange('ogDescription', e.target.value)}
          placeholder={translations.descriptionPlaceholder}
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
          {translations.siteNameLabel}
        </label>
        <input
          type="text"
          value={ogData.ogSiteName}
          onChange={(e) => onChange('ogSiteName', e.target.value)}
          placeholder={translations.siteNamePlaceholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Locale */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.localeLabel}
        </label>
        <select
          value={ogData.ogLocale}
          onChange={(e) => onChange('ogLocale', e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {OG_LOCALE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-900">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
