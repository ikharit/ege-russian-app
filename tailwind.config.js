export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'duo-green': '#58cc02',
        'duo-green-dark': '#58a700',
        'duo-blue': '#1cb0f6',
        'duo-red': '#ff4b4b',
        'duo-yellow': '#ffc800',
        'duo-purple': '#ce82ff',
        'duo-gray': '#e5e5e5',
        'duo-gray-dark': '#afafaf',
        'duo-snow': '#f7f7f7',
      }
    },
  },
  plugins: [],
}