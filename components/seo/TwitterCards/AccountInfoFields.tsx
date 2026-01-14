// ============================================
// TWITTER CARDS - ACCOUNT INFO FIELDS
// ============================================

import React from 'react';
import { TwitterCardData } from '../types';
import { TwitterCardTranslations } from '../translations';

interface AccountInfoFieldsProps {
  cardData: TwitterCardData;
  translations: TwitterCardTranslations;
  onChange: (field: keyof TwitterCardData, value: string) => void;
}

export const AccountInfoFields: React.FC<AccountInfoFieldsProps> = ({
  cardData,
  translations,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.siteLabel}
        </label>
        <input
          type="text"
          value={cardData.site}
          onChange={(e) => onChange('site', e.target.value)}
          placeholder={translations.sitePlaceholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.siteIdLabel}
        </label>
        <input
          type="text"
          value={cardData.siteId}
          onChange={(e) => onChange('siteId', e.target.value)}
          placeholder="123456"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.creatorLabel}
        </label>
        <input
          type="text"
          value={cardData.creator}
          onChange={(e) => onChange('creator', e.target.value)}
          placeholder={translations.creatorPlaceholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {translations.creatorIdLabel}
        </label>
        <input
          type="text"
          value={cardData.creatorId}
          onChange={(e) => onChange('creatorId', e.target.value)}
          placeholder="789012"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
