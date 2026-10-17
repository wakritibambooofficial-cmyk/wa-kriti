/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bamboo: {
          50: '#F3F6EE',
          100: '#E4EBD8',
          200: '#C9D7B2',
          300: '#A9C085',
          400: '#87A65D',
          500: '#6B8A44',
          600: '#3F5B3E', // primary forest green
          700: '#324A32',
          800: '#263826',
          900: '#1A271A',
        },
        sand: {
          50: '#FDFBF7',
          100: '#FAF7F0',
          200: '#F5F0E6',
          300: '#EDE6D6',
          400: '#E0D5BC',
          500: '#D8CBA9',
        },
        earth: {
          400: '#A9835C',
          500: '#8A6642',
          600: '#6B4A2E',
          700: '#4E3620',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(63, 91, 62, 0.08)',
        'soft-lg': '0 8px 32px rgba(63, 91, 62, 0.12)',
      },
    },
  },
  plugins: [],
};
