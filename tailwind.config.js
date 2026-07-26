/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        coal: "#0A0A0A",
        bone: "#F4F1EA",
        steel: "#7A7A7A",
        acid: "#CCFF00",
        alert: "#FF2A2A",
        signal: "#0055FF",
        "void-1": "#0F0F0F",
        "void-2": "#141414",
        "void-3": "#1A1A1A",
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(4rem, 14vw, 14rem)", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(3rem, 8vw, 8rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2rem, 5vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        scan: "scan 4s linear infinite",
        jitter: "jitter 0.15s steps(2) infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        jitter: {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-1px, 1px)" },
          "50%": { transform: "translate(1px, -1px)" },
          "75%": { transform: "translate(-1px, -1px)" },
          "100%": { transform: "translate(1px, 1px)" },
        },
      },
      transitionTimingFunction: {
        brutal: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      perspective: {
        "1000": "1000px",
      },
    },
  },
  plugins: [],
};
