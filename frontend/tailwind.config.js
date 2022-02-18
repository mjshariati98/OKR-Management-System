const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    important: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
          'xs': '475px',
          ...defaultTheme.screens,
        },
      },
    variants: {
        extend: {},
    },
    plugins: [],
};
