/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          900: '#04471C', // Deep Green
        },
        yellow: {
          400: '#FFC300', // Rich Gold
        },
      },
    },
  },
  plugins: [],
};
