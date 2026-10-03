/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0C0E',
        'glass-primary': 'rgba(255, 255, 255, 0.07)',
        'glass-secondary': 'rgba(255, 255, 255, 0.045)',
        'glass-border': 'rgba(255, 255, 255, 0.12)',
        'glass-border-focus': 'rgba(255, 255, 255, 0.22)',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A6A7AB',
        'text-tertiary': '#6F7076',
        'risk-low': '#4ADE80',
        'risk-medium': '#FBBF24',
        'risk-high': '#FB7185',
        'accent-neutral': '#E5E7EB',
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      backdropBlur: {
        glass: '16px',
        heavy: '24px',
      },
    },
  },
  plugins: [],
}
