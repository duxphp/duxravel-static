import { h, defineComponent, resolveDynamicComponent, toRefs, provide, reactive } from 'vue'
import { deepCopy } from '../../utils/object'

/**
 * 过滤不需要渲染到组件的参数
 * @param {*} data 
 * @returns 
 */
const filterComponentProps = data => {
  const { nodeName, child, ..._data } = data
  Object.keys(_data).forEach(key => {
    if (isCommandKey(key)) {
      delete _data[key]
    }
  })
  return _data
}

const commandReg = /^v[A-Z]/
const spaceReg = / /g
const vForReg = /[ ()]/g
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
    if (!data['vBind:' + _key]) {
      data['vBind:' + _key] = _value
    }
    const onKey = 'vOn:update:' + _key
    if (data[onKey] && typeof data[onKey] === 'string') {
      data[onKey] = [data[onKey], `__value => ${_value} = __value;`]
    }
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
  let newArg = { ...this, ...arg, ...slotArg }

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
  }

  /**
   * 将命令创建的数据存储到一个新对象里
   */
  const execData = {}

  // 指令处理
  itemKeys.forEach(key => {
    if (!isCommandKey(key)) {
      return
    }
    if (key.startsWith('vOn')) {
      // 事件绑定处理
      const _key = `on${key.substr(4, 1).toUpperCase()}${key.substr(5)}`
      const script = data[key]
      execData[_key] = ($event, ...arg) => {
        (typeof script === 'string' ? [script] : script).forEach(_script => {
          const res = exec.call(this, _script, { ...newArg, $event })
          if (typeof res === 'function') {
            res.call(this, $event, ...arg)
          }
        })
      }
    } else if (key.startsWith('vBind')) {
      // 数据绑定处理
      const [_type, _key] = key.split(':')
      const _result = exec.call(this, data[key], newArg)
      execData[_key] = _result
    } else if ((key.startsWith('render') || key.startsWith('vRender')) && typeof data[key] === 'object') {
      const _value = data[key]
      if (key.startsWith('vRender')) {
        key = key.substr(8)
      }
      // render节点转换
      const _data = key.split(':')
      // 节点需要的字段
      const paramsKeys = _data[1] ? _data[1].replace(spaceReg, '').split(',') : []
      // 节点转换
      execData[_data[0]] = (...reder) => renderNodeList.call(this, _value, { ...newArg, ...Object.fromEntries(paramsKeys.map((key, index) => [key, reder[index]])) }).default?.()
    } else if (key.startsWith('vChild') && typeof data[key] === 'object') {
      // 处理子集数据转换

      execData[key.split(':')[1]] = vExec(data[key], newArg)
    }
  })

  // 组合最终返回的得到的props
  const props = Object.assign(execData, filterComponentProps(data))

  // 文本字符换替换
  if (vStringReplace && typeof vStringReplace === 'string') {
    Object.keys(props).forEach(key => {
      if (typeof props[key] === 'string') {
        const val = props[key].replace(vStringReplace, '')
        // 如果是vModel绑定的值让这个值触发更新
        const updateKey = `onUpdate:${key}`
        if (val !== props[key] && typeof props[updateKey] === 'function') {
          props[updateKey](val)
        }
        props[key] = val
      }
    })
  }

  if (nodeName && typeof nodeName === 'string') {
    // 创建组件
    return h(
      resolveDynamicComponent(nodeName),
      props,
      renderNodeList.call(this, child, newArg)
    )
  } else {
    // 返回处理后的json
    return props
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
      _data[0] = _data[0].replace(vForReg, '').split(',')
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
          node.push(vExec.call(this, data, newAgr, slotProps))
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
    },
    dataValue: {
      type: Object,
      delault: () => ({})
    },
    debug: {
      type: Boolean,
      default: false
    },
    static: {
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
    if (typeof props.dataValue !== 'undefined' && typeof res.dataValue === 'undefined') {
      Object.keys(props.dataValue).forEach(key => {
        res[key] = props.dataValue[key]
      })
    }

    res.keys = Object.keys(res)
    return res
  },

  render() {
    return this.debug ?
      h('div', { style: 'flex: 1,height: 100%;' },
        h('div', { style: 'position: absolute;left: 0;top: 0;right: 0;bottom: 0;overflow: auto;' },
          h('pre', null, `<template>
${jsonToVue(this.node)}
</template>
<script>
${this.static?.scriptString || ''}
export default {
  setup(props, context) {
    ${this.setupScript}
  }
}

</script>
<style>
${this.static?.style || ''}
</style>
${this.static?.css?.map(v => `<link href="${v}"></link>`)?.join('\n') || ''}
${this.static?.script?.map(v => `<script src="${v}"></script>`)?.join('\n') || ''}
`))) :
      renderNodeList.call(
        Object.fromEntries(this.keys.map(key => [key, this[key]])),
        this.node
      ).default?.()
  }
})

