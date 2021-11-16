const colors = require('tailwindcss/colors')
const { preset } = require('twin.arco')

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Build your palette here
      }
    },
  },
  ...preset(),
  variants: {
    extend: {
      display: ['hover', 'focus'],
      visibility: ['hover', 'focus'],
      flex: ['hover', 'focus'],
    }
  },
  plugins: [],
}
