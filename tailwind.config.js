const colors = require('tailwindcss/colors')

module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
        },
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                black: '#000',
                white: '#fff',
                gray: {
                    900: '#131523',
                    800: '#333752',
                    700: '#5A607F',
                    600: '#7E84A3',
                    500: '#A1A7C4',
                    400: '#D7DBEC',
                    300: '#E6E9F4',
                    200: '#F5F6FA',
                    100: '#f6f6fb',
                    50: '#fafafb',
                },
                blue: {
                    900: '#1E5EFF',
                    800: '#336DFF',
                    700: '#4F81FF',
                    600: '#608DFF',
                    500: '#89ABFF',
                    400: '#B6CBFF',
                    300: '#D9E4FF',
                    200: '#ECF2FF',
                },
                green: {
                    900: '#06A561',
                    800: '#1FD286',
                    700: '#25E191',
                    600: '#48E9A5',
                    500: '#74EFB9',
                    400: '#95F6CC',
                    300: '#C4F8E2',
                    200: '#DAF9EC',
                },
                yellow: {
                    900: '#FF9900',
                    800: '#FFC700',
                    700: '#FFD613',
                    600: '#FFE45F',
                    500: '#FFE582',
                    400: '#FFECA3',
                    300: '#FFF4C9',
                    200: '#FFF9E1',
                },
                purple: {
                    900: '#6E0BD4',
                    800: '#8125DF',
                    700: '#9645E9',
                    600: '#A75EF1',
                    500: '#B97FF3',
                    400: '#D8B1FF',
                    300: '#E9D3FF',
                    200: '#F4E9FE',
                },
                red: {
                    900: '#F0142F',
                    800: '#F12B43',
                    700: '#F34359',
                    600: '#F45A6D',
                    500: '#F8919D',
                    400: '#FAB3BC',
                    300: '#FCD5D9',
                    200: '#FDE7EA',
                },
            }
        },
    },
    variants: {
        extend: {
            visibility: ['hover', 'focus'],
            ringWidth: ['hover'],
            ringColor: ['hover'],
            ringOpacity: ['hover'],
            ringOffsetWidth: ['hover'],
            ringOffsetColor: ['hover'],
            textColor: ['disabled'],
            backgroundColor: ['disabled', 'checked'],
            borderColor: ['disabled', 'checked'],
            inset: ['checked'],
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/line-clamp')
    ],
}
