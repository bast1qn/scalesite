// ============================================
// OPEN GRAPH TAGS - MEDIA FIELDS
// ============================================

import React from 'react';
import { Image, AlertCircle } from '@/lib/icons';
import { OpenGraphData } from '../types';
import { OpenGraphTranslations } from '../translations';
import { getSafeURL } from '../../../lib/validation';

interface MediaFieldsProps {
  ogData: OpenGraphData;
  errors: Record<string, string>;
  translations: OpenGraphTranslations;
  onChange: (field: keyof OpenGraphData, value: string) => void;
}

export const MediaFields: FC<MediaFieldsProps> = ({
  ogData,
  errors,
  translations,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.imageLabel}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="url"
          value={ogData.ogImage}
          onChange={(e) => onChange('ogImage', e.target.value)}
          placeholder={translations.imagePlaceholder}
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
              src={getSafeURL(ogData.ogImage) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23374151" width="400" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EInvalid Image URL%3C/text%3E%3C/svg%3E'}
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
          {translations.audioLabel}
        </label>
        <input
          type="url"
          value={ogData.ogAudio || ''}
          onChange={(e) => onChange('ogAudio', e.target.value)}
          placeholder="https://example.com/audio.mp3"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Video */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.videoLabel}
        </label>
        <input
          type="url"
          value={ogData.ogVideo || ''}
          onChange={(e) => onChange('ogVideo', e.target.value)}
          placeholder="https://example.com/video.mp4"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
