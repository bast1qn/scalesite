/**
 * Web Worker: SEO Analyzer
 *
 * PERFORMANCE: Offloads SEO analysis to background thread
 * - Analyzes large HTML documents without blocking UI
 * - Calculates keyword density, readability scores
 * - Generates SEO recommendations
 *
 * @usage
 * const worker = new Worker(new URL('./seoAnalyzer.worker.ts', import.meta.url));
 * worker.postMessage({ type: 'analyze', html: '<html>...</html>' });
 * worker.onmessage = (e) => console.log(e.data.result);
 */

export interface SEOAnalysisInput {
  html: string;
  url?: string;
  keywords?: string[];
}

export interface SEOAnalysisResult {
  title?: {
    content: string;
    length: number;
    status: 'good' | 'warning' | 'error';
    message: string;
  };
  metaDescription?: {
    content: string;
    length: number;
    status: 'good' | 'warning' | 'error';
    message: string;
  };
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  recommendations: string[];
  score: number;
}

self.onmessage = (e: MessageEvent<SEOAnalysisInput>) => {
  const { html, url, keywords = [] } = e.data;

  // Perform heavy SEO analysis
  const result = analyzeSEO({ html, url, keywords });

  // Send result back to main thread
  self.postMessage({ type: 'result', result });
};

function analyzeSEO(input: SEOAnalysisInput): SEOAnalysisResult {
  const { html, keywords } = input;

  // Parse HTML (basic string parsing for performance)
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

  // Count headings
  const headings = {
    h1: (html.match(/<h1[^>]*>/gi) || []).length,
    h2: (html.match(/<h2[^>]*>/gi) || []).length,
    h3: (html.match(/<h3[^>]*>/gi) || []).length,
    h4: (html.match(/<h4[^>]*>/gi) || []).length,
    h5: (html.match(/<h5[^>]*>/gi) || []).length,
    h6: (html.match(/<h6[^>]*>/gi) || []).length,
  };

  // Remove HTML tags for text analysis
  const text = html.replace(/<script[^>]*>.*?<\/script>/gis, '')
                   .replace(/<style[^>]*>.*?<\/style>/gis, '')
                   .replace(/<[^>]+>/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim();

  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Calculate readability score (simplified Flesch Reading Ease)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = wordCount / Math.max(1, sentences.length);
  const avgSyllablesPerWord = 1.5; // Simplified
  const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  // Calculate keyword density
  const keywordDensity: Record<string, number> = {};
  const lowerWords = words.map(w => w.toLowerCase());

  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    const count = lowerWords.filter(w => w.includes(lowerKeyword)).length;
    keywordDensity[keyword] = (count / wordCount) * 100;
  });

  // Generate recommendations
  const recommendations: string[] = [];

  if (title.length < 30) {
    recommendations.push('Title tag is too short. Aim for 50-60 characters.');
  } else if (title.length > 60) {
    recommendations.push('Title tag is too long. Keep it under 60 characters.');
  }

  if (metaDescription.length < 120) {
    recommendations.push('Meta description is too short. Aim for 150-160 characters.');
  } else if (metaDescription.length > 160) {
    recommendations.push('Meta description is too long. Keep it under 160 characters.');
  }

  if (headings.h1 === 0) {
    recommendations.push('Missing H1 heading. Add one for better SEO.');
  } else if (headings.h1 > 1) {
    recommendations.push('Multiple H1 headings found. Use only one H1 per page.');
  }

  if (wordCount < 300) {
    recommendations.push('Content is too short. Aim for at least 300 words.');
  }

  // Calculate overall SEO score
  let score = 100;
  if (title.length < 30 || title.length > 60) score -= 10;
  if (metaDescription.length < 120 || metaDescription.length > 160) score -= 10;
  if (headings.h1 === 0 || headings.h1 > 1) score -= 15;
  if (wordCount < 300) score -= 20;
  if (readabilityScore < 30) score -= 10;

  return {
    title: {
      content: title,
      length: title.length,
      status: title.length >= 30 && title.length <= 60 ? 'good' : title.length > 0 ? 'warning' : 'error',
      message: title.length >= 30 && title.length <= 60 ? 'Good length' : 'Aim for 50-60 characters',
    },
    metaDescription: {
      content: metaDescription,
      length: metaDescription.length,
      status: metaDescription.length >= 120 && metaDescription.length <= 160 ? 'good' : metaDescription.length > 0 ? 'warning' : 'error',
      message: metaDescription.length >= 120 && metaDescription.length <= 160 ? 'Good length' : 'Aim for 150-160 characters',
    },
    headings,
    wordCount,
    readabilityScore: Math.round(readabilityScore),
    keywordDensity,
    recommendations,
    score: Math.max(0, score),
  };
}

// Export worker creation helper
export function createSEOAnalyzerWorker() {
  return new Worker(new URL('./seoAnalyzer.worker.ts', import.meta.url), {
    type: 'module',
  });
}
