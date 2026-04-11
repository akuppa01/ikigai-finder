import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Semantic tokens (map to CSS vars) ──────────────────────────
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // ── Crimson — samurai red, primary brand ──────────────────────
        crimson: {
          50:  '#FFF0F0',
          100: '#FFD6D6',
          200: '#FFADAD',
          300: '#FF7070',
          400: '#FF3A3A',
          500: '#E81414',
          600: '#B91C1C',
          700: '#8B1515',
          800: '#6B1010',
          900: '#4A0C0C',
          950: '#2D0606',
        },

        // ── Ink — near-black, body text ───────────────────────────────
        ink: {
          50:  '#F7F5F3',
          100: '#EDE9E5',
          200: '#D6CFC9',
          300: '#B8AFA7',
          400: '#9A8F86',
          500: '#7D7168',
          600: '#635850',
          700: '#4A4139',
          800: '#312C26',
          900: '#1C1917',
          950: '#0E0C0A',
        },

        // ── Parchment — warm white, backgrounds ───────────────────────
        parchment: {
          50:  '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#EDE4D6',
          400: '#E0D5C3',
          500: '#D0C3AD',
          600: '#B8A892',
          700: '#9A8C76',
          800: '#7A6E5C',
          900: '#5A5144',
          950: '#3A3329',
        },

        // ── Bronze — muted gold, accents ──────────────────────────────
        bronze: {
          50:  '#FDF8EE',
          100: '#FAEDD4',
          200: '#F4D9A4',
          300: '#ECBF6A',
          400: '#E4A33A',
          500: '#D4891C',
          600: '#B8741A',
          700: '#9A5E18',
          800: '#7C4A16',
          900: '#5E3812',
          950: '#3E240C',
        },
      },

      fontFamily: {
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
        mono: ['monospace'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'float': 'float 4s ease-in-out infinite',
      },

      backgroundImage: {
        'parchment-grain':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },

      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--foreground)',
            '--tw-prose-headings': 'var(--foreground)',
            '--tw-prose-links': 'var(--primary)',
            '--tw-prose-bold': 'var(--foreground)',
            '--tw-prose-counters': 'var(--muted-foreground)',
            '--tw-prose-bullets': 'var(--muted-foreground)',
            '--tw-prose-hr': 'var(--border)',
            '--tw-prose-quotes': 'var(--foreground)',
            '--tw-prose-quote-borders': 'var(--primary)',
            '--tw-prose-captions': 'var(--muted-foreground)',
            '--tw-prose-code': 'var(--foreground)',
            '--tw-prose-pre-code': 'var(--foreground)',
            '--tw-prose-pre-bg': 'var(--muted)',
            '--tw-prose-th-borders': 'var(--border)',
            '--tw-prose-td-borders': 'var(--border)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
