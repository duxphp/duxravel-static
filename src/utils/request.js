import qs from 'qs'
import { deepCopy } from './object'
import { router } from './router'
import { clearUserInfo, getLocalUserInfo, login, setLocalUserInfo } from './user'

/**
 * 转换当前url为真实URL
 * @param {*} url
 * @param {*} type 相对地址还是绝对地址 relative absolute  绝对地址包含/admin  相对地址不包含admin 并且不能以/开头
 * @returns
 */
export const getUrl = (url, type = 'relative') => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `${import.meta.env.DEV ? 'http://a.dezhi-highway.com' : ''}${type === 'relative' ? '/' + ((location.pathname.split('/')[1] || 'admin') + (!url.startsWith('/') ? '/' : '')) : ''}${url}`
}

/**
 * 请求方法
 */
export const request = window.ajax = async params => {
  if (typeof params === 'string') {
    params = {
      url: params
    }
  }
  let { url, urlType, data = {}, method = 'GET', header = {}, successMsg, errorMsg = true } = params

  // 请求头
  const headers = new Headers({
    'Accept': 'application/json',
    Authorization: getLocalUserInfo().token || '',
    ...header
  })

  const init = {
    method,
    credentials: 'omit',
    headers
  }
  if (method.toUpperCase() === 'POST') {
    init.body = JSON.stringify(data)
    headers.append('Content-Type', 'application/json')
  } else {
    const params = qs.stringify(data)
    if (params && ~url.indexOf('?')) {
      url += '&' + params
    } else if (params) {
      url += '?' + params
    }
    headers.append('Content-Type', 'application/x-www-form-urlencoded')
  }
  const res = await fetch(getUrl(url, urlType), init)
  const result = {
    code: res.status,
    message: res.statusText
  }
  const contentType = res.headers.get("Content-Type").toLowerCase()
  const isJson = contentType.indexOf('application/json') === 0

  // 设置新的验证值
  const token = res.headers.get('authorization')
  if (token) {
    setLocalUserInfo({ token })
  }

  if (isJson) {
    result.data = await res.json()
  } else {
    result.data = await res.text()
  }

  // 跳转
  const xLocation = res.headers.get('x-Location')
  if (xLocation) {
    router(xLocation)
  }

  if (result.code === 401) {
    // token失效 登录重新获取token
    clearUserInfo()
    await login()
    return request(params)
  }
  if (result.code === 200 && isJson) {
    successMsg && window.message.success(result.data.message)
    return result.data.data
  } else if (result.code === 200 && !isJson) {
    successMsg && window.message.success(result.message)
    return result.data
  }
  errorMsg && window.message.error(result.data?.error?.message || result.data?.message || result.message)
  throw result
}


/**
 * 请求缓存数据
 */
const requestCacheData = {}
/**
 * 可以识别url和data缓存返回结果
 * @param {*} option 同request
 * @param {*} copy 是否返回深拷贝后的数据
 */
export const requestCache = (option = {}, copy) => {
  if (typeof option === 'string') {
    option = { url: option }
  }
  const { url, data } = option
  const key = `${url}-${JSON.stringify(data)}`
  let keyData = requestCacheData[key]
  if (!keyData || (!keyData.data && !keyData.request)) {
    keyData = requestCacheData[key] = {
      // 结果缓存
      data: null,
      // 队列缓存
      queue: [],
      // 请求缓存
      request: null
    }
    keyData.request = request(option).then(res => {
      keyData.data = res
      keyData.queue.forEach(([resolve]) => {
        resolve(copy ? deepCopy(res) : res)
      })
    }).catch(err => {
      keyData.queue.forEach(([, reject]) => {
        reject(err)
      })
    }).finally(() => {
      keyData.request = null
    })
  }
  if (keyData.data) {
    return Promise.resolve(copy ? deepCopy(keyData.data) : keyData.data)
  }
  return new Promise((resolve, reject) => {
    keyData.queue.push([resolve, reject])
  })
}


const searchQuickMarks = {}
/**
 * 请求方式同
 * @param {*} params
 * @param {*} mark
 * @returns
 */
export const searchQuick = (params, mark = '') => {
  const key = params.url + mark
  if (searchQuickMarks[key] === undefined) {
    searchQuickMarks[key] = {
      timer: null,
      prevReject: null,
      requestTask: null,
    }
  }
  const item = searchQuickMarks[key]
  return new Promise((resolve, reject) => {
    if (item.timer) {
      clearTimeout(item.timer)
      item.prevReject({ message: '过快请求', code: 1 })
    }
    if (item.requestTask) {
      item.requestTask.abort?.()
      item.requestTask = null
      item.prevReject({ message: '请求被覆盖', code: 2 })
    }
    item.prevReject = reject
    item.timer = setTimeout(() => {
      item.timer = null
      item.requestTask = request(params).then(res => {
        item.requestTask = null
        resolve(res)
      }).catch(err => {
        item.requestTask = null
        reject(err)
      })
    }, 200)
  })
}

export const selectQuery = window.selectQuery = function (query, url) {
  if (!query.length) {
    this.nParams.options = []
    return
  }
  this.loading = true
  request({
    url: url,
    method: 'get',
    data: {
      query: query
    }
  }).then(res => {
    let data = res.data.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
    this.nParams.options = data
    this.loading = false
  }).catch(() => {
    this.loading = false
  })
}
