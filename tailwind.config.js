/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6451F8',
          600: '#6451F8',
          700: '#523ee0',
          800: '#402cb8',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(100, 81, 248, 0.4)',
        'glow-lg': '0 0 35px -5px rgba(100, 81, 248, 0.5)',
      },
    },
  },
  plugins: [],
};
