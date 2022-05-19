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

  init() {
    const wsConfig = import.meta.env.DEV ? config : {
      wsProtocol: appConfig?.socket?.protocol,
      wsApi: appConfig?.socket?.api
    }
    if (!wsConfig.wsProtocol) {
      return
    }
    const ws = this.ws = new WebSocket(`${wsConfig.wsProtocol}${getDomain()}${wsConfig.wsApi}`)
    ws.addEventListener('message', e => {
      try {
        const data = JSON.parse(e.data)
        this.callbacks.forEach(v => v(data))
        if (data.type && this.callbackTypes[data.type]) {
          this.callbackTypes[data.type].forEach(v => v(data))
        }
      } catch (error) {
        console.log('收到不支持的消息', error)
      }
    })
    ws.addEventListener('open', () => {
      const { token = '' } = getLocalUserInfo()
      this.send({
        type: 'login',
        data: token.replace('Bearer ', '')
      })
    })
    ws.addEventListener('close', () => {
      console.log('链接关闭')
    })
    ws.addEventListener('error', err => {
      console.log('链接错误', err)
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
    return {
      send: (data, message = '') => {
        this.send({
          type,
          message,
          data
        })
      },
      sendMessage: (message = '') => {
        this.send({
          type,
          message
        })
      },
      on: callback => {
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