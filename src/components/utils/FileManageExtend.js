import {createApp} from 'vue'
import FileManage from "./FileManage";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

function createFileManage(option = {}) {

  return new Promise((resolve, reject) => {
    const dom = document.createElement('div')
    document.body.appendChild(dom)
    const app = createApp(FileManage, {
      close: () => {
        setTimeout(() => {
          app.unmount()
          if (document.body.contains(dom)) {
            document.body.removeChild(dom)
          }
        }, 500)
      },
      callback: resolve,
      ...option
    })
    app.use(ArcoVue).use(ArcoVueIcon).mount(dom)
  })
}

export default createFileManage