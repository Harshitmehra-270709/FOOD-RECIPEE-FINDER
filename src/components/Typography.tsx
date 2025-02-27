import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { typography, colors } from '@/theme';

interface TypographyProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const H1: React.FC<TypographyProps> = ({ children, style }) => (
  <Text style={[styles.h1, style]}>{children}</Text>
);

export const H2: React.FC<TypographyProps> = ({ children, style }) => (
  <Text style={[styles.h2, style]}>{children}</Text>
);

export const H3: React.FC<TypographyProps> = ({ children, style }) => (
  <Text style={[styles.h3, style]}>{children}</Text>
);

export const H4: React.FC<TypographyProps> = ({ children, style }) => (
  <Text style={[styles.h4, style]}>{children}</Text>
);

export const Body1: React.FC<TypographyProps> = ({ children, style }) => (
  <Text style={[styles.body1, style]}>{children}</Text>
);

export const Body2: React.FC<TypographyProps> = ({ children, style }) => (
  <Text style={[styles.body2, style]}>{children}</Text>
);

export const Caption: React.FC<TypographyProps> = ({ children, style }) => (
  <Text style={[styles.caption, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  h1: {
    fontSize: typography.sizes.h1,
    lineHeight: typography.lineHeights.h1,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  h2: {
    fontSize: typography.sizes.h2,
    lineHeight: typography.lineHeights.h2,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  h3: {
    fontSize: typography.sizes.h3,
    lineHeight: typography.lineHeights.h3,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  h4: {
    fontSize: typography.sizes.h4,
    lineHeight: typography.lineHeights.h4,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  body1: {
    fontSize: typography.sizes.body,
    lineHeight: typography.lineHeights.body,
    fontWeight: typography.weights.regular,
    color: colors.text,
  },
  body2: {
    fontSize: typography.sizes.caption,
    lineHeight: typography.lineHeights.caption,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: typography.sizes.small,
    lineHeight: typography.lineHeights.small,
    fontWeight: typography.weights.regular,
    color: colors.textTertiary,
  },
}); 