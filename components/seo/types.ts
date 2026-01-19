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

// ============================================
// STRUCTURED DATA TYPES
// Breaking circular dependencies
// ============================================

export type SchemaType = 'Article' | 'NewsArticle' | 'BlogPosting' | 'LocalBusiness' | 'Organization' | 'Product' | 'Person' | 'WebSite';

export interface SchemaFormData {
  // Article/NewsArticle/BlogPosting
  headline?: string;
  image?: string;
  author?: string;
  publisher?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  description?: string;

  // LocalBusiness
  name?: string;
  address?: string;
  telephone?: string;
  email?: string;
  openingHours?: string;
  priceRange?: string;
  geoLatitude?: string;
  geoLongitude?: string;

  // Organization
  legalName?: string;
  url?: string;
  logo?: string;
  foundingDate?: string;
  numberOfEmployees?: string;
  addressOrg?: string;

  // Product
  productName?: string;
  productImage?: string;
  productDescription?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  aggregateRating?: string;
  reviewCount?: string;

  // Person
  personName?: string;
  givenName?: string;
  familyName?: string;
  jobTitle?: string;
  worksFor?: string;
  urlPerson?: string;
  sameAs?: string;
  birthDate?: string;

  // WebSite
  siteName?: string;
  alternateName?: string;
  siteUrl?: string;
  siteDescription?: string;
  potentialAction?: string;
  target?: string;
}
