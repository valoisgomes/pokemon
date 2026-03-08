import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#CC0000',
          'red-dark': '#990000',
          yellow: '#FFCC00',
          blue: '#3B4CCA',
          'blue-dark': '#2A3699',
        },
      },
      fontFamily: {
        pokemon: ['var(--font-geist-sans)'],
      },
    },
  },
  plugins: [],
}
export default config
