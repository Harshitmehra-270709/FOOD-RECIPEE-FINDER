import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, typography, spacing } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  navigation: any;
}

export function Header({ title = 'Kitchen Chef', showBack, onBack, navigation }: HeaderProps) {
  const { user } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { paddingTop: Math.max(insets.top, StatusBar.currentHeight || 0) }
    ]}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.chefEmoji}>👨‍🍳</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {!user && (
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefEmoji: {
    fontSize: typography.h2,
    marginRight: spacing.xs,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.text,
  },
  rightSection: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  signInText: {
    color: colors.white,
    fontWeight: 'bold',
  },
}); 