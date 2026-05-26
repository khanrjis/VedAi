/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.10)',
        lift: '0 24px 70px rgba(15, 23, 42, 0.16)'
      },
      borderRadius: {
        '3xl': '1.75rem'
      },
      backgroundImage: {
        'premium-glow': 'radial-gradient(circle at top left, rgba(255,255,255,0.9), rgba(241,245,249,0.6) 30%, rgba(226,232,240,0.2) 100%)'
      }
    }
  },
  plugins: []
};
