/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./pages/*.html", "./dist/*.js"],
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
        'max-575': {
          max: '575px',
        },
        'max-527': {
          max: '527px',
        },
        'max-550': {
          max: '550px',
        },
        'max-565': {
          max: '565px',
        },
        'max-595': {
          max: '595px',
        },
        'max-635': {
          max: '635px',
        },
        'max-814': {
          max: '814px',
        },
        'max-870': {
          max: '870px',
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
