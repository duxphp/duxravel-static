import {h, defineComponent, resolveDynamicComponent, watch} from 'vue'
import classnames from 'classnames'
import {request, searchQuick} from '../../utils/request'
import {router} from '../../utils/router'
import {vExec} from '../Create'
import event from '../../utils/event'

function findSiblingsAndIndex(node, nodes) {
  if (!nodes) return [null, null]
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i]
    if (siblingNode.key === node.key) return [nodes, i]
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
    if (siblings) return [siblings, index]
  }
  return [null, null]
}

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
      optionEl: null,
      popupVisible: false,
      data: []
    }
  },
  setup(props) {
    watch(props.filter, params => {
      if (props.urlBind) {
        router.routerPush(void 0, Object.fromEntries(Object.keys(params).filter(key => params[key] !== null).map(key => [key, params[key]])))
      } else {
        this.getList({
          params: props.filter,
          agree: 'routerPush'
        })
      }
    })

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
          item.level = index
          item.icon = () => <span class={["inline-flex rounded-full border-2 w-4 h-4", 'bg-' + color[index] + '-400', 'border-' + color[index] + '-500']}/>
          if (item.children && item.children.length) {
            item.children = getNodeRoute(item.children, index + 1)
          }
          return item;
        })
      }

      return getNodeRoute(data, 0)

    },

    getList({params, agree}) {
      if (agree === 'routerPush') {
        searchQuick({
          url: this.url,
          method: 'get',
          data: params
        }).then(res => {
          this.data = this.renderData(res.data)
          console.log(this.url, this.data)
        }).catch(() => {

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
    handleDrop({node, dragNode, dropPosition}) {
      const data = this.data
      const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
        dragNode,
        data
      )
      const sort = {
        id: dragNode.key,
        parent: null,
        before: null,
        index: 0
      }
      dragNodeSiblings.splice(dragNodeIndex, 1)
      if (dropPosition === 'inside') {
        if (node.children) {
          node.children.unshift(dragNode)
        } else {
          node.children = [dragNode]
        }
      } else if (dropPosition === 'before') {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, data)
        // 计算位置
        sort.before = nodeSiblings[nodeIndex - 1]?.key || null
        sort.index = nodeIndex
        nodeSiblings.splice(nodeIndex, 0, dragNode)
      } else if (dropPosition === 'after') {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, data)
        // 计算位置
        sort.before = nodeSiblings[nodeIndex].key
        sort.index = nodeIndex + 1
        nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
      }
      this.data = Array.from(data)
      // 获取新的上级
      const getSuper = (key, superNode = null, child = this.data) => {
        for (let i = 0; i < child.length; i++) {
          const item = child[i]
          if (key === item.key) {
            return superNode?.key || superNode
          } else if (item.children && item.children.length) {
            const data = getSuper(key, item, item.children)
            if (data) {
              return data
            }
          }
        }
        return superNode
      }
      sort.parent = getSuper(dragNode.key)
      request({
        url: this.sortUrl,
        data: sort,
        method: 'POST'
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
    return <div>
      <a-dropdown
        vModel={[this.popupVisible, 'popupVisible']}
        popupContainer={this.optionEl}

        >
        {{
          default:() => <a-button onClick={() => this.popupVisible = true}>Click Me</a-button>,
          content: () => <div>
            <a-doption>Option 1</a-doption>
          </div>
        }}
      </a-dropdown>
      {this.data.length > 0 && <a-tree data={this.data}
                                       showLine={true}
                                       blockNode={true}>
        {
          {
            title: (item) => <div class="whitespace-nowrap">{item.title}</div>,
            extra: (item) => <div class="options">
              <span onClick={(e) => {
                this.optionEl = e.target
                console.log(e)
                this.popupVisible = true
              }}>
              <div>dsadsad</div>
              </span>
            </div>
          }
        }
      </a-tree>}

      {/*{
        this.data.length > 0 && this.$slots.default?.({
          data: this.data,
          //renderLabel: this.renderLabel,
          //onDrop: this.handleDrop
        })
      }
      {
        this.data.length === 0 && this.$slots.empty?.()
      }*/}
    </div>
  }
})
