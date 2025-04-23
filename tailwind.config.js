/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D6EFD',      // Strong blue
        secondary: '#6C757D',    // Gray
        success: '#198754',      // Green
        danger: '#DC3545',       // Red
        background: '#F8F9FA',   // Light gray background
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
