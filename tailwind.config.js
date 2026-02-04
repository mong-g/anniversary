/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'romantic-dark': '#0f0c29',
        'romantic-purple': '#302b63',
        'romantic-gold': '#ffd700',
        'soft-white': '#f5f5f5',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      }
    },
  },
  plugins: [],
}
