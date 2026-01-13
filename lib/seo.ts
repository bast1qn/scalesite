/**
 * SEO Tools - Foundation Utilities
 * Provides core SEO functionality for ScaleSite
 */

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
  sitemap?: string;
}

export interface SEOScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  issues: SEOIssue[];
  warnings: SEOIssue[];
  passes: SEOIssue[];
}

export interface SEOIssue {
  category: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  recommendation?: string;
}

/**
 * Generate meta tags for SEO
 */
export const generateMetaTags = (metadata: SEOMetadata): MetaTag[] => {
  const tags: MetaTag[] = [];

  // Basic meta tags
  tags.push({ name: 'title', content: metadata.title });
  tags.push({ name: 'description', content: metadata.description });

  if (metadata.keywords) {
    tags.push({ name: 'keywords', content: metadata.keywords });
  }

  // Open Graph tags
  if (metadata.ogTitle) {
    tags.push({ property: 'og:title', content: metadata.ogTitle });
  }
  if (metadata.ogDescription) {
    tags.push({ property: 'og:description', content: metadata.ogDescription });
  }
  if (metadata.ogImage) {
    tags.push({ property: 'og:image', content: metadata.ogImage });
  }
  tags.push({ property: 'og:type', content: 'website' });

  // Twitter Card tags
  if (metadata.twitterCard) {
    tags.push({ name: 'twitter:card', content: metadata.twitterCard });
    tags.push({ name: 'twitter:title', content: metadata.ogTitle || metadata.title });
    tags.push({ name: 'twitter:description', content: metadata.ogDescription || metadata.description });
    if (metadata.ogImage) {
      tags.push({ name: 'twitter:image', content: metadata.ogImage });
    }
  }

  // Robots directives
  const robotsDirectives: string[] = [];
  if (metadata.noindex) robotsDirectives.push('noindex');
  if (metadata.nofollow) robotsDirectives.push('nofollow');
  if (robotsDirectives.length > 0) {
    tags.push({ name: 'robots', content: robotsDirectives.join(', ') });
  }

  return tags;
};

/**
 * Generate XML sitemap
 */
