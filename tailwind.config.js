/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", // Include all HTML files in the root folder
    "./src/**/*.{html,js}", // Include HTML and JS files in src/ subdirectories
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#D8E7E3",
          DEFAULT: "#4F796C",
          dark: "#244D40",
        },
        secondary: {
          light: "#FDB05B",
          DEFAULT: "#FDB05B",
          dark: "#F69A34",
        },
        accent: "#F74420",
        bg: "#FDF2E4",
      },
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"],
      },
      letterSpacing: {
        max: "0.5em",
        medio: "0.3em",
        min: "0.2em",
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
      },
    },
  },
  plugins: [],
};
