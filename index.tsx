// ========================================================================
// IMPORTS - Organized by: React → External → Internal → Types
// ========================================================================

// React
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Internal - Components
import App from './App';

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

// Cache bust: Mi 14. Jan 07:43:56 CET 2026
// FORCE REBUILD: $(date +%s)
