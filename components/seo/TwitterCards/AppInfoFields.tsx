// ============================================
// TWITTER CARDS - APP INFO FIELDS
// ============================================

import React from 'react';
import { TwitterCardData } from '../types';
import { TwitterCardTranslations } from '../translations';

interface AppInfoFieldsProps {
  cardData: TwitterCardData;
  translations: TwitterCardTranslations;
  onChange: (field: keyof TwitterCardData, value: string) => void;
}

export const AppInfoFields: FC<AppInfoFieldsProps> = ({
  cardData,
  translations,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {/* iPhone App */}
      <div className="p-4 bg-white/5 rounded-lg">
        <h5 className="font-semibold text-white mb-3">iPhone</h5>
        <div className="space-y-3">
          <input
            type="text"
            value={cardData.iphoneName}
            onChange={(e) => onChange('iphoneName', e.target.value)}
            placeholder={translations.iphoneNameLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={cardData.iphoneId}
            onChange={(e) => onChange('iphoneId', e.target.value)}
            placeholder={translations.iphoneIdLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={cardData.iphoneUrl}
            onChange={(e) => onChange('iphoneUrl', e.target.value)}
            placeholder={translations.iphoneUrlLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* iPad App */}
      <div className="p-4 bg-white/5 rounded-lg">
        <h5 className="font-semibold text-white mb-3">iPad</h5>
        <div className="space-y-3">
          <input
            type="text"
            value={cardData.ipadName}
            onChange={(e) => onChange('ipadName', e.target.value)}
            placeholder={translations.ipadNameLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={cardData.ipadId}
            onChange={(e) => onChange('ipadId', e.target.value)}
            placeholder={translations.ipadIdLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={cardData.ipadUrl}
            onChange={(e) => onChange('ipadUrl', e.target.value)}
            placeholder={translations.ipadUrlLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Google Play App */}
      <div className="p-4 bg-white/5 rounded-lg">
        <h5 className="font-semibold text-white mb-3">Google Play</h5>
        <div className="space-y-3">
          <input
            type="text"
            value={cardData.googlePlayName}
            onChange={(e) => onChange('googlePlayName', e.target.value)}
            placeholder={translations.googlePlayNameLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={cardData.googlePlayId}
            onChange={(e) => onChange('googlePlayId', e.target.value)}
            placeholder={translations.googlePlayIdLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={cardData.googlePlayUrl}
            onChange={(e) => onChange('googlePlayUrl', e.target.value)}
            placeholder={translations.googlePlayUrlLabel}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
