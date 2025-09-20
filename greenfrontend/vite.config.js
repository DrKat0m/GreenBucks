import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Frontend calls /api/ocr → forwarded to http://localhost:8787/api/ocr
      '/api': 'http://localhost:8787',
    },
  },
})
