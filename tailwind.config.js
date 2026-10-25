import { heroui } from '@heroui/theme'

/**
 * LUMINA ARCHITECTURE — Active Tailwind Configuration.
 *
 * Designed to match the Lumina AI Automation Platform aesthetic:
 * - Deep obsidian-navy base (#06080f)
 * - Luminous cobalt/sky-blue horizon gradients (#1d4ed8 -> #60a5fa -> #dbeafe)
 * - Halftone arrow-matrix background patterns
 * - Mixed typography: Geometric Sans + Editorial Italic Serif + Technical Monospace
 * - Architectural 1px grid borders with chamfered section tabs and 3D squircle nodes
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        serif: [
          'var(--font-serif)',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        brand: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'deck-xs': ['11px', { lineHeight: '1.35', letterSpacing: '0.08em' }],
        'deck-sm': ['13px', { lineHeight: '1.5', letterSpacing: '-0.005em' }],
        'deck-base': ['16px', { lineHeight: '1.6', letterSpacing: '-0.012em' }],
        'deck-lg': ['18px', { lineHeight: '1.55', letterSpacing: '-0.015em' }],
        'deck-xl': ['22px', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
        'deck-2xl': ['26px', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        'deck-3xl': ['32px', { lineHeight: '1.16', letterSpacing: '-0.03em' }],
        'deck-4xl': ['40px', { lineHeight: '1.1', letterSpacing: '-0.032em' }],
        'deck-5xl': ['52px', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        'deck-6xl': ['64px', { lineHeight: '1.02', letterSpacing: '-0.036em' }],
        'deck-7xl': ['76px', { lineHeight: '0.98', letterSpacing: '-0.038em' }],
        'deck-8xl': ['92px', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        lumina: {
          void: '#06080f',
          obsidian: '#0a0d16',
          surface: '#0f1422',
          navy: '#162c56',
          cobalt: '#2b59a8',
          sky: '#6aa1f7',
          ice: '#d8eaff',
          line: 'rgba(255, 255, 255, 0.09)',
        },
        /* Backward-compatible semantic aliases mapped to Lumina palette */
        deck: {
          red: 'hsl(var(--deck-red))',
          'red-bright': 'hsl(var(--deck-red-bright))',
          'red-deep': 'hsl(var(--deck-red-deep))',
          ink: 'hsl(var(--deck-ink))',
          gold: 'hsl(var(--deck-gold))',
          ivory: 'hsl(var(--deck-ivory))',
          'ivory-2': 'hsl(var(--deck-ivory-2))',
          felt: 'hsl(var(--deck-felt))',
        },
        panel: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        signal: {
          ok: 'hsl(152 68% 46%)',
          warn: 'hsl(38 92% 54%)',
          down: 'hsl(0 78% 58%)',
          idle: 'hsl(var(--muted-foreground))',
          cyan: 'hsl(var(--deck-red-bright))',
        },
        blueprint: 'hsl(var(--border))',
      },
      borderRadius: {
        card: '16px',
        'card-sm': '10px',
        'card-lg': '22px',
        pip: '999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-lift': 'var(--shadow-card-lift)',
        lamp: '0 0 60px -10px hsl(var(--deck-red) / 0.5)',
        chip: '0 20px 50px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.22), inset 0 -2px 6px rgba(0, 0, 0, 0.9)',
      },
      transitionTimingFunction: {
        deck: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'deal-in': {
          '0%': { opacity: '0', transform: 'translate3d(0, 20px, 0) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0) scale(1)' },
        },
        'lamp-flicker': {
          '0%,100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        'pulse-beam': {
          '0%, 100%': { opacity: '0.65' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'deal-in': 'deal-in 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'lamp-flicker': 'lamp-flicker 5s ease-in-out infinite',
        'pulse-beam': 'pulse-beam 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [heroui()],
}
