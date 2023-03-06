import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import command from 'rollup-plugin-command'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env=loadEnv(mode, process.cwd(), '');

  let plugins = [vue(), vueJsx()]
  // 如果环境变量中设置有DUXRAVEL_PROJECT_ROOT，则执行Duxravel中的静态资源发布命令，将本static项目编译好的静态资源拷贝到业务主项目中
  if (env.DUXRAVEL_PROJECT_ROOT) {
    plugins.push(command(`cd ${env.DUXRAVEL_PROJECT_ROOT} && php artisan vendor:publish --tag="duxravel" --force`))
  }

  return defineConfig({
    plugins: plugins,
    resolve: {
      dedupe: ['vue'],
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
      host: '0.0.0.0',
      port: 3000
    }
  })
}
