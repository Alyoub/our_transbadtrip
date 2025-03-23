/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./pages/**/*.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      screens: {
        xs: {
          max: '639px',
        },
        'min-316': {
          min: '316px',
        },
        'max-503': {
          max: '503px',
        },
        'max-521': {
          max: '521px',
        },
        'max-550': {
          max: '550px',
        },
        'min-1900': {
          min: '1900px',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', {
          lineHeight: '1rem',
        }],
        '3xs': ['0.5rem', {
          lineHeight: '1rem',
        }],
        '4xs': ['0.375rem', {
          lineHeight: '1rem',
        }],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
