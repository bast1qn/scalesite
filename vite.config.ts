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
        include: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', 'recharts'],
        force: true
      },
      define: {
        // ✅ SECURITY: API keys are never exposed to client-side code (OWASP A01:2021)
        // All sensitive values are handled server-side via backend proxy
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
        // ✅ PERFORMANCE: Improve chunk size warnings threshold
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            // ✅ PERFORMANCE: Strategic manual chunks for better caching
            manualChunks: (id) => {
              // React Core (stable, rarely changes) - include React ecosystem
              if (id.includes('react') || id.includes('react-dom') || id.includes('react/jsx-runtime') || id.includes('recharts') || id.includes('lucide-react')) {
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
              // Document generation (rarely used)
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'docs';
              }
              // Google AI (rarely used)
              if (id.includes('@google/genai')) {
                return 'ai-vendor';
              }
              // ✅ PERFORMANCE: Separate router chunk
              if (id.includes('react-router-dom')) {
                return 'router';
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
