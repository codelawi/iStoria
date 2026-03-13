/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5b71ff",
        secondary: "#1f3252ff",
      },
      fontFamily: {
        enBold: "english-bold",
        enRegular: "english-regular",
        arRegular: "arabic-regular",
        arLight: "arabic-light",
        arBold: "arabic-bold",
      },
    },
  },
  plugins: [],
};
