import { NavigationProp, RouteProp } from '@react-navigation/native'

export type RootStackParamList = {
  MainTabs: undefined
  Auth: undefined
  SignUp: undefined
  ForgotPassword: undefined
  RecipeDetails: { id: string }
}

export type TabParamList = {
  HomeTab: undefined
  FavoritesTab: undefined
  ProfileTab: undefined
}

export type NavigationProps = {
  navigation: NavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, keyof RootStackParamList>
}

export type TabNavigationProps = {
  navigation: NavigationProp<TabParamList>
  route: RouteProp<TabParamList, keyof TabParamList>
} 