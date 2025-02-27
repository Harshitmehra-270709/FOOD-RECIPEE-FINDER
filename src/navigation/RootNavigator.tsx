import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useApp } from '@/context/AppContext'
import HomeScreen from '@/screens/HomeScreen'
import AuthScreen from '@/screens/AuthScreen'
import CreateRecipeScreen from '@/screens/CreateRecipeScreen'
import RecipeDetailsScreen from '@/screens/RecipeDetailsScreen'
import FavoritesScreen from '@/screens/FavoritesScreen'
import ProfileScreen from '@/screens/ProfileScreen'
import { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const { user } = useApp()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
            <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
} 