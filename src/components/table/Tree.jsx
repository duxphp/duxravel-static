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
    treeData: Array,
    url: {
      type: String
    },
    sortUrl: {
      type: String
    },
    filter: {
      type: Object,
      default: {}
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
    fieldNames: {
      type: Object,
      default: {
        key: 'key',
        title: 'title',
        children: 'children'
      }
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
      expandedKeys: []
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
        if (item[this.fieldNames.key] === key) {
          callback(item, index, arr, parent);
          return true;
        }
        if (item[this.fieldNames.children]) {
          return this.loopData(key, callback, item[this.fieldNames.children], item);
        }
        return false;
      });
    },
    // 获取展开状态保存名称
    expandedKeysName(oldFilter) {
      return this.expandedKeysNamePrefix + '-' + this.url + '-' + qs.stringify(oldFilter || this.filter)
    },
    // 处理数据以适应tree组件
    renderData(data) {
      let getNodeRoute = (tree, index = 0) => {
        return tree.map(item => {
          let node = {}
          node[this.fieldNames.title] = item[this.fieldNames.title]
          node[this.fieldNames.key] = item[this.fieldNames.key]
          node.level = index

          let children = item[this.fieldNames.children]
          if (children && children.length) {
            node[this.fieldNames.children] = getNodeRoute(children, index + 1)
          }
          node.rawData = item
          return node;
        })
      }

      data = getNodeRoute(data)
      return data
    },
    // 重新生成level
    resetLevel(data = this.data, level = 0) {
      data.forEach(item => {
        item.level = level
        if (item[this.fieldNames.children] && item[this.fieldNames.children].length) {
          this.resetLevel(item[this.fieldNames.children], level + 1)
        }
      })
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
          if (item[this.fieldNames.title].toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
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
          } else if (item[this.fieldNames.children]) {
            const filterData = loop(item[this.fieldNames.children]);
            if (filterData.length) {
              result.push({
                ...item,
                [this.fieldNames.children]: filterData
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

      if (this.treeData) {
        this.expandedKeys = treeExpanded.get(this.expandedKeysName())
        this.data = this.originData = this.renderData(this.treeData)
        this.loading = false
        return
      }

      if (!this.url) {
        return
      }
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
          this.data[action.pos !== 'end' ? 'push' : 'unshift'](this.renderData([action.data])[0])
          return
        }
        // 新增编辑删除操作
        this.loopData(
          action.type === 'add' ? action.parentKey : action.key,
          (item, index, arr) => {
            if (action.type === 'edit') {
              arr[index] = this.renderData([action.data])[0]
              if (!arr[index][this.fieldNames.children]?.length && item[this.fieldNames.children]) {
                arr[index][this.fieldNames.children] = item[this.fieldNames.children]
              }
            } else if (action.type === 'del') {
              arr.splice(index, 1)
            } else if (action.type === 'add') {
              if (!item[this.fieldNames.children]) {
                item[this.fieldNames.children] = []
              }
              item[this.fieldNames.children][action.pos !== 'end' ? 'push' : 'unshift'](this.renderData([action.data])[0])


              if (!this.expandedKeys.includes(action.parentKey)) {
                this.expandedKeys.push(action.parentKey)
              }
            }
          }
        )
      })

      this.resetLevel()
    },
    handleDrop({ dragNode, dropNode, dropPosition }) {

      console.log(this.data)
      const sort = {
        id: dragNode.key,
        parent: null,
        before: null,
        after: null
      }

      this.loopData(dragNode.key, (_, index, arr) => {
        arr.splice(index, 1);
      });

      // 返回的数据不符合映射，重新组合
      const newData = {
        [this.fieldNames.title]: dragNode[this.fieldNames.title],
        [this.fieldNames.key]: dragNode[this.fieldNames.key],
        [this.fieldNames.children]: dragNode[this.fieldNames.children],
        rawData: dragNode.rawData
      }
      if(dragNode[this.fieldNames.title] === undefined) {
        newData[this.fieldNames.title] = dragNode.title
      }
      if(dragNode[this.fieldNames.key] === undefined) {
        newData[this.fieldNames.key] = dragNode.key
      }
      if(dragNode[this.fieldNames.children] === undefined) {
        newData[this.fieldNames.children] = dragNode.children
      }


      if (dropPosition === 0) {
        this.loopData(dropNode.key, (item) => {
          item.children = item.children || [];
          item.children.push(newData);
          // 父级
          sort.parent = item[this.fieldNames.key]
          // 改变等级
          newData.level = item.level + 1
        })
      } else {
        this.loopData(dropNode.key, (_, index, arr, parent) => {
          const nodeIndex = dropPosition < 0 ? index : index + 1
          arr.splice(nodeIndex, 0, newData)
          // 上一个
          sort.before = arr[nodeIndex - 1]?.[this.fieldNames.key] || null
          // 下一个
          sort.after = arr[nodeIndex + 1]?.[this.fieldNames.key] || null
          // 父级
          sort.parent = parent ? parent[this.fieldNames.key] : null
          // 改变等级
          newData.level = parent ? parent.level + 1 : 0
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

    }
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
      {this.data.length > 0 ? <div
        class="flex-grow h-10 app-scrollbar overflow-y-auto overflow-x-hidden"
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
            fieldNames={this.fieldNames}
          >
            {
              {
                title: (item) => {
                  const bgColor = "bg-" + color[item.level] + "-400"
                  const borderColor = "border-" + color[item.level] + "-500"
                  return this.contextMenus.length
                    ? <a-dropdown
                      trigger="contextMenu"
                      position="tr"
                      onSelect={(key) => {
                        const menu = this.contextMenus.find(menu => menu.key === key)
                        new Function('item', 'options', menu.event)(item, this.options)
                      }}

                      class="w-32"
                    >
                      {{
                        default: () => {
                          return <div class="flex-grow whitespace-nowrap py-1 flex gap-2 items-center">
                            <span class={['inline-flex rounded-full border-2 w-4 h-4', bgColor, borderColor]} />
                            {this.$slots.label ? this.$slots.label(item) : item[this.fieldNames.title]}
                          </div>
                        },
                        content: () => {
                          return this.contextMenus.map(menu => <a-doption value={menu.key}>{menu.text}</a-doption>)
                        }
                      }}
                    </a-dropdown>
                    : <div class="flex-grow whitespace-nowrap py-1 flex gap-2 items-center ">
                      <span class={['inline-flex rounded-full border-2 w-4 h-4', bgColor, borderColor]} />
                      {this.$slots.label ? this.$slots.label(item) : item[this.fieldNames.title]}
                    </div>
                }
              }

            }
          </a-tree>
        </a-spin>
      </div> : <a-empty />
      }
    </div>
  }
})
