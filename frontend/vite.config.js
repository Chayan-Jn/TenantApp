import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'


export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
    tailwindcss(),
    compression({ algorithm: 'brotliCompress' }),
    compression({ algorithm: 'gzip' }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core — cached long-term, rarely changes
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
              return 'react-core';
            }
            // Router — separate so homepage doesn't need full router weight
            if (id.includes('react-router')) {
              return 'router';
            }
            // Icons — large, only needed when components mount
            if (id.includes('react-icons')) {
              return 'ui';
            }
            // Auth + data fetching
            if (id.includes('@tanstack') || id.includes('@react-oauth') || id.includes('google')) {
              return 'data';
            }
            // Everything else
            return 'vendor';
          }
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
  }
})