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
      this.progress.status = true
      const fd = new FormData()
      fd.append('file', e.target.files[0])
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
        this.$emit('update:value', data[0].url)
      })
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
      return this.type !== 'manage'
        ?
        <div class="w-full bg-gray-2 border border-dashed rounded border-gray-4 p-4 flex justify-center items-center flex-col ">
          <div class="">
            <svg t="1637049076755" class="w-12 h-12" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" >
              <path
                d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z"
                fill="#FFE9B4" p-id="9921"></path>
              <path
                d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z"
                fill="#FFB02C" p-id="9922"></path>
              <path
                d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z"
                fill="#FFCA28" p-id="9923"></path>
            </svg>
          </div>
          <div className="text-gray-6 mt-2">请点击上传或者拖动文件到该处</div>
          <div className="mt-2 relative">
              <input type="file" vShow={false} ref="fileRef" onChange={this.fileChange} />
              <a-button
                type="primary"
                loading={this.progress.status}
                onClick={() => {
                this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
              }
              }>{this.progress.status ? <span>上传中 {this.progress.progress}%</span> : (this.value ? '已上传': '上传文件')}</a-button>

          </div>
        </div>
        /*<a-upload
          action={getUrl(this.upload)}
          accept={this.accept}
          headers={{
            'Accept': 'application/json',
            Authorization: `${getLocalUserInfo().token || ''}`
          }}
          onChange={this.fileChange}
          showFileList={false}
          draggable
          tip={this.progress.status ? this.progress.progress + '%' : (this.value ? '已上传文件': '未上传文件')}
        >

        </a-upload>*/

        :

        <div
          className="w-full bg-gray-2 border border-dashed rounded border-gray-4 p-4 flex justify-center items-center flex-col ">
          <div className="">
            <svg t="1637049076755" class="w-12 h-12" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z"
                fill="#FFE9B4" p-id="9921"></path>
              <path
                d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z"
                fill="#FFB02C" p-id="9922"></path>
              <path
                d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z"
                fill="#FFCA28" p-id="9923"></path>
            </svg>
          </div>
          <div className="text-gray-6 mt-2">请点击上传或者拖动文件到该处</div>
          <div className="mt-2 relative">
            <a-button type="primary" onClick={this.fileManage}>{this.progress.status ? <span>上传中 <icon-loading/></span> : (this.value ? '重新上传' : '上传文件')}</a-button>

          </div>
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
              <icon-upload onClick={this.fileManage}/>
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