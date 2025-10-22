import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173,
    host: true, // Listen on all addresses for Docker compatibility
    strictPort: true, // Exit if port is already in use
    watch: {
      usePolling: true, // Enable polling for file changes in Docker
    },
  },
})
