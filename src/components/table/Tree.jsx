import {h, defineComponent, resolveDynamicComponent, watch} from 'vue'
import {getUrl, request, searchQuick} from '../../utils/request'
import {router} from '../../utils/router'
import {vExec} from '../Create'
import event from '../../utils/event'

export default defineComponent({
  props: {
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
    refreshUrls: {
      type: Array,
      default: () => []
    },
    search: {
      type: Boolean,
      default: true
    },
    keywords: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number],
      default: null
    }
  },
  watch: {
    filter(val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.getList({
          params: this.filter,
          agree: 'routerPush'
        })
      }
    }
  },
  data() {

    return {
      optionEl: null,
      popupVisible: false,
      loading: true,
      draggable: !!this.sortUrl,
      data: [],
      originData: []

    }
  },
  created() {
    this.getList({
      agree: 'routerPush'
    })
    // 监听关闭弹窗的时候刷新路由
    event.add('router-dialog-close', this.closeEvent)
    // 监听关闭ajax确认框时候的刷新数据
    event.add('router-ajax-finish', this.ajaxEvent)

  },
  beforeUnmount() {
    event.remove('router-dialog-close', this.closeEvent)
    event.remove('router-ajax-finish', this.ajaxEvent)
  },
  methods: {
    renderData(data) {
      function getNodeRoute(tree, index) {
        return tree.map(item => {
          let node = {}
          node.title = item.title
          node.key = item.key
          node.level = index
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
        this.draggable = !!this.sortUrl
        this.data = this.originData
        this.$nextTick(() => {
          this.loading = false
        })
        return false
      }
      const loop = (data) => {
        const result = [];
        data.forEach(item => {
          let status = false;
          if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            status = true
          }
          if (!status && item.rawData) {
            for (let key of this.keywords) {
              if (item.rawData[key] && item.rawData[key].toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                status = true
                break
              }
            }
          }
          if (status) {
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
        this.data = []
        searchQuick({
          url: getUrl(this.url),
          method: 'get',
          data: params
        }).then(res => {
          this.loading = false
          this.data = this.originData = this.renderData(res.data)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    closeEvent(data) {
      if (this.refreshUrls.length === 0 || this.refreshUrls.some(item => ~data.item.url.indexOf(item))) {
        this.getList({
          params: this.filter,
          agree: 'routerPush'
        })
      }
    },
    ajaxEvent(data) {
      if (this.refreshUrls.length === 0 || this.refreshUrls.some(item => ~data.url.indexOf(item))) {
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
          // 父级
          sort.parent = item.key
        })
      } else {
        loop(data, dropNode.key, (_, index, arr, parent) => {
          const nodeIndex = dropPosition < 0 ? index : index + 1
          arr.splice(nodeIndex, 0, dragNode);
          // 上一个
          sort.before = parent ? parent.children?.[nodeIndex - 1]?.key || null : null
          // 父级
          sort.parent = parent ? parent.key : null
          // 改变等级
          dragNode.level = parent ? parent.level + 1 : 0

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
  },
  render() {

    const color = this.iconColor
    return <div class="flex flex-col h-full">
      {this.search && <a-input-search
        onInput={(value) => {
          this.searchData(value)
        }}
        class="mb-2 flex-none"
        placeholder="搜索"
      />}
      {this.data.length > 0 ? <c-scrollbar
        direction="y"
        class="flex-grow h-10"
      >
        <a-spin class="block flex flex-col h-full" loading={this.loading} tip="加载节点中...">
          <a-tree
            class="app-tree"
            data={this.data}
            showLine={true}
            blockNode={true}
            draggable={this.draggable}
            onDrop={this.handleDrop}
            selectedKeys={this.value ? [this.value] : null}
            onSelect={(value) => {
              this.$emit('update:value', this.value === value[0] ? null : value[0])
            }}
          >
            {
              {
                title: (item) => <a-dropdown
                  trigger="contextMenu"
                  alignPoint
                  class="w-32"
                >
                  {{
                    default: () => {
                      const bgColor = "bg-" + color[item.level] + "-400"
                      const borderColor = "border-" + color[item.level] + "-500"
                      return <div class="flex-grow whitespace-nowrap py-2 flex gap-2 items-center">
                        <span class={['inline-flex rounded-full border-2 w-4 h-4', bgColor, borderColor]}/>
                        {this.$slots.label ? this.$slots.label(item) : item.title}
                      </div>
                    },
                    content: () => <div>
                      {this.contextMenus.length && this.contextMenus.map(menu => <a-doption onClick={() => new Function('item', menu.event)(item)}>{menu.text}</a-doption>)}
                    </div>
                  }}
                </a-dropdown>

              }
            }
          </a-tree>
        </a-spin>
      </c-scrollbar> : <a-empty/>
      }
    </div>
  }
})
