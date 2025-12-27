/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pure-black': '#0C0C0C',
        'dark-gray': '#121212',
        'soft-gray': '#2B2B2B',
        'pure-white': '#F8F8F8',
        'muted-gray': '#A1A1A1',
        'gold': '#F7D774',
        'burnt-orange': '#C97B43',
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Lexend Deca', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-sunset': 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)',
        'gradient-retro-purple': 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #13547A 0%, #80D0C7 100%)',
        'gradient-xp': 'linear-gradient(90deg, #F7D774 0%, #C97B43 100%)',
        'film-grain': `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(247, 215, 116, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(247, 215, 116, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