export default CompCreate

/**
 * 将json转换成Vue模板代码
 */
export const jsonToVue = (() => {
  const getAttr = item => {
    const keys = Object.keys(item)
    const attrString = keys.map(key => {
      const value = item[key]
      if (key.startsWith('vOn')) {
        return `@${key.substr(4)}="${value}"`
      } else if (key.startsWith('vBind')) {
        return `:${key.substr(6)}="${value}"`
      } else if (key.startsWith('vModel')) {
        return `v-model:${key.substr(7) || 'model-value'}="${value}"`
      } else if (key.startsWith('vFor')) {
        return `v-for="${value}"`
      } else if (key.startsWith('vIf')) {
        return `v-if="${value}"`
      } else if (key.startsWith('vChild')) {
        return `:${key.substr(7)}="${JSON.stringify(value).replace(/\"/g, '\'')}"`
      } else if (key.startsWith('vSlot')) {
        return `#:${key.substr(6) || 'default'}="${value}"`
      } else if ((key.startsWith('render') || key.startsWith('vRender')) && typeof data[key] === 'object') {
        return false
      } else if (key === 'child') {
        return false
      } else if (key === 'nodeName') {
        return false
      } else if (typeof value === 'object') {
        return `:${key}="${JSON.stringify(value).replace(/\"/g, '\'')}"`
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        return `:${key}="${value}"`
      }
      return `${key}="${value}"`
    }).filter(v => v).join(' ')
    if (attrString) {
      return ' ' + attrString
    }
    return ''
  }
  const getSpace = _level => {
    let string = ''
    for (let i = 0; i <= _level; i++) {
      string += '  '
    }
    return string
  }
  const getSlotKey = item => Object.keys(item).find(v => v.startsWith('vSlot'))
  return (node, level = 1) => {
    if (typeof node === 'string') {
      return getSpace(level) + node
    }
    if (!node) {
      return ''
    }
    if (!Array.isArray(node)) {
      node = [node]
    }
    return node.map(item => {
      if (typeof item === 'string') {
        return getSpace(level) + item
      }
      if (!item?.nodeName) {
        return false
      }
      const slotKey = getSlotKey(item)
      if (slotKey) {
        const _item = deepCopy(item)
        delete _item[slotKey]
        return `${getSpace(level)}<template #${slotKey.substr(6) || 'default'}="${item[slotKey]}">
${jsonToVue(_item, level + 1)}
${getSpace(level)}</template>`
      }
      let _str = `${getSpace(level)}<${item.nodeName}${getAttr(item)}>`
      if (item.child) {
        _str += '\n'
        _str += jsonToVue(item.child, level + 1)
        _str += '\n'
        _str += `${getSpace(level)}</${item.nodeName}>`
      } else {
        _str += `</${item.nodeName}>`
      }
      return _str
    }).filter(v => v).join('\n')
  }
})()