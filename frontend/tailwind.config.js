/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0f1115',
          surface: '#161a21',
          elevated: '#1e2329',
        },
        text: {
          primary: '#e8e8e8',
          secondary: '#a0a0a0',
          muted: '#6b7280',
          accent: '#ffd700',
        },
        accent: {
          DEFAULT: '#ffd700',
          hover: '#ffdd33',
          muted: 'rgba(255, 215, 0, 0.15)',
          strong: 'rgba(255, 215, 0, 0.35)',
        },
        border: {
          subtle: '#232730',
          DEFAULT: '#2a2e39',
          strong: '#404857',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(255, 215, 0, 0.15)',
        'glow-strong': '0 0 50px rgba(255, 215, 0, 0.25)',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}