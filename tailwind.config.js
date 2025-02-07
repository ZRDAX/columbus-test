// eslint-disable-next-line no-undef
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
      },
      screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
      },
    extend: {
      fontFamily: {
        'centuryGothic': ['CenturyGothic', 'sans-serif'],
      },
      backgroundImage: {
        'my-bg': "url('./public/assets/Gradients-Lab-2.png')"
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}

