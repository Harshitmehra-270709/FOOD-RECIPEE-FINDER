import React, { useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows, borderRadius } from '@/theme';

interface SearchBarProps extends TextInputProps {
  onSearch?: () => void;
  onClear?: () => void;
}

export function SearchBar({ onSearch, onClear, value, ...props }: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    if (onClear) {
      onClear();
      inputRef.current?.focus();
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      Keyboard.dismiss();
      onSearch();
    }
  };

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole="search"
      accessibilityLabel="Recipe search"
    >
      <View style={styles.searchSection}>
        <TouchableOpacity
          onPress={() => inputRef.current?.focus()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Focus search input"
        >
          <Ionicons 
            name="search" 
            size={20} 
            color={colors.gray[600]} 
            style={styles.searchIcon} 
          />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search recipes..."
          placeholderTextColor={colors.gray[500]}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          value={value}
          clearButtonMode="never"
          autoCapitalize="none"
          autoCorrect={false}
          importantForAutofill="no"
          accessible={true}
          accessibilityLabel="Search recipes input field"
          accessibilityHint="Enter text to search for recipes"
          {...props}
        />
        {value ? (
          <TouchableOpacity 
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            accessibilityHint="Double tap to clear the search text"
          >
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={colors.gray[600]} 
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    ...Platform.select({
      ios: {
        ...shadows.sm,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
}); 