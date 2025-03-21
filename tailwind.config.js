/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // animation: {
      //   shimmer: "shimmer 2s linear infinite"
      // },
      // keyframes: {
      //   shimmer: {
      //     from: {
      //       "backgroundPosition": "0 0"
      //     },
      //     to: {
      //       "backgroundPosition": "-200% 0"
      //     }
      //   }
      // }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
