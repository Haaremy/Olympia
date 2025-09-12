/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← sehr wichtig, sonst reagiert "dark:" nicht
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
