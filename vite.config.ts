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
  build: {

    assetsDir: 'static/manage',
    manifest: true,
    emptyOutDir: true,

    rollupOptions: {
      // 覆盖默认的 .html 入口
      input: 'src/main.js',
      /*output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            let name = id.toString().split('node_modules/')[1].split('/')[0].toString()
            if (name === 'tinymce' || name === 'apexcharts') {
              return name
            }else {
              return 'vendors'
            }
          }
        }
      }*/
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
