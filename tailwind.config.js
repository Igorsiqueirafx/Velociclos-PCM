/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#0f3460",
        "accent-light": "#533483",
        gold: "#e94560",
        "gold-light": "#f09937",
      },
    },
  },
  plugins: [],
};
