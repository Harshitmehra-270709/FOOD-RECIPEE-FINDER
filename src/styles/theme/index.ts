export * from './colors';
export * from './spacing';
export * from './typography';
export * from './animations';

// Base theme configuration
const colors = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  error: '#FF4646',
  success: '#4CAF50',
  warning: '#FFC107',
  accent: '#FFE3E3',
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#868E96',
    700: '#495057',
    800: '#343A40',
    900: '#212529'
  }
}

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
}

const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold'
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold'
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600'
  },
  body1: {
    fontSize: 16,
    lineHeight: 24
  },
  body2: {
    fontSize: 14,
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    lineHeight: 16
  }
}

const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 5
  }
}

const layout = {
  screenPadding: spacing.md,
  maxWidth: 1200
}

// Export theme object and its parts
export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  layout
}

// Export individual parts
export {
  colors,
  spacing,
  typography,
  shadows,
  layout
}

// Export theme type
export type Theme = typeof theme 