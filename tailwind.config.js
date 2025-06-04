/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/theme.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D6EFD", // Strong blue
        secondary: "#6C757D", // Gray
        success: "#198754", // Green
        danger: "#DC3545", // Red
        background: "#F8F9FA", // Light gray background
        darkBg: "#0E1117",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
