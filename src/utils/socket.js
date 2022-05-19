import config from '../config/request'
import { getDomain } from "./request"
import { getLocalUserInfo, onUserLogin } from './user'

class WS {
  constructor() {
    onUserLogin(status => {
      if (status) {
        this.create()
      } else {
        this.unInit()
      }
    })
  }

  // 重试锁定
  lockReconnect = false
  // 链接任务
  timeOut = null

  // ws实例
  ws = null
  // 监听数据回调函数
  callbacks = []

  // 监听某种类型的回调函数
  callbackTypes = {}

  create() {
    try {
      const wsConfig = import.meta.env.DEV ? config : {
        wsProtocol: appConfig?.socket?.protocol,
        wsApi: appConfig?.socket?.api
      }
      if (!wsConfig.wsProtocol) {
        return
      }
      const ws = this.ws = new WebSocket(`${wsConfig.wsProtocol}${getDomain()}${wsConfig.wsApi}`)
      this.init();
    } catch(e) {
        this.reconnect()
    }
  }

  reconnect() {
    if(this.lockReconnect) {
      return;
    }
    this.lockReconnect = true;
    this.timeOut && clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
      this.unInit()
      this.create()
      this.lockReconnect = false
    }, 4000)
  }

  init() {
    this.ws.addEventListener('message', e => {
      try {
        const data = JSON.parse(e.data)
        this.callbacks.forEach(v => v(data))
        if (data.type && this.callbackTypes[data.type]) {
          this.callbackTypes[data.type].forEach(v => v(data))
        }
      } catch (error) {
        console.log('程序处理错误或者不是JSON消息', error)
      }
    })
    this.ws.addEventListener('open', () => {
      const { token = '' } = getLocalUserInfo()
      this.send({
        type: 'login',
        data: token.replace('Bearer ', '')
      })
    })
    this.ws.addEventListener('close', () => {
      console.log('链接关闭')
        this.reconnect()
    })
    this.ws.addEventListener('error', err => {
      console.log('链接错误', err)
      this.reconnect()
    })
  }

  unInit() {
    this.ws.close?.()
    this.ws = null
    this.callbacks.splice(0)
    this.callbackTypes = {}
  }

  /**
   * 返回某个type的数据监听和数据发送
   * @param {*} type
   * @returns
   */
  type(type) {
    const callbacks = []
    return {
      // 发送消息
      send: (data, message = '') => {
        this.send({
          type,
          message,
          data
        })
      },
      // 发送消息文本
      sendMessage: (message = '') => {
        this.send({
          type,
          message
        })
      },
      // 监听消息
      on: callback => {
        callbacks.push(callback)
        this.callbackTypes[type] = this.callbackTypes[type] || []
        this.callbackTypes[type].push(callback)
        return {
          destroy: () => {
            const index = this.callbackTypes[type].findIndex(v => v === callback)
            ~index && this.callbackTypes[type].splice(index, 1)
            if (!this.callbackTypes[type].length) {
              delete this.callbackTypes[type]
            }
          }
        }
      },
      // 销毁所有的监听
      destroy() {
        callbacks.forEach(item => {
          const index = this.callbackTypes[type].findIndex(v => item === v)
          if (~index) {
            this.callbackTypes[type].splice(index, 1)
          }
        })
      }
    }
  }

  /**
   * 发送数据
   * @param {*} data
   */
  send(data) {
    this.ws.send?.(JSON.stringify(data))
  }

  /**
   * 监听数据
   * @param {*} callback
   * @returns
   */
  on(callback) {
    this.callbacks.push(callback)
    return {
      destroy: () => {
        const index = this.callbacks.findIndex(v => v === callback)
        ~index && this.callbacks.splice(index, 1)
      }
    }
  }

  // 取消所有函数监听
  off() {
    this.callbacks.splice(0)
  }
}

export default new WS()