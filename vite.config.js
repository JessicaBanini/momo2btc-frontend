import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Set the base path for routing
  server: {
    proxy: {
      '/api': {
        target: 'http://13.51.167.118', // Backend API URL
        changeOrigin: true, // Ensures requests are sent with the correct origin
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove `/api` prefix when forwarding
      },
    },
  },
});