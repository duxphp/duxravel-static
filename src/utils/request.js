import qs from 'qs'
import config from '../config/request'
import { deepCopy } from './object'
import { event, requestEvent } from './event'
import { moduleName, router } from './router'
import { clearUserInfo, getLocalUserInfo, login, setLocalUserInfo } from './user'
import axios from 'axios'

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

  let urlArr = []
  urlArr.push(import.meta.env.DEV ? config.domain : '')

  if (type === 'relative' && url.lastIndexOf("/" + moduleName(), 0) === -1) {
    urlArr.push("/" + moduleName() + (!url.startsWith('/') ? '/' : ''))
  }

  urlArr.push(url)
  return urlArr.join("")
}

export const getDomain = () => {
  return import.meta.env.DEV ? config.domain : window.location.origin
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

  let {
    url,
    urlType,
    data = {},
    method = 'GET',
    header = {},
    onProgress,
    successMsg,
    errorMsg = true,
    onSource
  } = params

  // 请求头
  const headers = {
    'Accept': 'application/json',
    Authorization: getLocalUserInfo().token || '',
    ...header
  }

  const init = {
    method,
    credentials: 'omit',
    headers
  }

  if (onSource) {
    const source = axios.CancelToken.source()
    init.cancelToken = source.token
    onSource?.(source)
  }
  if (onProgress) {
    init.onUploadProgress = (progressEvent) => {
      const progress = progressEvent.loaded / progressEvent.total * 100 | 0
      onProgress(progress)
    }
  }
  if (method.toUpperCase() !== 'GET') {
    init.data = data
  } else {
    const params = qs.stringify(data)
    if (params && ~url.indexOf('?')) {
      url += '&' + params
    } else if (params) {
      url += '?' + params
    }
  }
  init.url = getUrl(url, urlType)

  return axios(init).then((response) => {
    const result = {
      code: response.status,
      message: response.statusText
    }
    const contentType = response.headers['content-type'].toLowerCase()
    const isJson = contentType.indexOf('application/json') === 0

    // 设置新的验证值
    const token = response.headers['authorization']
    if (token) {
      setLocalUserInfo({ token })
    }

    if (response.headers['x-location']) {
      router(response.headers['x-location'])
    }

    if (response.headers['x-menu-select']) {
      event.emit('request-menu-select', response.headers['x-menu-select'])
    }

    // 请求事件
    result.data = response.data
    if (result.data?.data?.__event) {
      requestEvent.emit(result.data.data.__event.name, result.data.data.__event.data)
    }
    // 处理返回脚本
    if (result.data?.data?.__script) {
      new Function(result.data?.data?.__script)
    }

    if (isJson) {
      successMsg && result.data.message && window.message.success(result.data.message)
      return result.data.data
    } else {
      successMsg && result.message && window.message.success(result.message)
      return result.data
    }
  }).catch(async (error) => {
    const result = error.response
    if (result?.status === 401 || result?.status === 402) {
      // token失效 登录重新获取token
      clearUserInfo()
      await login()
      return request(params)
    }

    errorMsg && window.message.error(result?.data?.error?.message || result?.data?.message || error?.message || '业务繁忙，请稍后再试')
    throw result
  })
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
  if (typeof params === 'string') {
    params = { url: params }
  }
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
      item.source?.cancel?.('请求被覆盖')
      item.requestTask = null
      item.source = null
      item.prevReject({ message: '请求被覆盖', code: 2 })
    }
    item.prevReject = reject
    item.timer = setTimeout(() => {
      item.timer = null
      item.requestTask = request({
        ...params,
        onSource(res) {
          item.source = res
        }
      }).then(resolve).catch(reject).finally(() => {
        item.requestTask = null
        item.source = null
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

export const download = (url, type) => {
  let downloadKey
  const cb = key => {
    event.remove('download-manage-add-callback', cb)
    downloadKey = key
  }
  event.add('download-manage-add-callback', cb)
  event.emit('download-manage-add')

  const xhr = new XMLHttpRequest();
  xhr.open('GET', getUrl(url, type))        // 也可以使用POST方式，根据接口
  xhr.responseType = 'blob'  // 返回类型blob
  const headers = {
    Accept: 'application/json',
    Authorization: getLocalUserInfo().token || ''
  }
  Object.keys(headers).forEach(key => {
    xhr.setRequestHeader(key, headers[key])
  })
  // 默认文件名
  let filename = url.split('?')[0].split('/')
  filename = filename[filename.length - 1]
  // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
  xhr.addEventListener('progress', e => {
    event.emit('download-manage-update', {
      key: downloadKey,
      total: e.total,
      loaded: e.loaded
    })
  })

  xhr.addEventListener('readystatechange', () => {
    if (XMLHttpRequest.HEADERS_RECEIVED === xhr.readyState) {
      const disposition = xhr.getResponseHeader('content-disposition')
      if (disposition) {
        filename = decodeURIComponent(xhr.getResponseHeader('content-disposition').split('"')[1])
      }
      event.emit('download-manage-update', { key: downloadKey, filename })
    }
  })
  xhr.onload = function (e) {
    // 请求完成
    if (this.status === 200) {
      event.emit('download-manage-update', {
        key: downloadKey,
        result: true
      })
      // 返回200
      const blob = this.response
      const reader = new FileReader()
      reader.readAsDataURL(blob)    // 转换为base64，可以直接放入a表情href
      reader.onload = function (e) {
        // 转换完成，创建一个a标签用于下载
        const a = document.createElement('a')
        a.download = filename
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } else {
      event.emit('download-manage-update', {
        key: downloadKey,
        error: true
      })
    }
  };
  // 发送ajax请求
  xhr.send()
}