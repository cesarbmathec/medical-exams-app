/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#f97316',
        'brand-pink': '#ec4899',
      },
    },
  },
  plugins: [],
}