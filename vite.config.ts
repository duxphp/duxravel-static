import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), WindiCSS()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components'
    }
  },
  build: {
    //outDir: 'dist/resource',
    manifest: true,
    emptyOutDir: true,

    rollupOptions: {
      // 覆盖默认的 .html 入口
      input: 'src/main.js'
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
