import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';

    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: false, // Disable HMR to prevent WebSocket errors
        watch: {
          usePolling: false
        }
      },
      plugins: [
        react({
          jsxImportSource: 'react',
          babel: {
            plugins: []
          }
        }),

        // ✅ PERFORMANCE: Brotli compression (best compression ratio)
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          compressionOptions: {
            level: 11, // Maximum compression
          },
          threshold: 1024, // Only compress files > 1KB
          deleteOriginFile: false,
        }),

        // ✅ PERFORMANCE: Gzip compression (fallback for older browsers)
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          compressionOptions: {
            level: 9, // Maximum compression
          },
          threshold: 1024,
          deleteOriginFile: false,
        }),

        // ✅ PERFORMANCE: Bundle analyzer for optimization insights
        isProduction && visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
      ],
      cacheDir: false,
      // ✅ PERFORMANCE: Pre-bundle strategy for optimal cold start
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react-router-dom',
          // ✅ PERFORMANCE FIX: Pre-bundle framer-motion for better tree-shaking
          // This allows Vite to analyze and eliminate unused motion components
          'framer-motion',
        ],
        // ✅ PERFORMANCE: Lazy load heavy libraries
        // NOTE: recharts removed from exclude to fix forwardRef error and MIME type issues
        exclude: ['jspdf', 'html2canvas', '@google/genai', '@supabase/supabase-js', '@clerk/clerk-js'],
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
        // ✅ PERFORMANCE: CSS code splitting
        cssCodeSplit: true,
        // ✅ PERFORMANCE ADVANCED: Module preload for faster navigation
        modulePreload: {
          polyfill: true, // Inject module preload polyfill for older browsers
        },
        // ✅ PERFORMANCE: Advanced Rollup optimizations
        rollupOptions: {
          external: ['@neondatabase/serverless'],
          output: {
            // ✅ PERFORMANCE: Strategic manual chunks for better caching
            manualChunks: (id) => {
              // ⚠️ PERFORMANCE FIX: Only create chunks that are actually used
              // Prevents empty chunks (router, supabase, upload were empty)

              // React Core - MUST be in vendor chunk to avoid loading issues
              if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('react/jsx-runtime')) {
                return 'react-core';
              }
              // UI Icons - separate chunk for better caching (ONLY if used)
              if (id.includes('lucide-react') && id.includes('node_modules')) {
                return 'icons';
              }
              // ✅ PERFORMANCE: Separate Recharts chunk (lazy-loaded, only on analytics pages)
              if (id.includes('recharts')) {
                return 'charts';
              }
              // ✅ PERFORMANCE: Framer Motion - lazy loaded
              if (id.includes('framer-motion')) {
                return 'motion';
              }
              // ⚠️ REMOVED: Supabase (was empty chunk - not used in this build)
              // Document generation (rarely used)
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'docs';
              }
              // Google AI (rarely used)
              if (id.includes('@google/genai')) {
                return 'ai-vendor';
              }
              // ⚠️ REMOVED: Router (was empty chunk - merged into vendor)
              // React Router is too small for separate chunk, merge into vendor to reduce HTTP requests

              // ✅ PERFORMANCE: Clerk authentication - split into separate chunks
              // @clerk/clerk-react is lightweight React wrapper
              if (id.includes('@clerk/clerk-react')) {
                return 'clerk-react';
              }
              // @clerk/clerk-js is heavy JS SDK (~200KB) - separate chunk
              if (id.includes('@clerk/clerk-js')) {
                return 'clerk-js';
              }
              // ⚠️ REMOVED: Upload (was empty chunk - merged into vendor)
              // React Dropzone is rarely used and too small for separate chunk

              // Class variance authority (UI utils) - merge into vendor
              // Too small for separate chunk

              // Other node_modules
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },
            // ✅ PERFORMANCE: Optimize chunk file names for long-term caching
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
            // ✅ PERFORMANCE: Preserve module signatures for better caching
            hoistTransitiveImports: false,
          },
          // ✅ PERFORMANCE: Advanced treeshaking
          treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
          },
        },
        // ✅ PERFORMANCE: Terser optimization options
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
            pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
            passes: 2, // Multiple compression passes
          },
          format: {
            comments: false, // Remove comments
          },
        },
      },
      // ✅ PERFORMANCE: Esbuild options for better minification
      esbuild: {
        target: 'es2020',
        drop: isProduction ? ['console', 'debugger'] : [],
      }
    };
});
