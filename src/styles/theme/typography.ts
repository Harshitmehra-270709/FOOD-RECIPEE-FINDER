import { Platform } from 'react-native';
import { colors } from './colors';

export const typography = {
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    caption: 14,
    small: 12,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    h1: 40,
    h2: 32,
    h3: 28,
    h4: 24,
    body: 24,
    caption: 20,
    small: 16,
  },
  fontFamily: Platform.select({
    ios: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto',
      bold: 'Roboto',
    },
  }),

  // Text styles
  heading1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: colors.text,
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
      },
    }),
  },
  heading2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: colors.text,
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
      },
    }),
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text,
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
      },
    }),
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text,
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
      },
    }),
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
      },
    }),
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textTertiary,
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
      },
    }),
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.white,
    fontFamily: Platform.select({
      ios: {
        medium: 'System',
      },
      android: {
        medium: 'Roboto',
      },
    }),
  },
}; 