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
        cssCodeSplit: true,
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-core';
                }
                if (id.includes('framer-motion')) {
                  return 'ui-framework';
                }
                if (id.includes('@supabase')) {
                  return 'supabase';
                }
                return 'vendor';
              }

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
