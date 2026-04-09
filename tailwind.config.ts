import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-mesh-1)",
        foreground: "var(--text-primary)",
        glass: {
          bg: "var(--bg-glass)",
          border: "var(--border-glass)"
        },
        theme: {
          up: "var(--accent-up)",
          down: "var(--accent-down)",
          warning: "var(--accent-warning)",
          primary: "var(--accent-primary)"
        }
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }
    },
  },
  plugins: [],
};

export default config;
