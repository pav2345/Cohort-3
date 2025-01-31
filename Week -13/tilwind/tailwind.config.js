/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        red:{
          500:"blue"
        }
      },
      screens:{
        md:'768',
        lg:'1024px',
      },
      

    },
  },
  plugins: [],
}
