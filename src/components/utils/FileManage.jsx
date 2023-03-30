import { defineComponent, ref, watch } from 'vue'
import { getUrl, request, searchQuick } from '../../utils/request'
import { getLocalUserInfo } from '../../utils/user'
import { formatType } from '../../utils/component'


export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'all,image,video,audio,document,other'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    callback: Function,
    close: Function,
    uploadUrl: {
      type: String,
      default: 'upload'
    },
    fileUrl: {
      type: String,
      default: 'fileManage'
    }

  },
  setup(props) {

    const api = ref({
      upload: props.uploadUrl,
      list: props.fileUrl + '?type=files',
      del: props.fileUrl + '?type=files-delete',
      cateList: props.fileUrl + '?type=folder',
      cateAdd: props.fileUrl + '?type=folder-create',
      cateDel: props.fileUrl + '?type=folder-delete'
    })

    const listLoading = ref(true)

    const showModal = ref(true)

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

    // 总条数
    const pageTotal = ref(1)
    const pageSize = ref(16)

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

    let initStatus = false
    const init = () => {
      if (initStatus) {
        return
      }
      // 获取分类 和列表
      request(api.value.cateList).then(res => {
        if (res instanceof Array) {
          cate.value = res
          filter.value.id = res[0]?.dir_id || ''
        }
        initStatus = true
      })
    }

    // 获取列表
    const getList = () => {
      listLoading.value = true
      searchQuick({
        url: api.value.list,
        data: filter.value
      }).then(res => {
        list.value = res.data
        pageTotal.value = res.total
        pageSize.value = res.pageSize
        listLoading.value = false
      })
    }

    // 获取列表
    watch(filter.value, () => {
      if (!filter.value.id) {
        list.value = []
        pageTotal.value = 1
        pageSize.value = 16
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
        props.callback?.(item)
        showModal.value = false
      }
    }

    // 多选提交
    const submit = () => {
      props.callback?.(select.value)
      showModal.value = false
    }

    // 设置显示
    const closeModal = () => {
      showModal.value = false
      props.close()
    }

    // 上传进度数据
    const uploadProgress = ref({
      status: false,
      progress: 0
    })

    // 上传事件
    const fileChange = (files, e) => {
      if (e.status === 'uploading') {
        uploadProgress.value.status = true
        uploadProgress.value.progress = e.percent * 100
      } else if (e.status === 'done') {
        uploadProgress.value.status = false
        getList()
      } else if (e.status === 'error') {
        window.message.error(e.response.message)
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
        url: api.value.cateAdd,
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
        hideCancel: false,
        onOk: () => {
          request({
            url: api.value.cateDel,
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

    // 数据删除
    const imageManage = ref({
      select: [],
      show: false
    })

    // 列表改变时，清空选项
    watch(list, () => {
      imageManage.value.select = []
    })

    const imageSelect = id => {
      const index = imageManage.value.select.indexOf(id)
      if (~index) {
        imageManage.value.select.splice(index, 1)
      } else {
        imageManage.value.select.push(id)
      }
    }

    const imageDel = () => {
      if (!imageManage.value.select.length) {
        return
      }
      window.dialog.error({
        title: '删除提示',
        content: `此操作不可撤销，确定要删除这些图片吗？`,
        hideCancel: false,
        onOk: () => {
          request({
            url: api.value.del,
            data: {
              id: imageManage.value.select.join(',')
            }
          }).then(() => {
            getList()
          })
        }
      })
    }

    const type = props.type.split(',')
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

    isMultiple.value = props.multiple
    init()
    accept.value = formatType(type)
    filter.value.filter = typeOption.value[0].value
    showModal.value = true
    select.value.splice(0)

    return {
      listLoading,
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
      pageTotal,
      addCate,
      cateAddStatus,
      cateAddValue,
      delCate,
      api,
      imageManage,
      imageSelect,
      imageDel
    }
  },
  render() {
    return <a-modal modalClass="file-manage page-dialog max-w-screen-md w-full" visible={this.showModal}
      closable={false} footer={false} onClose={this.closeModal} onCancel={this.closeModal}>

      <div class="arco-modal-header flex gap-2">
        <div class="flex-grow flex flex-row gap-2">
          {!!this.filter.id && <a-upload
            action={getUrl(this.api.upload)}
            accept={this.accept}
            headers={{
              'Accept': 'application/json',
              Authorization: `${getLocalUserInfo().token || ''}`
            }}
            data={{
              id: this.filter.id
            }}
            onChange={this.fileChange}
            multiple
            showFileList={false}
          >
            {this.uploadProgress.status ? this.uploadProgress.progress + '%' : '上传文件'}
          </a-upload>}
        </div>
        <div class="flex-none flex flex-row gap-2">
          {this.imageManage.show && <a-button onClick={() => this.imageManage.select = this.list.map(item => item.file_id)}>
            全选
          </a-button>}
          {this.imageManage.show && <a-button onClick={this.imageDel}>
            删除
          </a-button>}
          <a-button onClick={() => this.imageManage.show = !this.imageManage.show}>
            {this.imageManage.show ? '完成' : '管理'}
          </a-button>
          {this.typeOption.length > 1 && <div class="w-32">
            <a-select
              vModel={[this.filter.filter, 'modelValue']}
              options={this.typeOption}
            />
          </div>}
          <div class="w-32">
            <a-input
              vModel={[this.filter.keyword, 'modelValue']}
              type="text"
              placeholder="搜索"
            />
          </div>
        </div>
        <div class="flex-none">
          <div class="arco-icon-hover arco-icon-hover-size-medium" onClick={this.closeModal}>
            <icon-close />
          </div>
        </div>
      </div>

      <div class="flex flex-row items-stretch  ">
        <div
          class="flex-none manage-sidebar w-40 border-r border-gray-300 dark:border-blackgray-2 h-96 overflow-y-auto block">
          <ul>
            {
              this.cate.map((item, index) => <li
                class={`cate-item flex justify-between py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-blackgray-2 dark:text-gray-400  ${this.filter.id === item.dir_id ? 'active text-blue-600 dark:text-blue-600' : ''}`}
                onClick={() => this.filter.id = item.dir_id}
              >
                <div class="flex gap-2 items-center">
                  <icon-folder />
                  {item.name}
                </div>
                <span class="del" onClick={e => {
                  this.delCate(index)
                }}><icon-delete /></span>
              </li>)
            }
            <li class="p-3">
              <a-input
                class="add"
                vModel={[this.cateAddValue, 'modelValue']}
                onBlur={this.addCate}
                type="text"
                placeholder="添加新分类"
                loading={this.cateAddStatus}
              />
            </li>
          </ul>
        </div>
        <div class="flex-grow manage-main  dark:bg-blackgray-2 h-96 overflow-y-auto">
          <a-spin loading={this.listLoading} class="block" tip="载入文件中，请稍等...">
            {this.list.length > 0 && <ul class="files-list grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 p-4">
              {
                this.list.map(item => <li>
                  <div
                    onClick={() => this.selectItem(item)}
                    class={`item mb-1 mt-1 rounded p-2 text-gray-800 dark:text-gray-300 select-none cursor-pointer${this.isSelectItem(item) ? ' active bg-gray-100 text-blue-600 dark:bg-blackgray-3 dark:text-blue-600' : ''}`}
                    data-id="550">
                    <div
                      class="h-20 rounded bg-cover bg-center bg-no-repeat rounded"
                      style={{ backgroundImage: `url(${item.url})` }}
                    >
                    </div>
                    <div class="mt-1">
                      <div class="truncate">{item.title}</div>
                      <div class="text-xs text-gray-500 truncate">{item.time}</div>
                      <div class="text-xs text-gray-500 truncate">{item.size}</div>
                    </div>
                  </div>
                  {this.imageManage.show && <a-checkbox modelValue={this.imageManage.select.includes(item.file_id)} onChange={() => this.imageSelect(item.file_id)} />}
                </li>)
              }
            </ul>}
            {this.pageTotal > 1 && <div class="flex justify-center py-2"><a-pagination
              vModel={[this.filter.page, 'current']}
              total={this.pageTotal}
              pageSize={this.pageSize}
            /></div>}
            {this.list.length === 0 && <div class="flex flex-col justify-center items-center h-96">
              <a-empty />
            </div>}
          </a-spin>
        </div>
      </div>
      {this.isMultiple && <div class="arco-modal-footer flex items-center gap-4 flex-row">
        <c-scrollbar class="flex-grow" trigger="hover" direction="x">
          <div class="flex gap-2 flex-nowrap flex-row flex-shrink-0">
            {
              this.select.map(item => <div class="relative flex-shrink-0" key={item.file_id} onClick={() => this.selectItem(item)}>
                <img class="w-8 h-8 rounded" src={item.url} />
                <div
                  class="absolute inset-0 bg-black bg-opacity-60 text-xs opacity-0  flex items-center justify-center text-white hover:opacity-100 select-none">删除
                </div>
              </div>)
            }
          </div>
        </c-scrollbar>


        <div class="flex-none justify-end flex gap-2">
          <a-button onClick={this.closeModal}>关闭</a-button>
          <a-button type="primary" onClick={this.submit}>确定</a-button>
        </div>
      </div>}
    </a-modal>
  }
})
