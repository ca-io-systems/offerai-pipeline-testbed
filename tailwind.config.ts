import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5A5F',
        dark: '#484848',
        secondary: '#767676',
        border: '#EBEBEB',
        background: '#F7F7F7',
        success: '#008A05',
        warning: '#FFB400',
        error: '#C13515',
      },
    },
  },
  plugins: [],
}

export default config
