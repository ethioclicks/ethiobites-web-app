import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // EthioPromo brand colors inspired by Ethiopian spices
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C0392B', // Berbere Red - main primary
          600: '#991b1b',
          700: '#7f1d1d',
          800: '#651415',
          900: '#450a0a',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#F1C40F', // Turmeric Yellow - main secondary
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        text: {
          primary: '#3E2723', // Coffee Brown
          secondary: '#795548',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#FFF8E1', // Creamy White background
        },
        accent: {
          orange: '#E67E22',
          green: '#27AE60',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;