/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "animate-shimmer",
    "bg-gradient-to-r",
    "from-gray-200",
    "via-gray-300",
    "to-gray-200",
  ],
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: ["@tailwindcss/postcss"],
};

export default config;
