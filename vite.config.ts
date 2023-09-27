import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src")
      }
    ]
  },

  plugins: [
    vue(),
  ],

  server: {
    host: '0.0.0.0',
    port: 9999,
    https: false,

    proxy: {
      '/api': '0.0.0.0:8000'
    }
  },

  esbuild: {
    pure: ['console.log'],
  },

  build: {
    minify: true
  }
})
