import { changeColor } from 'seemly'
import { checkboxDark } from 'naive-ui/es/checkbox/styles'
import { scrollbarDark } from 'naive-ui/es/_internal/scrollbar/styles'
import { commonDark } from 'naive-ui/es/_styles/common'
import { self } from './light'

const treeDark = {
  name: 'Tree',
  common: commonDark,
  peers: {
    Checkbox: checkboxDark,
    Scrollbar: scrollbarDark
  },
  self (vars) {
    const { primaryColor } = vars
    const commonSelf = self(vars)
    commonSelf.nodeColorActive = changeColor(primaryColor, { alpha: 0.8 })
    return commonSelf
  }
}

export default treeDark
