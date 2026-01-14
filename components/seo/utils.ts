// ============================================
// SEO UTILITY FUNCTIONS
// ============================================

import { TwitterCardData, OpenGraphData } from './types';
import {
  TWITTER_IMAGE_MAX_SIZE_BYTES,
  TWITTER_DEBOUNCE_DELAY_MS,
} from './constants';

// ============================================
// FILE VALIDATION
// ============================================

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File must be an image',
    };
  }

  if (file.size > TWITTER_IMAGE_MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Image must be less than ${TWITTER_IMAGE_MAX_SIZE_BYTES / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
}

// ============================================
// TAG GENERATION
// ============================================

export function generateTwitterCardTags(data: TwitterCardData, uploadedImageUrl?: string): string[] {
  const tags: string[] = [];

  tags.push(`<meta name="twitter:card" content="${data.cardType}" />`);

  if (data.site) tags.push(`<meta name="twitter:site" content="${data.site}" />`);
  if (data.siteId) tags.push(`<meta name="twitter:site:id" content="${data.siteId}" />`);
  if (data.creator) tags.push(`<meta name="twitter:creator" content="${data.creator}" />`);
  if (data.creatorId) tags.push(`<meta name="twitter:creator:id" content="${data.creatorId}" />`);

  if (data.title) tags.push(`<meta name="twitter:title" content="${data.title}" />`);
  if (data.description) tags.push(`<meta name="twitter:description" content="${data.description}" />`);

  const imageUrl = uploadedImageUrl || data.image;
  if (imageUrl) {
    tags.push(`<meta name="twitter:image" content="${imageUrl}" />`);
    if (data.imageAlt) {
      tags.push(`<meta name="twitter:image:alt" content="${data.imageAlt}" />`);
    }
  }

  if (data.cardType === 'player') {
    if (data.player) tags.push(`<meta name="twitter:player" content="${data.player}" />`);
    if (data.playerWidth) tags.push(`<meta name="twitter:player:width" content="${data.playerWidth}" />`);
    if (data.playerHeight) tags.push(`<meta name="twitter:player:height" content="${data.playerHeight}" />`);
  }

  if (data.cardType === 'app') {
    if (data.iphoneName) tags.push(`<meta name="twitter:app:name:iphone" content="${data.iphoneName}" />`);
    if (data.iphoneId) tags.push(`<meta name="twitter:app:id:iphone" content="${data.iphoneId}" />`);
    if (data.iphoneUrl) tags.push(`<meta name="twitter:app:url:iphone" content="${data.iphoneUrl}" />`);

    if (data.ipadName) tags.push(`<meta name="twitter:app:name:ipad" content="${data.ipadName}" />`);
    if (data.ipadId) tags.push(`<meta name="twitter:app:id:ipad" content="${data.ipadId}" />`);
    if (data.ipadUrl) tags.push(`<meta name="twitter:app:url:ipad" content="${data.ipadUrl}" />`);

    if (data.googlePlayName) tags.push(`<meta name="twitter:app:name:googleplay" content="${data.googlePlayName}" />`);
    if (data.googlePlayId) tags.push(`<meta name="twitter:app:id:googleplay" content="${data.googlePlayId}" />`);
    if (data.googlePlayUrl) tags.push(`<meta name="twitter:app:url:googleplay" content="${data.googlePlayUrl}" />`);
  }

  return tags;
}

export function generateOpenGraphTags(data: OpenGraphData): string[] {
  const tags: string[] = [];

  if (data.ogTitle) tags.push(`<meta property="og:title" content="${data.ogTitle}" />`);
  tags.push(`<meta property="og:type" content="${data.ogType}" />`);
  if (data.ogUrl) tags.push(`<meta property="og:url" content="${data.ogUrl}" />`);
  if (data.ogImage) tags.push(`<meta property="og:image" content="${data.ogImage}" />`);
  if (data.ogDescription) tags.push(`<meta property="og:description" content="${data.ogDescription}" />`);
  if (data.ogSiteName) tags.push(`<meta property="og:site_name" content="${data.ogSiteName}" />`);
  if (data.ogLocale) tags.push(`<meta property="og:locale" content="${data.ogLocale}" />`);
  if (data.ogDeterminer) tags.push(`<meta property="og:determiner" content="${data.ogDeterminer}" />`);
  if (data.ogAudio) tags.push(`<meta property="og:audio" content="${data.ogAudio}" />`);
  if (data.ogVideo) tags.push(`<meta property="og:video" content="${data.ogVideo}" />`);

  if (data.ogType === 'article') {
    if (data.articleAuthor) tags.push(`<meta property="article:author" content="${data.articleAuthor}" />`);
    if (data.articlePublishedTime) tags.push(`<meta property="article:published_time" content="${data.articlePublishedTime}" />`);
    if (data.articleModifiedTime) tags.push(`<meta property="article:modified_time" content="${data.articleModifiedTime}" />`);
    if (data.articleSection) tags.push(`<meta property="article:section" content="${data.articleSection}" />`);
    (data.articleTag || []).forEach(tag => {
      if (tag) tags.push(`<meta property="article:tag" content="${tag}" />`);
    });
  }

  return tags;
}

// ============================================
// URL VALIDATION
// ============================================

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// CLIPBOARD OPERATIONS
// ============================================

export function copyTagsToClipboard(tags: string[]): Promise<void> {
  const html = tags.join('\n');
  return navigator.clipboard.writeText(html);
}

export function downloadTagsAsHtml(tags: string[], filename: string): void {
  const html = tags.join('\n');
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// IMAGE UPLOAD
// ============================================

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================
// DEBOUNCE UTILITY
// ============================================

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = TWITTER_DEBOUNCE_DELAY_MS
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// FIELD VALIDATION
// ============================================

export function validateRequiredField(value: string): boolean {
  return value.trim().length > 0;
}

export function validateUrlField(value: string): boolean {
  return validateRequiredField(value) && isValidUrl(value);
}
