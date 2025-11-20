import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/react-hook-form-ai/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-hook-form-ai': path.resolve(__dirname, '..')
    }
  },
  optimizeDeps: {
    exclude: ['react-hook-form-ai']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});

