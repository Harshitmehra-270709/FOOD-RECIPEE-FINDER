import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { supabase } from '@/lib/supabase'

export const notificationService = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
  },

  async registerForPushNotifications() {
    const permissionGranted = await this.requestPermissions()
    if (!permissionGranted) return null

    const token = await Notifications.getExpoPushTokenAsync()
    return token.data
  },

  async saveUserToken(userId: string, token: string) {
    const { error } = await supabase
      .from('user_push_tokens')
      .upsert({ user_id: userId, token })

    if (error) throw error
  },

  async scheduleLocalNotification(title: string, body: string, trigger?: any) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null,
    })
  },

  async scheduleCookingTimer(recipeName: string, minutes: number) {
    const trigger = {
      seconds: minutes * 60,
    }

    return await this.scheduleLocalNotification(
      'Cooking Timer',
      `Time to check your ${recipeName}!`,
      trigger
    )
  }
} 