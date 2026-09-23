/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: '#111827',
        'surface-card': 'rgba(17, 24, 39, 0.7)',
        'surface-border': 'rgba(255, 255, 255, 0.08)',
        accent: {
          green: '#10B981',
          red: '#EF4444',
          blue: '#3B82F6',
          indigo: '#6366F1',
          cyan: '#06B6D4',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
