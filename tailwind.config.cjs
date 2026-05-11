/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      colors: {
        app: {
          lightBg: "#FAFAF9",
          lightCard: "#FFFFFF",
          lightAccent: "#F59E0B",
          darkBg: "#1C1917",
          darkCard: "#292524",
          darkAccent: "#FBBF24"
        },
        priority: {
          1: "#EF4444",
          2: "#F97316",
          3: "#EAB308",
          4: "#9CA3AF"
        }
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.06)"
      },
      borderRadius: {
        xl2: "20px"
      },
      transitionDuration: {
        280: "280ms",
        320: "320ms",
        350: "350ms"
      }
    }
  },
  plugins: []
};
