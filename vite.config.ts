import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'favicon.ico', 'images/logo.jpg'],
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,jpg}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Alma Dekh',
        short_name: 'Alma Dekh',
        description: 'Restaurante, Café y Casa de Té en Maschwitz',
        theme_color: '#faf8f5',
        background_color: '#faf8f5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react'
          if (id.includes('framer-motion')) return 'vendor-motion'
        },
      },
    },
  },
})
