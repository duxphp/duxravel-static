import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components'
    }
  },
  server: {
    // proxy: {
    //   '/': {
    //       target: 'http://dev.test/',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/admin/, '')

    //   }
    // }
  }
})