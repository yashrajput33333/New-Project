import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false, // Use this only if your backend uses HTTPS with self-signed certificates
      },
    },
  },
  plugins: [react()],
});

