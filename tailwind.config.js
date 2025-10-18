/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        connection: {
          wan: '#3b82f6',
          cellular: '#a855f7',
          wifi: '#22c55e',
          sfp: '#f97316',
        },
      },
    },
  },
  plugins: [],
}