export const generateSitemap = (entries: SitemapEntry[], baseUrl: string): string => {
  const urlset = entries
    .map(entry => {
      const url = entry.url.startsWith('http') ? entry.url : `${baseUrl}${entry.url}`;
      let xml = '  <url>\n';
      xml += `    <loc>${escapeXml(url)}</loc>\n`;

      if (entry.lastModified) {
        xml += `    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n`;
      }

      if (entry.changeFrequency) {
        xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
      }

      if (entry.priority !== undefined) {
        xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      }

      xml += '  </url>';
      return xml;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (rules: RobotsRule[]): string => {
  return rules
    .map(rule => {
      let content = `User-agent: ${rule.userAgent}\n`;

      if (rule.allow.length > 0) {
        rule.allow.forEach(path => {
          content += `Allow: ${path}\n`;
        });
      }

      if (rule.disallow.length > 0) {
        rule.disallow.forEach(path => {
          content += `Disallow: ${path}\n`;
        });
      }

      if (rule.crawlDelay) {
        content += `Crawl-delay: ${rule.crawlDelay}\n`;
      }

      if (rule.sitemap) {
        content += `\nSitemap: ${rule.sitemap}\n`;
      }

      return content;
    })
    .join('\n');
};

/**
 * Calculate SEO score based on content analysis
 */
export const calculateSEOScore = (content: {
  title?: string;
  description?: string;
  content?: string;
  headings?: { level: number; text: string }[];
  images?: { alt?: string; src?: string }[];
  url?: string;
}): SEOScoreResult => {
  const issues: SEOIssue[] = [];
  const warnings: SEOIssue[] = [];
  const passes: SEOIssue[] = [];
  let score = 0;
  const maxScore = 100;

  // Title checks (30 points)
  if (!content.title) {
    issues.push({
      category: 'Title',
      message: 'Missing page title',
      severity: 'critical',
      recommendation: 'Add a descriptive title tag (50-60 characters recommended)'
    });
  } else if (content.title.length < 30) {
    warnings.push({
      category: 'Title',
      message: `Title is too short (${content.title.length} characters)`,
      severity: 'warning',
      recommendation: 'Aim for 50-60 characters for better SEO'
    });
    score += 5;
  } else if (content.title.length > 60) {
    warnings.push({
      category: 'Title',
      message: `Title is too long (${content.title.length} characters)`,
      severity: 'warning',
      recommendation: 'Keep titles under 60 characters for optimal display'
    });
    score += 10;
  } else {
    passes.push({
      category: 'Title',
      message: 'Title length is optimal',
      severity: 'info'
    });
    score += 20;
  }

  // Description checks (25 points)
  if (!content.description) {
    issues.push({
      category: 'Meta Description',
      message: 'Missing meta description',
      severity: 'critical',
      recommendation: 'Add a compelling meta description (150-160 characters recommended)'
    });
  } else if (content.description.length < 120) {
    warnings.push({
      category: 'Meta Description',
      message: `Description is too short (${content.description.length} characters)`,
      severity: 'warning',
      recommendation: 'Aim for 150-160 characters for better CTR'
    });
    score += 10;
  } else if (content.description.length > 160) {
    warnings.push({
      category: 'Meta Description',
      message: `Description is too long (${content.description.length} characters)`,
      severity: 'warning',
      recommendation: 'Keep descriptions under 160 characters to avoid truncation'
    });
    score += 10;
  } else {
    passes.push({
      category: 'Meta Description',
      message: 'Meta description length is optimal',
      severity: 'info'
    });
    score += 20;
  }

  // Heading structure (20 points)
  if (!content.headings || content.headings.length === 0) {
    warnings.push({
      category: 'Headings',
      message: 'No headings found',
      severity: 'warning',
      recommendation: 'Use H1-H6 headings to structure your content'
    });
  } else {
    const hasH1 = content.headings.some(h => h.level === 1);
    if (!hasH1) {
      issues.push({
        category: 'Headings',
        message: 'Missing H1 heading',
        severity: 'critical',
        recommendation: 'Every page should have exactly one H1 heading'
      });
    } else {
      const h1Count = content.headings.filter(h => h.level === 1).length;
      if (h1Count > 1) {
        warnings.push({
          category: 'Headings',
          message: `Multiple H1 headings found (${h1Count})`,
          severity: 'warning',
          recommendation: 'Use only one H1 heading per page'
        });
        score += 5;
      } else {
        passes.push({
          category: 'Headings',
          message: 'Proper H1 heading usage',
          severity: 'info'
        });
        score += 10;
      }
    }
  }

  // Image alt text (15 points)
  if (content.images && content.images.length > 0) {
    const imagesWithoutAlt = content.images.filter(img => !img.alt || img.alt.trim() === '');
    const altTextRatio = 1 - (imagesWithoutAlt.length / content.images.length);

    if (altTextRatio === 0) {
      warnings.push({
        category: 'Images',
        message: 'No images have alt text',
        severity: 'warning',
        recommendation: 'Add descriptive alt text to all images for accessibility and SEO'
      });
    } else if (altTextRatio < 0.5) {
      warnings.push({
        category: 'Images',
        message: `Less than 50% of images have alt text`,
        severity: 'warning',
        recommendation: 'Add alt text to remaining images'
      });
      score += 5;
    } else if (altTextRatio < 1) {
      warnings.push({
        category: 'Images',
        message: `${Math.round(altTextRatio * 100)}% of images have alt text`,
        severity: 'warning',
        recommendation: 'Add alt text to all images for optimal accessibility'
      });
      score += 10;
    } else {
      passes.push({
        category: 'Images',
        message: 'All images have alt text',
        severity: 'info'
      });
      score += 15;
    }
  }

  // Content length (10 points)
  if (content.content) {
    const wordCount = content.content.split(/\s+/).length;
    if (wordCount < 300) {
      warnings.push({
        category: 'Content',
        message: `Content is too short (${wordCount} words)`,
        severity: 'warning',
        recommendation: 'Aim for at least 300 words for better SEO performance'
      });
      score += 3;
    } else if (wordCount >= 1000) {
      passes.push({
        category: 'Content',
        message: 'Content length is excellent for SEO',
        severity: 'info'
      });
      score += 10;
    } else {
      passes.push({
        category: 'Content',
        message: 'Content length is adequate',
        severity: 'info'
      });
      score += 7;
    }
  }

  return {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    issues,
    warnings,
    passes
  };
};

/**
 * Escape special XML characters
 */
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text: string, minFrequency: number = 2): string[] => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .filter(([_, count]) => count >= minFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

/**
 * Generate slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// ============================================
// WOCHE 22: SEO AUTOMATION FUNCTIONS
// ============================================

/**
 * Auto-generate meta tags from content
 */
export const autoGenerateMetaTags = (content: {
  title?: string;
  content?: string;
  url?: string;
  locale?: string;
}): SEOMetadata => {
  const { title, content: text, url, locale = 'de_DE' } = content;

  // Generate description from content (first 160 chars)
  let description = '';
  if (text) {
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    description = cleanText.substring(0, 157) + (cleanText.length > 157 ? '...' : '');
  }

  // Extract keywords from content
  let keywords = '';
  if (text) {
    const extractedKeywords = extractKeywords(text, 3);
    keywords = extractedKeywords.join(', ');
  }

  // Generate OG title (same as title or truncated)
  const ogTitle = title || '';
  const ogDescription = description;

  return {
    title: title || '',
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonical: url || '',
    noindex: false,
    nofollow: false
  };
};

/**
 * Generate Open Graph tags with defaults
 */
export const generateOpenGraphTags = (data: {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
}): MetaTag[] => {
  const tags: MetaTag[] = [];

  tags.push({ property: 'og:title', content: data.title });
  tags.push({ property: 'og:type', content: data.type || 'website' });
  tags.push({ property: 'og:url', content: data.url });
  tags.push({ property: 'og:description', content: data.description });

  if (data.image) {
    tags.push({ property: 'og:image', content: data.image });
  }

  if (data.siteName) {
    tags.push({ property: 'og:site_name', content: data.siteName });
  }

  if (data.locale) {
    tags.push({ property: 'og:locale', content: data.locale });
  }

  return tags;
};

/**
 * Generate Twitter Card tags
 */
export const generateTwitterCardTags = (data: {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image?: string;
  site?: string;
  creator?: string;
}): MetaTag[] => {
  const tags: MetaTag[] = [];
  const cardType = data.card || 'summary_large_image';

  tags.push({ name: 'twitter:card', content: cardType });
  tags.push({ name: 'twitter:title', content: data.title });
  tags.push({ name: 'twitter:description', content: data.description });

  if (data.image) {
    tags.push({ name: 'twitter:image', content: data.image });
  }

  if (data.site) {
    tags.push({ name: 'twitter:site', content: data.site });
  }

  if (data.creator) {
    tags.push({ name: 'twitter:creator', content: data.creator });
  }

  return tags;
};

/**
 * Generate JSON-LD structured data for Article
 */
export const generateArticleStructuredData = (data: {
  headline: string;
  image?: string;
  author: string;
  publisher: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  articleSection?: string;
}): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    author: {
      '@type': 'Person',
      name: data.author
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher
    },
    datePublished: data.datePublished
  };

  if (data.image) schema.image = data.image;
  if (data.dateModified) schema.dateModified = data.dateModified;
  if (data.description) schema.description = data.description;
  if (data.articleSection) schema.articleSection = data.articleSection;

  return JSON.stringify(schema, null, 2);
};

/**
 * Generate JSON-LD structured data for LocalBusiness
 */
export const generateLocalBusinessStructuredData = (data: {
  name: string;
  address: string;
  telephone?: string;
  email?: string;
  openingHours?: string;
  priceRange?: string;
  geoLatitude?: number;
  geoLongitude?: number;
}): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address
    }
  };

  if (data.telephone) schema.telephone = data.telephone;
  if (data.email) schema.email = data.email;
  if (data.openingHours) schema.openingHours = data.openingHours;
  if (data.priceRange) schema.priceRange = data.priceRange;
  if (data.geoLatitude && data.geoLongitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.geoLatitude,
      longitude: data.geoLongitude
    };
  }

  return JSON.stringify(schema, null, 2);
};

