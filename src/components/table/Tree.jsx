import { defineComponent } from 'vue'
import qs from 'qs'
import { request, searchQuick } from '../../utils/request'
import { requestEvent } from '../../utils/event'

/**
 * 将展开的级别keys保存在本地
 */
const treeExpanded = {
  key: 'treeExpandedKeysData',
  get(name) {
    let data = localStorage.getItem(this.key)
    if (!data) {
      return []
    }
    try {
      data = JSON.parse(data)
      return data[name] || []
    } catch (error) {
      return []
    }
  },
  set(name, value) {
    try {
      let data = localStorage.getItem(this.key)
      if (!data) {
        data = "{}"
      }
      data = JSON.parse(data)
      data[name] = value
      localStorage.setItem(this.key, JSON.stringify(data))
    } catch (error) {

    }
  }
}

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
    },
    requestEventName: {
      type: String,
      default: null
    }
  },
  watch: {
    filter(val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.data.length && treeExpanded.set(this.expandedKeysName(oldVal), this.expandedKeys)
        this.getList()
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
      originData: [],
      options: {},
      expandedKeys: [],
    }
  },
  created() {
    this.expandedKeysNamePrefix = location.pathname
    this.getList()
    requestEvent.add(this.requestEventName, this.requestEvent)
  },
  beforeUnmount() {
    // 保存key
    treeExpanded.set(this.expandedKeysName(), this.expandedKeys)
    requestEvent.remove(this.requestEventName, this.requestEvent)
  },
  methods: {
    // 通过key递归查找节点
    loopData(key, callback, data = this.data, parent = null) {
      data.some((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr, parent);
          return true;
        }
        if (item.children) {
          return this.loopData(key, callback, item.children, item);
        }
        return false;
      });
    },
    // 获取展开状态保存名称
    expandedKeysName(oldFilter) {
      return this.expandedKeysNamePrefix + '-' + this.url + '-' + qs.stringify(oldFilter || this.filter)
    },
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
            result.push({ ...item });
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
    getList() {
      this.loading = true
      this.data = []
      searchQuick({
        url: this.url,
        data: this.filter || {}
      }).then(res => {
        this.loading = false
        this.expandedKeys = treeExpanded.get(this.expandedKeysName())
        this.data = this.originData = this.renderData(res.data)
      }).catch(() => {
        this.loading = false
      })
    },
    requestEvent(res) {
      if (!res) {
        return
      }
      if (!Array.isArray(res)) {
        res = [res]
      }
      res.forEach(action => {
        // 新增数据到顶级
        if (action.type === 'add' && !action.parentKey) {
          this.data.push(this.renderData([action.data])[0])
          return
        }
        // 新增编辑删除操作
        this.loopData(
          action.type === 'add' ? action.parentKey : action.key,
          (item, index, arr) => {
            if (action.type === 'edit') {
              arr[index] = this.renderData([action.data])[0]
            } else if (action.type === 'del') {
              arr.splice(index, 1)
            } else if (action.type === 'add') {
              if (!item.children) {
                item.children = []
              }
              item.children[action.pos === 'end' ? 'push' : 'unshift'](this.renderData([action.data])[0])
              if (!this.expandedKeys.includes(action.parentKey)) {
                this.expandedKeys.push(action.parentKey)
              }
            }
          }
        )
      })
    },
    handleDrop({ dragNode, dropNode, dropPosition }) {

      const sort = {
        id: dragNode.key,
        parent: null,
        before: null,
        after: null
      }

      this.loopData(dragNode.key, (_, index, arr) => {
        arr.splice(index, 1);
      });

      if (dropPosition === 0) {
        this.loopData(dropNode.key, (item) => {
          item.children = item.children || [];
          item.children.push(dragNode);
          // 父级
          sort.parent = item.key
          // 改变等级
          dragNode.level = item.level + 1
        })
      } else {
        this.loopData(dropNode.key, (_, index, arr, parent) => {
          const nodeIndex = dropPosition < 0 ? index : index + 1
          arr.splice(nodeIndex, 0, dragNode);
          // 上一个
          sort.before = arr[nodeIndex - 1]?.key || null
          // 下一个
          sort.after = arr[nodeIndex + 1]?.key || null
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
            expandedKeys={this.expandedKeys}
            onExpand={res => this.expandedKeys = res}
          >
            {
              {
                title: (item) => {
                  const bgColor = "bg-" + color[item.level] + "-400"
                  const borderColor = "border-" + color[item.level] + "-500"
                  return this.contextMenus.length
                    ? <a-dropdown
                      trigger="contextMenu"
                      alignPoint
                      class="w-32"
                    >
                      {{
                        default: () => {
                          return <div class="flex-grow whitespace-nowrap py-2 flex gap-2 items-center">
                            <span class={['inline-flex rounded-full border-2 w-4 h-4', bgColor, borderColor]} />
                            {this.$slots.label ? this.$slots.label(item) : item.title}
                          </div>
                        },
                        content: () => <>
                          {this.contextMenus.map(menu => <a-doption onClick={() => {
                            new Function('item', 'options', menu.event)(item, this.options)
                          }}>{menu.text}</a-doption>)}
                        </>

                      }}
                    </a-dropdown>
                    : <div class="flex-grow whitespace-nowrap py-2 flex gap-2 items-center">
                      <span class={['inline-flex rounded-full border-2 w-4 h-4', bgColor, borderColor]} />
                      {this.$slots.label ? this.$slots.label(item) : item.title}
                    </div>
                }
              }

            }
          </a-tree>
        </a-spin>
      </c-scrollbar> : <a-empty />
      }
    </div>
  }
})
