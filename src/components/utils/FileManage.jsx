import { defineComponent, ref, getCurrentInstance, watch } from 'vue'
import event from '../../utils/event'
import { getUrl, request, searchQuick } from '../../utils/request'
import { getLocalUserInfo } from '../../utils/user'
import { formatType } from '../../utils/component'
import './FileManage.scss'

const api = {
  upload: 'upload',
  list: 'fileManage?type=files',
  del: 'fileManage?type=files-delete',
  cateList: 'fileManage?type=folder',
  cateAdd: 'fileManage?type=folder-create',
  cateDel: 'fileManage?type=folder-delete'
}

const selectData = {
  multiple: false,
  type: 'image'
}

export const selectFile = window.selectFile = (multiple, type = 'all,image,video,audio,document,other') => {
  event.emit('show-file-manage', {
    multiple,
    type
  })
  return new Promise((resolve, reject) => {
    selectData.resolve = resolve
    selectData.reject = reject
  })
}

export default defineComponent({
  setup() {
    const showModal = ref(false)

    // 格式限制
    const accept = ref('*.*')

    // 分类
    const cate = ref([])

    // 列表
    const list = ref([])

    // 选中项
    const select = ref([])

    // 筛选项
    const filter = ref({
      filter: 'all', // 类型
      keyword: '', // 搜索关键词
      id: '', // 分类id
      page: 1 // 分页
    })

    // 总页数
    const pageCount = ref(1)

    // 类型选项
    const typeOption = ref([])

    // 是否多选
    const isMultiple = ref(false)

    // 编辑模式 和选中项
    const editData = ref({
      status: false,
      select: []
    })

    // 新增分类value
    const cateAddValue = ref('')

    event.add('show-file-manage', ({ multiple, type }) => {
      type = type.split(',')
      const types = {
        all: '全部',
        image: '图片',
        video: '视频',
        audio: '音频',
        document: '文档',
        other: '其他'
      }
      typeOption.value = type.map(value => ({
        label: types[value],
        value
      }))
      
      isMultiple.value = multiple
      init()
      accept.value = formatType(type)
      filter.value.filter = typeOption.value[0].value
      showModal.value = true
      select.value.splice(0)
    })

    let initStatus = false
    const init = () => {
      if (initStatus) {
        return
      }
      // 获取分类 和列表
      request(api.cateList).then(res => {
        cate.value = res
        filter.value.id = res[0]?.dir_id || ''
        initStatus = true
      })
    }

    // 获取列表
    const getList = () => {
      searchQuick({
        url: api.list,
        data: filter.value
      }).then(res => {
        list.value = res.data
        pageCount.value = res.total
      })
    }

    // 获取列表
    watch(filter.value, () => {
      if (!filter.value.id) {
        list.value = []
        pageCount.value = 1
        return
      }
      getList()
    })

    const isSelectItem = item => select.value.some(child => child.file_id === item.file_id)
    const getSelectItemIndex = item => select.value.findIndex(child => child.file_id === item.file_id)

    // 选择项目
    const selectItem = item => {
      if (isMultiple.value) {
        // 多选
        const index = getSelectItemIndex(item)
        if (~index) {
          select.value.splice(index, 1)
        } else {
          select.value.push(item)
        }
      } else {
        // 单选直接返回
        selectData.resolve?.(item)
        showModal.value = false
      }
    }

    // 多选提交
    const submit = () => {
      selectData.resolve?.(select.value)
      showModal.value = false
    }

    // 设置显示
    const closeModal = () => {
      showModal.value = false
      selectData.reject?.({
        message: '用户关闭'
      })
    }

    // 上传进度数据
    const uploadProgress = ref({
      status: false,
      progress: 0
    })

    // 上传事件
    const fileChange = e => {
      if (e.file.status === 'uploading') {
        uploadProgress.value.status = true
        uploadProgress.value.progress = e.file.percentage
        // 上传中
      } else if (e.file.status === 'finished') {
        uploadProgress.value.status = false
        // 上传完成
        getList()
      }
    }

    const cateAddStatus = ref(false)
    // 新增分类
    const addCate = () => {
      if (cateAddStatus.value || !cateAddValue.value) {
        return
      }
      cateAddStatus.value = true
      request({
        url: api.cateAdd,
        data: {
          name: cateAddValue.value
        }
      }).then(res => {
        cate.value.push({
          dir_id: res.id,
          name: res.name
        })
        filter.value.id = res.id
        cateAddValue.value = ''
      }).finally(() => {
        cateAddStatus.value = false
      })
    }

    // 分类删除
    const delCate = (index) => {
      const item = cate.value[index]
      window.dialog.error({
        title: '删除提示',
        content: `此操作不可撤销，确定要删除"${item.name}"分类吗？`,
        negativeText: "取消",
        positiveText: '删除',
        onPositiveClick: () => {
          request({
            url: api.cateDel,
            data: {
              id: item.dir_id
            }
          }).then(() => {
            cate.value.splice(index, 1)
            if (item.dir_id === filter.value.id) {
              filter.value.id = cate.value[0]?.dir_id || ''
            }
          })
        }
      })

    }

    return {
      showModal,
      closeModal,
      accept,
      cate,
      list,
      select,
      isSelectItem,
      selectItem,
      submit,
      filter,
      editData,
      isMultiple,
      typeOption,
      fileChange,
      uploadProgress,
      pageCount,
      addCate,
      cateAddStatus,
      cateAddValue,
      delCate,
    }
  },
  render() {
    return <a-modal modalClass="page-dialog max-w-screen-md w-auto" visible={this.showModal} closable={false} footer={false} onUpdate:close={this.closeModal}>

        <div class="flex flex-col items-center  lg:flex-row p-4 border-b border-gray-300  gap-4">
          <div class="flex-grow flex flex-col lg:flex-row gap-2">
            {!!this.filter.id && <n-upload
              action={getUrl(api.upload)}
              accept={this.accept}
              headers={{
                'Accept': 'application/json',
                Authorization: `bearer ${getLocalUserInfo().token || ''}`
              }}
              data={{
                id: this.filter.id
              }}
              onChange={this.fileChange}
              multiple
              showFileList={false}
            >
              <n-button>{this.uploadProgress.status ? this.uploadProgress.progress + '%' : '上传文件'}</n-button>
            </n-upload>}
          </div>
          <div class="flex-none flex flex-row gap-2">
            {this.typeOption.length > 1 && <div class="w-32"><n-select
              value={this.filter.filter}
              onUpdate:value={val => this.filter.filter = val}
              options={this.typeOption}
            /></div>}
            <div class="w-32">
              <n-input
                value={this.filter.keyword}
                onUpdate:value={val => this.filter.keyword = val}
                type="text"
                placeholder="搜索"
              />
            </div>
          </div>
          <div class="flex-none">
            <div class="cursor-pointer h-5 w-5 text-gray-600 hover:text-red-900" onClick={this.closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row items-stretch border-b border-gray-300">
          <div class="flex-none manage-sidebar border-b bg-gray-100 lg:bg-white lg:w-40 lg:border-b-0 lg:border-r border-gray-300 lg:h-96 lg:overflow-y-auto lg:block hidden">
            <ul>
              {
                this.cate.map((item, index) => <li
                  class={`cate-item flex justify-between py-3 px-4 cursor-pointer hover:bg-gray-200 ${this.filter.id === item.dir_id ? 'active text-blue-900' : ''}`}
                  onClick={() => this.filter.id = item.dir_id}
                >
                  {item.name}
                  <span class="del" onClick={e => {
                    e.stopPropagation()
                    this.delCate(index)
                  }}>删除</span>
                </li>)
              }
              <li class="p-3">
                <n-input
                  class="add"
                  value={this.cateAddValue}
                  onUpdate:value={val => this.cateAddValue = val}
                  onBlur={this.addCate}
                  type="text"
                  placeholder="添加新分类"
                  loading={this.cateAddStatus}
                />
              </li>
            </ul>
          </div>
          <div class="flex-grow manage-main  lg:h-96 overflow-y-auto">
          {this.list.length > 0 && <ul class="files-list grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 p-4">
              {
                this.list.map(item => <li onClick={() => this.selectItem(item)}>
                  <div class={`item mb-1 mt-1 rounded p-2 text-gray-800 select-none cursor-pointer${this.isSelectItem(item) ? ' active bg-gray-200 text-blue-900' : ''}`} data-id="550">
                    <div
                      class="h-20 rounded bg-cover bg-center bg-no-repeat rounded"
                      style={{ backgroundImage: `url(${item.url})` }}
                    >
                    </div>
                    <div class="mt-1">
                      <div class="truncate">{item.title}</div>
                      <div class="text-xs text-gray-500">{item.time}</div>
                      <div class="text-xs text-gray-500">{item.size}</div>
                    </div>
                  </div>
                </li>)
              }
            </ul>}
            {this.pageCount > 1 && <n-pagination
              page={this.filter.page}
              onUpdate:page={page => this.filter.page = page}
              pageCount={this.pageCount}
            />}
            {this.list.length === 0 && <div class="files-none flex flex-col justify-center items-center text-center h-full">
              <div class="w-16 h-16 text-gray-600">
              <svg class="w-full h-full fill-current stroke-current" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M734.208 354.461538a78.769231 78.769231 0 0 1 73.216 49.703385L866.461538 552.881231V787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923v-231.699693l59.195076-151.433846A78.769231 78.769231 0 0 1 290.107077 354.461538h444.100923z m-355.209846 212.676924H189.046154L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-220.553846h-189.952a133.907692 133.907692 0 0 1-266.003692 0z m355.249231-181.169231H290.067692a47.261538 47.261538 0 0 0-41.865846 25.284923l-2.166154 4.765538L199.286154 535.630769h190.306461l-0.039384 0.590769A15.753846 15.753846 0 0 1 409.6 551.384615a102.4 102.4 0 0 0 204.8 0 15.753846 15.753846 0 0 1 14.848-15.753846h196.450462l-47.576616-119.847384a47.261538 47.261538 0 0 0-38.675692-29.538462l-5.238154-0.275692zM286.168615 106.417231l2.166154 2.363077 114.609231 155.254154a15.753846 15.753846 0 0 1-23.158154 21.070769l-2.166154-2.363077-114.60923-155.214769a15.753846 15.753846 0 0 1 23.158153-21.110154z m244.460308-4.017231a15.753846 15.753846 0 0 1 15.438769 12.603077l0.315077 3.150769v155.254154a15.753846 15.753846 0 0 1-31.192615 3.150769l-0.315077-3.150769V118.153846c0-8.664615 7.049846-15.753846 15.753846-15.753846z m265.688615 3.072a15.753846 15.753846 0 0 1 4.962462 19.298462l-1.614769 2.756923-114.333539 155.175384a15.753846 15.753846 0 0 1-26.978461-15.911384l1.575384-2.756923 114.372923-155.21477a15.753846 15.753846 0 0 1 22.016-3.347692z" ></path></svg>
              </div>
              <div class="mt-5 text-lg">没有找到文件</div>
              <div class="mt-1 text-gray-500">
                该目录下暂时没有找到该类型的文件，您可以进行上传
              </div>
            </div>}
          </div>
        </div>
        {this.isMultiple && <div class="p-4 flex items-center  gap-4 flex-col lg:flex-row">
          <n-scrollbar class="flex-grow">
          <div class="flex gap-2 flex-nowrap lg:flex flex-col lg:flex-row">
            {
              this.select.map(item => <div class="relative" key={item.file_id} onClick={() => this.selectItem(item)}>
                <img class="w-9 h-9 rounded" src={item.url} />
                <div class="absolute inset-0 bg-black bg-opacity-60 text-xs opacity-0 flex items-center justify-center text-white hover:opacity-100 select-none">删除</div>
              </div>)
            }
          </div>
          </n-scrollbar>
          <div class="flex-none justify-end flex gap-2">
            <n-button type="default" onClick={this.closeModal}>关闭</n-button>
            <n-button type="primary" onClick={this.submit}>确定</n-button>
          </div>
        </div>}
    </a-modal>
  }
})