// ============================================
// TWITTER CARDS - CARD TYPE SELECTOR
// ============================================

import React from 'react';
import { TwitterCardType } from '../types';
import { TWITTER_CARD_TYPE_DESCRIPTIONS } from '../constants';
import { TwitterCardTranslations } from '../translations';

interface CardTypeSelectorProps {
  currentType: TwitterCardType;
  onSelectType: (type: TwitterCardType) => void;
  translations: TwitterCardTranslations;
}

export const CardTypeSelector: FC<CardTypeSelectorProps> = ({
  currentType,
  onSelectType,
  translations,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {translations.cardTypeLabel}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(translations.cardTypes).map(([type, description]) => (
          <button
            key={type}
            onClick={() => onSelectType(type as TwitterCardType)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              currentType === type
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="font-semibold text-white mb-1">{type.replace('_', ' ')}</div>
            <div className="text-xs text-gray-400">{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
