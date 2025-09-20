import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Frontend calls /api/ocr → forwarded to http://localhost:8787/api/ocr
      '/api': 'http://localhost:8787',
    },
  },
})
