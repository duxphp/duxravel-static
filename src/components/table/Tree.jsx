import {h, defineComponent, resolveDynamicComponent, watch} from 'vue'
import classnames from 'classnames'
import {request, searchQuick} from '../../utils/request'
import {router} from '../../utils/router'
import {vExec} from '../Create'
import event from '../../utils/event'

export default defineComponent({
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    iconColor: {
      type: Array,
      default: () => []
    },
    contextMenus: {
      type: Array,
      default: () => []
    },
    url: {
      type: String
    },
    sortUrl: {
      type: String
    },
    filter: {
      type: Object,
      default: () => ({})
    },
    urlBind: {
      type: Boolean,
      default: true
    },
    closeDialogRefreshUrls: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchKey: '',
      optionEl: null,
      popupVisible: false,
      loading: true,
      draggable: true,
      data: [],
      originData: []

    }
  },
  watch: {
    filter(params) {
      if (this.urlBind) {
        router.routerPush(void 0, Object.fromEntries(Object.keys(params).filter(key => params[key] !== null).map(key => [key, params[key]])))
      } else {
        this.getList({
          params: this.filter,
          agree: 'routerPush'
        })
      }
    }
  },
  created() {
    if (this.urlBind) {
      // 监听路由参数改变重新获取列表数据
      event.add('router-change', this.getList)

      // 默认跳转到默认的filter选项
      router.routerPush(void 0, Object.fromEntries(Object.keys(this.filter).filter(key => this.filter[key] !== null).map(key => [key, this.filter[key]])))
    } else {
      this.getList({
        params: this.filter,
        agree: 'routerPush'
      })
      // 监听关闭弹窗的时候刷新路由
      event.add('router-dialog-close', this.closeEvent)
      // 监听关闭ajax确认框时候的刷新数据
      event.add('router-ajax-finish', this.ajaxEvent)
    }

  },
  beforeUnmount() {
    event.remove('router-change', this.getList)
    event.remove('router-dialog-close', this.closeEvent)
    event.remove('router-ajax-finish', this.ajaxEvent)
  },
  methods: {
    renderData(data) {
      const color = this.iconColor

      function getNodeRoute(tree, index) {
        //let level = index
        return tree.map(item => {
          let node = {}
          node.title = item.title
          node.key = item.key
          node.level = index
          //node.icon = () => <span class={["inline-flex rounded-full border-2 w-4 h-4", 'bg-' + color[index] + '-400', 'border-' + color[index] + '-500']}/>
          if (item.children && item.children.length) {
            node.children = getNodeRoute(item.children, index + 1)
          }
          node.rawData = item
          return node;
        })
      }

      return getNodeRoute(data, 0)
    },
    searchData(keyword) {
      this.loading = true
      this.draggable = false
      if (!keyword) {
        this.draggable = true
        this.data = this.originData
        this.$nextTick(() => {
          this.loading = false
        })
        return false
      }
      const loop = (data) => {
        const result = [];
        data.forEach(item => {
          if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            result.push({...item});
          } else if (item.children) {
            const filterData = loop(item.children);
            if (filterData.length) {
              result.push({
                ...item,
                children: filterData
              })
            }
          }
        })
        return result;
      }
      this.data = loop(this.originData)
      this.$nextTick(() => {
        this.loading = false
      })
    },

    getList({params, agree}) {
      if (agree === 'routerPush') {
        this.loading = true
        searchQuick({
          url: this.url,
          method: 'get',
          data: params
        }).then(res => {
          this.loading = false
          this.data = this.originData = this.renderData(res.data)
          console.log(this.url, this.data)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    closeEvent(data) {
      if (this.closeDialogRefreshUrls.length === 0 || this.closeDialogRefreshUrls.some(item => ~data.item.url.indexOf(item))) {
        this.getList({
          params: this.filter,
          agree: 'routerPush'
        })
      }
    },
    ajaxEvent(data) {
      if (this.closeDialogRefreshUrls.length === 0 || this.closeDialogRefreshUrls.some(item => ~data.url.indexOf(item))) {
        this.getList({
          params: this.filter,
          agree: 'routerPush'
        })
      }
    },
    handleDrop({dragNode, dropNode, dropPosition}) {

      const sort = {
        id: dragNode.key,
        parent: null,
        before: null
      }
      const data = this.data;
      const loop = (data, key, callback, parent = null) => {
        data.some((item, index, arr) => {
          if (item.key === key) {
            callback(item, index, arr, parent);
            return true;
          }
          if (item.children) {
            return loop(item.children, key, callback, item);
          }
          return false;
        });
      };

      loop(data, dragNode.key, (_, index, arr) => {
        arr.splice(index, 1);
      });

      if (dropPosition === 0) {
        loop(data, dropNode.key, (item) => {
          item.children = item.children || [];
          item.children.push(dragNode);
        })
      } else {
        loop(data, dropNode.key, (_, index, arr, parent) => {
          const nodeIndex = dropPosition < 0 ? index : index + 1
          arr.splice(nodeIndex, 0, dragNode);
          // 上一个
          sort.before = parent.children?.[nodeIndex - 1]?.key || null
          // 父级
          sort.parent = parent.key || null

          if (parent.key) dragNode.level = parent.level + 1

        })
      }

      this.loading = true
      request({
        url: this.sortUrl,
        data: sort,
        method: 'POST'
      }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })

    },
    // 返回主体内容
    renderLabel({option}) {
      const list = this.columns.map(item => {
        let child = ''
        item = vExec.call({}, item)
        if (item.render) {
          child = item.render(option)
        } else if (item.key) {
          child = option[item.key]
        }
        return h(resolveDynamicComponent('div'), {
          class: classnames(item.className, 'tree-line'),
          style: item.width ? {width: item.width + 'px'} : {},
        }, child)
      })
      return list
    }
  },
  render() {

    const color = this.iconColor
    return <a-spin class="block" loading={this.loading} tip="加载节点中...">
      <a-input-search
        onInput={(value) => {
          this.searchData(value)
        }}
        class="mb-2"
      />
      {this.data.length > 0 ? <a-tree
        class="app-tree"
        data={this.data}
        showLine={true}
        blockNode={true}
        draggable={this.draggable}
        onDrop={this.handleDrop}>
        {
          {
            title: (item) => <a-dropdown
              trigger="contextMenu"
              alignPoint
              class="w-32"
            >
              {{
                default: () => <div class="flex-grow whitespace-nowrap py-2 flex gap-2 items-center">
                  <span class={["inline-flex rounded-full border-2 w-4 h-4", 'bg-' + color[item.level] + '-400', 'border-' + color[item.level] + '-500']}/>
                  {item.title}
                </div>,
                content: () => <div>
                  {this.contextMenus.length && this.contextMenus.map(menu => <a-doption onClick={() => new Function('item', menu.event)(item)}>{menu.text}</a-doption>)}
                </div>
              }}
            </a-dropdown>

          }
        }
      </a-tree> : <a-empty/>
      }
    </a-spin>
  }
})
