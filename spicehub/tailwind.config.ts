import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mechanic: "#38b6ff",
        programmer: "#7ed957",
        socialmedia: "#df0089",
        executive: "#f4ca24",
        marketing: "#4718a4",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
