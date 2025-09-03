// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-dark': '#0f172a', // Slate-900
        'primary-text': '#f1f5f9',    // Slate-100
        'accent-green': '#22c55e',    // Emerald-500
        'accent-red': '#ef4444',      // Red-500
      },
    },
  },
  plugins: [],
}

export default config