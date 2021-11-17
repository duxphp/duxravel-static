import {createApp} from 'vue'
import Dialog from "./Dialog";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from '@arco-design/web-vue/es/icon'


function createDialog(option = {}) {
  return new Promise((resolve, reject) => {
    const dom = document.createElement('div')
    document.body.appendChild(dom)
    const app = createApp(Dialog, {
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

createDialog.prompt = (option = {}) => {
  option.type = 'prompt'
  return createDialog(option)
}

export default createDialog