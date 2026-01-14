import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// ✅ PERFORMANCE: Remove FOIT by adding 'loaded' class after mount
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Add loaded class to show content after React mounts
if (rootElement) {
  requestAnimationFrame(() => {
    rootElement.classList.add('loaded');
  });
}
// Cache bust: Mi 14. Jan 07:43:56 CET 2026
// FORCE REBUILD: $(date +%s)
