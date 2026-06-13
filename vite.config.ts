import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // BASE_PATH is injected by CI (GitHub Pages) so the app works under a
  // repo subpath; defaults to '/' for local dev and root-domain hosts.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
})
