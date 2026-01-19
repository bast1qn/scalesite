/**
 * ✅ PERFORMANCE PHASE 3: Dynamic Chunk Loading
 *
 * Optimiert das Laden von schweren Dependencies durch:
 * - Dynamic Imports für Code-Splitting
 * - Lazy Loading von selten genutzten Features
 * - Prefetching von wahrscheinlichen nächsten Pages
 */

// ✅ PERFORMANCE: Lazy load Recharts nur wenn Analytics Pages besucht werden
export async function loadCharts() {
  const { BarChart, LineChart, PieChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = await import('recharts');
  return { BarChart, LineChart, PieChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer };
}

// ✅ PERFORMANCE: Lazy load jsPDF nur wenn PDF Export benötigt wird
export async function loadPDF() {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
}

// ✅ PERFORMANCE: Lazy load html2canvas nur wenn Screenshot benötigt wird
export async function loadHtml2Canvas() {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas;
}

// ✅ PERFORMANCE: Lazy load Google AI nur wenn AI Features genutzt werden
export async function loadGoogleAI() {
  const { GoogleGenerativeAI } = await import('@google/genai');
  return GoogleGenerativeAI;
}

// ✅ PERFORMANCE: Lazy load Supabase nur wenn direkt genutzt wird (nicht durch Clerk)
export async function loadSupabase() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient;
}

/**
 * Chunk Prefetch Helper
 * Prefetched Chunks basierend auf User Intent
 */
export function prefetchChunk(chunkImporter: () => Promise<any>) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      chunkImporter().catch(() => {
        // Silently fail - prefetching is optional
      });
    });
  } else {
    // Fallback für Browser ohne requestIdleCallback
    setTimeout(() => {
      chunkImporter().catch(() => {
        // Silently fail
      });
    }, 2000);
  }
}

/**
 * Strategisches Prefetching basierend auf Route
 */
export function prefetchForRoute(route: string) {
  switch (route) {
    case 'home':
      // Prefetch Charts wenn User auf Home ist (Analytics ist wahrscheinliche nächste Page)
      prefetchChunk(loadCharts);
      break;
    case 'analytics':
      // Analytics Page lädt Charts bereits, prefetche nichts
      break;
    case 'dashboard':
      // Prefetch Charts für Dashboard Analytics
      prefetchChunk(loadCharts);
      break;
    default:
      // Kein Prefetching
      break;
  }
}
