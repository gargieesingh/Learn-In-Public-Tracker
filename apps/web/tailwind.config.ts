import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { bg: '#0A0A0F', surface: '#13131A', accent: '#6C63FF', mint: '#63FFD8', muted: '#8585A3', border: '#272738' },
      fontFamily: { display: ['var(--font-space)', 'sans-serif'], body: ['var(--font-inter)', 'sans-serif'] },
      keyframes: { shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } } },
      animation: { shimmer: 'shimmer 1.5s infinite linear' }
    }
  },
  plugins: []
} satisfies Config
