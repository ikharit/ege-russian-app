import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { exportEditsPlugin } from './src/vite-plugin-export-edits'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    exportEditsPlugin(),
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
