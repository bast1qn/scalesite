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
      plugins: [react({
        jsxImportSource: 'react',
        babel: {
          plugins: []
        }
      })],
      cacheDir: false, // COMPLETELY DISABLE VITE CACHE
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
        force: true
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'es2020',
        minify: 'terser',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        terserOptions: {
          compress: {
            passes: 1,
            drop_console: false
          },
          format: {
            comments: false
          }
        }
      }
    };
});
