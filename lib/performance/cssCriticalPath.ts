/**
 * CSS CRITICAL PATH OPTIMIZATION
 * Inlines critical CSS, async loads non-critical styles
 *
 * @performance
 * - Reduces First Contentful Paint (FCP)
 * - Minimizes render-blocking resources
 * - Improves LCP by prioritizing above-the-fold styles
 */

/**
 * Critical CSS for above-the-fold content
 * These styles should be inlined in the HTML head
 */
export const CRITICAL_CSS = `
/* Reset & Base */
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:100px}
body{margin:0;padding:0;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}

/* Critical Layout */
#root{min-height:100vh}
header{position:fixed;top:0;left:0;right:0;z-index:50}
main{flex-grow:1;width:100%}

/* Critical Typography - Prevent FOIT/FOUT */
@font-face{font-family:'Inter';font-display:swap;font-stretch:normal;font-style:normal}
@font-face{font-family:'Plus Jakarta Sans';font-display:swap;font-stretch:normal;font-style:normal}
@font-face{font-family:'Outfit';font-display:swap;font-stretch:normal;font-style:normal}

/* Critical Loading States */
[data-skeleton]{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:skeleton-loading 1.5s ease-in-out infinite}
@keyframes skeleton-loading{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Critical Aspect Ratios - Prevent CLS */
.aspect-ratio-box{position:relative;overflow:hidden}
.aspect-ratio-box::before{content:"";display:block;width:100%;padding-bottom:var(--aspect-ratio)}
.aspect-ratio-box>*{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
`;

/**
 * Generate critical CSS hash for cache busting
 */
export function generateCriticalCSSHash(): string {
  // Simple hash for versioning
  let hash = 0;
  for (let i = 0; i < CRITICAL_CSS.length; i++) {
    const char = CRITICAL_CSS.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Inline critical CSS into document head
 * Call this during SSR or in index.html
 */
export function inlineCriticalCSS(): void {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.setAttribute('data-critical', 'true');
  style.setAttribute('data-hash', generateCriticalCSSHash());
  style.textContent = CRITICAL_CSS;

  // Insert before first style or link tag
  const firstStyle = document.querySelector('style, link[rel="stylesheet"]');
  if (firstStyle) {
    firstStyle.before(style);
  } else {
    document.head.prepend(style);
  }
}

/**
 * Extract critical CSS from stylesheet
 * This would be used at build time with tools like PurgeCSS
 */
export function extractCriticalCSS(
  fullCSS: string,
  selectors: string[]
): string {
  const lines = fullCSS.split('\n');
  const criticalRules: string[] = [];
  let currentRule: string[] = [];
  let inRule = false;

  for (const line of lines) {
    // Check if line contains a critical selector
    const isCritical = selectors.some(selector =>
      line.includes(selector)
    );

    if (isCritical || inRule) {
      currentRule.push(line);

      if (line.includes('}')) {
        criticalRules.push(currentRule.join('\n'));
        currentRule = [];
        inRule = false;
      } else if (line.includes('{')) {
        inRule = true;
      }
    }
  }

  return criticalRules.join('\n');
}

/**
 * Critical selectors for above-the-fold content
 */
export const CRITICAL_SELECTORS = [
  'header',
  'nav',
  '.hero',
  'h1',
  'h2',
  'h3',
  'button',
  'a',
  'img',
  '#root',
  'main',
];

/**
 * Load non-critical CSS asynchronously
 */
export function loadCSSAsync(href: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.onload = () => {
    link.rel = 'stylesheet';
  };
  document.head.appendChild(link);
}

/**
 * Preconnect to font origins
 */
export function setupFontPreconnect(): void {
  if (typeof document === 'undefined') return;

  const origins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  origins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Font display strategy
 * swap = Hide text, show font immediately when loaded (prevents CLS)
 * block = Show text immediately, wait for font (prevents FOIT)
 * optional = Use system font if font takes too long
 */
export const FONT_DISPLAY_STRATEGIES = {
  swap: 'font-display: swap;', // Prevents layout shift
  block: 'font-display: block;', // Prevents invisible text
  optional: 'font-display: optional;', // Best of both
  fallback: 'font-display: fallback;', // Short block period
} as const;

/**
 * Optimize font loading
 */
export function optimizeFontLoading(): void {
  if (typeof document === 'undefined') return;

  // Add font-display swap to all @font-face rules
  const styles = document.querySelectorAll('style');
  styles.forEach(style => {
    const css = style.textContent || '';
    if (css.includes('@font-face') && !css.includes('font-display')) {
      // Inject font-display: swap
      style.textContent = css.replace(
        /@font-face\s*{([^}]+)}/g,
        (match, rules) => {
          if (!rules.includes('font-display')) {
            return `@font-face{${rules}font-display:swap;}`;
          }
          return match;
        }
      );
    }
  });
}

/**
 * CSS bundle optimization
 * Splits CSS into critical and non-critical bundles
 */
export interface CSSBundles {
  critical: string;
  nonCritical: string;
}

export function splitCSSBundles(fullCSS: string): CSSBundles {
  const critical = extractCriticalCSS(fullCSS, CRITICAL_SELECTORS);
  const nonCritical = fullCSS
    .split('\n')
    .filter(line => !critical.includes(line))
    .join('\n');

  return {
    critical,
    nonCritical,
  };
}

/**
 * Measure critical CSS size
 */
export function measureCriticalCSS(css: string): {
  size: number;
  gzip: number;
  brotli: number;
} {
  const size = new Blob([css]).size;

  // Rough estimates for compression ratios
  const gzip = Math.round(size * 0.3);
  const brotli = Math.round(size * 0.2);

  return { size, gzip, brotli };
}

/**
 * Performance target for critical CSS
 */
export const CRITICAL_CSS_TARGETS = {
  maxSize: 15 * 1024, // 15KB uncompressed
  maxGzip: 5 * 1024, // 5KB gzipped
  maxSelectorCount: 100, // Maximum selectors
} as const;

/**
 * Validate critical CSS
 */
export function validateCriticalCSS(css: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const metrics = measureCriticalCSS(css);

  if (metrics.size > CRITICAL_CSS_TARGETS.maxSize) {
    errors.push(`Critical CSS too large: ${metrics.size}b (max: ${CRITICAL_CSS_TARGETS.maxSize}b)`);
  }

  if (metrics.gzip > CRITICAL_CSS_TARGETS.maxGzip) {
    errors.push(`Critical CSS gzip too large: ${metrics.gzip}b (max: ${CRITICAL_CSS_TARGETS.maxGzip}b)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Init critical CSS optimizations
 */
export function initCriticalCSS(): void {
  if (typeof document === 'undefined') return;

  // Inline critical CSS
  inlineCriticalCSS();

  // Setup font preconnects
  setupFontPreconnect();

  // Optimize font loading
  optimizeFontLoading();

  // Load non-critical CSS async
  // This would be done by Vite automatically
}
