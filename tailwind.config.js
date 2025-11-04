/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: '#ff0000',
      secondary: '#f472b6',
      // etc.
    }
  }
},
  plugins: [],
}