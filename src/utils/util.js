import {request} from "./request";


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
      localStorage.setItem('weather', JSON.stringify({time: new Date().getTime(), data: res}))
      callback(res)
    })
  }
}

export {
  asyncTimeOut,
  weather
}