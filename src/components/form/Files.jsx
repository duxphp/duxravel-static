import {defineComponent} from 'vue'
import {getUrl} from '../../utils/request'
import {formatType} from '../../utils/component'
import {getLocalUserInfo} from "../../utils/user";

export default defineComponent({
  props: {
    'upload': {
      type: String,
      default: 'upload'
    },
    'fileUrl': {
      type: String,
      default: 'fileManage'
    },
    'value': {
      type: Array
    },
    'format': {
      type: String,
    },
    'type': {
      type: String,
      default: 'manage'
    },
  },
  data() {
    return {
      formatClone: 'all,image,video,audio,document,other',
      accept: '*.*',
      list: [],
      drag: false,
      visible: false,
      modalValue: '',
      current: 0,
      progress: {
        status: false,
        progress: 0
      },
      headers: {
        Accept: 'application/json',
        Authorization: `${getLocalUserInfo().token || ''}`
      }
    }
  },
  created() {
    this.list = this.value || []
    if (this.format) {
      this.formatClone = this.format
    }
    this.accept = formatType(this.formatClone)
  },
  methods: {
    fileChange(files, e) {

      if (e.status === 'uploading') {
        this.progress.status = true
        this.progress.progress = e.percent * 100
      } else if (e.status === 'done') {
        this.progress.status = false
        e.response.data.map(item => {
          this.list.push({
            name: item.title,
            url: item.url
          })
        })
        this.$emit('update:value', this.list)
      } else if (e.status === 'error') {
        window.message.error(e.response.message || '上传失败')
      }
    },
    fileManage() {
      window.fileManage({
        multiple: true,
        type: this.formatClone,
        uploadUrl: this.upload,
        fileUrl: this.fileUrl
      }).then(res => {
        res.map((item) => {
          this.list.push({
            name: item.title,
            url: item.url
          })
          this.$emit('update:value', this.list)
        })
      })
    }
  },
  render() {

    return <div class="w-full">
      <draggable
        modelValue={this.list}
        onUpdate:modelValue={(value) => {
          this.$emit('update:value', value), this.list = value
        }}
        onStart={this.drag = true}
        onEnd={this.drag = false}
        itemKey="index"
        class="rounded divide-y divide-gray-3 dark:divide-blackgray-3 overflow-hidden "
      >
        {{
          item: (item) => <div class="p-3 py-2 flex items-center justify-between text-sm bg-gray-100 hover:bg-gray-200 dark:bg-blackgray-1">
            <div class="w-0 flex-1 flex items-center text-gray-800 dark:text-gray-400">
              <icon-file class="flex-shrink-0 "/>
              <span class="ml-2 flex-1 w-0 truncate">
                  {item.element.name}
                </span>
            </div>
            <div class="ml-4 flex-shrink-0 flex gap-4">
              <a-link href={item.element.url} target="_blank">
                下载
              </a-link>
              <a-link status="danger" onClick={() => {
                this.list.splice(item.index, 1)
              }}>
                删除
              </a-link>
            </div>
          </div>,
          footer: () => this.type !== 'manage'
            ? <div>
              <a-upload
                action={getUrl(this.upload)}
                accept={this.accept}
                headers={this.headers}
                onChange={this.fileChange}
                multiple
                showFileList={false}
              >
                {
                  {
                    'upload-button': () => <div class="p-3 py-2 flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-blackgray-1 dark:hover:bg-blackgray-2 text-gray-600 dark:text-gray-400 ">
                      {this.progress.status ? <div>已上传 {this.progress.progress}%</div> : '上传附件'}
                    </div>
                  }
                }
              </a-upload>
            </div>
            : <div class="p-3 py-2 flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-blackgray-1 dark:hover:bg-blackgray-2 text-gray-600 dark:text-gray-400 " onClick={this.fileManage}>
              上传附件
            </div>
        }}

      </draggable>
    </div>
  }
})