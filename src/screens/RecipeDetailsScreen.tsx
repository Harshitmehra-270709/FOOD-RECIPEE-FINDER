import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NavigationProps } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { getRecipeById } from '../services/api';
import { Recipe, getRecipeIngredients } from '../types/recipe';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/theme';

export default function RecipeDetailsScreen({ route, navigation }: NavigationProps) {
  const { id } = route.params as { id: string };
  const { user, toggleFavorite, isFavorite } = useApp();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const data = await getRecipeById(id);
      if (data) {
        setRecipe(data);
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  const ingredients = getRecipeIngredients(recipe);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>

      <ScrollView>
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.image}
          contentFit="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{recipe.strMeal}</Text>
            {user && (
              <TouchableOpacity
                onPress={() => toggleFavorite(recipe.idMeal)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={isFavorite(recipe.idMeal) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite(recipe.idMeal) ? colors.primary : colors.text}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={styles.ingredient}>
              • {item.measure} {item.ingredient}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{recipe.strInstructions}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 16,
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
}); 