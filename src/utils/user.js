import { event } from '../utils/event'
import { moduleName } from './router'

const userInfoKey = () => moduleName() + 'UserInfo'

/**
 * 调用登录
 * @returns
 */
export const login = () => {
  event.emit('open-login')
  return new Promise((resolve, reject) => {
    const callback = () => {
      event.remove('login-success', callback)
      resolve()
    }
    event.add('login-success', callback)
  })
}

/**
 * 获取本地用户信息
 * @returns
 */
export const getLocalUserInfo = () => {
  const userInfo = localStorage.getItem(userInfoKey())
  if (userInfo) {
    try {
      return JSON.parse(userInfo)
    } catch (error) {
      return {}
    }
  } else {
    return {}
  }
}

/**
 * 设置本地用户信息
 * @param {*} info
 */
export const setLocalUserInfo = info => {
  localStorage.setItem(userInfoKey(), JSON.stringify({ ...getLocalUserInfo(), ...info }))
}

/**
 * 清除用户信息
 */
export const clearUserInfo = () => {
  localStorage.removeItem(userInfoKey())
}

/**
 * 退出登录
 */
export const loginOut = () => {
  clearUserInfo()
  const modName = moduleName()
  onUserLoginFunc.forEach(func => func(false))
  window.location.replace(modName ? `/${modName}` : '/')
}

/**
 * 管理员是否已经登录
 * @returns
 */
export const isLogin = () => {
  const userInfo = getLocalUserInfo()
  return !!userInfo.user_id
}

// 回调函数
const onUserLoginFunc = []
/**
 * 监听用户登录行为
 */
event.add('login-success', () => {
  onUserLoginFunc.forEach(func => func(true))
})
/**
 * 监听用户登录状态 true登录 false退出登录
 * @param {*} callback
 */
export const onUserLogin = callback => {
  if (isLogin()) {
    callback(true)
  }
  onUserLoginFunc.push(callback)
}

/**
 * 停止监听用户登录状态
 * @param {*} callback
 */
export const offUserLogin = callback => {
  if (typeof callback === 'function') {
    const index = onUserLoginFunc.findIndex(v => v === callback)
    ~index && onUserLoginFunc.splice(index, 1)
  } else {
    onUserLoginFunc.splice(0)
  }
}
