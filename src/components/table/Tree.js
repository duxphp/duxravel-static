import { h, defineComponent, resolveDynamicComponent, watch } from 'vue'
import classnames from 'classnames'
import { request, searchQuick } from '../../utils/request'
import { router } from '../../utils/router'
import { vExec } from '../Create'
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
    'n-params': {
      type: Object,
    },
    columns: {
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
    }
  },
  data() {
    return {
      data: []
    }
  },
  setup(props) {
    watch(props.filter, params => {
      router.routerPush(void 0, Object.fromEntries(Object.keys(params).filter(key => params[key] !== null).map(key => [key, params[key]])))
    })
  },
  created() {
    // 监听路由参数改变重新获取列表数据
    event.add('router-change', this.getList)

    // 默认跳转到默认的filter选项
    router.routerPush(void 0, Object.fromEntries(Object.keys(this.filter).filter(key => this.filter[key] !== null).map(key => [key, this.filter[key]])))
  },
  unmounted() {
    event.remove('router-change', this.getList)
  },
  methods: {
    getList({ params, agree }) {
      agree === 'routerPush' && searchQuick({
        url: this.url,
        method: 'get',
        data: params
      }).then(res => {
        this.data = res.data
      }).catch(() => {

      })
    },
    handleDrop({ node, dragNode, dropPosition }) {
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
    renderLabel({ option }) {
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
          style: item.width ? { width: item.width + 'px' } : {},
        }, child)
      })
      return list
    }
  },
  render() {
    return <div>
      <n-tree
        vShow={this.data.length > 0}
        class="table-tree"
        {...vExec.call(this, this.nParams)}
        data={this.data}
        checkable={true}
        renderLabel={this.renderLabel}
        blockLine={true}
        draggable={true}
        onDrop={this.handleDrop}
      />
      <div vShow={this.data.length === 0} class="flex justify-center bg-white p-4 shadow">
        <app-empty title="暂未找到数据" content="暂未找到数据，您可以尝试刷新数据" className="" />
      </div>

    </div>
  }
})
