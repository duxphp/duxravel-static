import { changeColor } from 'seemly'
import { checkboxLight } from 'naive-ui/es/checkbox/styles'
import { scrollbarLight } from 'naive-ui/es/_internal/scrollbar/styles'
import { commonLight } from 'naive-ui/es/_styles/common'
import { createTheme } from 'naive-ui/es/_mixins/use-theme'

export const self = vars => {
  const {
    borderRadiusSmall,
    hoverColor,
    pressedColor,
    primaryColor,
    textColor3,
    textColor2,
    textColorDisabled,
    fontSize
  } = vars
  return {
    fontSize,
    nodeBorderRadius: borderRadiusSmall,
    nodeColorHover: hoverColor,
    nodeColorPressed: pressedColor,
    nodeColorActive: changeColor(primaryColor, { alpha: 0.1 }),
    arrowColor: textColor3,
    nodeTextColor: textColor2,
    nodeTextColorDisabled: textColorDisabled,
    loadingColor: primaryColor,
    dropMarkColor: primaryColor
  }
}

const treeLight = createTheme({
  name: 'Tree',
  common: commonLight,
  peers: {
    Checkbox: checkboxLight,
    Scrollbar: scrollbarLight
  },
  self
})

export default treeLight
