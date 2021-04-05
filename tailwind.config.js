/* eslint-disable global-require */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      transformOrigin: {
        0: "0%",
      },
      zIndex: {
        "-1": "-1",
      },
    },
  },
  variants: {
    extend: {
      ringWidth: ["active"],
      ringColor: ["active"],
      ringOpacity: ["active"],
    },
    borderColor: ["responsive", "hover", "focus", "focus-within"],
  },
  plugins: [require("@tailwindcss/forms")],
};
