import qs from 'qs'
import { compile } from 'vue/dist/vue.cjs.js'

import { request } from "./request";
import event from './event'
import { getXmlByTagName, getXmlByTagNames } from './xml'

window.addEventListener('popstate', e => {
  routerChange(e.state || {
    url: location.href.substr(location.origin.length)
  })
})

let currentState = {}
const routerChange = (state = {}) => {
  if (!state.url) {
    return
  }

  state = {
    agree: state.agree || 'push',
    url: state.url,
    path: state.url.split('?')[0],
    params: qs.parse(state.url.split('?')[1] || ''),
    pathChange: state.url.split('?')[0] !== currentState.path
  }

  currentState = state
  // 默认 路由重置
  const path = state.path.split('/')
  if (path.length <= 2 || path[2] === '') {
    // 将根目录重置到菜单的第一个模块
    router.indexPage && router.replace(router.indexPage)
    // 无效路由 不执行页面获取
    return
  }
  event.emit('router-change', state)
}
/**
 * 路由改变时获取页面
 * @param {*} url 路由地址
 * @param {*} type 类型 page 页面 dialog 弹窗
 */
export const getPage = (url, type) => {
  const callback = []
  const promise = new Promise((resolve, reject) => {
    callback.push(resolve, reject)
    request({
      header: {
        'x-dux-sfc': '1',
        ...(type === 'dialog' ? { 'x-dialog': '1' } : {})
      },
      errorMsg: type === 'dialog',
      // 删除模块名称
      url: url.split('/').slice(2).join('/')
    }, true).then(data => {
      resolve({
        type: typeof data === 'string' ? 'vue' : 'node',
        data
      })
    }).catch(reject)
  })
  promise.abort = () => {
    callback[1]?.({
      message: '取消请求',
      code: 1
    })
  }
  return promise
}



/**
 * 将url和data参数进行合并 转换为新的url
 * @param {*} url
 * @param {*} data
 * @returns
 */
const toUrl = (url = location.pathname, data = {}) => {
  data = { ...qs.parse(url.split('?')[1] || ''), ...data }
  const stringify = qs.stringify(data)
  return url.split('?')[0] + (stringify ? '?' + stringify : '')
}

/**
 * 路由跳转函数
 */
export const router = window.router = (url, data) => {
  if (!url) {
    return
  }
  const split = url.split(':')
  if (typeof split[1] === 'string' && !split[1]) {
    split[1] = location.href.substr(location.origin.length)
  }
  const agree = split.length > 1 ? split[0] : 'push'
  router[agree]?.(split[1], data)
}
router.indexPage = null
// 正常路由
router.push = (url, data) => {
  url = toUrl(url, data)
  const state = {
    url,
    agree: 'push'
  }
  history.pushState(state, url, url)
  routerChange(state)
}

// 路由相同则不重新加载
router.routerPush = (url, data) => {
  url = toUrl(url, data)
  const state = {
    url,
    agree: 'routerPush'
  }
  history.pushState(state, url, url)
  routerChange(state)
}

// 替换路由
router.replace = (url, data) => {
  url = toUrl(url, data)
  const state = {
    url,
    agree: 'replace'
  }
  history.replaceState(state, url, url)
  routerChange(state)
}
// 返回
router.back = (url) => {
  const num = url | 0 || 1;
  history.go(-num)
}
// 弹窗
router.dialog = (url) => {
  event.emit('router-dialog', { url })
}
// 普通跳转
router.http = (url) => {
  window.location.href = `http:${url}`
}
router.https = (url) => {
  window.location.href = `https:${url}`
}

/**
 * 页面资源管理
 */