/**
 * Generate JSON-LD structured data for Organization
 */
export const generateOrganizationStructuredData = (data: {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  foundingDate?: string;
  numberOfEmployees?: number;
  address?: string;
}): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name
  };

  if (data.url) schema.url = data.url;
  if (data.logo) schema.logo = data.logo;
  if (data.description) schema.description = data.description;
  if (data.foundingDate) schema.foundingDate = data.foundingDate;
  if (data.numberOfEmployees) schema.numberOfEmployees = data.numberOfEmployees;
  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address
    };
  }

  return JSON.stringify(schema, null, 2);
};

/**
 * Ping search engines about sitemap update
 * Note: This is a client-side helper. In production, this should be done server-side.
 */
export const pingSearchEngines = async (sitemapUrl: string): Promise<{
  google: boolean;
  bing: boolean;
}> => {
  const results = {
    google: false,
    bing: false
  };

  try {
    // Ping Google
    const googleResponse = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );
    results.google = googleResponse.ok;
  } catch (error) {
    console.error('Google ping failed:', error);
  }

  try {
    // Ping Bing
    const bingResponse = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );
    results.bing = bingResponse.ok;
  } catch (error) {
    console.error('Bing ping failed:', error);
  }

  return results;
};

/**
 * Auto-update sitemap with new URL
 */
