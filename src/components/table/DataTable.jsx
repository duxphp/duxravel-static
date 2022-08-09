import { defineComponent, ref, watch } from 'vue'
import { vExec } from '../Create'
import { getUrl, request, searchQuick } from '../../utils/request'
import event, { requestEvent } from '../../utils/event'
import { router } from '../../utils/router'

// 获取最近的pageContent组件实例
export const getPageContent = (parent) => {
  const parentName = parent?.$options?.name;
  if (parentName === "PageContent") {
    return parent;
  } else if (!parent.$parent) {
    return;
  }
  return getPageContent(parent.$parent);
}


export default defineComponent({
  props: {
    url: {
      type: String,
      default: () => window.location.href
    },
    urlBind: {
      type: Boolean,
      default: false
    },
    defaultData: Object,
    editUrl: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    filter: {
      type: Object,
      default: () => ({})
    },
    'n-params': {
      type: Object,
      default: () => ({})
    },
    select: {
      type: Boolean,
      default: false
    },
    simple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 20
    },
    requestEventName: {
      type: String,
      default: null
    },
    nowrap: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    defaultData(val) {
      // console.log('数据更新', val)
      val instanceof Array && (this.data = this.formatData(val))
    }
  },
  setup(props) {

    // 格式化数据
    const formatData = (data, replaceKeys = props.columns.filter(v => v.replace)) => {
      return data.map(item => {
        item.__loading = false
        // 替换keys
        if (replaceKeys.length) {
          replaceKeys.forEach(v => {
            item[v.dataIndex] = item[v.dataIndex].replace(v.replace, '')
          })
        }
        if (item.children) {
          item.children = formatData(item.children, replaceKeys);
        }
        return item
      })
    }

    // 选中的列
    const checkedRowKeys = ref([])
    // 列表数据
    const data = ref(formatData(props.defaultData || []))
    // 排序字段
    const sort = ref({})

    // 选中的行数
    const checkRow = () => checkedRowKeys.value.length

    /**
     * 默认批量操作方法
     * @param {*} option
     * @param {*} title
     * @param {*} type
     */
    const checkAction = (option, title, type = 'warning') => {
      if (!checkedRowKeys.value.length) {
        window.message.warning('请选择项目后再进行操作！')
        return
      }
      const callback = () => {
        if (typeof option === 'string') {
          option = {
            url: option,
            method: 'POST'
          }
        }
        if (!option.data?.ids) {
          if (typeof option.data === 'undefined') {
            option.data = {}
          }
          option.data.ids = checkedRowKeys.value
        }
        if (!option.method) {
          option.method = 'POST'
        }
        if (!option.urlType) {
          option.urlType = 'absolute'
        }
        if (typeof option.successMsg === 'undefined') {
          option.successMsg = true
        }
        request(option).then(getList)
      }
      if (title) {
        window.dialog[type]({
          title: '操作提醒',
          content: title,
          hideCancel: false,
          onOk: callback
        })
      } else {
        callback()
      }

    }

    const pagination = ref({
      showTotal: !props.simple,
      showJumper: !props.simple,
      showPageSize: !props.simple,
      simple: props.simple,
      total: 0,
      current: 1,
      pageSize: props.limit,
      onChange: page => {
        pagination.value.current = page
        getList(props.filter)
      },
      onPageSizeChange: limit => {
        pagination.value.pageSize = limit
        pagination.value.current = 1
        getList(props.filter)
      }
    })

    // loading显示
    const loading = ref(false)

    // 获取列表
    const getList = (params = {}) => {
      if (props.defaultData) {
        return
      }
      loading.value = true
      searchQuick({
        url: getUrl(props.url),
        data: {
          ...params,
          _sort: sort.value,
          page: pagination.value.current,
          limit: pagination.value.pageSize
        }
      }, 'data-table').then(res => {
        pagination.value.total = res.total
        pagination.value.pageSize = res.pageSize
        data.value = formatData(res.data)
        loading.value = false
      }).catch(() => {
        loading.value = false
      })
    }

    // 绑定在page插槽上的数据
    const childData = {
      checkedRowKeys,
      checkRow,
      getList,
      checkAction
    }

    const loopData = (key, callback, list = data.value, parent = null) => {
      list.some((item, index, arr) => {
        if (item[props.nParams['row-key']] == key) {
          item.__loading = false;
          callback(item, index, arr, parent);
          return true;
        }
        if (item.children) {
          return loopData(key, callback, item.children, item);
        }
        return false;
      });
    }

    const requestEventCallBack = res => {
      if (!res) {
        return
      }
      if (!Array.isArray(res)) {
        res = [res]
      }
      res.forEach(action => {
        if (action.data) {
          action.data = formatData([action.data])[0]
        }
        // 新增数据到顶级
        if (action.type === 'add' && !action.parentKey) {
          data.value[action.pos === 'end' ? 'push' : 'unshift'](action.data)
          return
        }
        loopData(
          action.type === 'add' ? action.parentKey : action.key,
          (item, index, arr) => {
            switch (action.type) {
              case 'edit': {
                arr[index] = action.data
                if (!arr[index].children?.length && item.children) {
                  arr[index].children = item.children
                }
                break
              }
              case 'add': {
                if (!item.children) {
                  item.children = []
                }
                item.children[action.pos === 'end' ? 'push' : 'unshift'](action.data)
                pagination.value.total += 1
                break
              }
              case 'del': {
                arr.splice(index, 1)
                pagination.value.total -= 1
                break
              }
              default: {
                break
              }
            }
          }
        )

      })
    }

    // 请求事件监听 更新数据
    if (props.requestEventName) {
      requestEvent.add(props.requestEventName, requestEventCallBack)
    }

    const routerChange = ({ params, agree }) => {
      // 参数变化重置为第一页
      if (agree === 'routerPush') {
        pagination.value.current = 1
        getList(params)
      }
    }

    // url自动跟随参数
    if (props.urlBind) {
      // 监听路由参数改变重新获取列表数据
      event.add('router-change', routerChange)

      // 监听筛选
      watch(props.filter, params => {
        // 过滤空参数 并且跳转到这个代参数的路由地址
        router.routerPush(void 0, Object.fromEntries(Object.keys(params).filter(key => params[key] !== null).map(key => [key, params[key]])))
      })

      // 默认跳转到默认的filter选项
      router.routerPush(void 0, Object.fromEntries(Object.keys(props.filter).filter(key => props.filter[key] !== null).map(key => [key, props.filter[key]])))
    } else {
      watch(props.filter, params => {
        // 跳转第一页
        pagination.value.current = 1
        // 过滤空参数 并且跳转到这个代参数的路由地址
        getList(params)
      })
      getList(props.filter)
    }

    // 排序
    const sorter = (key, order) => {
      if (!order) {
        sort.value = {}
      } else {
        sort.value = {}
        sort.value[key] = order === 'ascend' ? 'asc' : 'desc'
      }
      getList(props.filter)
    }

    const editStatus = ref({
      status: false
    })

    // 默认修改数据方法
    const editValue = (url = this.editUrl, data, index) => {
      if (editStatus.value.status) {
        return
      }
      editStatus.value = {
        status: true,
        data,
        index
      }
      request({
        url,
        urlType: 'absolute',
        method: 'post',
        data
      }).finally(() => {
        editStatus.value = {
          status: false
        }
      })
    }

    const colSortable = {
      sortDirections: ['ascend', 'descend'],
    }

    const columns = props.columns.map(item => vExec.call({ colSortable }, item, { editValue, editStatus }))

    return {
      formatData,
      sorter,
      pagination,
      childData,
      data,
      loading,
      columnsRender: columns,
      getList,
      routerChange,
      checkedRowKeys,
      requestEventCallBack
    }
  },

  beforeUnmount() {
    event.remove('router-change', this.routerChange)
    requestEvent.remove(this.requestEventName, this.requestEventCallBack)
  },

  render() {
    return <div class="relative">
      <a-table
        loading={this.loading}
        rowSelection={this.select ? {
          type: 'checkbox',
          selectedRowKeys: this.checkedRowKeys,
          showCheckedAll: true
        } : false}
        onSelectionChange={value => {
          this.checkedRowKeys = value
        }}
        pagination={this.defaultData ? false : this.pagination}
        data={this.data}
        columns={this.columnsRender}
        onSorterChange={this.sorter}
        {...vExec.call(this, this.nParams)}
      >
        {{
          tbody: () => {
            return <tbody style={this.nowrap ? { whiteSpace: 'nowrap' } : {}} />
          }
        }}
      </a-table>
      <div class="absolute bottom-0 z-10 ">
        {this.$slots.footer?.(this.childData)}
      </div>
    </div>

  }
})
