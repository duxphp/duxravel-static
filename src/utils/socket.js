import config from '../config/request'
import { getDomain } from "./request"
import { getLocalUserInfo, onUserLogin } from './user'

class WS {
  constructor() {
    onUserLogin(status => {
      if (status) {
        this.init()
      } else {
        this.unInit()
      }
    })
  }

  // ws实例
  ws = null

  // 监听数据回调函数
  callbacks = []

  // 监听某种类型的回调函数
  callbackTypes = {}

  // 监听断开和重连重连成功
  reconnectCallbacks = []

  init() {
    const api = import.meta.env.DEV ? config.wsApi : appConfig?.socket?.api
    if (!api) {
      return
    }
    try {
      const ws = this.ws = new WebSocket(`${getDomain().replace('https://', 'wss://').replace('http://', 'ws://')}${api}`)
      ws.addEventListener('message', e => {
        try {
          const data = JSON.parse(e.data)
          this.callbacks.forEach(v => v(data))
          if (data.type && this.callbackTypes[data.type]) {
            this.callbackTypes[data.type].forEach(v => v(data))
          }
          // 登录成功
          if (data.type === 'login') {
            this.emitReconnect(true)
          }
        } catch (error) {
          console.log('程序处理错误或者不是JSON消息', error)
        }
      })
      ws.addEventListener('open', () => {
        const { token = '' } = getLocalUserInfo()
        this.send({
          type: 'login',
          data: token.replace('Bearer ', '')
        })
      })
      ws.addEventListener('close', err => {
        if (err.code !== 1000) {
          // 1000 表示主动关闭并且不需要这个链接了
          this.reconnect()
        }
        this.emitReconnect()
      })
      ws.addEventListener('error', err => {
        console.log('链接错误', err)
        this.reconnect()
        this.emitReconnect()
      })
    } catch (error) {
      console.log('链接初始化错误', error)
      this.reconnect()
      this.emitReconnect()
    }
  }

  unInit() {
    this.ws.close?.(1000)
    this.ws = null
    this.callbacks.splice(0)
    this.callbackTypes = {}
  }

  reconnect() {
    console.log('链接断开 将在稍后重试')
    this.reconnectTimer && clearTimeout(this.reconnectTimer)
    this.reconnectTimer = setTimeout(() => {
      if (this.ws?.readyState === WebSocket.CLOSING || this.ws?.readyState === WebSocket.CLOSED) {
        console.log('正在重连')
        this.init()
      } else {
        console.log('不符合重连条件')
      }
    }, 5000)
  }

  // 执行断开链接和链接成功的回调
  emitReconnect(status = false) {
    this.reconnectCallbacks.forEach(v => v(status))
  }

  // 监听链接状态 断开链接和登录成功
  onReconnect(callback) {
    this.reconnectCallbacks.push(callback)
    return {
      destroy: () => {
        const index = this.reconnectCallbacks.findIndex(v => v === callback)
        ~index && this.reconnectCallbacks.splice(index, 1)
      }
    }
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
        const list = this.callbackTypes[type] = this.callbackTypes[type] || []
        list.push(callback)
        return {
          destroy: () => {
            const index = list.findIndex(v => v === callback)
            ~index && list.splice(index, 1)
            if (!list.length) {
              delete this.callbackTypes[type]
            }
          }
        }
      },
      // 销毁所有的监听
      destroy: () => {
        callbacks.forEach(item => {
          const list = this.callbackTypes[type]
          const index = list?.findIndex?.(v => item === v)
          list && ~index && list.splice(index, 1)
          if (!list.length) {
            delete this.callbackTypes[type]
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
    this.ws?.readyState === WebSocket.OPEN && this.ws.send(JSON.stringify(data))
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