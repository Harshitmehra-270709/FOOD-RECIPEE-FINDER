import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'
import { NavigationProps } from '../navigation/types'
import { useApp } from '../context/AppContext'
import { Header } from '../components/Header'
import { RecipeCard } from '../components/RecipeCard'
import { getRecipeById } from '../services/api'
import { Recipe } from '../types/recipe'

export default function FavoritesScreen({ navigation }: NavigationProps) {
  const { user, favorites, toggleFavorite, isFavorite } = useApp()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavoriteRecipes()
  }, [favorites])

  const loadFavoriteRecipes = async () => {
    setLoading(true)
    try {
      const recipePromises = favorites.map(id => getRecipeById(id))
      const results = await Promise.all(recipePromises)
      setRecipes(results.filter((recipe): recipe is Recipe => recipe !== null))
    } catch (error) {
      console.error('Error loading favorite recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetails', { id: item.idMeal })}
      isFavorite={isFavorite(item.idMeal)}
      onFavoritePress={() => toggleFavorite(item.idMeal)}
    />
  )

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Favorites" navigation={navigation} />
        <View style={styles.centerContent}>
          <Text style={styles.message}>Please sign in to view your favorites</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Favorites" navigation={navigation} />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#FF6B6B" />
      ) : recipes.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.message}>No favorite recipes yet</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.recipesList}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipesList: {
    padding: 8,
  },
}) 