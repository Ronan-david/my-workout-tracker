import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { dirname, join } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/my-workout-tracker', 
  plugins: [
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "${join(currentDir, './src/assets/scss/global.scss')}" as *;
        `
      }
    }
  }
})
