// ========================================================================
// IMPORTS - Organized by: React → External → Internal → Types
// ========================================================================

// React
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Internal - Components
import App from './App';

// ✅ PERFORMANCE ADVANCED: Service Worker & Core Web Vitals Monitoring
import { registerServiceWorker } from './lib/performance/serviceWorker';
import { initPerformanceMonitoring } from './lib/performance/monitoring';

// ========================================================================
// APPLICATION ENTRY POINT
// ========================================================================

/**
 * Find and validate root DOM element
 * @throws {Error} If root element is not found in DOM
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * Create React 18 root with concurrent features
 */
const root = ReactDOM.createRoot(rootElement);

/**
 * Render application with StrictMode for additional development checks
 * PERFORMANCE: Remove FOIT by adding 'loaded' class after mount
 */
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Add 'loaded' class to root element after React mounts
 * Prevents flash of unstyled content (FOUC) and enables fade-in animations
 */
if (rootElement) {
  requestAnimationFrame(() => {
    rootElement.classList.add('loaded');
  });
}

/**
 * ✅ PERFORMANCE ADVANCED: Initialize Service Worker for offline caching
 * - Caches static assets for instant repeat load (50-80% faster)
 * - Enables offline functionality
 * - Reduces server load
 */
registerServiceWorker().then(({ registration, updateAvailable }) => {
  if (import.meta.env.DEV) {
    console.log(
      '[SW] Service Worker' +
        (registration ? ' ✅' : ' ❌') +
        (updateAvailable ? ' | Update Available 🆕' : '')
    );
  }
}).catch(err => {
  if (import.meta.env.DEV) {
    console.warn('[SW] Registration failed:', err);
  }
});

/**
 * ✅ PERFORMANCE ADVANCED: Initialize Core Web Vitals Monitoring
 * Tracks LCP, FID, CLS, INP, FCP, TTFB for production analytics
 * Helps identify performance regressions before users complain
 */
if (import.meta.env.PROD) {
  // Initialize in production only (no performance overhead in dev)
  requestIdleCallback(() => {
    initPerformanceMonitoring().catch(err => {
      console.warn('[Performance] Monitoring init failed:', err);
    });
  });
}

