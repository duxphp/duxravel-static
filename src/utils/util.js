import { watch, ref } from 'vue'
import { request } from "./request";


/**
 * 执行定时时间后的异步任务
 * @param {number} time 毫秒
 */
const asyncTimeOut = time => {
  let resolveFunc
  let rejectFunc
  const pro = new Promise((resolve, reject) => {
    resolveFunc = resolve
    rejectFunc = reject
  })
  const timer = setTimeout(() => resolveFunc({ code: 200, message: '倒计时结束', type: 'timeout' }), time)
  pro.clear = () => {
    clearTimeout(timer)
    rejectFunc({ code: 500, message: '清除倒计时' })
  }
  return pro
}

const weather = (callback) => {
  let res = localStorage.getItem('weather')
  res = res ? JSON.parse(res) : {}
  if (res.time + 10800000 > new Date().getTime()) {
    callback(res.data)
  } else {
    request({
      url: "map/weather",
      errorMsg: false,
    }).then(res => {
      localStorage.setItem('weather', JSON.stringify({ time: new Date().getTime(), data: res }))
      callback(res)
    })
  }
}

/**
 * 获取当前元素相对于指定元素的相对位置
 * @param {*} current 当前dom
 * @param {*} stop 查找结束dom
 * @param {*} data 数据 无需传入
 * @returns
 */
const getOffset = (current, stop = document, data = { left: 0, top: 0 }) => {
  if (!current || current === stop) {
    return data
  }
  data.left += current.offsetLeft
  data.top += current.offsetTop
  return getOffset(current.offsetParent, stop, data)
}

const watchAssignObject = (...arg) => {
  const data = ref({})

  arg.forEach(item => {
    watch(item, val => {
      Object.keys(val).forEach(key => {
        data.value[key] = val[key]
      })
    })
    Object.keys(item).forEach(key => {
      data.value[key] = item[key]
    })
  })

  return data.value
}

export {
  asyncTimeOut,
  weather,
  getOffset,
  watchAssignObject
}