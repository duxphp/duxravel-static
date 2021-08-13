/**
 * 判断字符串是不是一个数字
 * @param {string} str 字符串
 * @return {boolean}
 */
export const isNumber = str => {
  if (typeof str === 'number') {
    return true
  }
  const regExp = /^[\d.]+$/g
  return regExp.test(str)
}

/**
 * 将一个数字类型的字符串转换为数字 如果不是字符串类型则返回他自己
 * @param {*} str 
 * @returns 
 */
export const strToNumber = str => isNumber(str) ? Number(str) : str

export default {
  isNumber,
  strToNumber
}