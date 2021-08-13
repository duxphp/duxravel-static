/**
 * 全局事件系统
 */
export default {
  /**
   * 保存的函数
   */
  funcs: {},
  /**
   * 添加事件监听
   * @param {string} name 事件名称
   * @param {string} func 回调函数
   */
  add(name, func) {
    this.funcs[name] = this.funcs[name] || []
    this.funcs[name].push(func)
  },
  /**
   * 移除事件监听 不传第二个参数 则移除当前事件的所有函数
   * @param {string} name 事件名称
   * @param {function} func 要移除监听的函数
   */
  remove(name, func) {
    if (!func) {
      delete this.funcs[name]
    } else {
      const list = this.funcs[name]
      if (!list) {
        return
      }
      list.every((item, index) => {
        if (item === func) {
          list.splice(index, 1)
          return false
        }
        return true
      })
    }
  },
  /**
   * 触发事件
   * @param {string} name 事件名称
   * @param  {...any} args 事件参数
   */
  emit(name, ...args) {
    const funcs = this.funcs[name] || []
    funcs.forEach(func => func(...args))
  },
  /**
   * 判断是否存在事件 传入func则判断func绑定的事件
   * @param {string} name
   * @param {function} func
   * @returns 是否存在
   */
  is(name, func) {
    if (!func) {
      return !!this.funcs[name]
    } else {
      const list = this.funcs[name]
      if (!list) {
        return false
      }
      return list.every(item => item === func)
    }
  }
}

export const stopPropagation = e => {
  e.stopPropagation && e.stopPropagation()
}
