import { h, defineComponent, resolveDynamicComponent, toRefs, provide, reactive, isRef, isReactive, isProxy, toRef } from 'vue'
import { deepCopy } from '../utils/object'

/**
 * 判断是不是引用类型 用于优化绑定
 * @param {*} data 
 */
const isQuote = data => {
  return typeof data === 'function' || isRef(data) || isRef(data) || isReactive(data) || isProxy(data)
}

/**
 * 过滤不需要渲染到组件的参数
 * @param {*} data 
 * @returns 
 */
const getComponentProps = data => {
  const { nodeName, child, vStringReplace, vIf, vFor, ..._data } = data
  return _data
}

const commandReg = /^v[A-Z]/
const spaceReg = / /g
const vForRef = /[ ()]/g
/**
 * 判断是不是一个指令
 * @param {*} key 
 * @returns 
 */
const isCommandKey = key => commandReg.test(key) || key.startsWith('render')

const vDataTypes = ['string', 'object']

export const createPropsProvideKey = 'createPropsProvideKey'

// 执行字符串函数
const exec = function (script, params = {}) {
  try {
    const data = { ...this, ...params }
    const keys = Object.keys(data)
    return (new Function(...keys, 'return ' + script)).apply(null, keys.map(key => data[key]))
  } catch (error) {
    console.error(error)
  }
}

/**
 * vue指令执行
 * @param {*} data 当前节点数据
 * @param {*} arg 执行参数
 * @param {*} slotProps 插槽参数
 */
export const vExec = function (data, arg, slotProps) {
  const { nodeName, child, vStringReplace } = data

  // 将vModel转换为vBind和vOn
  Object.keys(data).filter(key => key.startsWith('vModel')).forEach(key => {
    const _value = data[key]
    delete data[key]
    const _key = key.substr(7) || 'modelValue'
    data['vBind:' + _key] = _value
    data['vOn:update:' + _key] = `__value => ${_value} = __value;`
  })

  // 查找keys
  const itemKeys = Object.keys(data)

  // 插槽变量计算
  const vSlotKey = itemKeys.find(key => key.startsWith('vSlot'))
  const slotArg = (() => {
    if (!vSlotKey || !data[vSlotKey] || typeof data[vSlotKey] !== 'string' || !slotProps) {
      return {}
    }
    // 计算变量名
    const keys = data[vSlotKey].replace(/[ {}]{1,}/g, '').split(',').map(v => v.split('=')[0].split(':')).map(v => v[1] || v[0]).toString()
    const script = `
    const ${data[vSlotKey]} = props;
    return { ${keys} }
    `
    return (new Function('props', script))(slotProps);
  })();
  // 组合参数
  let newArg = { ...arg, ...slotArg }

  // 绑定数据
  if (data.vData) {
    const dataType = typeof data.vData
    if (!vDataTypes.includes(dataType) || !data.vData) {
      console.error('vData:无效的类型', data.vData)
    } else {
      // 绑定数据
      const obj = reactive(dataType === 'string' ? exec.call(this, data.vData, newArg) : data.vData)
      newArg = { ...newArg, ...obj }
    }
    delete data.vData
  }
  // 指令处理
  itemKeys.forEach(key => {
    if (!isCommandKey(key)) {
      return
    }
    if (key.startsWith('vOn')) {
      // 事件绑定处理
      const _key = `on${key.substr(4, 1).toUpperCase()}${key.substr(5)}`
      const script = data[key]
      delete data[key]
      data[_key] = ($event, ...arg) => {
        const res = exec.call(this, script, { ...newArg, $event })
        if (typeof res === 'function') {
          res.call(this, $event, ...arg)
        }
      }
    } else if (key.startsWith('vBind')) {
      // 数据绑定处理
      const _key = key.substr(6)
      data[_key] = exec.call(this, data[key], newArg)
      if (isQuote(data[_key])) {
        delete data[key]
      }
    } else if ((key.startsWith('render') || key.startsWith('vRender')) && typeof data[key] === 'object') {
      const _value = data[key]
      if (key.startsWith('vRender')) {
        delete data[key]
        key = key.substr(8)
      } else {
        delete data[key]
      }
      // render节点转换
      const _data = key.split(':')
      // 节点需要的字段
      const paramsKeys = _data[1] ? _data[1].replace(spaceReg, '').split(',') : []
      // 节点转换
      data[_data[0]] = (...reder) => renderNodeList.call(this, deepCopy(_value), { ...newArg, ...Object.fromEntries(paramsKeys.map((key, index) => [key, reder[index]])) }).default?.()
    } else if (key.startsWith('vChild') && typeof data[key] === 'object') {
      // 处理子集数据转换
      data[key.split(':')[1]] = vExec(data[key], newArg)
      delete data[key]
    }
  })

  // 文本字符换替换
  if (vStringReplace && typeof vStringReplace === 'string') {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        const val = data[key].replace(vStringReplace, '')
        // 如果是vModel绑定的值让这个值触发更新
        const updateKey = `onUpdate:${key}`
        if (val !== data[key] && typeof data[updateKey] === 'function') {
          data[updateKey](val)
        }
        data[key] = val
      }
    })
  }

  if (nodeName && typeof nodeName === 'string') {
    // 创建组件
    return h(
      resolveDynamicComponent(nodeName),
      getComponentProps(data),
      renderNodeList.call(this, child, newArg)
    )
  } else {
    // 返回处理后的json
    return data
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

  if (typeof data === 'string' || typeof data === 'number') {
    data += ''
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

    const { vIf, vFor } = data

    // 条件处理
    if (vIf) {
      const bool = exec.call(this, vIf, arg)
      if (!bool) {
        return
      }
    }
    // 循环处理
    if (vFor) {
      const _data = vFor.split(' in ')
      _data[0] = _data[0].replace(vForRef, '').split(',')
      const value = exec.call(this, _data[1], arg)
      if (typeof value !== 'object') {
        return
      }
      const node = []
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const newAgr = { ...arg, [_data[0][0]]: value[key] }
          if (_data[0][1]) {
            newAgr[_data[0][1]] = key
          }
          node.push(vExec.call(this, deepCopy(data), newAgr, slotProps))
        }
      }
      return node
    } else {
      return vExec.call(this, data, arg, slotProps)
    }
  }
}

export const renderNodeList = function (node, arg) {
  if (typeof node === 'undefined' || (typeof node === 'object' && (!node || Object.keys(node).length === 0))) {
    return {}
  }
  const childNode = {}

  // 将插槽分组
  const slotGroup = {}
  const nodes = node instanceof Array ? node : [node]

  nodes.forEach((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
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
    if (!slotGroup[slotKey].length) {
      return
    }
    childNode[slotKey] = props => slotGroup[slotKey].map((item) => renderItem.call(this, item.vDeepCopy ? deepCopy(item) : item, arg, props))
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

    let res = (new Function('props', 'context', props.setupScript))(toRefs(props), context)

    if (typeof res !== 'object') {
      res = {}
    }
    if (typeof props.data !== 'undefined' && typeof res.data === 'undefined') {
      res.data = props.data
    }
    res.keys = Object.keys(res)
    return res
  },

  render() {
    return renderNodeList.call(
      Object.fromEntries(this.keys.map(key => [key, this[key]])),
      this.node
    ).default?.()
  }
})

export default CompCreate
