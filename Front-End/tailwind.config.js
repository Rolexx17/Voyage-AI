// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 900: '#0c4a6e' }
      },
      animation: { 'gradient-x': 'gradient-x 15s ease infinite', 'pulse-slow': 'pulse 6s infinite' },
      keyframes: { 'gradient-x': { '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' }, '50%': { 'background-size': '200% 200%', 'background-position': 'right center' } } }
    }
  },
  plugins: []
}
