import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/rhf-demo/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'rhf-demo': path.resolve(__dirname, '..')
    }
  },
  optimizeDeps: {
    exclude: ['rhf-demo']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});

