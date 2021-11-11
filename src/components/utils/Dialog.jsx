import {toRef, defineComponent } from 'vue'
import event from '../../utils/event'
import Create from '../Create'
import { getUrl, request } from '../../utils/request'

let callback = [];

export const appDialog = window.appDialog = {
  alert: (config) => {
    event.emit('app-dialog-alert', { config })
  },
  confirm: (config) => {
    event.emit('app-dialog-confirm', { config })
  },
  prompt: (config) => {
    event.emit('app-dialog-prompt', { config })
  },
  ajax: (config) => {
    event.emit('app-dialog-ajax', { config })
  }
}

export default defineComponent({
  components: {
    Create
  },
  data() {
    return {
      show: false,
      tyle: 'alert',
      width: 'max-w-lg',
      alert: {
        title: '',
        content: '',
        callback: null
      },
      confirm: {
        title: '',
        content: '',
        success: null,
        cancel: null,
        loading: false,
        ajax: false,
      },
      prompt: {
        title: '请输入内容',
        content: '',
        callback: null,
      }
    }
  },
  created() {
    event.add('app-dialog-alert', ({ config }) => {
      this.type = 'alert'
      this.alert.title = config.title
      this.alert.content = config.content
      this.alert.callback = config.callback
      this.show = true
    })
    event.add('app-dialog-confirm', ({ config }) => {
      this.type = 'confirm'
      this.confirm.title = config.title
      this.confirm.content = config.content
      this.confirm.success = config.success
      this.confirm.cancel = config.cancel
      this.show = true
    })
    event.add('app-dialog-ajax', ({ config }) => {
      this.type = 'confirm'
      this.confirm.ajax = true
      this.confirm.title = config.title
      this.confirm.content = config.content
      this.confirm.success = () => {
        this.confirm.loading = true
        request(config.url, config.data, config.type).then(res => {
          this.confirm.loading = false
          typeof config.success === 'function' && config.success(res, this)
          this.show = false
        }).catch(() => {
          this.confirm.loading = false
        })
      }
      this.confirm.cancel = config.cancel
      this.show = true
    })
    event.add('app-dialog-prompt', ({ config }) => {
      this.type = 'prompt'
      this.prompt.title = config.title
      this.prompt.content = config.content
      this.prompt.callback = config.callback
      this.show = true
    })
  },
  methods: {

  },
  render() {

    let inner
    if (this.type === 'alert') {
      inner = <div>
        <div class="flex items-start p-6 ">
          <div class=" flex-shrink-0 flex items-center justify-center rounded-full bg-green-200 mx-0 h-10 w-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div class="text-lg leading-6 font-medium text-gray-800" id="modal-title">
              {this.alert.title}
            </div>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {this.alert.content}
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 px-5 pb-5">
          <n-button type="primary" onClick={() => { this.show = false, typeof this.alert.callback === 'function' && this.alert.callback(this) }}>
            确定
          </n-button>
        </div>
      </div>
    }

    if (this.type === 'confirm') {

      return <a-modal
          visible={this.show}
          onOk={() => { this.show = this.confirm.ajax ? true : false, typeof this.confirm.success === 'function' && this.confirm.success(this) }}
          onCancel={() => { this.show = false, typeof this.confirm.cancel === 'function' && this.confirm.cancel(this) }}
          okLoading={!this.confirm.loading}
      >
        {
          {
            title: () => 'sss'
          }
        }
        <div>{this.confirm.content}</div>

      </a-modal>

      inner = <div>
        <div class="flex items-start p-6 ">
          <div class=" flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-200 mx-0 h-10 w-10">
            <svg class="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div class="text-lg leading-6 font-medium text-gray-800" id="modal-title">
              {this.confirm.title}
            </div>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {this.confirm.content}
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 px-5 pb-5">
          <n-button type="default" disabled={this.confirm.loading} onClick={() => { this.show = false, typeof this.confirm.cancel === 'function' && this.confirm.cancel(this) }}>
            取消
          </n-button>
          <n-button type="primary" disabled={this.confirm.loading} loading={this.confirm.loading} onClick={() => { this.show = this.confirm.ajax ? true : false, typeof this.confirm.success === 'function' && this.confirm.success(this) }}>
            确定
          </n-button>
        </div>
      </div>
    }

    if (this.type === 'prompt') {
      inner = <div>
        <div class="p-4">
          <div class="leading-6 text-gray-800" id="modal-title">
            {this.prompt.title}
          </div>
          <div class="mt-4">
            <n-input value={this.prompt.content} onUpdate:value={(value) => { this.prompt.content = value }} type="text" />
          </div>
        </div>
        <div class="flex justify-end space-x-2 px-5 pb-5">
          <n-button type="default" onClick={() => { this.show = false }}>
            取消
          </n-button>
          <n-button type="primary" onClick={() => { this.show = false, typeof this.prompt.callback === 'function' && this.prompt.callback(this.prompt.content) }}>
            确定
          </n-button>
        </div>
      </div>
    }

    return <a-modal
        visible={this.show}
    >
      <n-card class={this.width} content-style="padding: 0;">
        {inner}
      </n-card>
    </a-modal>
  }
})
