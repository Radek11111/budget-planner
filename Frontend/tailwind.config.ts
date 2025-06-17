import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'], // Główny font (SUSE)
        mono: ['Roboto Mono', 'monospace'], // Font dla liczb/tabel
      },
    },
  },
  plugins: [],
} satisfies Config
