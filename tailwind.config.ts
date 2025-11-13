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
        'yellow-bin': '#FFC107',
        'grey-bin': '#757575',
        'alert-info': '#2196F3',
        'alert-success': '#4CAF50',
        'alert-warning': '#FF9800',
        'alert-danger': '#F44336',
      },
    },
  },
  plugins: [],
}

export default config
