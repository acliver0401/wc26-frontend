import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  // In production (Vercel), VITE_API_URL should point to your Render backend,
  // e.g. https://wc26-backend.onrender.com
  // Set this in Vercel dashboard → Environment Variables
})
