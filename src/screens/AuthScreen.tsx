import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { useApp } from '@/context/AppContext'
import { NavigationProps } from '../navigation/types'
import { colors, typography, spacing, shadows } from '../theme'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Ionicons } from '@expo/vector-icons'

export default function AuthScreen({ navigation }: NavigationProps) {
  const { signIn } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return false
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password')
      return false
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long')
      return false
    }
    return true
  }

  const handleSignIn = async () => {
    if (!validateInputs()) return

    setLoading(true)
    try {
      await signIn(email, password)
      navigation.replace('MainTabs')
    } catch (error: any) {
      let message = 'Failed to sign in. Please check your credentials.'
      if (error.message?.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please try again.'
      } else if (error.message?.includes('rate limited')) {
        message = 'Too many attempts. Please try again later.'
      }
      Alert.alert('Error', message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword')
  }

  const handleSignUp = () => {
    navigation.navigate('SignUp')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header navigation={navigation} title="Sign In" />
      
      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.gray[500]} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.gray[500]} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>

          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            onPress={handleSignIn}
            disabled={loading}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Create an Account"
            variant="outline"
            onPress={handleSignUp}
            disabled={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...Platform.select({
      ios: shadows.sm,
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
    fontSize: typography.body,
    color: colors.text,
  },
  forgotButton: {
    alignItems: 'center',
  },
  forgotText: {
    color: colors.primary,
    fontSize: typography.body,
  },
  footer: {
    gap: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.gray[500],
    fontSize: typography.caption,
  },
}) 