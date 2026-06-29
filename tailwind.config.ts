import type { Config } from "tailwindcss";

/**
 * Design system « La Bella Pizzeria ».
 * Palette chaleureuse italienne artisanale :
 * anthracite profond, crème, orange chaud, rouge tomate, vert basilic en accent.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fonds sombres
        charcoal: {
          DEFAULT: "#1a1614",
          50: "#f6f4f2",
          800: "#241f1c",
          900: "#181412",
          950: "#0f0c0b",
        },
        // Zones de contenu claires
        cream: {
          DEFAULT: "#f5ecdd",
          50: "#fdfaf4",
          100: "#f8f1e6",
          200: "#f0e3cf",
          300: "#e6d3b5",
        },
        // Accent principal — orange chaud
        terracotta: {
          DEFAULT: "#e8590c",
          50: "#fdf1e7",
          100: "#fbe0cc",
          300: "#f6a96b",
          400: "#fb7c2d",
          500: "#e8590c",
          600: "#d24b06",
          700: "#b03d05",
        },
        // Accent secondaire — rouge tomate
        tomato: {
          DEFAULT: "#c1331f",
          500: "#d63a24",
          600: "#c1331f",
          700: "#9e2817",
        },
        // Accent léger — vert basilic
        basil: {
          DEFAULT: "#6a9a3b",
          400: "#7fb14a",
          500: "#6a9a3b",
          600: "#557d2f",
        },
      },
      fontFamily: {
        // Variables CSS injectées par next/font (cf. app/layout.tsx)
        script: ["var(--font-script)", "cursive"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 40px -20px rgba(0, 0, 0, 0.45)",
        "card-hover": "0 28px 60px -24px rgba(0, 0, 0, 0.55)",
        glow: "0 0 0 1px rgba(232, 89, 12, 0.15), 0 12px 30px -10px rgba(232, 89, 12, 0.35)",
      },
      backgroundImage: {
        "hero-fade":
          "linear-gradient(90deg, rgba(15,12,11,0.96) 0%, rgba(15,12,11,0.72) 45%, rgba(15,12,11,0.15) 100%)",
        "dark-fade":
          "linear-gradient(180deg, rgba(15,12,11,0) 0%, rgba(15,12,11,0.85) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        // Transition courte pour le changement d'onglet / d'étape (mobile)
        "fade-up-sm": "fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.8s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
