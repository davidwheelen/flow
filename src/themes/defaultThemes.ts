import { Theme } from '@/types/theme';

export const liquidGlassTheme: Theme = {
  id: 'liquid-glass',
  name: 'Liquid Glass',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    background: '#1a1a1a',
    surface: 'rgba(255, 255, 255, 0.1)',
    text: '#e0e0e0',
    textSecondary: '#a0a0a0',
  },
  glassEffect: {
    blur: 12,
    transparency: 0.1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
};

export const defaultThemes = {
  light: {
    id: 'light',
    name: 'Light Mode',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#ffffff',
      surface: 'rgba(0, 0, 0, 0.05)',
      text: '#1a1a1a',
      textSecondary: '#6b7280',
    },
    glassEffect: {
      blur: 8,
      transparency: 0.05,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#0a0a0a',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#e0e0e0',
      textSecondary: '#a0a0a0',
    },
    glassEffect: {
      blur: 10,
      transparency: 0.08,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
};
