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
        background: '#FAFAF7', // Off-white background
        foreground: '#222', // Charcoal text
        primary: {
          DEFAULT: '#4F46E5', // Indigo
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F87171', // Coral
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F0',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#E5E7EB',
          foreground: '#374151',
        },
        border: '#E5E7EB',
        input: '#F9FAFB',
        ring: '#4F46E5',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#222',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#222',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif JP', 'ui-serif', 'Georgia', 'serif'],
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