export const resource = {

  // 已经加载的资源
  /**
   * 已经加载的资源
   * 资源1: dom 对应的dom节点，方便移除
   */
  load: {},

  /**
   * 页面引用到的资源 及当前页面存在的数量
   * page: {
   *  num: 1,
   *  list: ['资源1', '资源2']
   * }
   */
  pageLoad: {},

  /**
   * 加载页面样式
   * @param {string} data 当前页面模板
   * @param {string} page 当前页面url 用于做标识
   * @param {string} oldPage 上一个页面url 用户删除上一个页面的导入的相关资源
   */
  async pageLoad(data, page) {
    const current = this.pageLoad[page] = {
      num: 0,
      list: []
    }

    // 资源记载列表
    const loadList = [
      this.loadCss(getXmlByTagNames(data, 'link').filter(item => item.attr.link).map(item => item.attr.link)),
      this.loadStyle(getXmlByTagNames(data, 'style').map(item => item.child)),
      this.loadScript(getXmlByTagNames(data, 'script').filter(item => item.attr.src).map(item => item.attr.src))
    ]

    const res = await Promise.all(loadList)

    current.list.push(...res.map(item => item.map(item => item[0])).flat())

    current.num++
  },

  /**
   * 卸载页面资源
   * @param {strnig} page 
   * @param {number} num 要卸载的页面资源个数 默认是1当有大于等于1个相同页面时，将不会卸载当前的资源
   */
  uninstall(page, num = 1) {
    const current = this.pageLoad[page]
    if (!current || current.num > num) {
      return
    }
    // 除了卸载页面其他所有页面的资源
    const all = new Set(Object.keys(this.pageLoad).map(key => key === page ? [] : this.pageLoad[key].list).flat())

    // 卸载数据
    current.list.forEach(key => {
      // 没有在其他页面引用到直接删除
      if (!all.has(key)) {
        this.load[key]?.source?.parentNode?.removeChild?.(this.load[key].source)
        delete this.load[key]
      }
    })
    // 删除当前加载的页面
    delete this.pageLoad[page]
  },

  // 异步加载多个js
  loadScript(list) {
    const arr = list.filter(src => !this.load[src])
    const success = []
    if (!arr.length) {
      return Promise.resolve(success)
    }
    return new Promise((resolve, reject) => {

      // 按照顺序加载js，防止依赖冲突
      const load = list => {
        if (!list.length) {
          resolve(success)
          return
        }
        const script = document.createElement('script')
        script.type = 'text/javascript';
        script.onload = () => {
          this.load[list[0]] = {
            source: script,
            type: 'js'
          }
          success.push([list[0], script])
          load(list.slice(1))
        }
        script.onerror = () => {
          reject({
            message: list[0] + '加载失败'
          })
        }
        script.src = list[0]
        document.getElementsByTagName('head')[0].appendChild(script)
      }

      load(arr)

    })
  },

  /**
   * 异步加载多个css文件
   * @param {*} list 
   * @returns 
   */
  loadCss(list) {
    const arr = list.filter(href => !this.load.has(href))
    const success = []
    if (!arr.length) {
      return Promise.resolve(success)
    }

    return new Promise((resolve, reject) => {
      arr.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'stylesheet';
        link.onload = () => {
          this.load[href] = {
            source: link,
            type: 'css'
          }
          success.push([href, link])
          if (success.length === arr.length) {
            resolve(success)
          }
        }
        link.onerror = () => {
          reject({
            message: href + '加载失败'
          })
        }
        link.href = href
        document.getElementsByTagName('head')[0].appendChild(link);
      })
    })
  },

  async loadStyle(list) {
    return []
  }
}


// 获取异步模板
export const getComp = async (data, url) => {

  // 加载页面资源
  await resource.pageLoad(data, url)

  // 处理组件代码
  const compScript = (getXmlByTagNames(data, 'script').find(item => Object.keys(item.attr).length === 0)?.child || 'return {}').replace('export default', 'return ')

  // 生成组件
  let comp = (new Function(compScript))()
  if (typeof comp !== 'object') {
    comp = {}
  }
  comp.render = compile(getXmlByTagName(data, 'template')?.child || '')
  return comp
}

/**
 * 获取路由上的query参数
 * @param {*} url
 */
export const getParams = (url = window.location.href) => qs.parse(url.split('?')[1] || '')
