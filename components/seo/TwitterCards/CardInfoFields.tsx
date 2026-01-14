// ============================================
// TWITTER CARDS - CARD INFO FIELDS
// ============================================

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TwitterCardData, TwitterCardType } from '../types';
import { TwitterCardTranslations } from '../translations';

interface CardInfoFieldsProps {
  cardData: TwitterCardData;
  errors: Record<string, string>;
  uploadedImageUrl: string;
  translations: TwitterCardTranslations;
  onChange: (field: keyof TwitterCardData, value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export const CardInfoFields: FC<CardInfoFieldsProps> = ({
  cardData,
  errors,
  uploadedImageUrl,
  translations,
  onChange,
  onImageUpload,
  onRemoveImage,
}) => {
  const hasImage = uploadedImageUrl || cardData.image;
  const showImageFields = cardData.cardType === 'summary' || cardData.cardType === 'summary_large_image';
  const showPlayerFields = cardData.cardType === 'player';

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
          value={cardData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder={translations.titlePlaceholder}
          className={`w-full px-4 py-3 bg-white/5 border ${
            errors.title ? 'border-red-500' : 'border-white/10'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.title}
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
          value={cardData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder={translations.descriptionPlaceholder}
          rows={3}
          className={`w-full px-4 py-3 bg-white/5 border ${
            errors.description ? 'border-red-500' : 'border-white/10'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Image (for summary cards) */}
      {showImageFields && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {translations.imageLabel}
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="space-y-3">
            {/* URL Input */}
            <input
              type="url"
              value={cardData.image}
              onChange={(e) => onChange('image', e.target.value)}
              placeholder={translations.imagePlaceholder}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.image ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />

            {/* Upload Button */}
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {translations.uploadBtn}
                </div>
              </label>

              {hasImage && (
                <button
                  onClick={onRemoveImage}
                  className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  {translations.removeImage}
                </button>
              )}
            </div>

            {/* Image Preview */}
            {hasImage && (
              <div className="relative">
                <img
                  src={uploadedImageUrl || cardData.image}
                  alt="Twitter Card Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23374151" width="400" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}

            {errors.image && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.image}
              </p>
            )}
          </div>

          {/* Image Alt */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {translations.imageAltLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={cardData.imageAlt}
              onChange={(e) => onChange('imageAlt', e.target.value)}
              placeholder={translations.imageAltPlaceholder}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.imageAlt ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.imageAlt && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.imageAlt}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Player (for player card) */}
      {showPlayerFields && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {translations.playerLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="url"
              value={cardData.player}
              onChange={(e) => onChange('player', e.target.value)}
              placeholder="https://example.com/player"
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.player ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.player && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.player}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {translations.playerWidthLabel}
              </label>
              <input
                type="number"
                value={cardData.playerWidth}
                onChange={(e) => onChange('playerWidth', e.target.value)}
                placeholder="435"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {translations.playerHeightLabel}
              </label>
              <input
                type="number"
                value={cardData.playerHeight}
                onChange={(e) => onChange('playerHeight', e.target.value)}
                placeholder="251"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
