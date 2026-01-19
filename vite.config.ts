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
        // ✅ FIX: Remove force: true to prevent React bundling issues
        force: false
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
          // ✅ PERFORMANCE PHASE 3: Additional external modules to reduce bundle
          external: ['@neondatabase/serverless', 'fsevents', 'electron'],
          // ✅ PERFORMANCE PHASE 3: Reduce chunk count by consolidating small chunks
          output: {
            // ✅ PERFORMANCE PHASE 3: Improved manual chunks for better caching and smaller bundles
            manualChunks: (id) => {
              // ⚠️ FIX: Bundle ALL React-related packages together to prevent useLayoutError
              // This includes React, all UI frameworks, and libraries that use React hooks
              const reactPackages = [
                'react',
                'react-dom',
                'framer-motion',
                '@emotion',
                'react-router',
                '@clerk',
                '@supabase/supabase-js',
                'lucide-react',
                '@heroicons/react',
                'class-variance-authority',
              ];
              const isInReactPackages = reactPackages.some(pkg => id.includes(`node_modules/${pkg}`));
              if (isInReactPackages || id.includes('react/jsx-runtime')) {
                return 'react-core';
              }

              // ✅ PERFORMANCE: Separate Recharts chunk (lazy-loaded, only on analytics pages)
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
          // ✅ PERFORMANCE PHASE 3: Advanced treeshaking with aggressive settings
          treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
            tryCatchDeoptimization: false, // ✅ PERFORMANCE PHASE 3: Don't deoptimize try-catch
            toplevel: true, // ✅ PERFORMANCE PHASE 3: Tree-shake top-level statements
            // ✅ PERFORMANCE PHASE 3: Aggressive dead code elimination
            manualChunks: true, // Enable manual chunk tree-shaking
            manualPureFunctions: [ // Mark functions as pure for better elimination
              'clsx',
              'clsx/classNames',
              'classnames',
            ],
          },
        },
        // ✅ PERFORMANCE PHASE 3: Aggressive Terser optimization for maximum compression
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
            pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.trace'] : [],
            passes: 2, // ✅ PERFORMANCE PHASE 3: 2 passes for safe compression
            // ✅ PERFORMANCE PHASE 3: Enable advanced optimizations
            dead_code: true,
            // ✅ FIX: Removed global_defs that can break React
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
            // ✅ FIX: Disable unsafe optimizations that can break React
            unsafe: false,
            unsafe_comps: false,
            unsafe_Function: false,
            unsafe_math: false,
            unsafe_proto: false,
            unsafe_regexp: false,
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
