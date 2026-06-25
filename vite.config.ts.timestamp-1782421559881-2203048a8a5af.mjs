// vite.config.ts
import { defineConfig } from "file:///C:/Users/USER/Documents/kimi/workspace/ege-russian-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/USER/Documents/kimi/workspace/ege-russian-app/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/USER/Documents/kimi/workspace/ege-russian-app/node_modules/vite-plugin-pwa/dist/index.js";
import { visualizer } from "file:///C:/Users/USER/Documents/kimi/workspace/ege-russian-app/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig({
  base: process.env.GITHUB_PAGES ? "/ege-russian-app/" : "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Для локальной сборки (vite preview) SW самоуничтожается, чтобы не было проблем с устаревшим кэшем.
      // Для GitHub Pages работает нормально.
      selfDestroying: !process.env.GITHUB_PAGES,
      manifest: {
        name: "\u0415\u0413\u042D \u0420\u0443\u0441\u0441\u043A\u0438\u0439",
        short_name: "\u0415\u0413\u042D \u0420\u0443\u0441\u0441\u043A\u0438\u0439",
        description: "\u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u043A \u0415\u0413\u042D \u043F\u043E \u0440\u0443\u0441\u0441\u043A\u043E\u043C\u0443 \u044F\u0437\u044B\u043A\u0443",
        theme_color: "#58cc02",
        background_color: "#ffffff",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml"
          },
          {
            src: "icon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "maskable"
          },
          {
            src: "icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // 4 MB — покрывает index chunk ~3.1 MB
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === "document" || request.destination === "script",
            handler: "NetworkFirst",
            options: {
              cacheName: "app-shell",
              networkTimeoutSeconds: 3
            }
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      plugins: [visualizer({ open: false, filename: "dist/stats.html" })],
      output: {
        manualChunks: {
          dooshin: ["./src/data/sections/dooshin"],
          recharts: ["recharts"],
          "framer-motion": ["framer-motion"],
          supabase: ["@supabase/supabase-js"],
          lucide: ["lucide-react"],
          router: ["react-router-dom"],
          vendor: ["react", "react-dom"]
        }
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU0VSXFxcXERvY3VtZW50c1xcXFxraW1pXFxcXHdvcmtzcGFjZVxcXFxlZ2UtcnVzc2lhbi1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVTRVJcXFxcRG9jdW1lbnRzXFxcXGtpbWlcXFxcd29ya3NwYWNlXFxcXGVnZS1ydXNzaWFuLWFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVVNFUi9Eb2N1bWVudHMva2ltaS93b3Jrc3BhY2UvZWdlLXJ1c3NpYW4tYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBwcm9jZXNzLmVudi5HSVRIVUJfUEFHRVMgPyAnL2VnZS1ydXNzaWFuLWFwcC8nIDogJy8nLFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgLy8gXHUwNDE0XHUwNDNCXHUwNDRGIFx1MDQzQlx1MDQzRVx1MDQzQVx1MDQzMFx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzRVx1MDQzOSBcdTA0NDFcdTA0MzFcdTA0M0VcdTA0NDBcdTA0M0FcdTA0MzggKHZpdGUgcHJldmlldykgU1cgXHUwNDQxXHUwNDMwXHUwNDNDXHUwNDNFXHUwNDQzXHUwNDNEXHUwNDM4XHUwNDQ3XHUwNDQyXHUwNDNFXHUwNDM2XHUwNDMwXHUwNDM1XHUwNDQyXHUwNDQxXHUwNDRGLCBcdTA0NDdcdTA0NDJcdTA0M0VcdTA0MzFcdTA0NEIgXHUwNDNEXHUwNDM1IFx1MDQzMVx1MDQ0Qlx1MDQzQlx1MDQzRSBcdTA0M0ZcdTA0NDBcdTA0M0VcdTA0MzFcdTA0M0JcdTA0MzVcdTA0M0MgXHUwNDQxIFx1MDQ0M1x1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQ0MFx1MDQzNVx1MDQzMlx1MDQ0OFx1MDQzOFx1MDQzQyBcdTA0M0FcdTA0NERcdTA0NDhcdTA0MzVcdTA0M0MuXG4gICAgICAvLyBcdTA0MTRcdTA0M0JcdTA0NEYgR2l0SHViIFBhZ2VzIFx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzMFx1MDQzNVx1MDQ0MiBcdTA0M0RcdTA0M0VcdTA0NDBcdTA0M0NcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0M0UuXG4gICAgICBzZWxmRGVzdHJveWluZzogIXByb2Nlc3MuZW52LkdJVEhVQl9QQUdFUyxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdcdTA0MTVcdTA0MTNcdTA0MkQgXHUwNDIwXHUwNDQzXHUwNDQxXHUwNDQxXHUwNDNBXHUwNDM4XHUwNDM5JyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ1x1MDQxNVx1MDQxM1x1MDQyRCBcdTA0MjBcdTA0NDNcdTA0NDFcdTA0NDFcdTA0M0FcdTA0MzhcdTA0MzknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1MDQxRlx1MDQzRVx1MDQzNFx1MDQzM1x1MDQzRVx1MDQ0Mlx1MDQzRVx1MDQzMlx1MDQzQVx1MDQzMCBcdTA0M0EgXHUwNDE1XHUwNDEzXHUwNDJEIFx1MDQzRlx1MDQzRSBcdTA0NDBcdTA0NDNcdTA0NDFcdTA0NDFcdTA0M0FcdTA0M0VcdTA0M0NcdTA0NDMgXHUwNDRGXHUwNDM3XHUwNDRCXHUwNDNBXHUwNDQzJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjNThjYzAyJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHN0YXJ0X3VybDogJy4nLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ2ljb24uc3ZnJyxcbiAgICAgICAgICAgIHNpemVzOiAnYW55JyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnaWNvbi5zdmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdtYXNrYWJsZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ2ljb24uc3ZnJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2Uvc3ZnK3htbCcsXG4gICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBza2lwV2FpdGluZzogdHJ1ZSxcbiAgICAgICAgY2xpZW50c0NsYWltOiB0cnVlLFxuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogNCAqIDEwMjQgKiAxMDI0LCAvLyA0IE1CIFx1MjAxNCBcdTA0M0ZcdTA0M0VcdTA0M0FcdTA0NDBcdTA0NEJcdTA0MzJcdTA0MzBcdTA0MzVcdTA0NDIgaW5kZXggY2h1bmsgfjMuMSBNQlxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT4gcmVxdWVzdC5kZXN0aW5hdGlvbiA9PT0gJ2ltYWdlJyxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnaW1hZ2VzJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiA1MCwgbWF4QWdlU2Vjb25kczogMzAgKiAyNCAqIDYwICogNjAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogKHsgcmVxdWVzdCB9KSA9PiByZXF1ZXN0LmRlc3RpbmF0aW9uID09PSAnZG9jdW1lbnQnIHx8IHJlcXVlc3QuZGVzdGluYXRpb24gPT09ICdzY3JpcHQnLFxuICAgICAgICAgICAgaGFuZGxlcjogJ05ldHdvcmtGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2FwcC1zaGVsbCcsXG4gICAgICAgICAgICAgIG5ldHdvcmtUaW1lb3V0U2Vjb25kczogM1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICBidWlsZDoge1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIHBsdWdpbnM6IFt2aXN1YWxpemVyKHsgb3BlbjogZmFsc2UsIGZpbGVuYW1lOiAnZGlzdC9zdGF0cy5odG1sJyB9KV0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgZG9vc2hpbjogWycuL3NyYy9kYXRhL3NlY3Rpb25zL2Rvb3NoaW4nXSxcbiAgICAgICAgICByZWNoYXJ0czogWydyZWNoYXJ0cyddLFxuICAgICAgICAgICdmcmFtZXItbW90aW9uJzogWydmcmFtZXItbW90aW9uJ10sXG4gICAgICAgICAgc3VwYWJhc2U6IFsnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ10sXG4gICAgICAgICAgbHVjaWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICAgICAgICAgIHJvdXRlcjogWydyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRlc3Que3RzLHRzeH0nXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtXLFNBQVMsb0JBQW9CO0FBQy9YLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxrQkFBa0I7QUFFM0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTSxRQUFRLElBQUksZUFBZSxzQkFBc0I7QUFBQSxFQUN2RCxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUE7QUFBQTtBQUFBLE1BR2QsZ0JBQWdCLENBQUMsUUFBUSxJQUFJO0FBQUEsTUFDN0IsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1g7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxhQUFhO0FBQUEsUUFDYixjQUFjO0FBQUEsUUFDZCwrQkFBK0IsSUFBSSxPQUFPO0FBQUE7QUFBQSxRQUMxQyxnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZLENBQUMsRUFBRSxRQUFRLE1BQU0sUUFBUSxnQkFBZ0I7QUFBQSxZQUNyRCxTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZLEVBQUUsWUFBWSxJQUFJLGVBQWUsS0FBSyxLQUFLLEtBQUssR0FBRztBQUFBLFlBQ2pFO0FBQUEsVUFDRjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFlBQVksQ0FBQyxFQUFFLFFBQVEsTUFBTSxRQUFRLGdCQUFnQixjQUFjLFFBQVEsZ0JBQWdCO0FBQUEsWUFDM0YsU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1gsdUJBQXVCO0FBQUEsWUFDekI7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCx1QkFBdUI7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDYixTQUFTLENBQUMsV0FBVyxFQUFFLE1BQU0sT0FBTyxVQUFVLGtCQUFrQixDQUFDLENBQUM7QUFBQSxNQUNsRSxRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixTQUFTLENBQUMsNkJBQTZCO0FBQUEsVUFDdkMsVUFBVSxDQUFDLFVBQVU7QUFBQSxVQUNyQixpQkFBaUIsQ0FBQyxlQUFlO0FBQUEsVUFDakMsVUFBVSxDQUFDLHVCQUF1QjtBQUFBLFVBQ2xDLFFBQVEsQ0FBQyxjQUFjO0FBQUEsVUFDdkIsUUFBUSxDQUFDLGtCQUFrQjtBQUFBLFVBQzNCLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxRQUMvQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsU0FBUyxDQUFDLHdCQUF3QjtBQUFBLEVBQ3BDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
