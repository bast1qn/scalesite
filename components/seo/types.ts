// ============================================
// SEO COMPONENT TYPES
// ============================================

export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

export interface TwitterCardData {
  cardType: TwitterCardType;
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

export type OpenGraphType = 'website' | 'article' | 'book' | 'profile';

export interface OpenGraphData {
  ogTitle: string;
  ogType: OpenGraphType;
  ogUrl: string;
  ogImage: string;
  ogDescription: string;
  ogSiteName: string;
  ogLocale: string;
  ogAudio?: string;
  ogVideo?: string;
  ogDeterminer?: string;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTag?: string[];
}

export interface SEOSearchParams {
  [key: string]: string | undefined;
  q?: string;
  type?: string;
  page?: string;
}

export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}
