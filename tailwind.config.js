/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2f7",
          100: "#d6e0ec",
          200: "#aec1d9",
          300: "#7f9cbd",
          400: "#4d6f93",
          500: "#2b4c72",
          600: "#1a3960",
          700: "#122F54",
          800: "#0d2440",
          900: "#081930",
          950: "#050f1e",
        },
        gold: {
          50: "#fdf6ea",
          100: "#faebc9",
          200: "#f4d68e",
          300: "#eec158",
          400: "#e8a83a",
          500: "#F26F21",
          600: "#d15e17",
          700: "#a84813",
          800: "#803613",
          900: "#5c2810",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
