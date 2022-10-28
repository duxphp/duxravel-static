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
    'type': {
      type: String,
      default: 'manage'
    },
  },
  data() {
    return {
      formatClone: 'image',
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
          this.list.push(item.url)
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
          this.list.push(item.url)
          this.$emit('update:value', this.list)
        })
      })
    }
  },
  render() {
    return <div>
      <a-image-preview-group
        vModel={[this.visible, 'visible']}
        vModel={[this.current, 'current']}
        infinite={true}
        srcList={this.list}
      />
      <draggable
        modelValue={this.list}
        onUpdate:modelValue={(value) => {
          this.$emit('update:value', value)
          this.list = value
        }}
        onStart={this.drag = true}
        onEnd={this.drag = false}
        itemKey="index"
        class="flex gap-2 flex-wrap"
      >
        {{
          item: (item) => <div
            class="relative bg-gray-100 hover:bg-gray-200 dark:bg-blackgray-1 dark:hover:bg-blackgray-2 rounded bg-cover bg-center bg-no-repeat block flex items-end"
            style={{backgroundSize: '90%', backgroundImage: `url(${item.element || '/service/image/placeholder/180/180/选择图片'})`}}
          >
            <div class="flex p-2 gap-2 bg-white bg-opacity-80  dark:bg-blackgray-5 dark:bg-opacity-80 w-28 h-28 opacity-0 hover:opacity-100 items-center">
              <div class="flex-grow flex justify-center text-center  hover:text-blue-600 cursor-pointer "
                   onClick={() => {
                     this.visible = true
                     this.current = item.index
                   }}>
                <icon-eye/>
              </div>
              <div class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer">
                <icon-share-alt type="primary" ghost size="small" onClick={() => {
                  window.appDialog.prompt({
                    title: '更改图片地址',
                    value: item.element
                  }).then(value => {
                    this.list[item.index] = value
                  })
                }}>
                </icon-share-alt>
              </div>
              <div class="flex-grow flex justify-center text-center hover:text-blue-600 cursor-pointer">
                <icon-delete onClick={() => {
                  this.list.splice(item.index, 1)
                }}/>
              </div>
            </div>
          </div>,
          footer: () => this.type !== 'manage'
            ? <div class="relative w-28 h-28 rounded block ">
                <a-upload
                  action={getUrl(this.upload)}
                  accept={this.accept}
                  headers={this.headers}
                  onChange={this.fileChange}
                  multiple
                  showFileList={false}
                  class="block"
                >
                  {
                    {
                      'upload-button': () => <div class="text-gray-600 dark:text-gray-400 absolute flex items-center justify-center w-full h-full bg-gray-100 hover:bg-gray-200 dark:bg-blackgray-1 dark:hover:bg-blackgray-2 rounded cursor-pointer text-center">
                        {this.progress.status ?
                        <div class="text-xl"> {this.progress.progress}%</div> :
                        <div class="flex items-center flex-col justify-center ">
                          <icon-upload class="text-2xl"/>
                          <div class="mt-2">上传图片</div>
                        </div>}
                      </div>
                    }
                  }
                </a-upload>



            </div>
            : <div class="relative w-28 h-28 rounded block" onClick={this.fileManage}>
              <div class="text-gray-600 hover:text-blue-600 absolute flex items-center justify-center w-full h-full bg-gray-100  hover:bg-gray-200 dark:bg-blackgray-1 dark:hover:bg-blackgray-2 rounded cursor-pointer">
                <div class="flex items-center flex-col justify-center ">
                  <icon-upload class="text-2xl"/>
                  <div class="mt-2 text-xs">上传图片</div>
                </div>
              </div>
            </div>
        }}
      </draggable>
    </div>
  }
})