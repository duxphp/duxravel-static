const { light } = require('./arco-palette.json')

const colors = Object.fromEntries(Object.keys(light).map(key => {
  return [key, Object.fromEntries(light[key].map((val, index) => {
    return [index === 0 ? 50 : index * 100, val]
  }))]
}))

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors
    },
  },
  variants: {
    extend: {
      display: ['hover', 'focus'],
      visibility: ['hover', 'focus'],
      flex: ['hover', 'focus'],
    }
  },
  plugins: [],
}
