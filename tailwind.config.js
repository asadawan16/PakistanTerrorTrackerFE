/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        lufga: ["Lufga", "Lufga ExtraBold", "sans-serif"],
        'lufga-extrabold': ["Lufga ExtraBold", "Lufga", "sans-serif"],
      },
    },
  },
};
