import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 8080,
    proxy: {
      '/backend': {
        target: 'https://misinformation-combater-backend-386097269689.europe-west1.run.app',
        changeOrigin: true,
        secure: true,           // set false only if backend uses self-signed cert
        rewrite: (path) => path.replace(/^\/backend/, '') // remove the /backend prefix
      }
    },
  }
})
