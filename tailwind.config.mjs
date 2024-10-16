/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,vue}'],
  theme: {
    extend: {
      screens: {
        'phone': '400px'
      },
      fontFamily: {
        'title': ["DM Serif Display", "Noto Serif SC", "serif"]
      }
    }
  },
  plugins: []
}
