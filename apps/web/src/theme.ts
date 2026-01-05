export const colors = {
  primary: {
    DEFAULT: '#6B26D9',
    light: '#8B5CF6',
    dark: '#5B21B6',
    glow: 'rgba(139, 92, 246, 0.5)',
  },
  accent: {
    DEFAULT: '#F5A623',
    light: '#FBBF24',
    dark: '#D97706',
    glow: 'rgba(245, 166, 35, 0.5)',
  },
  background: {
    DEFAULT: '#0D0D12',
    surface: '#16161E',
    elevated: '#1E1E28',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  gray: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(139, 92, 246, 0.5)',
  },
  status: {
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const

export const blur = {
  sm: '8px',
  md: '12px',
  lg: '20px',
  xl: '32px',
} as const

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const

export const shadows = {
  glow: {
    primary: `0 0 20px ${colors.primary.glow}`,
    accent: `0 0 20px ${colors.accent.glow}`,
    sm: '0 0 10px rgba(139, 92, 246, 0.3)',
  },
  card: '0 4px 24px rgba(0, 0, 0, 0.4)',
  elevated: '0 8px 32px rgba(0, 0, 0, 0.5)',
} as const

export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.08)',
    blur: blur.md,
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.12)',
    blur: blur.lg,
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.4)',
    border: 'rgba(255, 255, 255, 0.06)',
    blur: blur.xl,
  },
} as const

export const theme = {
  colors,
  blur,
  radius,
  spacing,
  shadows,
  glass,
} as const

export type Theme = typeof theme
export default theme
