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
        // Optimize chunk splitting to reduce bundle size
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'ui': ['./App.tsx', './pages/Home.tsx', './pages/Marketplace.tsx']
            }
          }
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
        // Production optimizations
        minify: 'terser',
        sourcemap: false,
        target: 'es2020'
      }
    };
});

