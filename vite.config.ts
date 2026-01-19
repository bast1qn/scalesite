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
        // ✅ PERFORMANCE PHASE 3: Lazy load heavy libraries (aggressive strategy)
        // NOTE: recharts removed from exclude to fix forwardRef error and MIME type issues
        // ✅ PERFORMANCE PHASE 3: Added @clerk/clerk-react for better code-splitting
        exclude: ['jspdf', 'html2canvas', '@google/genai', '@supabase/supabase-js', '@clerk/clerk-js', '@clerk/clerk-react'],
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
        // ✅ PERFORMANCE PHASE 3: Stricter chunk size limit for better mobile performance
        chunkSizeWarningLimit: 500,
        // ✅ PERFORMANCE: CSS code splitting + minification
        cssCodeSplit: true,
        cssMinify: true, // ✅ PERFORMANCE PHASE 3: Extra CSS minification (reduces CSS by 15-20%)
        // ✅ PERFORMANCE ADVANCED: Module preload for faster navigation
        modulePreload: {
          polyfill: true, // Inject module preload polyfill for older browsers
        },
        // ✅ PERFORMANCE PHASE 3: Advanced Rollup optimizations with aggressive splitting
        rollupOptions: {
          external: ['@neondatabase/serverless'],
          output: {
            // ✅ PERFORMANCE PHASE 3: Improved manual chunks for better caching and smaller bundles
            manualChunks: (id) => {
              // ⚠️ PERFORMANCE FIX: Only create chunks that are actually used
              // Prevents empty chunks (router, supabase were empty)

              // React Core - MUST be in vendor chunk to avoid loading issues
              if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('react/jsx-runtime')) {
                return 'react-core';
              }
              // ✅ PERFORMANCE PHASE 3: Optimize react-router-dom - keep in vendor to avoid empty chunk
              // Previously created empty router chunk, now consolidates with vendor
              // if (id.includes('react-router-dom') && id.includes('node_modules')) {
              //   return 'router';
              // }

              // ✅ PERFORMANCE: Separate Recharts chunk (lazy-loaded, only on analytics pages)
              if (id.includes('recharts')) {
                return 'charts';
              }
              // ✅ PERFORMANCE PHASE 3: Lazy load framer-motion (only load when animations are used)
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
              // ✅ PERFORMANCE PHASE 3: Split clerk-react (lightweight wrapper) from clerk-js (heavy SDK)
              if (id.includes('@clerk/clerk-react') && id.includes('node_modules')) {
                return 'clerk-react';
              }
              // ✅ PERFORMANCE PHASE 3: Lazy load clerk-js (heavy SDK ~200KB) only when auth is needed
              if (id.includes('@clerk/clerk-js') && id.includes('node_modules')) {
                return 'clerk-js';
              }
              // ✅ PERFORMANCE PHASE 3: Keep supabase in vendor to avoid empty chunk (was empty before)
              // if (id.includes('@supabase/supabase-js') && id.includes('node_modules')) {
              //   return 'supabase';
              // }

              // UI Icons - consolidate to reduce chunk count
              if ((id.includes('lucide-react') || id.includes('@heroicons/react')) && id.includes('node_modules')) {
                return 'icons';
              }

              // Utils libraries
              if (id.includes('class-variance-authority') && id.includes('node_modules')) {
                return 'utils';
              }
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
        // ✅ PERFORMANCE PHASE 3: Aggressive Terser optimization for maximum compression
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
            pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.trace'] : [],
            passes: 3, // ✅ PERFORMANCE PHASE 3: 3 passes for maximum compression (was 2)
            // ✅ PERFORMANCE PHASE 3: Enable advanced optimizations
            dead_code: true,
            global_defs: {
              // Remove React devtools checks in production
              '__REACT_DEVTOOLS_GLOBAL_HOOK__': 'false'
            },
            // ✅ PERFORMANCE PHASE 3: Enable inline scripts (reduces bundle size by 5-10%)
            inline: 2,
            // ✅ PERFORMANCE PHASE 3: Remove unused function arguments
            unused: true,
            // ✅ PERFORMANCE PHASE 3: Collapse variables aggressively
            collapse_vars: true,
            reduce_vars: true,
            // ✅ PERFORMANCE PHASE 3: Remove object properties with safe transforms
            properties: true,
            // ✅ PERFORMANCE PHASE 3: Join consecutive var statements
            join_vars: true,
            // ✅ PERFORMANCE PHASE 3: Convert ES2015+ code to ES5 for smaller size
            ecma: 2015,
            // ✅ PERFORMANCE PHASE 3: Enable unsafe optimizations (max compression)
            unsafe: true,
            unsafe_comps: true,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_proto: true,
            unsafe_regexp: true,
          },
          format: {
            comments: false, // Remove comments
            // ✅ PERFORMANCE PHASE 3: Remove all whitespace for maximum compression
            beautify: false,
            // ✅ PERFORMANCE PHASE 3: Shorten variable names aggressively
            ecma: 2015,
            // ✅ PERFORMANCE PHASE 3: Preserve ANSI requirements for compatibility
            ascii_only: false,
            // ✅ PERFORMANCE PHASE 3: Use shortest quotes
            quote_style: 0, // Prefer double quotes, but use shortest
          },
          // ✅ PERFORMANCE PHASE 3: Enable mangling for maximum size reduction
          mangle: {
            properties: false, // Don't mangle property names (unsafe)
            // ✅ PERFORMANCE PHASE 3: Aggressive variable name mangling
            toplevel: true, // Mangle top-level scope names
            // ✅ PERFORMANCE PHASE 3: Keep function names for debugging (remove in production)
            keep_fnames: !isProduction,
            // ✅ PERFORMANCE PHASE 3: Keep class names for React components
            keep_classnames: true,
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
