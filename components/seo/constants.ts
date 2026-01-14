// ============================================
// TWITTER CARDS CONSTANTS
// ============================================

import { TwitterCardData, OpenGraphData, TwitterCardType, OpenGraphType } from './types';

// Validation Limits
export const TWITTER_IMAGE_MAX_SIZE_MB = 5;
export const TWITTER_IMAGE_MAX_SIZE_BYTES = TWITTER_IMAGE_MAX_SIZE_MB * 1024 * 1024;
export const TWITTER_CARD_TITLE_MAX_LENGTH = 70;
export const TWITTER_CARD_DESCRIPTION_MAX_LENGTH = 200;
export const TWITTER_DEBOUNCE_DELAY_MS = 2000;

// OpenGraph Limits
export const OG_TITLE_MAX_LENGTH = 95;
export const OG_DESCRIPTION_MAX_LENGTH = 200;
export const OG_IMAGE_MIN_WIDTH = 1200;
export const OG_IMAGE_MIN_HEIGHT = 630;
export const OG_IMAGE_MAX_SIZE_MB = 8;

// Validation Messages
export const TWITTER_VALIDATION_ERRORS = {
  TITLE_REQUIRED: 'titleRequired',
  IMAGE_REQUIRED: 'imageRequired',
  DESCRIPTION_REQUIRED: 'descriptionRequired',
  IMAGE_ALT_REQUIRED: 'imageAltRequired',
  PLAYER_REQUIRED: 'playerRequired',
  PLAYER_DIMENSIONS: 'playerDimensions',
} as const;

export const OG_VALIDATION_ERRORS = {
  TITLE_REQUIRED: 'titleRequired',
  URL_REQUIRED: 'urlRequired',
  URL_INVALID: 'urlInvalid',
  IMAGE_REQUIRED: 'imageRequired',
  DESCRIPTION_REQUIRED: 'descriptionRequired',
} as const;

// Default Values
export const DEFAULT_TWITTER_CARD_TYPE: TwitterCardType = 'summary_large_image';
export const DEFAULT_OG_TYPE: OpenGraphType = 'website';
export const DEFAULT_OG_LOCALE = 'de_DE';

// Card Type Descriptions
export const TWITTER_CARD_TYPE_DESCRIPTIONS = {
  summary: 'Summary (small image)',
  summary_large_image: 'Summary Large Image (large image)',
  app: 'App (app install)',
  player: 'Player (video/audio)',
} as const;

export const OG_TYPE_LABELS = {
  website: 'Website',
  article: 'Article',
  book: 'Book',
  profile: 'Profile',
} as const;

// Locale Options
export const OG_LOCALE_OPTIONS = [
  { value: 'de_DE', label: 'Deutsch (Deutschland)' },
  { value: 'de_AT', label: 'Deutsch (Österreich)' },
  { value: 'de_CH', label: 'Deutsch (Schweiz)' },
  { value: 'en_US', label: 'English (United States)' },
  { value: 'en_GB', label: 'English (United Kingdom)' },
  { value: 'fr_FR', label: 'Français (France)' },
  { value: 'it_IT', label: 'Italiano (Italy)' },
  { value: 'es_ES', label: 'Español (Spain)' },
] as const;

// Determiner Options
export const OG_DETERMINER_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'a', label: 'A' },
  { value: 'an', label: 'An' },
  { value: 'the', label: 'The' },
  { value: 'auto', label: 'Auto' },
] as const;

// Initial States
export const INITIAL_TWITTER_CARD_DATA: Partial<TwitterCardData> = {
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
  googlePlayUrl: '',
};

export const INITIAL_OG_DATA: Partial<OpenGraphData> = {
  ogTitle: '',
  ogType: DEFAULT_OG_TYPE,
  ogUrl: '',
  ogImage: '',
  ogDescription: '',
  ogSiteName: '',
  ogLocale: DEFAULT_OG_LOCALE,
  ogAudio: '',
  ogVideo: '',
  ogDeterminer: '',
  articleAuthor: '',
  articlePublishedTime: '',
  articleModifiedTime: '',
  articleSection: '',
  articleTag: [],
};
