const {light} = require('./arco-palette.json')
import {defineConfig} from 'windicss/helpers'


const safelist = []

const colors = Object.fromEntries(Object.keys(light).map(key => {
  // 安全 tree 色彩
  safelist.push(`text-${key}-400`)
  safelist.push(`bg-${key}-400`)
  safelist.push(`border-${key}-500`)

  // arco 颜色导入
  return [key, Object.fromEntries(light[key].map((val, index) => {
    return [index === 0 ? 50 : index * 100, val]
  }))]
}))

// 筛选器样式
safelist.push('my-2 mt-2 mb-2 mx-2')

export default defineConfig({
  darkMode: 'class', // or 'media' or 'class'
  safelist: safelist.join(' '),
  theme: {
    extend: {
      colors: {
        'blackgray': {
          1: '#373739',
          2: '#313132',
          3: '#2a2a2b',
          4: '#232324',
          5: '#17171a',
        },
        ...colors,
      }
    },
  },
})
