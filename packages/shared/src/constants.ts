// App constants
export const APP_CONFIG = {
  NAME: 'Sócio do Tabuleiro',
  VERSION: '1.0.0',
  DESCRIPTION: 'Marketplace para Mestres, Lojistas e Jogadores de RPG',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  SESSIONS: '/api/sessions',
  USERS: '/api/users',
  BOOKINGS: '/api/bookings',
  MARKETPLACE: '/api/marketplace',
  PAYMENTS: '/api/payments',
} as const;

// UI constants
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#6b26d9',
    PRIMARY_HOVER: '#5b20b9',
    PRIMARY_LIGHT: '#8b5cf6',
    ACCENT: '#FFB800',
    ACCENT_HOVER: '#e5a600',
    BACKGROUND: '#050505',
    SURFACE: '#121212',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;
