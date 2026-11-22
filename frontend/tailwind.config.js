/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F0EB',
          300: '#EBE3DA',
          400: '#DDD2C5',
          500: '#C7B7A5',
        },
        rosewood: {
          50: '#FDF7F5',
          100: '#FAECE8',
          200: '#F5D8D0',
          300: '#E8A598',
          400: '#D87D65',
          500: '#B85D47',
          600: '#994430',
          700: '#7A3222',
        },
        gold: {
          50: '#FBF9F2',
          100: '#F5EFE0',
          200: '#EADBB6',
          300: '#DCC387',
          400: '#C5A059',
          500: '#B38B42',
          600: '#916D2E',
        },
        slatewarm: {
          100: '#F2EFEB',
          200: '#DDD8D3',
          400: '#8C827D',
          600: '#5A524F',
          700: '#3D3735',
          800: '#2A2524',
          900: '#1A1716',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E5EDE7',
          200: '#C9DBCF',
          500: '#648371',
          700: '#3D5447',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 25px -4px rgba(42, 37, 36, 0.06), 0 2px 10px -2px rgba(42, 37, 36, 0.04)',
        'card': '0 10px 30px -5px rgba(42, 37, 36, 0.08), 0 4px 12px -2px rgba(42, 37, 36, 0.03)',
        'elevated': '0 20px 45px -10px rgba(42, 37, 36, 0.12), 0 8px 20px -4px rgba(42, 37, 36, 0.06)',
      }
    },
  },
  plugins: [],
}
