import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      optimizeDeps: {
        include: ['lucide-react']
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        cssCodeSplit: true,
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        // Enable better compression for modern browsers
        reportCompressedSize: false,
        // PERFORMANCE: Advanced build optimizations
        // Enable modern JS features for better performance
        rollupOptions: {
          output: {
            // Better caching with content-based hashes
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
            // PERFORMANCE: Improve tree-shaking
            // Ensure only used exports are included
            exports: 'auto',
            // PERFORMANCE: Optimize module exports
            interop: 'auto',
            manualChunks(id) {
              // Vendor libraries
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                  return 'react-core';
                }
                if (id.includes('framer-motion')) {
                  return 'ui-framework';
                }
                if (id.includes('@supabase')) {
                  return 'supabase';
                }
                if (id.includes('recharts')) {
                  return 'charts';
                }
                if (id.includes('jspdf') || id.includes('html2canvas')) {
                  return 'pdf-generation';
                }
                if (id.includes('react-dropzone')) {
                  return 'file-upload';
                }
                // Lazy load lucide-react icons - they're heavy
                if (id.includes('lucide-react')) {
                  return 'icons';
                }
                return 'vendor';
              }

              // Feature-based code splitting
              if (id.includes('/components/dashboard/')) {
                return 'dashboard';
              }
              if (id.includes('/components/pricing/')) {
                return 'pricing';
              }
              if (id.includes('/components/configurator/')) {
                return 'configurator';
              }
              if (id.includes('/components/ai-content/')) {
                return 'ai-content';
              }
              if (id.includes('/components/tickets/')) {
                return 'tickets';
              }
              if (id.includes('/components/team/')) {
                return 'team';
              }
              if (id.includes('/components/billing/')) {
                return 'billing';
              }
              if (id.includes('/components/analytics/')) {
                return 'analytics';
              }
              if (id.includes('/components/newsletter/')) {
                return 'newsletter';
              }
              if (id.includes('/components/onboarding/')) {
                return 'onboarding';
              }
              if (id.includes('/components/projects/')) {
                return 'projects';
              }
              if (id.includes('/components/skeleton/')) {
                return 'skeleton';
              }
              if (id.includes('/components/seo/')) {
                return 'seo';
              }
              if (id.includes('/components/chat/')) {
                return 'chat';
              }
              if (id.includes('/components/launch/')) {
                return 'launch';
              }
              if (id.includes('/components/performance/')) {
                return 'performance';
              }
              if (id.includes('/components/notifications/')) {
                return 'notifications';
              }
              if (id.includes('/pages/')) {
                return 'pages';
              }
              if (id.includes('/components/')) {
                return 'components';
              }
              if (id.includes('/contexts/')) {
                return 'contexts';
              }
            }
          }
        }
      }
    };
});
