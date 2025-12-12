// Dark theme color palette
export const Colors = {
  // Primary colors
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',

  // Secondary colors
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',

  // Accent colors
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Dark theme backgrounds
  background: '#0F0F14',
  backgroundSecondary: '#1A1A24',
  backgroundTertiary: '#252532',
  card: '#1E1E2A',
  cardHover: '#2A2A3A',

  // Glass effect
  glass: 'rgba(30, 30, 42, 0.8)',
  glassBorder: 'rgba(124, 58, 237, 0.3)',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textDisabled: '#52525B',

  // Border colors
  border: '#2A2A3A',
  borderLight: '#3F3F50',
  borderPrimary: '#7C3AED',

  // Gradients
  gradientPrimary: ['#7C3AED', '#A78BFA'],
  gradientSecondary: ['#10B981', '#34D399'],
  gradientAccent: ['#F59E0B', '#FBBF24'],
  gradientDark: ['#1A1A24', '#0F0F14'],
};

// Spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Border radius
export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Typography
export const Typography = {
  fontFamily: 'System',
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};
