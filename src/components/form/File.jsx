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
      type: [String, Number]
    },
    'format': {
      type: String,
      default: 'all,image,video,audio,document,other'
    },
    'image': {
      type: Boolean
    },
    'mini': {
      type: Boolean
    },
    'size': {
      type: Number,
      default: 125
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
      },
      headers: {
        Accept: 'application/json',
        Authorization: `${getLocalUserInfo().token || ''}`
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
    fileChange(files, e) {
      if (e.status === 'uploading') {
        this.progress.status = true
        this.progress.progress = e.percent * 100
      } else if (e.status === 'done') {
        this.progress.status = false
        this.$emit('update:value', e.response.data[0].url)

      } else if (e.status === 'error') {
        window.message.error(e.response.message || '上传失败')
      }
    },
    fileManage() {
      window.fileManage({
        type: this.formatClone,
      }).then(res => {
        this.$emit('update:value', res.url)
      })
    }
  },
  render() {
    if (!this.image) {
      return <div
        class="w-full bg-gray-100  rounded hover:bg-gray-200 dark:hover:bg-blackgray-2 dark:border-blackgray-1 dark:bg-blackgray-1  p-4 flex justify-center items-center flex-col">
        <div>
          <svg class="w-12 h-12" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z" fill="#FFE9B4" p-id="9921"></path>
            <path d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z" fill="#FFB02C" p-id="9922"></path>
            <path d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z" fill="#FFCA28" p-id="9923"></path>
          </svg>
        </div>
        <div class="text-gray-600 dark:text-gray-400 mt-2">请点击上传或者拖动文件到该处</div>
        {this.type !== 'manage' ? <div class="mt-2 relative">

          <a-upload
            action={getUrl(this.upload)}
            accept={this.accept}
            headers={this.headers}
            onChange={this.fileChange}
            showFileList={false}
          >
            {
              {
                'upload-button': () => <a-button
                  type="primary"
                  loading={this.progress.status}
                >
                  {this.progress.status ? <span>上传中 {this.progress.progress}%</span> : (this.value ? '已上传' : '上传文件')}
                </a-button>
              }
            }
          </a-upload>
        </div> : <div class="mt-2 relative">
          <a-button
            type="primary"
            loading={this.progress.status}
            onClick={this.fileManage}
          >
            {this.progress.status ? <span>上传中 {this.progress.progress}%</span> : (this.value ? '已上传' : '上传文件')}
          </a-button>
        </div>}
      </div>
    } else {
      return <div
        class="relative bg-gray-100 hover:bg-gray-200 dark:bg-blackgray-1 dark:hover:bg-blackgray-2 rounded bg-cover bg-center bg-no-repeat block flex items-end "
        style={{
          width: this.size + 'px',
          height: this.size + 'px',
          backgroundSize: '90%',
          backgroundImage: `url(${this.value || '/service/image/placeholder/180/180/选择图片'})`
        }}
      >
        <a-image-preview src={this.value || '/service/image/placeholder/180/180/选择图片'} vModel={[this.visible, 'visible']}/>
        {!this.mini ?
          <div class="flex gap-2 h-7 w-full items-center bg-white bg-opacity-60 dark:bg-blackgray-5 dark:bg-opacity-80">
            <div class="flex-grow flex justify-center text-center  hover:text-blue-600 cursor-pointer"
                 onClick={() => {
                   this.visible = true
                 }}>
              <icon-eye/>
            </div>
            {this.type !== 'manage' ? <div class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer">
                <a-upload
                  action={getUrl(this.upload)}
                  accept={this.accept}
                  headers={this.headers}
                  onChange={this.fileChange}
                  showFileList={false}
                >
                  {
                    {
                      'upload-button': () => <icon-upload/>
                    }
                  }
                </a-upload>
              </div>
              : <div class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer" onClick={this.fileManage}>
                <icon-upload/>
              </div>}
            {this.link && <div class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer">
              <icon-share-alt type="primary" ghost size="small" onClick={() => {
                this.prompt = true
              }}>
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
          : <div class="flex-grow flex justify-center items-center text-center w-full h-full opacity-0 hover:opacity-100 hover:bg-white  bg-opacity-30 dark:bg-blackgray-1 dark:bg-opacity-80 dark:hover:bg-blackgray-2 rounded cursor-pointer">
            <a-upload
              action={getUrl(this.upload)}
              accept={this.accept}
              headers={this.headers}
              onChange={this.fileChange}
              showFileList={false}
            >
              {
                {
                  'upload-button': () => <icon-upload/>
                }
              }
            </a-upload>
          </div>}
      </div>
    }
  }
})