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
        // Japanese Ikigai Theme — Parchment · Ink · Crimson
        background: '#F5F0E8',
        foreground: '#1C1917',
        primary: {
          DEFAULT: '#B91C1C',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#A47C52',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#E8E0D5',
          foreground: '#78716C',
        },
        accent: {
          DEFAULT: '#DDD0BE',
          foreground: '#1C1917',
        },
        border: '#D5C9B8',
        input: '#FDFCFA',
        ring: '#B91C1C',
        destructive: {
          DEFAULT: '#E53E3E',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FDFCFA',
          foreground: '#1C1917',
        },
        popover: {
          DEFAULT: '#FDFCFA',
          foreground: '#1C1917',
        },

        // Crimson — primary accent (samurai red)
        crimson: {
          50: '#FFF1F1',
          100: '#FFE0E0',
          200: '#FFC5C5',
          300: '#FF9B9B',
          400: '#F87171',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
          800: '#7F1D1D',
          900: '#450A0A',
        },

        // Ink — text / dark tones
        ink: {
          50: '#F8F7F5',
          100: '#F0EDE9',
          200: '#E3DDD5',
          300: '#C9C0B4',
          400: '#A8998B',
          500: '#7A6B5E',
          600: '#5C4F44',
          700: '#433830',
          800: '#2A2218',
          900: '#1C1510',
        },

        // Parchment — warm whites / backgrounds
        parchment: {
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#E0D4C0',
          500: '#D0BFA6',
          600: '#B8A08A',
          700: '#9A806A',
          800: '#7A6150',
          900: '#5C4535',
        },

        // Bronze / Gold — muted highlights
        bronze: {
          50: '#FFFBF0',
          100: '#FFF3D0',
          200: '#FFE4A0',
          300: '#FFCF60',
          400: '#E8B428',
          500: '#B8860B',
          600: '#9A6F09',
          700: '#7A5807',
          800: '#5C4105',
          900: '#3D2B03',
        },

        // Sage — secondary green (kept for backward compat)
        sage: {
          50: '#F0F4ED',
          100: '#D9E4D1',
          200: '#B3C9A3',
          300: '#8DAE75',
          400: '#7A9B5F',
          500: '#68A357',
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
          500: '#8B7355',
          600: '#7A6248',
          700: '#69513B',
          800: '#58402E',
          900: '#472F21',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
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
      letterSpacing: {
        widest: '0.4em',
        wider: '0.2em',
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
