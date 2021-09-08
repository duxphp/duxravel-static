import { asyncTimeOut } from "./util"

// 菜单数据
const globalMenuData = {
  menuDom: null,
  callback: [],
  close() {
    document.removeEventListener('click', globalMenuData.close)
    globalMenuData.callback[1] && globalMenuData.callback[1]('正常关闭')
    globalMenuData.removeEle()
  },
  removeEle() {
    if (!globalMenuData.menuDom) {
      return
    }
    globalMenuData.callback = []
    document.body.removeChild(globalMenuData.menuDom)
    globalMenuData.menuDom = null
  }
}

/**
 * 显示一个全局菜单
 * @param {*} param0
 * @returns
 */
const openMenu = window.openGlobalMenu = ({ list, event }) => {

  if (globalMenuData.menuDom) {
    globalMenuData.close()
  }

  const childDom = list.map(item => `<div class='item'>${item.text}</div>`).join('')

  globalMenuData.menuDom = document.createElement('div')
  globalMenuData.menuDom.classList.add('global-menus')
  globalMenuData.menuDom.innerHTML = childDom
  asyncTimeOut(10).then(() => {
    document.addEventListener('click', globalMenuData.close)
  })

  document.body.appendChild(globalMenuData.menuDom)

  // 窗口尺寸
  const [width, height] = [document.body.clientWidth, document.body.clientHeight]
  // 元素插入后才能获取宽高
  const domRect = globalMenuData.menuDom.getBoundingClientRect()

  const [left, top] = [Math.min(event.x, width - domRect.width), Math.min(event.y, height - domRect.height)]

  globalMenuData.menuDom.style.left = left + 'px'
  globalMenuData.menuDom.style.top = top + 'px'

  document.querySelectorAll('.global-menus > .item').forEach((ele, index) => {
    ele.onclick = () => {
      globalMenuData.callback[0] && globalMenuData.callback[0]({
        index,
        item: list[index]
      })
      globalMenuData.removeEle()
    }
  })

  return new Promise((resolve, reject) => {
    globalMenuData.callback = [resolve, reject]
  })
}

export {
  openMenu
}