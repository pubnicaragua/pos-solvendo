/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // azul principal
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
        accent: {
          DEFAULT: '#101014', // negro del logo
        },
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        white: '#fff',
        black: '#101014',
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      borderRadius: {
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(16,16,20,0.08)',
        modal: '0 4px 32px 0 rgba(16,16,20,0.16)',
      },
    },
  },
  plugins: [],
};
