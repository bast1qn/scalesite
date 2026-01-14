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
            manualChunks: {
              // React Core (stable, rarely changes)
              'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
              // Supabase (large, separate chunk)
              'supabase': ['@supabase/supabase-js'],
              // Heavy UI libraries
              'motion': ['framer-motion'],
              'charts': ['recharts'],
              // Document generation (rarely used)
              'docs': ['jspdf', 'html2canvas'],
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
