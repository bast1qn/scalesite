// ============================================
// TWITTER CARDS TRANSLATIONS
// ============================================

import { TWITTER_CARD_TYPE_DESCRIPTIONS } from './constants';

export interface TwitterCardTranslations {
  title: string;
  description: string;
  cardInfo: string;
  accountInfo: string;
  appInfo: string;
  playerInfo: string;
  imageUpload: string;
  cardTypeLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  imageLabel: string;
  imagePlaceholder: string;
  imageAltLabel: string;
  imageAltPlaceholder: string;
  siteLabel: string;
  sitePlaceholder: string;
  siteIdLabel: string;
  creatorLabel: string;
  creatorPlaceholder: string;
  creatorIdLabel: string;
  playerLabel: string;
  playerWidthLabel: string;
  playerHeightLabel: string;
  appCountryLabel: string;
  iphoneNameLabel: string;
  iphoneIdLabel: string;
  iphoneUrlLabel: string;
  ipadNameLabel: string;
  ipadIdLabel: string;
  ipadUrlLabel: string;
  googlePlayNameLabel: string;
  googlePlayIdLabel: string;
  googlePlayUrlLabel: string;
  previewBtn: string;
  hidePreviewBtn: string;
  copyBtn: string;
  downloadBtn: string;
  uploadBtn: string;
  generated: string;
  validate: string;
  clear: string;
  removeImage: string;
  cardTypes: typeof TWITTER_CARD_TYPE_DESCRIPTIONS;
  errors: {
    titleRequired: string;
    imageRequired: string;
    descriptionRequired: string;
    imageAltRequired: string;
    playerRequired: string;
    playerDimensions: string;
  };
}

export const TWITTER_TRANSLATIONS: Record<'de' | 'en', TwitterCardTranslations> = {
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
      player: 'Player (Video/Audio)',
    },
    errors: {
      titleRequired: 'Titel ist erforderlich',
      imageRequired: 'Bild ist erforderlich',
      descriptionRequired: 'Beschreibung ist erforderlich',
      imageAltRequired: 'ALT-Text ist erforderlich',
      playerRequired: 'Player URL ist erforderlich',
      playerDimensions: 'Player Abmessungen sind erforderlich',
    },
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
      player: 'Player (video/audio)',
    },
    errors: {
      titleRequired: 'Title is required',
      imageRequired: 'Image is required',
      descriptionRequired: 'Description is required',
      imageAltRequired: 'ALT text is required',
      playerRequired: 'Player URL is required',
      playerDimensions: 'Player dimensions are required',
    },
  },
};

// ============================================
// OPEN GRAPH TRANSLATIONS
// ============================================

export interface OpenGraphTranslations {
  title: string;
  description: string;
  basicInfo: string;
  media: string;
  articleInfo: string;
  advanced: string;
  titleLabel: string;
  titlePlaceholder: string;
  typeLabel: string;
  urlLabel: string;
  urlPlaceholder: string;
  imageLabel: string;
  imagePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  siteNameLabel: string;
  siteNamePlaceholder: string;
  localeLabel: string;
  determinerLabel: string;
  audioLabel: string;
  videoLabel: string;
  articleAuthorLabel: string;
  articlePublishedLabel: string;
  articleModifiedLabel: string;
  articleSectionLabel: string;
  articleTagLabel: string;
  previewBtn: string;
  hidePreviewBtn: string;
  copyBtn: string;
  downloadBtn: string;
  generated: string;
  validate: string;
  clear: string;
  tags: string;
  addTag: string;
  removeTag: string;
  errors: {
    titleRequired: string;
    urlRequired: string;
    urlInvalid: string;
    imageRequired: string;
    descriptionRequired: string;
  };
}

export const OG_TRANSLATIONS: Record<'de' | 'en', OpenGraphTranslations> = {
  de: {
    title: 'Open Graph Tags',
    description: 'Optimiere deine Seite für Social Media Plattformen',
    basicInfo: 'Grundlegende Informationen',
    media: 'Medien',
    articleInfo: 'Artikel-Informationen',
    advanced: 'Erweiterte Optionen',
    titleLabel: 'OG Titel',
    titlePlaceholder: 'Deine Seite | ScaleSite',
    typeLabel: 'OG Typ',
    urlLabel: 'OG URL',
    urlPlaceholder: 'https://example.com/page',
    imageLabel: 'OG Bild URL',
    imagePlaceholder: 'https://example.com/og-image.jpg',
    descriptionLabel: 'OG Beschreibung',
    descriptionPlaceholder: 'Beschreibe deine Seite in 1-2 Sätzen...',
    siteNameLabel: 'Seitenname',
    siteNamePlaceholder: 'ScaleSite',
    localeLabel: 'Sprache/Region',
    determinerLabel: 'Bestimmungswort',
    audioLabel: 'Audio URL (optional)',
    videoLabel: 'Video URL (optional)',
    articleAuthorLabel: 'Autor',
    articlePublishedLabel: 'Veröffentlichungsdatum',
    articleModifiedLabel: 'Zuletzt bearbeitet',
    articleSectionLabel: 'Sektion',
    articleTagLabel: 'Tags (kommagetrennt)',
    previewBtn: 'Vorschau',
    hidePreviewBtn: 'Ausblenden',
    copyBtn: 'Kopieren',
    downloadBtn: 'Herunterladen',
    generated: 'Generierte Tags',
    validate: 'Validieren',
    clear: 'Zurücksetzen',
    tags: 'Tags',
    addTag: 'Tag hinzufügen',
    removeTag: 'Tag entfernen',
    errors: {
      titleRequired: 'Titel ist erforderlich',
      urlRequired: 'URL ist erforderlich',
      urlInvalid: 'Ungültiges URL-Format',
      imageRequired: 'Bild ist erforderlich',
      descriptionRequired: 'Beschreibung ist erforderlich',
    },
  },
  en: {
    title: 'Open Graph Tags',
    description: 'Optimize your page for social media platforms',
    basicInfo: 'Basic Information',
    media: 'Media',
    articleInfo: 'Article Information',
    advanced: 'Advanced Options',
    titleLabel: 'OG Title',
    titlePlaceholder: 'Your Page | ScaleSite',
    typeLabel: 'OG Type',
    urlLabel: 'OG URL',
    urlPlaceholder: 'https://example.com/page',
    imageLabel: 'OG Image URL',
    imagePlaceholder: 'https://example.com/og-image.jpg',
    descriptionLabel: 'OG Description',
    descriptionPlaceholder: 'Describe your page in 1-2 sentences...',
    siteNameLabel: 'Site Name',
    siteNamePlaceholder: 'ScaleSite',
    localeLabel: 'Locale',
    determinerLabel: 'Determiner',
    audioLabel: 'Audio URL (optional)',
    videoLabel: 'Video URL (optional)',
    articleAuthorLabel: 'Author',
    articlePublishedLabel: 'Published Date',
    articleModifiedLabel: 'Last Modified',
    articleSectionLabel: 'Section',
    articleTagLabel: 'Tags (comma-separated)',
    previewBtn: 'Preview',
    hidePreviewBtn: 'Hide',
    copyBtn: 'Copy',
    downloadBtn: 'Download',
    generated: 'Generated Tags',
    validate: 'Validate',
    clear: 'Clear',
    tags: 'Tags',
    addTag: 'Add Tag',
    removeTag: 'Remove Tag',
    errors: {
      titleRequired: 'Title is required',
      urlRequired: 'URL is required',
      urlInvalid: 'Invalid URL format',
      imageRequired: 'Image is required',
      descriptionRequired: 'Description is required',
    },
  },
};
