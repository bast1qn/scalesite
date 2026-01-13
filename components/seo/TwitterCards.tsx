import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Image as ImageIcon, Twitter, Eye, Copy, Download, Upload } from 'lucide-react';

interface TwitterCardData {
  cardType: 'summary' | 'summary_large_image' | 'app' | 'player';
  site: string;
  siteId: string;
  creator: string;
  creatorId: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  player: string;
  playerWidth: string;
  playerHeight: string;
  appCountry: string;
  iphoneName: string;
  iphoneId: string;
  iphoneUrl: string;
  ipadName: string;
  ipadId: string;
  ipadUrl: string;
  googlePlayName: string;
  googlePlayId: string;
  googlePlayUrl: string;
}

interface TwitterCardsProps {
  language?: 'de' | 'en';
  initialData?: Partial<TwitterCardData>;
  onDataChange?: (data: TwitterCardData) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export const TwitterCards: React.FC<TwitterCardsProps> = ({
  language = 'de',
  initialData,
  onDataChange,
  variant = 'default'
}) => {
  const [cardData, setCardData] = useState<TwitterCardData>({
    cardType: initialData?.cardType || 'summary_large_image',
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
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const t = {
    de: {
      title: 'Twitter Cards',
      description: 'Erstelle ansprechende Twitter Cards für deine Inhalte',
      cardInfo: 'Karten-Informationen',
      accountInfo: 'Konto-Informationen',
      appInfo: 'App-Informationen',
      playerInfo: 'Player-Informationen',
      imageUpload: 'Bild hochladen',
      cardTypeLabel: 'Kartentyp',
      titleLabel: 'Titel',
      titlePlaceholder: 'Deine Überschrift',
      descriptionLabel: 'Beschreibung',
      descriptionPlaceholder: 'Beschreibe deinen Inhalt...',
      imageLabel: 'Bild URL',
      imagePlaceholder: 'https://example.com/image.jpg',
      imageAltLabel: 'Bild ALT Text',
      imageAltPlaceholder: 'Beschreibung des Bildes',
      siteLabel: 'Website Twitter Handle',
      sitePlaceholder: '@scaleSite',
      siteIdLabel: 'Website Twitter ID',
      creatorLabel: 'Ersteller Twitter Handle',
      creatorPlaceholder: '@creator',
      creatorIdLabel: 'Ersteller Twitter ID',
      playerLabel: 'Player URL',
      playerWidthLabel: 'Player Breite',
      playerHeightLabel: 'Player Höhe',
      appCountryLabel: 'App Land',
      iphoneNameLabel: 'iPhone App Name',
      iphoneIdLabel: 'iPhone App ID',
      iphoneUrlLabel: 'iPhone App URL',
      ipadNameLabel: 'iPad App Name',
      ipadIdLabel: 'iPad App ID',
      ipadUrlLabel: 'iPad App URL',
      googlePlayNameLabel: 'Google Play App Name',
      googlePlayIdLabel: 'Google Play App ID',
      googlePlayUrlLabel: 'Google Play App URL',
      previewBtn: 'Vorschau',
      hidePreviewBtn: 'Ausblenden',
      copyBtn: 'Kopieren',
      downloadBtn: 'Herunterladen',
      uploadBtn: 'Bild hochladen',
      generated: 'Generierte Tags',
      validate: 'Validieren',
      clear: 'Zurücksetzen',
      removeImage: 'Bild entfernen',
      cardTypes: {
        summary: 'Summary (kleines Bild)',
        summary_large_image: 'Summary Large Image (großes Bild)',
        app: 'App (App-Installation)',
        player: 'Player (Video/Audio)'
      },
      errors: {
        titleRequired: 'Titel ist erforderlich',
        imageRequired: 'Bild ist erforderlich',
        descriptionRequired: 'Beschreibung ist erforderlich',
        imageAltRequired: 'ALT-Text ist erforderlich',
        playerRequired: 'Player URL ist erforderlich',
        playerDimensions: 'Player Abmessungen sind erforderlich'
      }
    },
    en: {
      title: 'Twitter Cards',
      description: 'Create engaging Twitter Cards for your content',
      cardInfo: 'Card Information',
      accountInfo: 'Account Information',
      appInfo: 'App Information',
      playerInfo: 'Player Information',
      imageUpload: 'Upload Image',
      cardTypeLabel: 'Card Type',
      titleLabel: 'Title',
      titlePlaceholder: 'Your headline',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Describe your content...',
      imageLabel: 'Image URL',
      imagePlaceholder: 'https://example.com/image.jpg',
      imageAltLabel: 'Image ALT Text',
      imageAltPlaceholder: 'Description of the image',
      siteLabel: 'Site Twitter Handle',
      sitePlaceholder: '@scaleSite',
      siteIdLabel: 'Site Twitter ID',
      creatorLabel: 'Creator Twitter Handle',
      creatorPlaceholder: '@creator',
      creatorIdLabel: 'Creator Twitter ID',
      playerLabel: 'Player URL',
      playerWidthLabel: 'Player Width',
      playerHeightLabel: 'Player Height',
      appCountryLabel: 'App Country',
      iphoneNameLabel: 'iPhone App Name',
      iphoneIdLabel: 'iPhone App ID',
      iphoneUrlLabel: 'iPhone App URL',
      ipadNameLabel: 'iPad App Name',
      ipadIdLabel: 'iPad App ID',
      ipadUrlLabel: 'iPad App URL',
      googlePlayNameLabel: 'Google Play App Name',
      googlePlayIdLabel: 'Google Play App ID',
      googlePlayUrlLabel: 'Google Play App URL',
      previewBtn: 'Preview',
      hidePreviewBtn: 'Hide',
      copyBtn: 'Copy',
      downloadBtn: 'Download',
      uploadBtn: 'Upload Image',
      generated: 'Generated Tags',
      validate: 'Validate',
      clear: 'Clear',
      removeImage: 'Remove Image',
      cardTypes: {
        summary: 'Summary (small image)',
        summary_large_image: 'Summary Large Image (large image)',
        app: 'App (app install)',
        player: 'Player (video/audio)'
      },
      errors: {
        titleRequired: 'Title is required',
        imageRequired: 'Image is required',
        descriptionRequired: 'Description is required',
        imageAltRequired: 'ALT text is required',
        playerRequired: 'Player URL is required',
        playerDimensions: 'Player dimensions are required'
      }
    }
  };

  const labels = t[language];

  const validateField = (name: string, value: string): string | null => {
    if (name === 'title' && !value.trim()) {
      return labels.errors.titleRequired;
    }
    if (name === 'image' && (cardData.cardType === 'summary' || cardData.cardType === 'summary_large_image') && !value.trim() && !uploadedImageUrl) {
      return labels.errors.imageRequired;
    }
    if (name === 'description' && !value.trim()) {
      return labels.errors.descriptionRequired;
    }
    if (name === 'imageAlt' && (cardData.cardType === 'summary' || cardData.cardType === 'summary_large_image') && !value.trim()) {
      return labels.errors.imageAltRequired;
    }
    if (name === 'player' && cardData.cardType === 'player' && !value.trim()) {
      return labels.errors.playerRequired;
    }
    return null;
  };

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File must be an image');
      return;
    }

    // In production, upload to Supabase Storage
    // For now, create a local preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImageUrl(reader.result as string);
      setErrors({ ...errors, image: null });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl('');
    handleChange('image', '');
  };

  const generateTags = (): string[] => {
    const tags: string[] = [];

    tags.push(`<meta name="twitter:card" content="${cardData.cardType}" />`);

    if (cardData.site) tags.push(`<meta name="twitter:site" content="${cardData.site}" />`);
    if (cardData.siteId) tags.push(`<meta name="twitter:site:id" content="${cardData.siteId}" />`);
    if (cardData.creator) tags.push(`<meta name="twitter:creator" content="${cardData.creator}" />`);
    if (cardData.creatorId) tags.push(`<meta name="twitter:creator:id" content="${cardData.creatorId}" />`);

    if (cardData.title) tags.push(`<meta name="twitter:title" content="${cardData.title}" />`);
    if (cardData.description) tags.push(`<meta name="twitter:description" content="${cardData.description}" />`);

    const imageUrl = uploadedImageUrl || cardData.image;
    if (imageUrl) {
      tags.push(`<meta name="twitter:image" content="${imageUrl}" />`);
      if (cardData.imageAlt) {
        tags.push(`<meta name="twitter:image:alt" content="${cardData.imageAlt}" />`);
      }
    }

    if (cardData.cardType === 'player') {
      if (cardData.player) tags.push(`<meta name="twitter:player" content="${cardData.player}" />`);
      if (cardData.playerWidth) tags.push(`<meta name="twitter:player:width" content="${cardData.playerWidth}" />`);
      if (cardData.playerHeight) tags.push(`<meta name="twitter:player:height" content="${cardData.playerHeight}" />`);
    }

    if (cardData.cardType === 'app') {
      if (cardData.iphoneName) tags.push(`<meta name="twitter:app:name:iphone" content="${cardData.iphoneName}" />`);
      if (cardData.iphoneId) tags.push(`<meta name="twitter:app:id:iphone" content="${cardData.iphoneId}" />`);
      if (cardData.iphoneUrl) tags.push(`<meta name="twitter:app:url:iphone" content="${cardData.iphoneUrl}" />`);

      if (cardData.ipadName) tags.push(`<meta name="twitter:app:name:ipad" content="${cardData.ipadName}" />`);
      if (cardData.ipadId) tags.push(`<meta name="twitter:app:id:ipad" content="${cardData.ipadId}" />`);
      if (cardData.ipadUrl) tags.push(`<meta name="twitter:app:url:ipad" content="${cardData.ipadUrl}" />`);

      if (cardData.googlePlayName) tags.push(`<meta name="twitter:app:name:googleplay" content="${cardData.googlePlayName}" />`);
      if (cardData.googlePlayId) tags.push(`<meta name="twitter:app:id:googleplay" content="${cardData.googlePlayId}" />`);
      if (cardData.googlePlayUrl) tags.push(`<meta name="twitter:app:url:googleplay" content="${cardData.googlePlayUrl}" />`);
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
    a.download = 'twitter-cards.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCardData({
      cardType: 'summary_large_image',
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {labels.cardTypeLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(labels.cardTypes).map(([type, description]) => (
                <button
                  key={type}
                  onClick={() => handleChange('cardType', type as TwitterCardData['cardType'])}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    cardData.cardType === type
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

          {/* Card Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{labels.cardInfo}</h4>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.titleLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder={labels.titlePlaceholder}
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
                  {labels.descriptionLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={cardData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={labels.descriptionPlaceholder}
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
              {(cardData.cardType === 'summary' || cardData.cardType === 'summary_large_image') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {labels.imageLabel}
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <div className="space-y-3">
                    {/* URL Input */}
                    <input
                      type="url"
                      value={cardData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      placeholder={labels.imagePlaceholder}
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
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                          <Upload className="w-4 h-4" />
                          {labels.uploadBtn}
                        </div>
                      </label>

                      {(uploadedImageUrl || cardData.image) && (
                        <button
                          onClick={handleRemoveImage}
                          className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          {labels.removeImage}
                        </button>
                      )}
                    </div>

                    {/* Image Preview */}
                    {(uploadedImageUrl || cardData.image) && (
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
                      {labels.imageAltLabel}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardData.imageAlt}
                      onChange={(e) => handleChange('imageAlt', e.target.value)}
                      placeholder={labels.imageAltPlaceholder}
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
                      {labels.playerLabel}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="url"
                      value={cardData.player}
                      onChange={(e) => handleChange('player', e.target.value)}
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
                        {labels.playerWidthLabel}
                      </label>
                      <input
                        type="number"
                        value={cardData.playerWidth}
                        onChange={(e) => handleChange('playerWidth', e.target.value)}
                        placeholder="435"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {labels.playerHeightLabel}
                      </label>
                      <input
                        type="number"
                        value={cardData.playerHeight}
                        onChange={(e) => handleChange('playerHeight', e.target.value)}
                        placeholder="251"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">{labels.accountInfo}</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.siteLabel}
                </label>
                <input
                  type="text"
                  value={cardData.site}
                  onChange={(e) => handleChange('site', e.target.value)}
                  placeholder={labels.sitePlaceholder}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.siteIdLabel}
                </label>
                <input
                  type="text"
                  value={cardData.siteId}
                  onChange={(e) => handleChange('siteId', e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.creatorLabel}
                </label>
                <input
                  type="text"
                  value={cardData.creator}
                  onChange={(e) => handleChange('creator', e.target.value)}
                  placeholder={labels.creatorPlaceholder}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {labels.creatorIdLabel}
                </label>
                <input
                  type="text"
                  value={cardData.creatorId}
                  onChange={(e) => handleChange('creatorId', e.target.value)}
                  placeholder="789012"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* App Info (only for app card) */}
          {showAppFields && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{labels.appInfo}</h4>

              <div className="space-y-4">
                {/* iPhone App */}
                <div className="p-4 bg-white/5 rounded-lg">
                  <h5 className="font-semibold text-white mb-3">iPhone</h5>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cardData.iphoneName}
                      onChange={(e) => handleChange('iphoneName', e.target.value)}
                      placeholder={labels.iphoneNameLabel}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={cardData.iphoneId}
                      onChange={(e) => handleChange('iphoneId', e.target.value)}
                      placeholder={labels.iphoneIdLabel}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={cardData.iphoneUrl}
                      onChange={(e) => handleChange('iphoneUrl', e.target.value)}
                      placeholder={labels.iphoneUrlLabel}
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
                      onChange={(e) => handleChange('ipadName', e.target.value)}
                      placeholder={labels.ipadNameLabel}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={cardData.ipadId}
                      onChange={(e) => handleChange('ipadId', e.target.value)}
                      placeholder={labels.ipadIdLabel}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={cardData.ipadUrl}
                      onChange={(e) => handleChange('ipadUrl', e.target.value)}
                      placeholder={labels.ipadUrlLabel}
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
                      onChange={(e) => handleChange('googlePlayName', e.target.value)}
                      placeholder={labels.googlePlayNameLabel}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={cardData.googlePlayId}
                      onChange={(e) => handleChange('googlePlayId', e.target.value)}
                      placeholder={labels.googlePlayIdLabel}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={cardData.googlePlayUrl}
                      onChange={(e) => handleChange('googlePlayUrl', e.target.value)}
                      placeholder={labels.googlePlayUrlLabel}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
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
