/**
 * Theme configuration for Castello Coffee Platform
 * Contains color tokens, shadows, and design system constants
 */

export const colors = {
  castello: {
    red: {
      primary: '#dc2626',
      light: '#f87171',
      dark: '#991b1b',
    },
    gold: {
      primary: '#eab308',
      light: '#fde047',
      dark: '#a16207',
    },
  },
  glass: {
    white: 'rgba(255, 255, 255, 0.7)',
    strong: 'rgba(255, 255, 255, 0.85)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
  severity: {
    info: {
      bg: '#eff6ff',
      border: '#3b82f6',
      text: '#1e40af',
    },
    warning: {
      bg: '#fef3c7',
      border: '#f59e0b',
      text: '#92400e',
    },
    critical: {
      bg: '#fee2e2',
      border: '#ef4444',
      text: '#991b1b',
    },
  },
}

export const shadows = {
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  glassLg: '0 20px 60px 0 rgba(31, 38, 135, 0.25)',
  luxury: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: {
    gold: '0 0 20px rgba(234, 179, 8, 0.4), 0 0 40px rgba(234, 179, 8, 0.2)',
    red: '0 0 20px rgba(220, 38, 38, 0.4), 0 0 40px rgba(220, 38, 38, 0.2)',
  },
}

export const borderRadius = {
  card: '24px',
  button: '16px',
  input: '12px',
  full: '9999px',
}

export const spacing = {
  section: '48px',
  card: '32px',
  element: '24px',
  compact: '16px',
}

export const animations = {
  transition: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

export const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
}

export const chartColors = {
  primary: ['#dc2626', '#eab308', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
  gradient: {
    gold: ['#fef9c3', '#fde047', '#eab308', '#ca8a04'],
    red: ['#fee2e2', '#fca5a5', '#ef4444', '#dc2626'],
    blue: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'],
  },
}


