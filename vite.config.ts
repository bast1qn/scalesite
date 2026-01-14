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
        target: 'es2020',
        minify: 'esbuild',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks(id) {
              // Don't split React - keep it in the main bundle
              if (id.includes('node_modules')) {
                // Skip React completely
                if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                  return undefined;
                }
                // Split other large vendors
                if (id.includes('framer-motion')) {
                  return 'vendor-motion';
                }
                if (id.includes('recharts')) {
                  return 'vendor-charts';
                }
                if (id.includes('@supabase')) {
                  return 'vendor-supabase';
                }
                return 'vendor';
              }
            }
          }
        }
      }
    };
});
