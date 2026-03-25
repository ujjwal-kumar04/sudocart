/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffe680',
        secondary: '#1b4f9c',
        dark: '#2c2c2c',
        light: '#f5f5f5',
        border: '#dcdcdc',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      screens: {
        'xs': '360px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
