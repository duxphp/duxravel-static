import { defineComponent } from 'vue'
import { getUrl } from '../../utils/request'
import { getLocalUserInfo } from '../../utils/user'
import { formatType } from '../../utils/component'

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
    'image': {
      type: Boolean
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
    if(this.image) {
      this.formatClone = 'image'
    }
    this.accept = formatType(this.formatClone)
  },
  methods: {
    fileChange(e) {
      if (e.file.status === 'uploading') {
        this.progress.status = true
        this.progress.progress = e.file.percentage
        // 上传中
      } else if (e.file.status === 'finished') {
        this.progress.status = false
      }
    },
    fileFinish({ file, event }) {
      try {
        const result = JSON.parse(event.target.response)
        if (result.code !== 200) {
          window.message.error(result.message || '上传失败')
        } else {
          result.data.map((item) => {
            this.list.push(this.image ? item.url : {name: item.title, url: item.url})
          })
        }
      } catch (err) {
        window.message.error('上传文件异常，请稍后再试')
      }
    },
    fileManage() {
      window.selectFile(true, this.formatClone).then(res => {
        res.map((item) => {
          this.list.push(this.image ? item.url : {name: item.title, url: item.url})
        })
      })
    }
  },
  render() {

    if (!this.image) {
      return <div>
        <draggable
          modelValue={this.list}
          onUpdate:modelValue={(value) => { this.$emit('update:value', value), this.list = value }}
          onStart={this.drag = true}
          onEnd={this.drag = false}
          itemKey="index"
          class="border border-gray-400 rounded divide-y divide-gray-400"
        >
          {{
            item: (item) => <li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
              <div class="w-0 flex-1 flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
                </svg>
                <span class="ml-2 flex-1 w-0 truncate">
                  {item.element.name}
                </span>
              </div>
              <div class="ml-4 flex-shrink-0 flex gap-4">
                <a href={item.element.url} target="_blank" class="font-medium text-blue-600 cursor-pointer">
                  下载
                </a>
                <div class="font-medium text-red-600 cursor-pointer" onClick={() => {
                  this.list.splice(item.index, 1)
                }}>
                  删除
                </div>
              </div>
            </li>,
            footer: () => this.type !== 'manage'
            ? <n-upload
            action={getUrl(this.upload)}
            accept={this.accept}
            headers={{
              'Accept': 'application/json',
              Authorization: `bearer ${getLocalUserInfo().token || ''}`
            }}
            onChange={this.fileChange}
            onFinish={this.fileFinish}
            showFileList={false} class="pl-3 pr-4 py-3 flex items-center justify-center cursor-pointer hover:text-blue-600">
              上传附件
            </n-upload>
            : <li class="pl-3 pr-4 py-3 flex items-center justify-center cursor-pointer hover:text-blue-600" onClick={this.fileManage}>
            上传附件
          </li>
          }}
          
        </draggable>
      </div>

    } else {
      return <draggable
        modelValue={this.list}
        onUpdate:modelValue={(value) => { this.$emit('update:value', value), this.list = value }}
        onStart={this.drag = true}
        onEnd={this.drag = false}
        itemKey="index"
        class="flex gap-2 flex-wrap"
      >
        {{
          item: (item) => <div class="relative w-28 h-28 border border-gray-400 border-dashed rounded bg-cover bg-center bg-no-repeat block hover:border-blue-600" style={{ backgroundSize: '90%', backgroundImage: `url(${item.element || '/service/image/placeholder/180/180/选择图片'})` }}>
            <div class="opacity-0 hover:opacity-100 absolute flex items-center justify-center w-full h-full bg-blue-200 bg-opacity-90 rounded cursor-pointer"><n-button type="error" onClick={() => {
              this.list.splice(item.index, 1)
            }}>删除</n-button></div>
          </div>,
          footer: () => this.type !== 'manage'
            ? <n-upload
              action={getUrl(this.upload)}
              accept={this.accept}
              headers={{
                'Accept': 'application/json',
                Authorization: `${getLocalUserInfo().token || ''}`
              }}
              onChange={this.fileChange}
              onFinish={this.fileFinish}
              showFileList={false}
            >
              <div class="relative w-28 h-28 border border-gray-400 border-dashed rounded bg-cover bg-center bg-no-repeat block hover:border-blue-600">
                <div class="text-gray-500 hover:text-blue-600 absolute flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-90 rounded cursor-pointer">
                  <div vShow={this.progress.status} class="text-2xl">
                    {this.progress.progress}%
                  </div>
                  <div vShow={!this.progress.status} class=" w-7 h-7">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              </div>
            </n-upload>
            : <div class="relative w-28 h-28 border border-gray-400 border-dashed rounded bg-cover bg-center bg-no-repeat block hover:border-blue-600" onClick={this.fileManage}>
              <div class="text-gray-500 hover:text-blue-600 absolute flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-90 rounded cursor-pointer">
                <div class=" w-7 h-7">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
            </div>
        }}
      </draggable>
    }


  }
})