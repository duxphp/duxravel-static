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
    console.log(this.contextMenus)
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
          let node = {}
          node.title = item.title
          node.key = item.key
          node.level = index
          node.icon = () => <span class={["inline-flex rounded-full border-2 w-4 h-4", 'bg-' + color[index] + '-400', 'border-' + color[index] + '-500']} />
          if (item.children && item.children.length) {
            node.children = getNodeRoute(item.children, index + 1)
          }
          node.rawData = item
          return node;
        })
      }

      return getNodeRoute(data, 0)

    },

    getList({ params, agree }) {
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
    handleDrop({ dragNode, dropNode, dropPosition }) {

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
        });
      } else {
        loop(data, dropNode.key, (_, index, arr, parent) => {
          const nodeIndex = dropPosition < 0 ? index : index + 1
          arr.splice(nodeIndex, 0, dragNode);
          // 上一个
          sort.before = parent.children?.[nodeIndex - 1]?.key || null
          // 父级
          sort.parent = parent.key || null
        });
      }

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
      {this.data.length > 0 && <a-tree
        class="app-tree"
        data={this.data}
        showLine={true}
        blockNode={true}
        draggable
        onDrop={this.handleDrop}>
        {
          {
            title: (item) => <a-dropdown
              trigger="contextMenu"
              alignPoint
              class="w-32"
            >
              {{
                default: () => <div class="flex-grow whitespace-nowrap py-2">{item.title} {item.key}</div>,
                content: () => <div>
                  {this.contextMenus.length && this.contextMenus.map(menu => <a-doption onClick={() => new Function('item', menu.event)(item)}>{menu.text}</a-doption>)}
                </div>
              }}
            </a-dropdown>

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
