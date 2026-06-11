/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#090b14',
        'bg-2': '#0f111b',
        card: 'rgba(20,23,36,.75)',
        'card-hover': 'rgba(26,30,48,.85)',
        border: 'rgba(255,255,255,.05)',
        'border-hover': 'rgba(255,255,255,.1)',
        text: '#e2e8f0',
        'text-2': '#94a3b8',
        'text-3': '#4a5270',
        accent: '#f59e0b',
        'accent-2': '#fbbf24',
        home: '#ef4444',
        draw: '#f59e0b',
        away: '#3b82f6',
        green: '#22c55e',
      },
      borderRadius: {
        r: '12px',
        rs: '8px',
      },
    },
  },
  plugins: [],
}