export const addToSitemap = (
  existingSitemap: SitemapEntry[],
  newUrl: SitemapEntry
): SitemapEntry[] => {
  // Check if URL already exists
  const exists = existingSitemap.some(entry => entry.url === newUrl.url);

  if (exists) {
    // Update existing entry
    return existingSitemap.map(entry =>
      entry.url === newUrl.url ? { ...entry, ...newUrl } : entry
    );
  }

  // Add new entry
  return [...existingSitemap, newUrl];
};

/**
 * Generate robots.txt with sitemap reference
 */
export const generateRobotsTxtWithSitemap = (
  rules: RobotsRule[],
  sitemapUrl: string
): string => {
  const robotsContent = generateRobotsTxt(rules);
  return `${robotsContent}\n\nSitemap: ${sitemapUrl}`;
};

/**
 * Validate structured data
 */
export const validateStructuredData = (jsonLd: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  try {
    const schema = JSON.parse(jsonLd);

    // Check for required fields
    if (!schema['@context']) {
      errors.push('Missing @context field');
    }
    if (!schema['@type']) {
      errors.push('Missing @type field');
    }

    // Validate context URL
    if (schema['@context'] && schema['@context'] !== 'https://schema.org') {
      errors.push('Invalid @context value (should be https://schema.org)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      valid: false,
      errors: ['Invalid JSON format']
    };
  }
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (
  baseUrl: string,
  path: string,
  params?: Record<string, string>
): string => {
  try {
    const url = new URL(path, baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    // Remove tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
    trackingParams.forEach(param => url.searchParams.delete(param));

    return url.toString();
  } catch {
    return path.startsWith('http') ? path : `${baseUrl}${path}`;
  }
};

/**
 * Extract meta tags from HTML
 */
export const extractMetaTagsFromHtml = (html: string): {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
} => {
  const result: any = {};

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1];

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (descMatch) result.description = descMatch[1];

  // Extract OG tags
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (ogTitleMatch) result.ogTitle = ogTitleMatch[1];

  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (ogDescMatch) result.ogDescription = ogDescMatch[1];

  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (ogImageMatch) result.ogImage = ogImageMatch[1];

  // Extract Twitter card
  const twitterCardMatch = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (twitterCardMatch) result.twitterCard = twitterCardMatch[1];

  return result;
};

/**
 * Generate SEO audit report
 */
export const generateSEOAuditReport = async (
  url: string
): Promise<{
  score: number;
  maxScore: number;
  issues: SEOIssue[];
  warnings: SEOIssue[];
  passes: SEOIssue[];
}> => {
  const issues: SEOIssue[] = [];
  const warnings: SEOIssue[] = [];
  const passes: SEOIssue[] = [];
  let score = 0;
  const maxScore = 100;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const metaTags = extractMetaTagsFromHtml(html);

    // SSL Check
    if (url.startsWith('https://')) {
      passes.push({
        category: 'Security',
        message: 'Website uses HTTPS',
        severity: 'info'
      });
      score += 10;
    } else {
      issues.push({
        category: 'Security',
        message: 'Website does not use HTTPS',
        severity: 'critical',
        recommendation: 'Install an SSL certificate'
      });
    }

    // Title Check
    if (metaTags.title) {
      if (metaTags.title.length >= 50 && metaTags.title.length <= 60) {
        passes.push({
          category: 'Meta Tags',
          message: 'Title length is optimal',
          severity: 'info'
        });
        score += 15;
      } else {
        warnings.push({
          category: 'Meta Tags',
          message: `Title is ${metaTags.title.length} characters (optimal: 50-60)`,
          severity: 'warning',
          recommendation: 'Adjust title length to 50-60 characters'
        });
        score += 8;
      }
    } else {
      issues.push({
        category: 'Meta Tags',
        message: 'Missing title tag',
        severity: 'critical',
        recommendation: 'Add a title tag to your page'
      });
    }

    // Description Check
    if (metaTags.description) {
      if (metaTags.description.length >= 150 && metaTags.description.length <= 160) {
        passes.push({
          category: 'Meta Tags',
          message: 'Meta description length is optimal',
          severity: 'info'
        });
        score += 15;
      } else {
        warnings.push({
          category: 'Meta Tags',
          message: `Description is ${metaTags.description.length} characters (optimal: 150-160)`,
          severity: 'warning',
          recommendation: 'Adjust description length to 150-160 characters'
        });
        score += 8;
      }
    } else {
      issues.push({
        category: 'Meta Tags',
        message: 'Missing meta description',
        severity: 'critical',
        recommendation: 'Add a meta description to your page'
      });
    }

    // Open Graph Check
    if (metaTags.ogTitle && metaTags.ogDescription) {
      passes.push({
        category: 'Open Graph',
        message: 'Open Graph tags are present',
        severity: 'info'
      });
      score += 10;
    } else {
      warnings.push({
        category: 'Open Graph',
        message: 'Missing or incomplete Open Graph tags',
        severity: 'warning',
        recommendation: 'Add complete Open Graph tags for better social media sharing'
      });
      score += 5;
    }

    // Twitter Card Check
    if (metaTags.twitterCard) {
      passes.push({
        category: 'Twitter Card',
        message: 'Twitter Card is configured',
        severity: 'info'
      });
      score += 10;
    } else {
      warnings.push({
        category: 'Twitter Card',
        message: 'Missing Twitter Card',
        severity: 'warning',
        recommendation: 'Add Twitter Card meta tags for better Twitter sharing'
      });
      score += 5;
    }

    // H1 Check
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
    if (h1Matches) {
      if (h1Matches.length === 1) {
        passes.push({
          category: 'Content',
          message: 'Page has exactly one H1 heading',
          severity: 'info'
        });
        score += 10;
      } else if (h1Matches.length > 1) {
        warnings.push({
          category: 'Content',
          message: `Page has ${h1Matches.length} H1 headings`,
          severity: 'warning',
          recommendation: 'Use only one H1 heading per page'
        });
        score += 5;
      }
    } else {
      issues.push({
        category: 'Content',
        message: 'Missing H1 heading',
        severity: 'critical',
        recommendation: 'Add one H1 heading to your page'
      });
    }

    // Image Alt Check
    const imgMatches = html.match(/<img[^>]*>/gi);
    if (imgMatches) {
      const imagesWithoutAlt = imgMatches.filter(img => !img.includes('alt='));
      const altRatio = 1 - (imagesWithoutAlt.length / imgMatches.length);

      if (altRatio === 1) {
        passes.push({
          category: 'Accessibility',
          message: 'All images have alt text',
          severity: 'info'
        });
        score += 10;
      } else if (altRatio >= 0.8) {
        warnings.push({
          category: 'Accessibility',
          message: `${Math.round(altRatio * 100)}% of images have alt text`,
          severity: 'warning',
          recommendation: 'Add alt text to remaining images'
        });
        score += 7;
      } else {
        issues.push({
          category: 'Accessibility',
          message: 'Many images are missing alt text',
          severity: 'critical',
          recommendation: 'Add descriptive alt text to all images'
        });
        score += 3;
      }
    }

    // Canonical Link Check
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
    if (canonicalMatch) {
      passes.push({
        category: 'Technical SEO',
        message: 'Canonical URL is set',
        severity: 'info'
      });
      score += 10;
    } else {
      warnings.push({
        category: 'Technical SEO',
        message: 'Missing canonical URL',
        severity: 'warning',
        recommendation: 'Add a canonical link to prevent duplicate content issues'
      });
      score += 5;
    }

  } catch (error) {
    issues.push({
      category: 'General',
      message: `Failed to audit URL: ${error}`,
      severity: 'critical'
    });
  }

  return {
    score,
    maxScore,
    issues,
    warnings,
    passes
  };
};
