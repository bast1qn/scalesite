// ============================================
// OPEN GRAPH TAGS - ARTICLE INFO FIELDS
// ============================================

import React from 'react';
import { OpenGraphData } from '../types';
import { OpenGraphTranslations } from '../translations';

interface ArticleInfoFieldsProps {
  ogData: OpenGraphData;
  translations: OpenGraphTranslations;
  onChange: (field: keyof OpenGraphData, value: string | string[]) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  onTagChange: (index: number, value: string) => void;
}

export const ArticleInfoFields: React.FC<ArticleInfoFieldsProps> = ({
  ogData,
  translations,
  onChange,
  onAddTag,
  onRemoveTag,
  onTagChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.articleAuthorLabel}
        </label>
        <input
          type="text"
          value={ogData.articleAuthor || ''}
          onChange={(e) => onChange('articleAuthor', e.target.value)}
          placeholder="Max Mustermann"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {translations.articlePublishedLabel}
          </label>
          <input
            type="datetime-local"
            value={ogData.articlePublishedTime || ''}
            onChange={(e) => onChange('articlePublishedTime', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {translations.articleModifiedLabel}
          </label>
          <input
            type="datetime-local"
            value={ogData.articleModifiedTime || ''}
            onChange={(e) => onChange('articleModifiedTime', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.articleSectionLabel}
        </label>
        <input
          type="text"
          value={ogData.articleSection || ''}
          onChange={(e) => onChange('articleSection', e.target.value)}
          placeholder="Technology"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.articleTagLabel}
        </label>
        <div className="space-y-2">
          {(ogData.articleTag || []).map((tag, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => onTagChange(index, e.target.value)}
                placeholder="Tag"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => onRemoveTag(index)}
                className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                {translations.removeTag}
              </button>
            </div>
          ))}
          <button
            onClick={onAddTag}
            className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
          >
            {translations.addTag}
          </button>
        </div>
      </div>
    </div>
  );
};
