import {createApp} from 'vue'
import DialogTable from "./DialogTable";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

function createDialog(option = {}) {

  return new Promise((resolve, reject) => {
    const dom = document.createElement('div')
    document.body.appendChild(dom)
    const app = createApp(DialogTable, {
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
    app.use(ArcoVueIcon)
    app.use(ArcoVue).mount(dom)
  })
}

export default createDialog