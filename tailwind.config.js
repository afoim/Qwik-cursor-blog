import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'silver-shine': 'silverShine 8s linear infinite',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
        'shine-slow': 'shine 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        silverShine: {
          '0%': {
            backgroundPosition: '0% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '50%, 100%': { transform: 'translateX(100%)' },
        },
      },
      typography: (theme) => ({
        invert: {
          css: {
            '--tw-prose-body': 'transparent',
            '--tw-prose-headings': 'transparent',
            '--tw-prose-links': 'transparent',
            '--tw-prose-bold': 'transparent',
            '--tw-prose-counters': 'transparent',
            '--tw-prose-bullets': 'transparent',
            '--tw-prose-hr': 'rgb(var(--silver-400))',
            '--tw-prose-quotes': 'transparent',
            '--tw-prose-quote-borders': 'rgb(var(--silver-700))',
            '--tw-prose-captions': 'transparent',
            '--tw-prose-code': 'transparent',
            '--tw-prose-pre-code': theme('colors.zinc.100'),
            '--tw-prose-pre-bg': theme('colors.zinc.800'),
            '--tw-prose-th-borders': 'rgb(var(--silver-600))',
            '--tw-prose-td-borders': 'rgb(var(--silver-700))',
          },
        },
      }),
    },
  },
  plugins: [
    typography(),
  ],
}; 