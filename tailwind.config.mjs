/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx}'],
  theme: {
    extend: {
      screens: {
        'phone': '400px'
      },
      fontFamily: {
        title: 'DM Serif Text, serif'
      }
    }
  },
  plugins: []
}
