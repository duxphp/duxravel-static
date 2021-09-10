/**
 * 获取一个节点
 * @param {*} xml 
 * @param {*} name 
 * @param {*} cursor 
 * @returns 
 */
export const getXmlByTagName = window.getXmlByTagName = (xml, name, cursor = 0) => {
  const startIndex = xml.indexOf('<' + name, cursor)
  if (!~startIndex) {
    return
  }
  cursor = startIndex + 1
  let endIndex = -1
  let level = 0
  while (!~endIndex) {
    // 查找下一个开始和结束标签
    const nextEnd = xml.indexOf('</' + name, cursor)
    const nextStart = xml.indexOf('<' + name, cursor)
    if (~nextEnd && ((~nextStart && nextEnd < nextStart) || !~nextStart)) {
      // 下一个标签是结束标签
      if (level === 0) {
        endIndex = nextEnd
      } else {
        cursor = nextEnd + 1
        level--
      }
    } else if (~nextStart && ((~nextEnd && nextStart < nextEnd) || !~nextEnd)) {
      // 下一个标签是开始标签
      cursor = nextStart + 1
      level++
    } else {
      console.error('xml结构错误')
      return
    }
  }
  // 获取标签属性
  const attrEnd = xml.indexOf('>', startIndex)
  let attrString = xml.substr(startIndex + name.length + 2, attrEnd - (startIndex + name.length + 2)).trim()
  const attr = {}
  while (attrString.length) {
    const spaceIndex = attrString.indexOf(' ')
    const equalIndex = attrString.indexOf('=')
    if (!~spaceIndex && !~equalIndex) {
      // 找到最后一个没有值的属性
      attr[attrString] = true
      attrString = ''
    } else if ((~spaceIndex && ~equalIndex && spaceIndex < equalIndex) || !~equalIndex) {
      // 找到没有值的属性 后面还有属性 有等号 或者 没有等号
      const key = attrString.substr(0, spaceIndex)
      attr[key] = true
      attrString = attrString.substr(key.length).trim()
    } else {
      // 有属性的值
      const key = attrString.substr(0, equalIndex)
      const value = attrString.substr(equalIndex + 2, attrString.indexOf(attrString.substr(equalIndex + 1, 1), equalIndex + 2) - equalIndex - 2)
      attr[key] = value
      attrString = attrString.substr((key + value).length + 3).trim()
    }
  }
  const data = {
    attr,
    child: xml.substr(attrEnd + 1, endIndex - attrEnd - 1),
    start: startIndex,
    end: endIndex + name.length + 3,
    nextStart: attrEnd
  }
  return data
}

/**
 * 获取多个节点
 * @param {*} xml 
 * @param {*} name 
 * @param {*} cursor 
 * @param {*} arr 
 * @returns 
 */
export const getXmlByTagNames = window.getXmlByTagNames = (xml, name, cursor, arr = []) => {
  const data = getXmlByTagName(xml, name, cursor)
  if (data) {
    arr.push(data)
    return getXmlByTagNames(xml, name, data.nextStart, arr)
  }
  return arr
}