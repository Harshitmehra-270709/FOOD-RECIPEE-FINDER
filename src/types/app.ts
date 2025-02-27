import { User } from '@supabase/supabase-js'
import { NavigationProp, RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '@/navigation/types'

export interface Recipe {
  idMeal: string
  strMeal: string
  strInstructions: string
  strMealThumb: string
  strArea: string
  strCategory: string
  ingredients?: string[]
  measurements?: string[]
}

export interface PushNotificationSettings {
  newRecipes: boolean
  cookingTimers: boolean
  favoriteUpdates: boolean
}

export interface DeviceInfo {
  platform: 'ios' | 'android'
  orientation: 'portrait' | 'landscape'
  screenSize: {
    width: number
    height: number
  }
}

export interface AppContextType {
  user: User | null
  favorites: string[]
  toggleFavorite: (recipeId: string) => Promise<void>
  isFavorite: (recipeId: string) => boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isOffline: boolean
  pushNotificationSettings: PushNotificationSettings
  updatePushNotificationSettings: (settings: Partial<PushNotificationSettings>) => Promise<void>
  deviceInfo: DeviceInfo
}

export interface HeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  navigation: NavigationProp<RootStackParamList>
}

export interface RecipeCardProps {
  recipe: Recipe
  onPress: () => void
  isFavorite?: boolean
  onFavoritePress?: () => void
}

export interface OfflineAction {
  type: 'toggleFavorite'
  recipeId: string
  timestamp: string
} 