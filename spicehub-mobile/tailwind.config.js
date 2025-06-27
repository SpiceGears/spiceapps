import gluestackPlugin from '@gluestack-ui/nativewind-utils/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["app/**/*.{tsx,jsx,ts,js}", "components/**/*.{tsx,jsx,ts,js}"],
  presets: [require('nativewind/preset')],
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|primary)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        dark: {
        'bg-dark': 'hsl(224 0% 1%)',
        bg: 'hsl(224 0% 4%)',
        'bg-light': 'hsl(224 0% 9%)',
        text: 'hsl(224 0% 95%)',
        'text-muted': 'hsl(224 0% 69%)',
        highlight: 'hsl(224 0% 39%)',
        border: 'hsl(224 0% 28%)',
        'border-muted': 'hsl(224 0% 18%)',
        primary: 'hsl(206 75% 69%)',
        secondary: 'hsl(28 64% 65%)',
        danger: 'hsl(9 26% 64%)',
        warning: 'hsl(52 19% 57%)',
        success: 'hsl(146 17% 59%)',
        info: 'hsl(217 28% 65%)',
        },

        light: {
        'bg-dark': 'hsl(224 0% 90%)',
        bg: 'hsl(224 0% 95%)',
        'bg-light': 'hsl(224 100% 100%)',
        text: 'hsl(224 0% 4%)',
        'text-muted': 'hsl(224 0% 28%)',
        highlight: 'hsl(224 100% 100%)',
        border: 'hsl(224 0% 50%)',
        'border-muted': 'hsl(224 0% 62%)',
        primary: '#116cbf',
        secondary: 'hsl(34 100% 19%)',
        danger: '#da4755',
        warning: 'hsl(52 23% 34%)',
        success: 'hsl(147 19% 36%)',
        info: 'hsl(217 22% 41%)',
        },
      },
    },
  },
  plugins: [gluestackPlugin],
};
