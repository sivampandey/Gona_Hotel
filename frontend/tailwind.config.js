/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          emerald: '#1A362B',
          'emerald-dark': '#0F241C',
          'emerald-light': '#2A5243',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          'gold-dark': '#AA820A',
          champagne: '#E8D8B0',
          sand: '#F7F4EF',
          cream: '#FDFBF7',
          obsidian: '#0F1715',
          charcoal: '#1E2927',
          bronze: '#8C6239'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(26, 54, 43, 0.15)',
        'luxury-hover': '0 30px 60px -12px rgba(212, 175, 55, 0.25)',
        'glass': '0 8px 32px 0 rgba(15, 23, 21, 0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'luxury-gold': 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)',
        'luxury-emerald': 'linear-gradient(135deg, #1A362B 0%, #0F1715 100%)',
      }
    },
  },
  plugins: [],
}
