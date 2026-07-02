import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { exportEditsPlugin } from './src/vite-plugin-export-edits'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    exportEditsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      // Для локальной сборки (vite preview) SW самоуничтожается, чтобы не было проблем с устаревшим кэшем.
      // Для GitHub Pages работает нормально.
      selfDestroying: false,
      manifest: {
        name: 'ЕГЭ Русский',
        short_name: 'ЕГЭ Русский',
        description: 'Подготовка к ЕГЭ по русскому языку',
        theme_color: '#58cc02',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB — покрывает index chunk ~6.8 MB
        manifestTransforms: [
          async (manifestEntries) => {
            const manifest = manifestEntries.map((entry) => {
              if (entry.url.endsWith('.js') || entry.url.endsWith('.css') || entry.url === 'index.html') {
                return { ...entry, revision: `${entry.revision}-${Date.now()}` }
              }
              return entry
            })
            return { manifest, warnings: [] }
          }
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell',
              networkTimeoutSeconds: 3
            }
          }
        ],
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      plugins: [visualizer({ open: false, filename: 'dist/stats.html' })],
      output: {
        manualChunks: {
          recharts: ['recharts'],
          'framer-motion': ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          lucide: ['lucide-react'],
          router: ['react-router-dom'],
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
