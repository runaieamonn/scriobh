/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Cascadia Code"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-pre-bg': theme('colors.zinc.100'),
            maxWidth: 'none',
          },
        },
        invert: {
          css: {
            '--tw-prose-pre-bg': theme('colors.zinc.800'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
