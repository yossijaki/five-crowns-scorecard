import { type Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#6B7280',
        dark: {
          100: '#1F2937',
          200: '#111827',
          300: '#0F172A',
        },
      },
    },
  },
  plugins: [],
} satisfies Config