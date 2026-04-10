import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockDevServerPlugin()], //mockDevServerPlugin({ enabled: false })
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '^/api': { target: 'http://localhost:8080' },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
