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
        // Al precache entra solo el esqueleto de la app. Con `png` y `jpg` en
        // el patron entraban tambien las 25 fotos de la galeria y los
        // ornamentos: la primera visita descargaba 12,3 MB antes de que la
        // PWA quedara utilizable. Las imagenes se cachean bajo demanda, mas
        // abajo. Los iconos siguen entrando via `includeAssets`, que si los
        // necesita disponibles sin conexion para instalar la app.
        globPatterns: ['**/*.{js,css,html,ico,svg,json,webmanifest}'],
        globIgnores: ['**/heic-worker-*.js'],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        runtimeCaching: [
          {
            // Fotos y ornamentos propios: se guardan recien cuando el visitante
            // llega a ellos. El tope evita que la galeria llene el telefono.
            urlPattern: /\/images\/.*\.(?:png|jpe?g|webp|avif|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'almadekh-imagenes',
              expiration: { maxEntries: 90, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Fotos de platos y eventos subidas desde el panel.
            urlPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'almadekh-storage',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'almadekh-fuentes',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Alma Dekh',
        short_name: 'Alma Dekh',
        description: 'Restaurante, Café y Casa de Té en Maschwitz',
        theme_color: '#0A0704',
        background_color: '#0A0704',
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
