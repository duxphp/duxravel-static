import { defineComponent } from 'vue'
import { getUrl, request } from '../../utils/request'
import { getLocalUserInfo } from '../../utils/user'
import { formatType } from '../../utils/component'

export default defineComponent({
  props: {
    'upload': {
      type: String,
      default: 'upload'
    },
    'value': {
      type: [String, Number]
    },
    'format': {
      type: String,
      default: 'all,image,video,audio,document,other'
    },
    'image': {
      type: Boolean
    },
    'size': {
      type: Number,
      default: 32
    },
    'type': {
      type: String,
      default: 'manage'
    },
    'link': {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formatClone: '',
      accept: '*.*',
      progress: {
        status: false,
        progress: 0
      }
    }
  },
  created() {
    if (this.format) {
      this.formatClone = this.format
    }
    if (this.image) {
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
          this.$emit('update:value', result.data[0].url)
        }
      } catch (err) {
        window.message.error('上传文件异常，请稍后再试')
      }
    },
    fileManage() {
      window.selectFile(false, this.formatClone).then(res => {
        this.$emit('update:value', res.url)
      });
    }
  },
  render() {

    if (!this.image) {
      return this.type !== 'manage'
        ? <n-upload
          action={getUrl(this.upload)}
          accept={this.accept}
          headers={{
            'Accept': 'application/json',
            Authorization: `bearer ${getLocalUserInfo().token || ''}`
          }}
          onChange={this.fileChange}
          onFinish={this.fileFinish}
          showFileList={false}
        >
          <n-upload-dragger class="select-none flex flex-col gap-2 justify-center items-center relative cursor-pointer h-32 lg:h-32 border border-gray-500 border-dashed rounded bg-cover bg-center bg-no-repeat text-gray-500 hover:text-blue-600 hover:border-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            <div class="text-gray-500"><span class="status">{this.progress.status ? <span>文件上传中，请稍后 <span class="ml-2 text-blue-600">{this.progress.progress}%</span></span> : (this.value ? '文件已上传，点击重新上传' : '未上传文件，点击或者拖动上传文件')}</span></div>
          </n-upload-dragger>
        </n-upload>
        : <div onClick={this.fileManage} class="select-none flex flex-col gap-2 justify-center items-center relative cursor-pointer h-32 lg:h-32 border border-gray-500 border-dashed rounded bg-cover bg-center bg-no-repeat text-gray-500 hover:text-blue-600 hover:border-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <div class="text-gray-500"><span class="status">{this.value ? <span class="text-blue-600">文件已上传，点击重新上传</span> : '未上传文件，点击上传文件'}</span></div>
        </div>

    } else {
      return <div
        class="relative  border border-gray-300 border-dashed bg-gray-100 rounded bg-cover bg-center bg-no-repeat block hover:border-blue-600"
        class={`h-${this.size} lg:w-${this.size} lg:h-${this.size}`}
        style={{ backgroundSize: '90%', backgroundImage: `url(${this.value || '/service/image/placeholder/180/180/选择图片'})` }}
      >
        <div class="opacity-0 hover:opacity-100 absolute flex flex-col gap-2 justify-center items-center w-full h-full bg-blue-100 bg-opacity-90 rounded cursor-pointer">
          {this.type !== 'manage' ? <n-upload
            action={getUrl(this.upload)}
            accept={this.accept}
            headers={{
              'Accept': 'application/json',
              Authorization: `bearer ${getLocalUserInfo().token || ''}`
            }}
            onChange={this.fileChange}
            onFinish={this.fileFinish}
            showFileList={false}
          >
            {this.link ? <n-button type="primary" ghost size="small">上传</n-button> : <div class="w-1/2 h-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>}
          </n-upload> 
          : (this.link ? <n-button type="primary" onClick={this.fileManage} ghost size="small">上传</n-button> : <div onClick={this.fileManage} class="w-1/2 h-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>)}
          {this.link && <n-button type="primary" ghost size="small" onClick={() => {
            window.appDialog.prompt({
              title: '请输入图片地址',
              callback: (value) => {
                this.$emit('update:value', value)
              }
            })
          }}>地址</n-button>}
        </div>
      </div>
    }


  }
})