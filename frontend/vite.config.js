import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Proposal-App-Live/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
