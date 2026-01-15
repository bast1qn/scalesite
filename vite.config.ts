import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';

    return {
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
      // ✅ PERFORMANCE: Pre-bundle ALL dependencies to improve cold start
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'lucide-react',
          'framer-motion',
          'react-router-dom',
          '@supabase/supabase-js',
          '@clerk/clerk-react',
          '@clerk/clerk-js'
        ],
        exclude: ['recharts', 'jspdf', 'html2canvas', '@google/genai'],
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
        // ✅ PERFORMANCE: Advanced Rollup optimizations
        rollupOptions: {
          external: ['@neondatabase/serverless'],
          output: {
            // ✅ PERFORMANCE: Strategic manual chunks for better caching
            manualChunks: (id) => {
              // React Core (stable, rarely changes) - EXCEPT heavy libraries
              if (id.includes('react') || id.includes('react-dom') || id.includes('react/jsx-runtime') || id.includes('lucide-react')) {
                return 'react-vendor';
              }
              // ✅ PERFORMANCE: Separate Recharts chunk (lazy-loaded, only on analytics pages)
              if (id.includes('recharts')) {
                return 'charts';
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
              // Clerk authentication
              if (id.includes('@clerk')) {
                return 'auth';
              }
              // ✅ PERFORMANCE: Split React Dropzone (heavy, rarely used)
              if (id.includes('react-dropzone')) {
                return 'upload';
              }
            },
            // ✅ PERFORMANCE: Optimize chunk file names for long-term caching
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
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
