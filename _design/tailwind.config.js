/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EBF4FF',
          100: '#D1E4FF',
          200: '#A3C8FF',
          300: '#75ACFF',
          400: '#4790FF',
          500: '#1A73E8',
          600: '#1A5FBF',
          700: '#1A4A96',
          800: '#1A365D',
          900: '#0A1F3A',
        },
        accent: {
          50: '#FFF0EB',
          100: '#FFE1D6',
          200: '#FFC3AD',
          300: '#FFA583',
          400: '#FF875A',
          500: '#FF5722',
          600: '#E64A19',
          700: '#BF3913',
          800: '#99290B',
          900: '#731A04',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#FBBF24',
        },
        error: {
          500: '#EF4444',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};