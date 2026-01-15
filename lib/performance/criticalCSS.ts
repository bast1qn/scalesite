/**
 * CRITICAL CSS & RESOURCE HINTS
 *
 * PERFORMANCE: Extracts critical CSS for above-the-fold content
 * - Reduces render-blocking resources
 * - Improves First Contentful Paint (FCP)
 * - Strategic preloading of key resources
 */

// Critical CSS for above-the-fold content
export const CRITICAL_CSS = `
  /* Reset & Base */
  *,*::before,*::after{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0)}
  body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5}

  /* Critical Layout */
  .min-h-screen{min-height:100vh}
  .flex{display:flex}
  .items-center{align-items:center}
  .justify-center{justify-content:center}
  .justify-between{justify-content:space-between}
  .gap-4{gap:1rem}
  .gap-6{gap:1.5rem}
  .px-4{padding-left:1rem;padding-right:1rem}
  .py-4{padding-top:1rem;padding-bottom:1rem}
  .p-4{padding:1rem}
  .p-6{padding:1.5rem}
  .p-8{padding:2rem}
  .mb-4{margin-bottom:1rem}
  .mb-6{margin-bottom:1.5rem}
  .mb-8{margin-bottom:2rem}
  .mt-4{margin-top:1rem}
  .mt-6{margin-top:1.5rem}
  .mt-8{margin-top:2rem}

  /* Critical Typography */
  .text-sm{font-size:0.875rem;line-height:1.25rem}
  .text-base{font-size:1rem;line-height:1.5rem}
  .text-lg{font-size:1.125rem;line-height:1.75rem}
  .text-xl{font-size:1.25rem;line-height:1.75rem}
  .text-2xl{font-size:1.5rem;line-height:2rem}
  .text-3xl{font-size:1.875rem;line-height:2.25rem}
  .text-4xl{font-size:2.25rem;line-height:2.5rem}
  .font-light{font-weight:300}
  .font-normal{font-weight:400}
  .font-medium{font-weight:500}
  .font-semibold{font-weight:600}
  .font-bold{font-weight:700}
  .text-center{text-align:center}
  .text-left{text-align:left}
  .text-right{text-align:right}
  .text-slate-900{color:#0f172a}
  .text-slate-700{color:#334155}
  .text-slate-600{color:#475569}
  .text-slate-500{color:#64748b}
  .text-white{color:#ffffff}

  /* Critical Colors & Backgrounds */
  .bg-white{background-color:#ffffff}
  .bg-slate-50{background-color:#f8fafc}
  .bg-slate-100{background-color:#f1f5f9}
  .bg-slate-900{background-color:#0f172a}
  .bg-primary-500{background-color:#3b82f6}
  .bg-primary-600{background-color:#2563eb}
  .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
  .from-primary-500{--tw-gradient-from:#3b82f6;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(59,130,246,0))}
  .to-violet-600{--tw-gradient-to:#7c3aed}
  .from-violet-600{--tw-gradient-from:#7c3aed}
  .to-primary-500{--tw-gradient-to:#3b82f6}

  /* Critical Spacing */
  .container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
  @media(min-width:640px){.container{max-width:640px}}
  @media(min-width:768px){.container{max-width:768px}}
  @media(min-width:1024px){.container{max-width:1024px}}
  @media(min-width:1280px){.container{max-width:1280px}}

  /* Critical Interactive Elements */
  .inline-block{display:inline-block}
  .block{display:block}
  .hidden{display:none}
  .rounded{border-radius:0.25rem}
  .rounded-lg{border-radius:0.5rem}
  .rounded-full{border-radius:9999px}
  .shadow{box-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)}
  .shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)}
  .transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter}
  .duration-200{transition-duration:200ms}
  .duration-300{transition-duration:300ms}
  .ease-in-out{transition-timing-function:cubic-bezier(0.4,0,0.2,1)}

  /* Critical Buttons */
  .btn-primary{display:inline-flex;align-items:center;justify-content:center;padding:0.75rem 1.5rem;font-weight:600;border-radius:0.5rem;transition:all 0.2s;background:linear-gradient(to right,#3b82f6,#7c3aed);color:#ffffff;border:none;cursor:pointer}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(59,130,246,0.3)}
  .btn-primary:active{transform:translateY(0)}

  /* Navigation */
  nav{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border-bottom:1px solid #e2e8f0}
  nav .container{display:flex;align-items:center;justify-content:space-between;height:4rem}

  /* Loading States */
  .animate-spin{animation:spin 1s linear infinite}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .animate-pulse{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}

  /* Hero Section */
  .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem}
  .hero h1{font-size:clamp(2.5rem,5vw,4rem);font-weight:800;line-height:1.1;margin-bottom:1.5rem;background:linear-gradient(135deg,#0f172a 0%,#3b82f6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .hero p{font-size:1.25rem;color:#64748b;max-width:600px;margin:0 auto 2rem}

  /* Fade In Animation */
  @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .fade-in{animation:fadeIn 0.6s ease-out}

  /* Hide scrollbar for clean UI */
  .no-scrollbar::-webkit-scrollbar{display:none}
  .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
`;

/**
 * Inject critical CSS into head
 */
export const injectCriticalCSS = () => {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = CRITICAL_CSS;
  document.head.appendChild(style);
};

/**
 * Resource hints for performance optimization
 */
export const addResourceHints = () => {
  if (typeof document === 'undefined') return;

  const head = document.head;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.clerk.com',
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
  });

  // Prefetch high-priority pages
  const prefetchPages = [
    '/leistungen',
    '/projekte',
    '/preise',
  ];

  prefetchPages.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    link.as = 'document';
    head.appendChild(link);
  });

  // Preload critical fonts
  const preloadFonts = [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      as: 'style',
      type: 'text/css',
    },
  ];

  preloadFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.href;
    link.as = font.as as any;
    if (font.type) link.type = font.type;
    head.appendChild(link);
  });
};

/**
 * DNS prefetch for low-priority external domains
 */
export const dnsPrefetch = () => {
  if (typeof document === 'undefined') return;

  const domains = [
    'https://www.google-analytics.com',
    'https://stats.g.doubleclick.net',
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

/**
 * Initialize all performance optimizations
 */
export const initPerformanceOptimizations = () => {
  if (typeof window === 'undefined') return;

  // Inject critical CSS immediately
  injectCriticalCSS();

  // Add resource hints
  addResourceHints();

  // DNS prefetch
  dnsPrefetch();

  // Mark critical CSS as loaded
  if (window.performance) {
    window.performance.mark('critical-css-loaded');
  }
};

/**
 * Remove critical CSS after full load (non-blocking CSS loaded)
 */
export const removeCriticalCSS = () => {
  if (typeof document === 'undefined') return;

  const criticalStyle = document.getElementById('critical-css');
  if (criticalStyle) {
    criticalStyle.remove();
  }
};

/**
 * Prefetch route chunks for navigation
 */
export const prefetchRoute = (routePath: string) => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  link.as = 'document';
  document.head.appendChild(link);
};

/**
 * Preload component chunk
 */
export const preloadComponent = (chunkName: string) => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = `/assets/${chunkName}.js`;
  link.as = 'script';
  document.head.appendChild(link);
};
