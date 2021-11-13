import {defineComponent, ref} from 'vue'
import {getUrl, request} from '../../utils/request'
import {getLocalUserInfo} from '../../utils/user'
import {formatType} from '../../utils/component'

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
      visible: false,
      prompt: false,
      modalValue: '',
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
    fileFinish({file, event}) {
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
        ? <a-upload
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
          <n-upload-dragger
            class="select-none flex flex-col gap-2 justify-center items-center relative cursor-pointer h-32 lg:h-32 border border-gray-500 border-dashed rounded bg-cover bg-center bg-no-repeat text-gray-500 hover:text-blue-600 hover:border-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 " fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            <div class="text-gray-500"><span class="status">{this.progress.status ? <span>文件上传中，请稍后 <span
              class="ml-2 text-blue-600">{this.progress.progress}%</span></span> : (this.value ? '文件已上传，点击重新上传' : '未上传文件，点击或者拖动上传文件')}</span>
            </div>
          </n-upload-dragger>
        </a-upload>
        : <div onClick={this.fileManage}
               class="select-none flex flex-col gap-2 justify-center items-center relative cursor-pointer h-32 lg:h-32 border border-gray-500 border-dashed rounded bg-cover bg-center bg-no-repeat text-gray-500 hover:text-blue-600 hover:border-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 " fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <div class="text-gray-500"><span class="status">{this.value ?
            <span class="text-blue-600">文件已上传，点击重新上传</span> : '未上传文件，点击上传文件'}</span></div>
        </div>

    } else {
      return <div
        class="relative  border border-gray-300  bg-gray-100 rounded bg-cover bg-center bg-no-repeat block flex items-end w-full h-full "
        class={`h-${this.size} lg:w-${this.size} lg:h-${this.size}`}
        style={{
          backgroundSize: '90%',
          backgroundImage: `url(${this.value || 'http://highway.test/service/image/placeholder/180/180/选择图片'})`
        }}
      >
        <a-image-preview src={this.value || 'http://highway.test/service/image/placeholder/180/180/选择图片'}
                         vModel={[this.visible, 'visible']}/>
        <div class="flex p-2 gap-2 w-full bg-white bg-opacity-60">

          <div class="flex-grow flex text-center justify-center hover:text-blue-600 cursor-pointer" onClick={() => {
            this.visible = true
          }}>
            <icon-eye/>
          </div>

          {this.type !== 'manage' ? <div
              class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer"
              onClick={this.fileManage}

              //
              // action={getUrl(this.upload)}
              // accept={this.accept}
              // headers={{
              //   'Accept': 'application/json',
              //   Authorization: `bearer ${getLocalUserInfo().token || ''}`
              // }}
              // onChange={this.fileChange}
              // onFinish={this.fileFinish}
              // showFileList={false}
            >
              <icon-upload/>
            </div>
            : <div class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer">
              <icon-upload onClick={this.fileManage} />
            </div>}
          {this.link && <div class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer">
            <icon-share-alt type="primary" ghost size="small" onClick={() => {
              this.prompt = true
            }}>地址
            </icon-share-alt>

            <a-modal
              visible={this.prompt}
              title='图片地址'
              vModel={[this.prompt, 'visible']}
              onOk={() => {
                this.$emit('update:value', this.modalValue)
              }}
            >
              <div>
                <a-input vModel={[this.modalValue, 'model-value']} modelValue={this.value}/>
              </div>
            </a-modal>

          </div>}
        </div>
      </div>
    }


  }
})