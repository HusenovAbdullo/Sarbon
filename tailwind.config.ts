import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/menu/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 18px 55px rgba(15, 23, 42, 0.10)",
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        glow: "0 20px 60px rgba(37, 99, 235, 0.28)"
      },
      borderRadius: {
        shell: "28px"
      },
      screens: {
        xs: "440px",
        "3xl": "1760px"
      }
    }
  },
  plugins: []
};

export default config;
