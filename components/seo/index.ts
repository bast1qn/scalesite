// ============================================
// SEO COMPONENTS - BARREL FILE
// ============================================
// This file provides a centralized export point for all SEO components
// and makes imports cleaner and more maintainable.

// Main Components
export { MetaTagGenerator } from './MetaTagGenerator';
export { SitemapGenerator } from './SitemapGenerator';
export { RobotsEditor } from './RobotsEditor';
export { SEOScore } from './SEOScore';
export { OpenGraphTags } from './OpenGraphTags';
export { TwitterCards } from './TwitterCards';
export { StructuredData } from './StructuredData';
export { SEOAuditReport } from './SEOAuditReport';

// Types (Refactored - extracted from components)
export type {
  TwitterCardData,
  TwitterCardType,
  OpenGraphData,
  OpenGraphType,
  SEOSearchParams,
  SEOValidationResult,
} from './types';

// Translation Types
export type { TwitterCardTranslations, OpenGraphTranslations } from './translations';

// Utility Types
export type { ImageValidationResult } from './utils';
