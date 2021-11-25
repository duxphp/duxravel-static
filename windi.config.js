const { light } = require('./arco-palette.json')
import { all } from 'tinymce/themes/silver/theme'
import { defineConfig } from 'windicss/helpers'

const colors = Object.fromEntries(Object.keys(light).map(key => {
  return [key, Object.fromEntries(light[key].map((val, index) => {
    return [index === 0 ? 50 : index * 100, val]
  }))]
}))

export default defineConfig({
  darkMode: 'class', // or 'media' or 'class'
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
