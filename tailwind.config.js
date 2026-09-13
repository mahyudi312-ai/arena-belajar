/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          red: "#FF4757", gold: "#FFD93D", blue: "#4A90E2",
          green: "#2ECC71", purple: "#A55EEA", dark: "#2C3E50",
          light: "#F8F9FA", cream: "#FFF8E7"
        }
      },
      fontFamily: {
        playful: ["Baloo 2", "cursive"],
        fun: ["Fredoka", "sans-serif"],
        body: ["Nunito", "sans-serif"]
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,71,87,0.7)" },
          "50%": { boxShadow: "0 0 0 15px rgba(255,71,87,0)" }
        }
      }
    }
  },
  plugins: []
}
