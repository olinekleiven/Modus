/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pomo-red': '#dc2626',
        'pomo-red-light': '#ef4444',
        'pomo-red-dark': '#b91c1c',
      },
    },
  },
  plugins: [],
}

