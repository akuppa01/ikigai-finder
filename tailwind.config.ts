import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Zen Bamboo Forest Theme
        background: '#F7F5F0', // Warm beige background
        foreground: '#2D3748', // Deep charcoal text
        primary: {
          DEFAULT: '#68A357', // Sage green
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#8B7355', // Earthy brown
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#E8E4D8', // Soft beige
          foreground: '#6B7280',
        },
        accent: {
          DEFAULT: '#A8C09A', // Moss green
          foreground: '#2D3748',
        },
        border: '#D1C7B8', // Warm border
        input: '#F9F7F3',
        ring: '#68A357',
        destructive: {
          DEFAULT: '#E53E3E',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D3748',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D3748',
        },
        // Zen theme specific colors
        sage: {
          50: '#F0F4ED',
          100: '#D9E4D1',
          200: '#B3C9A3',
          300: '#8DAE75',
          400: '#7A9B5F',
          500: '#68A357', // Primary sage
          600: '#5A8A4A',
          700: '#4C713D',
          800: '#3E5830',
          900: '#303F23',
        },
        moss: {
          50: '#F2F5F0',
          100: '#DDE5D8',
          200: '#BBCBB1',
          300: '#99B18A',
          400: '#7A9B5F',
          500: '#5B7A34',
          600: '#4A6229',
          700: '#394A1F',
          800: '#283215',
          900: '#171A0B',
        },
        earth: {
          50: '#F7F5F0',
          100: '#E8E4D8',
          200: '#D1C7B8',
          300: '#BAAA97',
          400: '#A38D76',
          500: '#8B7355', // Primary earth
          600: '#7A6248',
          700: '#69513B',
          800: '#58402E',
          900: '#472F21',
        },
        mist: {
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E3E6E8',
          300: '#D5D9DC',
          400: '#C7CCD0',
          500: '#B9BFC4', // Primary mist
          600: '#9CA3A9',
          700: '#7F878E',
          800: '#626B73',
          900: '#454F58',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Primary gold
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        sans: ['Lato', 'Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: [
          'Merriweather',
          'Playfair Display',
          'Noto Serif JP',
          'ui-serif',
          'Georgia',
          'serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
