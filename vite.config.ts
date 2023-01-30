/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'pointbreak',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named'
      },
    },
  },
  test: {
    setupFiles: resolve(__dirname, 'test/setup.ts')
  }
})
