import * as Vue from 'vue'
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
      errorMsg: false,
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
 * 路由异步组件加载器配置
 */
export const sfcLoaderOption = {
  moduleCache: {
    vue: Vue,
  },
  async getFile(data) {
    return {
      type: '.vue',
      getContentData: () => data
    }
  },
  addStyle() { },
}


const getCompObj = script => {

  return (new Function(script.replace('export default', 'return ')))()
}

// 异步加载js
const loadScriptOld = new Set()
const loadScript = list => {
  const arr = list.filter(src => !loadScriptOld.has(src))
  if (!arr.length) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    let success = 0
    arr.forEach(src => {
      const script = document.createElement('script')
      script.type = 'text/javascript';
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
            success++
            if (success === arr.length) {
              resolve()
            }
          }
        };
      } else {
        //其他浏览器
        script.onload = function () {
          success++
          if (success === arr.length) {
            resolve()
          }
        }
        script.onerror = () => {
          reject(src + '加载失败')
        }
      }
      script.src = src
      document.getElementsByTagName('head')[0].appendChild(script);
    })
  })
}

// 获取异步模板
export const getComp = async data => {

  const scripts = getXmlByTagNames(data, 'script')

  // 加载远程js
  await loadScript(scripts.filter(item => item.attr.src).map(item => item.attr.src))

  const compScript = (scripts.find(item => Object.keys(item.attr).length === 0)?.child || 'return {}').replace('export default', 'return ')

  const comp = (new Function(compScript))()
  comp.render = compile(getXmlByTagName(data, 'template')?.child || '')
  return comp
}

/**
 * 获取路由上的query参数
 * @param {*} url
 */
export const getParams = (url = window.location.href) => qs.parse(url.split('?')[1] || '')
