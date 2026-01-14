// ============================================
// TWITTER CARDS COMPONENT - REFACTORED
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Eye } from 'lucide-react';
import {
  TwitterCardData,
  TwitterCardType,
} from './types';
import {
  INITIAL_TWITTER_CARD_DATA,
  DEFAULT_TWITTER_CARD_TYPE,
} from './constants';
import { TWITTER_TRANSLATIONS, TwitterCardTranslations } from './translations';
import {
  generateTwitterCardTags,
  validateImageFile,
  readImageFile,
  validateRequiredField,
} from './utils';
import { CardTypeSelector } from './TwitterCards/CardTypeSelector';
import { CardInfoFields } from './TwitterCards/CardInfoFields';
import { AccountInfoFields } from './TwitterCards/AccountInfoFields';
import { AppInfoFields } from './TwitterCards/AppInfoFields';
import { GeneratedPreview } from './TwitterCards/GeneratedPreview';

// ============================================
// TYPES
// ============================================

export interface TwitterCardsProps {
  language?: 'de' | 'en';
  initialData?: Partial<TwitterCardData>;
  onDataChange?: (data: TwitterCardData) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

// ============================================
// MAIN COMPONENT
// ============================================

export const TwitterCards: React.FC<TwitterCardsProps> = ({
  language = 'de',
  initialData,
  onDataChange,
  variant = 'default'
}) => {
  // State
  const [cardData, setCardData] = useState<TwitterCardData>({
    cardType: initialData?.cardType || DEFAULT_TWITTER_CARD_TYPE,
    site: initialData?.site || '',
    siteId: initialData?.siteId || '',
    creator: initialData?.creator || '',
    creatorId: initialData?.creatorId || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    imageAlt: initialData?.imageAlt || '',
    player: initialData?.player || '',
    playerWidth: initialData?.playerWidth || '',
    playerHeight: initialData?.playerHeight || '',
    appCountry: initialData?.appCountry || '',
    iphoneName: initialData?.iphoneName || '',
    iphoneId: initialData?.iphoneId || '',
    iphoneUrl: initialData?.iphoneUrl || '',
    ipadName: initialData?.ipadName || '',
    ipadId: initialData?.ipadId || '',
    ipadUrl: initialData?.ipadUrl || '',
    googlePlayName: initialData?.googlePlayName || '',
    googlePlayId: initialData?.googlePlayId || '',
    googlePlayUrl: initialData?.googlePlayUrl || ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Translations
  const labels: TwitterCardTranslations = TWITTER_TRANSLATIONS[language];

  // Validation
  const validateField = (name: string, value: string): string | null => {
    if (name === 'title' && !validateRequiredField(value)) {
      return labels.errors.titleRequired;
    }

    const needsImage = cardData.cardType === 'summary' || cardData.cardType === 'summary_large_image';
    if (name === 'image' && needsImage && !validateRequiredField(value) && !uploadedImageUrl) {
      return labels.errors.imageRequired;
    }

    if (name === 'description' && !validateRequiredField(value)) {
      return labels.errors.descriptionRequired;
    }

    if (name === 'imageAlt' && needsImage && !validateRequiredField(value)) {
      return labels.errors.imageAltRequired;
    }

    if (name === 'player' && cardData.cardType === 'player' && !validateRequiredField(value)) {
      return labels.errors.playerRequired;
    }

    return null;
  };

  // Event Handlers
  const handleChange = (field: keyof TwitterCardData, value: string) => {
    const updated = { ...cardData, [field]: value };
    setCardData(updated);

    const error = validateField(field, value);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      const imageUrl = await readImageFile(file);
      setUploadedImageUrl(imageUrl);
      setErrors({ ...errors, image: undefined });
    } catch (error) {
      alert('Failed to read image file');
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl('');
    handleChange('image', '');
  };

  const handleSelectCardType = (type: TwitterCardType) => {
    handleChange('cardType', type);
  };

  const handleClear = () => {
    setCardData({
      cardType: DEFAULT_TWITTER_CARD_TYPE,
      site: '',
      siteId: '',
      creator: '',
      creatorId: '',
      title: '',
      description: '',
      image: '',
      imageAlt: '',
      player: '',
      playerWidth: '',
      playerHeight: '',
      appCountry: '',
      iphoneName: '',
      iphoneId: '',
      iphoneUrl: '',
      ipadName: '',
      ipadId: '',
      ipadUrl: '',
      googlePlayName: '',
      googlePlayId: '',
      googlePlayUrl: ''
    });
    setUploadedImageUrl('');
    setErrors({});
  };

  const generateTags = () => {
    return generateTwitterCardTags(cardData, uploadedImageUrl);
  };

  // Conditional Rendering Flags
  const showAppFields = cardData.cardType === 'app';
  const showPlayerFields = cardData.cardType === 'player';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Twitter className="w-6 h-6 text-blue-400" />
          {labels.title}
        </h3>
        <p className="text-gray-400">{labels.description}</p>
      </div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <div className="space-y-6">
          {/* Card Type Selection */}
          <CardTypeSelector
            currentType={cardData.cardType}
            onSelectType={handleSelectCardType}
            translations={labels}
          />

          {/* Card Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{labels.cardInfo}</h4>
            <CardInfoFields
              cardData={cardData}
              errors={errors}
              uploadedImageUrl={uploadedImageUrl}
              translations={labels}
              onChange={handleChange}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
            />
          </div>

          {/* Account Info */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">{labels.accountInfo}</h4>
            <AccountInfoFields
              cardData={cardData}
              translations={labels}
              onChange={handleChange}
            />
          </div>

          {/* App Info (only for app card) */}
          {showAppFields && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{labels.appInfo}</h4>
              <AppInfoFields
                cardData={cardData}
                translations={labels}
                onChange={handleChange}
              />
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
      <GeneratedPreview
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

export default TwitterCards;
