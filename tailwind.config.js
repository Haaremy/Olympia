// tailwind.config.js
module.exports = {
  darkMode: 'class', // wichtig für manuelles Umschalten
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",    // für Next.js App Router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
