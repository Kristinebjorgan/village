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
          light: "#788da4",
          DEFAULT: "#3c556e",
          dark: "#25334a",
        },
        secondary: {
          light: "#fada5e",
          DEFAULT: "#ffbf00",
          dark: "#D19400",
        },
        accent: "#D8DCE3",
        bg: "#F4F6F5",
      },
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"], 
        header: ["Lora", "serif"], 
      },
      letterSpacing: {
        max: "0.5em",
        medio: "0.54em",
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
