import React from 'react'
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert } from 'react-native'
import { NavigationProps } from '../navigation/types'
import { useApp } from '@/context/AppContext'
import { Header } from '../components/Header'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileScreen({ navigation }: NavigationProps) {
  const { user, signOut, pushNotificationSettings, updatePushNotificationSettings } = useApp()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigation.replace('Home')
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.')
    }
  }

  const renderSettingItem = (
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D1D1', true: '#FF6B6B' }}
        thumbColor={value ? '#FFF' : '#F4F4F4'}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <Header title="Profile" navigation={navigation} showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content}>
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#2C1810" />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          {renderSettingItem(
            'New Recipes',
            pushNotificationSettings.newRecipes,
            (value) => updatePushNotificationSettings({ newRecipes: value })
          )}
          {renderSettingItem(
            'Cooking Timers',
            pushNotificationSettings.cookingTimers,
            (value) => updatePushNotificationSettings({ cookingTimers: value })
          )}
          {renderSettingItem(
            'Favorite Updates',
            pushNotificationSettings.favoriteUpdates,
            (value) => updatePushNotificationSettings({ favoriteUpdates: value })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  content: {
    flex: 1,
  },
  userSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE3E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  email: {
    fontSize: 16,
    color: '#2C1810',
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#2C1810',
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}) 