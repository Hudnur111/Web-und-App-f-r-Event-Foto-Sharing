/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Space Mono', 'Courier New', 'monospace'],
      },
      colors: {
        orange: {
          500: '#FF4500',
        }
      },
      animation: {
        'pulse-brutal': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};