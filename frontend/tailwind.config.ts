import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08070F",
        panel: "#1E1D35",
        panel2: "#27273B",
        line: "#4C1D95",
        violet: "#8B5CF6",
        lilac: "#A78BFA",
        gold: "#FBBF24",
        fog: "#94A3B8",
        frost: "#F8FAFC",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "Inter", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(139, 92, 246, 0.75)",
        "glow-gold": "0 0 36px -14px rgba(251, 191, 36, 0.85)",
      },
      animation: {
        "scan": "scan 9s linear infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 8s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "80%, 100%": { transform: "scale(1.7)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
