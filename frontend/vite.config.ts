import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import http from 'http'

/**
 * Vite plugin to proxy the exact "/" route to the backend so the
 * Thymeleaf marketing landing page is served instead of the SPA.
 */
function marketingRootProxy(): Plugin {
  return {
    name: 'marketing-root-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        if (url === '/' || url === '/?') {
          const proxyReq = http.request(
            {
              hostname: 'localhost',
              port: 8083,
              path: req.url,
              method: req.method,
              headers: { ...req.headers, host: 'localhost:8083' },
            },
            (proxyRes) => {
              res.writeHead(proxyRes.statusCode ?? 200, proxyRes.headers)
              proxyRes.pipe(res)
            },
          )
          proxyReq.on('error', () => next())
          req.pipe(proxyReq)
        } else {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    marketingRootProxy(),
    TanStackRouterVite({
      routesDirectory: './src/app/routes',
      generatedRouteTree: './src/app/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    visualizer({
      filename: 'dist/bundle-stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-router': [
            '@tanstack/react-router',
            '@tanstack/react-query',
          ],
          'vendor-ui': [
            'radix-ui',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
          'vendor-fullcalendar': [
            '@fullcalendar/core',
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/interaction',
          ],
          'vendor-forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
        },
      },
    },
    target: 'es2022',
    sourcemap: false,
  },
  server: {
    port: 3033,
    proxy: {
      '/api': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8083',
        ws: true,
      },
      '/ru': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/pl': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/marketing': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
    },
  },
})
