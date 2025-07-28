/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-out": "fadeOut 3s ease-in-out forwards 1s",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      colors: {
        "accent-primary": "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
        "accent-hover": "var(--color-accent-hover)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
