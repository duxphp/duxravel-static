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
  const attr = xml.substr(startIndex + name.length + 2, attrEnd - (startIndex + name.length + 2))
  const data = {
    attr: attr ? Object.fromEntries(attr
      .split(' ')
      .map(item => item
        .split('=')
        .map((name, index) => index === 1 ? name.replace(/[\"\']/g, '') : name)
      )
    ) : {},
    child: xml.substr(attrEnd + 1, endIndex - startIndex - name.length - 2),
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