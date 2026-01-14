/**
 * SEO Type Definitions
 * Centralized types for all SEO-related components
 */

// ============================================================================
// STRUCTURED DATA TYPES
// ============================================================================

/**
 * Supported Schema.org types for structured data
 */
export type SchemaType =
  | 'Article'
  | 'NewsArticle'
  | 'BlogPosting'
  | 'LocalBusiness'
  | 'Organization'
  | 'Product'
  | 'Person'
  | 'WebSite';

/**
 * Form data for Schema.org structured data generation
 * Covers all schema types with optional fields
 */
export interface SchemaFormData {
  // Article/NewsArticle/BlogPosting fields
  headline?: string;
  image?: string;
  author?: string;
  publisher?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  description?: string;

  // LocalBusiness fields
  name?: string;
  address?: string;
  telephone?: string;
  email?: string;
  openingHours?: string;
  priceRange?: string;
  geoLatitude?: string;
  geoLongitude?: string;

  // Organization fields
  legalName?: string;
  url?: string;
  logo?: string;
  foundingDate?: string;
  numberOfEmployees?: string;
  addressOrg?: string;

  // Product fields
  productName?: string;
  productImage?: string;
  productDescription?: string;
  brand?: string;
  offersPrice?: string;
  offersCurrency?: string;
  offersAvailability?: string;
  offersUrl?: string;

  // Person fields
  personName?: string;
  personImage?: string;
  personJobTitle?: string;
  personUrl?: string;
  personWorksFor?: string;
  personEmail?: string;
  personTelephone?: string;
  personAddress?: string;

  // WebSite fields
  siteName?: string;
  siteUrl?: string;
  siteDescription?: string;
  searchActionUrl?: string;
  searchActionTarget?: string;
}

// ============================================================================
// TWITTER CARD TYPES
// ============================================================================

/**
 * Twitter card types
 */
export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

/**
 * Twitter card data for social media optimization
 */
export interface TwitterCardData {
  cardType: TwitterCardType;
  site?: string;
  siteId?: string;
  creator?: string;
  creatorId?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  player?: string;
  playerWidth?: string;
  playerHeight?: string;
  playerStream?: string;
  playerStreamContentType?: string;
  iPhoneApp?: string;
  iPhoneAppStoreId?: string;
  iPhoneAppUrl?: string;
  iPadApp?: string;
  iPadAppStoreId?: string;
  iPadAppUrl?: string;
  googlePlayApp?: string;
  googlePlayAppUrl?: string;
  appCountry?: string;
}

// ============================================================================
// OPEN GRAPH TYPES
// ============================================================================

/**
 * Open Graph object types
 */
export type OGType = 'website' | 'article' | 'book' | 'profile';

/**
 * Open Graph data for Facebook/social media sharing
 */
export interface OpenGraphData {
  type: OGType;
  title: string;
  url?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageHeight?: string;
  siteName?: string;
  locale?: string;
  alternateLocale?: string;

  // Article-specific
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleExpirationTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTag?: string;

  // Book-specific
  bookAuthor?: string;
  bookIsbn?: string;
  bookReleaseDate?: string;
  bookTag?: string;

  // Profile-specific
  profileFirstName?: string;
  profileLastName?: string;
  profileUsername?: string;
  profileGender?: string;
}

// ============================================================================
// SEO AUDIT TYPES
// ============================================================================

/**
 * SEO audit check result
 */
export interface SEOAuditCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  recommendation?: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Complete SEO audit report
 */
export interface SEOAuditReport {
  url: string;
  overallScore: number;
  checks: SEOAuditCheck[];
  criticalIssues: number;
  warnings: number;
  passed: number;
  timestamp: string;
}

// ============================================================================
// SEO COMPONENT PROPS
// ============================================================================

/**
 * Props for StructuredData component
 */
export interface StructuredDataProps {
  language?: 'de' | 'en';
  initialData?: SchemaFormData;
  onDataChange?: (data: SchemaFormData) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Props for TwitterCards component
 */
export interface TwitterCardsProps {
  initialData?: TwitterCardData;
  onDataChange?: (data: TwitterCardData) => void;
  language?: 'de' | 'en';
  variant?: 'default' | 'compact';
}

/**
 * Props for OpenGraphTags component
 */
export interface OpenGraphTagsProps {
  initialData?: OpenGraphData;
  onDataChange?: (data: OpenGraphData) => void;
  language?: 'de' | 'en';
  variant?: 'default' | 'compact';
}
