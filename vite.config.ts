import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: false, // Disable HMR to prevent WebSocket errors
        watch: {
          usePolling: false
        }
      },
      plugins: [react({
        jsxImportSource: 'react',
        babel: {
          plugins: []
        }
      })],
      cacheDir: false,
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
        force: true
      },
      define: {
        // ✅ SECURITY: NEVER expose API keys to client-side code!
        // Use backend proxy or server-side rendering instead (OWASP A01:2021)
        // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY), // ❌ REMOVED: Security risk
        // 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY), // ❌ REMOVED: Security risk
      },
      resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'es2020',
        minify: 'terser', // ✅ PERFORMANCE: Enable Terser minification
        sourcemap: false,
        rollupOptions: {
          output: {
            // ✅ PERFORMANCE: Strategic manual chunks for better caching
            manualChunks: (id) => {
              // React Core (stable, rarely changes)
              if (id.includes('react') || id.includes('react-dom') || id.includes('react/jsx-runtime')) {
                return 'react-vendor';
              }
              // Supabase (large, separate chunk)
              if (id.includes('@supabase/supabase-js')) {
                return 'supabase';
              }
              // Heavy UI libraries
              if (id.includes('framer-motion')) {
                return 'motion';
              }
              // Charts - LAZY LOADED (only when AnalyticsPage loads)
              if (id.includes('recharts')) {
                return 'charts';
              }
              // Document generation (rarely used)
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'docs';
              }
              // Google AI (rarely used)
              if (id.includes('@google/genai')) {
                return 'ai-vendor';
              }
            }
          }
        }
      },
      // ✅ PERFORMANCE: Terser options for better compression
      esbuild: {
        target: 'es2020',
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      }
    };
});
