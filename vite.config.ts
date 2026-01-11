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
        rollupOptions: {
          output: {
            manualChunks(id) {
              // Vendor chunks for npm packages
              if (id.includes('node_modules')) {
                // React and core libraries
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-core';
                }
                // UI framework
                if (id.includes('framer-motion')) {
                  return 'ui-framework';
                }
                // Supabase and auth
                if (id.includes('@supabase')) {
                  return 'supabase';
                }
                // Other vendor
                return 'vendor';
              }

              // App code chunks
              if (id.includes('/components/dashboard/')) {
                return 'dashboard';
              }
              if (id.includes('/pages/')) {
                return 'pages';
              }
              if (id.includes('/components/') && !id.includes('/components/dashboard/')) {
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
