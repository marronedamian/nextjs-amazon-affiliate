import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        translucentWhite: "rgba(255, 255, 255, 0.1)",
        translucentBlack: "rgba(0, 0, 0, 0.4)",
        fallbackDark: "#111114", 
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "custom-radial":
          "radial-gradient(circle at center, #1a1a1d, #111114, #0a0a0a)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.05)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "pulse-slow": "pulseSlow 10s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  // @ts-expect-error - Tailwind acepta esto aunque no esté en UserConfig
  safelist: [
    "animate-fade-up",
    "delay-100",
    "delay-200",
    "delay-300",
    "delay-400",
    "delay-500",
    "group-hover:scale-110",
    "group-hover:scale-105",
    "hover:scale-105",
    "hover:shadow-xl",
  ],
};

export default config;
