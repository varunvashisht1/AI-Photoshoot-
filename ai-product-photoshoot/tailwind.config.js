/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          950: "#020617",
          900: "#0b1220",
          800: "#0f172a",
          700: "#1e293b",
        },
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        accent: {
          400: "#a855f7",
          500: "#9333ea",
          600: "#7e22ce",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34, 211, 238, 0.18), 0 12px 40px -8px rgba(34, 211, 238, 0.35)",
        "glow-accent":
          "0 0 0 1px rgba(168, 85, 247, 0.18), 0 12px 40px -8px rgba(168, 85, 247, 0.35)",
        soft: "0 8px 24px -10px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #22d3ee 0%, #a855f7 55%, #f472b6 100%)",
        "panel-gradient":
          "linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(11, 18, 32, 0.45) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        "pulse-soft": "pulseSoft 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "toast-in": "toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
