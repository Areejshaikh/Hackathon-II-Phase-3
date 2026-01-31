/**
 * Design Tokens for Premium Visual Overhaul
 * Following Linear/Vercel-style design principles
 */

// Color Tokens
export const colors = {
  // Primary Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Slate Colors
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b', // Border color (#1e293b)
    900: '#0f172a',
  },

  // Indigo Colors
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Premium Dark Theme Colors
  dark: {
    bg: '#020617', // Deep Dark Slate
    glassBg: 'rgba(15, 23, 42, 0.4)', // slate-900/40
    glassBorder: '#1e293b', // slate-800
  }
};

// Spacing Tokens (based on Tailwind's scale)
export const spacing = {
  'xs': '0.125rem',  // 2px
  'sm': '0.25rem',  // 4px
  'md': '0.5rem',   // 8px
  'lg': '1rem',     // 16px
  'xl': '1.5rem',   // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
};

// Typography Tokens
export const typography = {
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },

  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Effect Tokens
export const effects = {
  backdropBlur: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  opacity: {
    glass: '0.4', // 40% for glassmorphism
    hover: '0.3', // 30% for hover effects
  },

  transition: {
    duration: {
      short: '150ms',
      medium: '200ms',
      long: '300ms',
    },
    property: {
      borderColor: 'border-color',
    },
  },
};

// Border Tokens
export const borders = {
  width: {
    thin: '1px',
  },
  radius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
  },
  color: {
    default: '#1e293b', // slate-800
    hover: 'rgba(79, 70, 229, 0.3)', // indigo-500/30
  },
};

// Shadow Tokens
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
};