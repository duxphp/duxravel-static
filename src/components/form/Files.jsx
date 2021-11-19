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
        type: this.formatClone
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
        class="border border-gray-3 rounded divide-y divide-gray-3 overflow-hidden "
      >
        {{
          item: (item) => <div class="pl-3 pr-4 py-2 flex items-center justify-between text-sm bg-white">
            <div class="w-0 flex-1 flex items-center text-gray-8">
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
                    'upload-button': () => <div className="pl-3 pr-4 py-2 flex items-center justify-center cursor-pointer hover:text-arcoblue-7">
                      {this.progress.status ? <div className="text-gray-6">已上传 {this.progress.progress}%</div> : '上传附件'}
                    </div>
                  }
                }
              </a-upload>
            </div>
            : <div class="pl-3 pr-4 py-3 flex items-center justify-center cursor-pointer hover:text-arcoblue-7" onClick={this.fileManage}>
              上传附件
            </div>
        }}

      </draggable>
    </div>
  }
})