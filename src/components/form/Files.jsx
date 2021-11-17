import {defineComponent} from 'vue'
import {getUrl} from '../../utils/request'
import {formatType} from '../../utils/component'

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
    fileChange(e) {
      e.stopPropagation()
      if (!e.target.files.length || this.progress.status) {
        return false;
      }
      this.progress.status = true
      const fd = new FormData()

      for (let i in e.target.files) {
        fd.append('file_' + i, e.target.files[i])
      }
      window.ajax({
        url: getUrl(this.upload),
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        data: fd,
        onProgress: (progress) => {
          this.progress.progress = progress
        }
      }).then(data => {
        this.progress.status = false
        data.map(item => {
          this.list.push({
            name: item.title,
            url: item.url
          })
        })
        this.$emit('update:value', this.list)
      }).catch(() => {
        this.progress.status = false
      })
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
        class="border border-gray-4 rounded divide-y divide-gray-4 overflow-hidden "
      >
        {{
          item: (item) => <div class="pl-3 pr-4 py-3 flex items-center justify-between text-sm bg-white">
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
              <input type="file" vShow={false} ref="fileRef" accept={this.accept} multiple onChange={this.fileChange} disabled={this.progress.status} />
              <div className="pl-3 pr-4 py-3 flex items-center justify-center cursor-pointer hover:text-arcoblue-7" onClick={() => {
                this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
              }}>
                {this.progress.status ? <div class="text-gray-6">已上传 {this.progress.progress}%</div> : '上传附件'}
              </div>
            </div>
            : <div class="pl-3 pr-4 py-3 flex items-center justify-center cursor-pointer hover:text-arcoblue-7" onClick={this.fileManage}>
              上传附件
            </div>
        }}

      </draggable>
    </div>
  }
})