const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Build your palette here
        gray: colors.blueGray,
        red: colors.red,
        blue: colors.blue,
        yellow: colors.orange,
      }
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
