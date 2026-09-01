/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F4FC",
          100: "#B3DEF5",
          200: "#80C8EE",
          300: "#4DB2E7",
          400: "#1A9CE0",
          500: "#0094DA",
          600: "#007AB5",
          700: "#006199",
          800: "#004A75",
          900: "#003352",
          DEFAULT: "#0094DA",
        },
        accent: {
          50: "#FFF0E6",
          100: "#FFD4B3",
          200: "#FFB880",
          300: "#FF9C4D",
          400: "#FF801A",
          500: "#F26522",
          600: "#D9551A",
          700: "#BF4613",
          800: "#A6370D",
          900: "#8C2906",
          DEFAULT: "#F26522",
        },
        success: {
          DEFAULT: "#00A859",
          light: "#E6F7EF",
        },
        navy: {
          DEFAULT: "#1B2D4B",
          light: "#2A4068",
          dark: "#0F1A2E",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 148, 218, 0.12)",
        card: "0 2px 16px rgba(15, 23, 42, 0.08)",
        "card-hover": "0 8px 32px rgba(0, 148, 218, 0.15)",
        elevated: "0 4px 24px rgba(15, 23, 42, 0.12)",
        header: "0 2px 12px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "fade-up": "fadeUp .7s ease both",
        "fade-in": "fadeIn .5s ease both",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "slide-in-right": "slideInRight .4s ease both",
        "slide-in-left": "slideInLeft .4s ease both",
        "slide-down": "slideDown .3s ease both",
        "scale-up": "scaleUp .3s ease both",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: ".65", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
