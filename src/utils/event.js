/**
 * 全局事件系统
 */
export const event = {
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
      if (!list.length) {
        delete this.funcs[name]
      }
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

/**
 * 请求返回数据事件系统
 */
export const requestEvent = {
  key(name) {
    return 'request-' + name
  },
  add(name, func) {
    event.add(this.key(name), func)
  },
  remove(name, func) {
    event.remove(this.key(name), func)
  },
  emit(name, ...args) {
    event.emit(this.key(name), ...args)
  },
  is(name, func) {
    event.is(this.key(name), func)
  }
}

export const stopPropagation = e => {
  e.stopPropagation && e.stopPropagation()
}

/**
 * 路由导航变化监听和触发
 */
export const menuNavigation = {
  data: [],
  emit(data) {
    this.data = data
    this.callback?.(data)
  },
  on(callback) {
    callback(this.data)
    this.callback = callback
  }
}