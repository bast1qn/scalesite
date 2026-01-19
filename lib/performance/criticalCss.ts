/**
 * ✅ PERFORMANCE PHASE 3: Critical CSS Optimization
 *
 * Generiert minimales Critical CSS für above-the-fold Content
 * Reduziert initialen CSS-Block durch Inline-CSS
 */

export const CRITICAL_CSS = `
  /* Critical CSS - Above the Fold Only */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
    line-height: 1.5;
    color: #18181b;
    background: #ffffff;
  }

  /* Prevent FOUC */
  #root {
    min-height: 100vh;
    opacity: 0;
  }

  #root.loaded {
    opacity: 1;
    transition: opacity 0.3s ease-in;
  }

  /* Loading Spinner */
  .page-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #ffffff;
  }

  /* Critical Layout */
  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  /* Dark Mode Prevention */
  @media (prefers-color-scheme: dark) {
    body {
      background: #000000;
      color: #fafafa;
    }
    .page-loader {
      background: #000000;
    }
  }
`;

/**
 * Inject Critical CSS into head
 * Use this in index.html or via script
 */
export function injectCriticalCSS() {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.setAttribute('data-critical', 'true');
  style.textContent = CRITICAL_CSS;

  // Insert before first stylesheet or at end of head
  const firstLink = document.querySelector('link[rel="stylesheet"]');
  if (firstLink && firstLink.parentNode) {
    firstLink.parentNode.insertBefore(style, firstLink);
  } else {
    document.head.appendChild(style);
  }
}

/**
 * Remove Critical CSS after page load
 * Frees memory and allows full CSS to take over
 */
export function removeCriticalCSS() {
  if (typeof window === 'undefined') return;

  // Remove after initial paint
  window.addEventListener('load', () => {
    setTimeout(() => {
      const criticalStyle = document.querySelector('style[data-critical="true"]');
      if (criticalStyle && criticalStyle.parentNode) {
        criticalStyle.parentNode.removeChild(criticalStyle);
      }
    }, 1000); // Keep for 1 second to ensure smooth transition
  });
}
