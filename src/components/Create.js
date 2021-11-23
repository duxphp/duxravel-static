import { h, defineComponent, resolveDynamicComponent, toRefs, provide, toRef, isRef, reactive } from 'vue'

export const createPropsProvideKey = 'createPropsProvideKey'

// 执行字符串函数
const exec = function (script, params = {}) {
  const data = { ...this, ...params }
  const keys = Object.keys(data)
  return (new Function(...keys, 'return ' + script))(...keys.map(key => data[key]))
}

/**
 * vue指令执行
 * @param {*} data 当前节点数据
 * @param {*} arg 执行参数
 * @param {*} slotProps 插槽参数
 */
export const vExec = function (data, arg, slotProps) {
  const { nodeName, child, ...item } = data

  // 查找keys
  const itemKeys = Object.keys(item)

  // 插槽变量计算
  const vSlotKey = itemKeys.find(key => key.startsWith('vSlot'))
  const slotArg = (() => {
    if (!vSlotKey || !item[vSlotKey] || typeof item[vSlotKey] !== 'string') {
      return {}
    }
    // 计算变量名
    const keys = item[vSlotKey].replace(/[ {}]{1,}/g, '').split(',').map(v => v.split('=')[0].split(':')).map(v => v[1] || v[0]).toString()
    const script = `
    const ${item[vSlotKey]} = props;
    return { ${keys} }
    `
    return (new Function('props', script))(slotProps || {});
  })();
  // 组合参数
  let newArg = { ...arg, ...slotArg }

  // 绑定数据
  if (item.vData) {
    const dataType = typeof item.vData
    if (!['string', 'object'].includes(dataType) || !item.vData) {
      console.error('vData:无效的类型', item.vData)
    } else {
      // 绑定数据
      const obj = reactive(dataType === 'string' ? exec.call(this, item.vData, newArg) : item.vData)
      newArg = { ...newArg, ...obj }
    }
    delete item.vData
  }
  // 指令处理
  itemKeys.forEach(key => {
    if (key.startsWith('vOn')) {
      // 事件绑定处理
      const name = `on${key.substr(4, 1).toUpperCase()}${key.substr(5)}`
      const script = item[key]
      delete item[key]
      item[name] = $event => {
        const res = exec.call(this, script, { ...newArg, $event })
        if (typeof res === 'function') {
          res.call(this, $event)
        }
      };
    } else if (key.startsWith('vBind')) {
      // 数据绑定处理
      item[key.substr(6)] = exec.call(this, item[key], newArg)
      delete item[key]
    } else if (key.startsWith('vModel')) {
      // Model绑定处理
      const bindKey = item[key]
      delete item[key]
      const name = key.substr(7) || 'modelValue'
      item[name] = exec.call(this, bindKey, newArg)
      item[`onUpdate:${name}`] = _value => exec.call(this, `${bindKey} = _value`, { ...newArg, _value })
    } else if (key.startsWith('render')) {
      // render节点转换
      const node = item[key]
      delete item[key]
      const data = key.split(':')
      // 节点需要的字段
      const paramsKeys = data[1] ? data[1].replace(/ /g, '').split(',') : []
      // 节点转换
      item[data[0]] = (...reder) => renderNodeList.call(this, node, { ...newArg, ...Object.fromEntries(paramsKeys.map((key, index) => [key, reder[index]])) }).default()
    } else if (key.startsWith('vData')) {
      // 处理子集数据转换
      item[key.split(':')[1]] = vExec(item[key], arg, slotProps)
      delete item[key]
    }
  })
  if (nodeName && typeof nodeName === 'string') {
    // 创建组件
    return h(
      resolveDynamicComponent(nodeName),
      item,
      renderNodeList.call(this, child, newArg)
    )

  } else {
    // 返回处理后的json
    return item
  }
}

/**
 * 返回每一项
 * @param {*} data 当前这一项的数据
 * @param {*} childNode 子节点 和 插槽
 * @param {*} defaultNodes 默认插槽数组
 * @param {*} arg 附加到exec上的变量
 * @returns
 */
export const renderItem = function (data, arg, slotProps) {
  if (typeof data === 'string') {
    const string = []
    const split = data.split('{{')
    split[0] && string.push(split[0])
    for (let i = 1; i < split.length; i++) {
      const item = split[i].split('}}')
      string.push(exec.call(this, item[0], arg))
      item[1] && string.push(item[1])
    }
    return string.join('')
  } else if (typeof data === 'object' && data !== null) {

    const { vIf, vFor, ...item } = data

    // 条件处理
    if (vIf) {
      const bool = exec.call(this, vIf, arg)
      if (!bool) {
        return
      }
    }
    // 循环处理
    if (vFor) {
      const data = vFor.split(' in ')
      data[0] = data[0].replace(/[ ()]/g, '').split(',')
      const value = exec.call(this, data[1], arg)
      if (typeof value !== 'object') {
        return
      }
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const newAgr = { ...arg, [data[0][0]]: value[key] }
          if (data[0][1]) {
            newAgr[data[0][1]] = key
          }
          return vExec.call(this, item, newAgr, slotProps)
        }
      }
    } else {
      return vExec.call(this, item, arg, slotProps)
    }
  }
}

export const renderNodeList = function (node, arg) {
  if (!node || Object.keys(node).length === 0) {
    return { default: () => [] }
  }
  const childNode = {}

  // 将插槽分组
  const slotGroup = {}
  const nodes = node instanceof Array ? node : [node]

  nodes.forEach((item) => {
    if (typeof item === 'string') {
      slotGroup.default = slotGroup.default || []
      slotGroup.default.push(item)
    } else if (typeof item === 'object' && Object.keys(item).length && item !== null) {
      // 插槽变量计算
      const vSlotKey = Object.keys(item).find(key => key.startsWith('vSlot'))
      const slotName = vSlotKey && vSlotKey.substr(6) || 'default'
      slotGroup[slotName] = slotGroup[slotName] || []
      slotGroup[slotName].push(item)
    }
  })
  Object.keys(slotGroup).forEach(slotKey => {
    childNode[slotKey] = props => slotGroup[slotKey].map((item) => renderItem.call(this, item, arg, props))
  })
  return childNode
}


const CompCreate = defineComponent({
  props: {
    node: {
      type: [Array, Object, String],
      default: ''
    },
    setupScript: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      delault: () => ({})
    }
  },

  setup(props, context) {
    // 共享数据
    provide(createPropsProvideKey, props)

    const res = (new Function('props', 'context', props.setupScript))(toRefs(props), context)
    return typeof res === 'object' ? res : {}
  },

  render() {
    return renderNodeList.call(this, this.node).default?.()
  }
})

export default CompCreate
