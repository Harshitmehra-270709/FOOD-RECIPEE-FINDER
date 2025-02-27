import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { NavigationProps } from '@/navigation/types';
import { searchRecipes, searchByCuisine, searchByIngredients } from '@/services/api';
import { Recipe, isVegetarian, estimateCalories } from '@/types/recipe';
import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { Header } from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { colors, typography, spacing } from '@/theme';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const CATEGORIES = [
  { id: 'Indian', name: 'Indian', icon: '🇮🇳' },
  { id: 'Italian', name: 'Italian', icon: '🇮🇹' },
  { id: 'Mexican', name: 'Mexican', icon: '🇲🇽' },
  { id: 'American', name: 'American', icon: '🇺🇸' },
  { id: 'Chinese', name: 'Chinese', icon: '🇨🇳' },
  { id: 'Thai', name: 'Thai', icon: '🇹🇭' },
  { id: 'Japanese', name: 'Japanese', icon: '🇯🇵' },
  { id: 'French', name: 'French', icon: '🇫🇷' },
  { id: 'Greek', name: 'Greek', icon: '🇬🇷' },
  { id: 'Spanish', name: 'Spanish', icon: '🇪🇸' },
  { id: 'Turkish', name: 'Turkish', icon: '🇹🇷' },
  { id: 'Vietnamese', name: 'Vietnamese', icon: '🇻🇳' },
  { id: 'British', name: 'British', icon: '🇬🇧' },
];

// Add type for featured recipe
interface FeaturedRecipe extends Recipe {
  cuisine: string;
  cuisineIcon: string;
  ingredients: string[];
  steps: string[];
}

const formatInstructionStep = (step: string, index: number) => {
  return `${index + 1}. ${step.charAt(0).toUpperCase() + step.slice(1)}`;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Create a separate component for the featured recipe item
const FeaturedRecipeItem = React.memo(({ 
  item, 
  index, 
  onPress, 
  user, 
  isFavorite, 
  toggleFavorite 
}: { 
  item: FeaturedRecipe; 
  index: number;
  onPress: () => void;
  user: any;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchableOpacity
      entering={FadeInRight.delay(index * 200).springify()}
      style={[styles.featuredItem, animatedStyle]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Image
        source={{ uri: item.strMealThumb }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={500}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradientOverlay}
      />
      <View style={styles.featuredOverlay}>
        <Animated.View 
          entering={FadeInDown.delay(index * 300).springify()}
          style={styles.featuredCuisineTag}
        >
          <Text style={styles.cuisineIcon}>{item.cuisineIcon}</Text>
          <Text style={styles.cuisineName}>{item.cuisine}</Text>
        </Animated.View>
        <Animated.Text 
          entering={FadeInDown.delay(index * 400).springify()}
          style={styles.featuredTitle} 
          numberOfLines={2}
        >
          {item.strMeal}
        </Animated.Text>
        <Animated.View 
          entering={FadeInDown.delay(index * 500).springify()}
          style={styles.featuredDetails}
        >
          {item.isVegetarian && (
            <View style={[styles.badge, styles.vegBadge]}>
              <Ionicons name="leaf" size={18} color={colors.success} />
              <Text style={[styles.badgeText, styles.vegText]}>Vegetarian</Text>
            </View>
          )}
          <View style={[styles.badge, styles.caloriesBadge]}>
            <Ionicons name="flame" size={18} color={colors.warning} />
            <Text style={[styles.badgeText, styles.caloriesText]}>{item.calories || '~'} cal</Text>
          </View>
          <View style={[styles.badge, styles.stepsBadge]}>
            <Ionicons name="list" size={18} color={colors.info} />
            <Text style={[styles.badgeText, styles.stepsText]}>{item.steps.length} steps</Text>
          </View>
          <TouchableOpacity 
            style={styles.viewStepsButton}
            onPress={() => {
              Alert.alert(
                'Cooking Steps',
                item.steps.join('\n\n'),
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="book-outline" size={18} color={colors.text} />
            <Text style={styles.viewStepsText}>View Recipe</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {user && (
        <TouchableOpacity
          style={styles.featuredFavoriteButton}
          onPress={() => toggleFavorite(item.idMeal)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite(item.idMeal) ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite(item.idMeal) ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      )}
    </AnimatedTouchableOpacity>
  );
});

// Add this component before the HomeScreen component
const CategoryItem = React.memo(({ 
  item, 
  isSelected, 
  onSelect 
}: { 
  item: typeof CATEGORIES[0];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: isSelected 
      ? withSpring(colors.primary + '15', { damping: 15 })
      : withSpring(colors.white, { damping: 15 }),
    borderColor: isSelected 
      ? withSpring(colors.primary, { damping: 15 })
      : withSpring(colors.gray[300], { damping: 15 }),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1.1, { damping: 8 }),
      withSpring(1, { damping: 5 })
    );
    iconScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 5 })
    );
    onSelect(item.id);
  };

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(200).springify()}
      style={[
        styles.categoryItem,
        animatedStyle
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.Text 
        style={[
          styles.categoryIcon,
          iconAnimatedStyle
        ]}
      >
        {item.icon}
      </Animated.Text>
      <Animated.Text 
        style={[
          styles.categoryName,
          { 
            color: isSelected ? colors.primary : colors.text,
            fontWeight: isSelected ? '700' : '600'
          }
        ]}
      >
        {item.name}
      </Animated.Text>
    </AnimatedTouchable>
  );
});

export default function HomeScreen({ navigation }: NavigationProps) {
  const { user, toggleFavorite, isFavorite } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isSearchingByIngredients, setIsSearchingByIngredients] = useState(false);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRecipes();
    loadFeaturedRecipes();
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const estimateCookingTime = (instructions: string | undefined): string => {
    if (!instructions) return '30 min'; // Default cooking time if no instructions

    // Basic estimation based on instruction length and complexity
    const steps = instructions.split(/\n|\.|;/).filter(step => step.trim().length > 0).length;
    
    // Rough estimation: 2 minutes per step plus base time
    const baseTime = 10; // Base preparation time in minutes
    const timePerStep = 2;
    const estimatedMinutes = baseTime + (steps * timePerStep);
    
    if (estimatedMinutes < 30) return '30 min';
    if (estimatedMinutes < 60) return '45 min';
    if (estimatedMinutes < 90) return '1 hr';
    if (estimatedMinutes < 120) return '1.5 hrs';
    return '2+ hrs';
  };

  const loadRecipes = async (query = '') => {
    setLoading(true);
    try {
      const results = await searchRecipes(query);
      const validRecipes = results
        .filter(recipe => {
          const hasValidImage = recipe.strMealThumb && recipe.strMealThumb.startsWith('http');
          const isNotExcluded = !recipe.strMeal?.toLowerCase().includes('migas');
          const meetsVegetarianFilter = !showVegetarianOnly || isVegetarian(recipe);
          return hasValidImage && isNotExcluded && meetsVegetarianFilter;
        })
        .map(recipe => ({
          ...recipe,
          isVegetarian: isVegetarian(recipe),
          calories: estimateCalories(recipe),
          cookingTime: estimateCookingTime(recipe.strInstructions)
        }));

      setRecipes(validRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      Alert.alert(
        'Error',
        'Failed to load recipes. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedRecipes = async () => {
    try {
      setLoading(true);
      
      const featuredRecipePromises = CATEGORIES.map(category => 
        searchByCuisine(category.id)
      );

      const allCuisineRecipes = await Promise.all(featuredRecipePromises);
      
      const topRecipesPerCuisine = allCuisineRecipes.map((recipes, index) => {
        if (!recipes?.length) return null;

        const validRecipes = recipes
          .filter(recipe => 
            recipe?.strMealThumb && 
            recipe.strMealThumb.startsWith('http') &&
            !recipe.strMeal?.toLowerCase().includes('migas')
          )
          .map(recipe => {
            const ingredients: string[] = [];
            const measures: string[] = [];

            // Get all ingredients and measures
            for (let i = 1; i <= 20; i++) {
              const ingredient = recipe[`strIngredient${i}` as keyof typeof recipe];
              const measure = recipe[`strMeasure${i}` as keyof typeof recipe];
              
              if (ingredient && ingredient.trim()) {
                ingredients.push(ingredient.trim());
                measures.push(measure?.trim() || '');
              }
            }

            // Parse and format instructions into steps
            const instructions = recipe.strInstructions || '';
            const instructionSteps = instructions
              .split(/\r?\n|\r|\.|;/)
              .map(step => step.trim())
              .filter(step => step.length > 0 && !step.toLowerCase().includes('step'))
              .map((step, index) => formatInstructionStep(step, index));

            // Combine ingredients with measures
            const ingredientSteps = ingredients.map((ing, idx) => 
              `• ${measures[idx]} ${ing}`
            );

            return {
              ...recipe,
              cuisine: CATEGORIES[index].name,
              cuisineIcon: CATEGORIES[index].icon,
              isVegetarian: isVegetarian(recipe),
              calories: estimateCalories(recipe),
              cookingTime: estimateCookingTime(recipe.strInstructions),
              ingredients: ingredientSteps,
              steps: instructionSteps,
            };
          });

        if (!validRecipes.length) return null;
        const randomIndex = Math.floor(Math.random() * validRecipes.length);
        return validRecipes[randomIndex];
      }).filter(Boolean);

      setFeaturedRecipes(topRecipesPerCuisine);
    } catch (error) {
      console.error('Error loading featured recipes:', error);
      Alert.alert(
        'Error',
        'Failed to load featured recipes. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      loadRecipes(query);
      setSelectedCategory(null);
    }, 500); // 500ms debounce
    
    setSearchTimeout(timeout);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      handleClearSearch();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadRecipes(searchQuery),
        loadFeaturedRecipes()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert(
        'Error',
        'Failed to refresh recipes. Please try again.'
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchQuery('');
    setSelectedCategory(null);
    loadRecipes('');
  };

  const handleCategorySelect = async (categoryId: string) => {
    if (categoryId === selectedCategory) {
      // Unselect category and return to home state
      setSelectedCategory(null);
      setLoading(true);
      try {
        await loadRecipes('');
      } catch (error) {
        console.error('Error loading recipes:', error);
        Alert.alert(
          'Error',
          'Failed to load recipes. Please try again.'
        );
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setSelectedCategory(categoryId);
    setLoading(true);
    try {
      const results = await searchByCuisine(categoryId);
      if (!results || results.length === 0) {
        Alert.alert(
          'No Recipes Found',
          `No recipes found for ${categoryId} cuisine. Try another category.`
        );
        setSelectedCategory(null);
        return;
      }

      // Process recipes to include cooking time
      const processedResults = results.map(recipe => ({
        ...recipe,
        isVegetarian: isVegetarian(recipe),
        calories: estimateCalories(recipe),
        cookingTime: estimateCookingTime(recipe.strInstructions)
      }));

      setRecipes(processedResults);
    } catch (error) {
      console.error('Error loading category recipes:', error);
      Alert.alert(
        'Error',
        'Failed to load recipes for this category. Please try again.'
      );
      setSelectedCategory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleSearchByIngredients = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    setIsSearchingByIngredients(true);
    setSelectedCategory(null);
    setSearchQuery('');
    
    try {
      const results = await searchByIngredients(ingredients);
      const validRecipes = results
        .map(recipe => ({
          ...recipe,
          isVegetarian: isVegetarian(recipe),
          calories: estimateCalories(recipe)
        }))
        .filter(recipe => !showVegetarianOnly || recipe.isVegetarian);
      setRecipes(validRecipes);
    } catch (error) {
      console.error('Error searching by ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to reload recipes when vegetarian toggle changes
  useEffect(() => {
    if (isSearchingByIngredients) {
      handleSearchByIngredients();
    } else if (selectedCategory) {
      handleCategorySelect(selectedCategory);
    } else {
      loadRecipes(searchQuery);
    }
  }, [showVegetarianOnly]);

  const renderFeaturedRecipeItem = useCallback(({ item, index }: { item: FeaturedRecipe; index: number }) => (
    <FeaturedRecipeItem
      item={item}
      index={index}
      onPress={() => navigation.navigate('RecipeDetails', { 
        id: item.idMeal,
        ingredients: item.ingredients,
        steps: item.steps,
        title: item.strMeal,
        cuisine: item.cuisine,
        cuisineIcon: item.cuisineIcon,
      })}
      user={user}
      isFavorite={isFavorite}
      toggleFavorite={toggleFavorite}
    />
  ), [user, navigation, isFavorite, toggleFavorite]);

  const renderCategoryItem = useCallback(({ item }: { item: typeof CATEGORIES[0] }) => (
    <CategoryItem
      item={item}
      isSelected={selectedCategory === item.id}
      onSelect={handleCategorySelect}
    />
  ), [selectedCategory, handleCategorySelect]);

  const renderRecipeItem = useCallback(({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetails', { id: item.idMeal })}
      isFavorite={user ? isFavorite(item.idMeal) : undefined}
      onFavoritePress={user ? () => toggleFavorite(item.idMeal) : undefined}
    />
  ), [user, navigation, isFavorite, toggleFavorite]);

  const keyExtractor = useCallback((item: any) => item.idMeal || item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Vegetarian Only</Text>
            <Switch
              value={showVegetarianOnly}
              onValueChange={setShowVegetarianOnly}
              trackColor={{ false: colors.gray[300], true: colors.success }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Search by Ingredients</Text>
          <View style={styles.ingredientInputContainer}>
            <TextInput
              style={styles.ingredientInput}
              value={currentIngredient}
              onChangeText={setCurrentIngredient}
              placeholder="Enter an ingredient..."
              onSubmitEditing={handleAddIngredient}
            />
            <TouchableOpacity
              style={styles.addIngredientButton}
              onPress={handleAddIngredient}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          {ingredients.length > 0 && (
            <View style={styles.ingredientsList}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {ingredients.map((ingredient, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.ingredientChip}
                    onPress={() => handleRemoveIngredient(ingredient)}
                  >
                    <Text style={styles.ingredientChipText}>{ingredient}</Text>
                    <Text style={styles.removeIngredient}>×</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.searchIngredientsButton}
                onPress={handleSearchByIngredients}
              >
                <Text style={styles.searchIngredientsButtonText}>Find Recipes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>

        {!searchQuery && !selectedCategory && (
          <View style={styles.featuredContainer}>
            <Text style={styles.sectionTitle}>Featured Recipes</Text>
            {loading ? (
              <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
            ) : featuredRecipes.length > 0 ? (
              <FlatList
                data={featuredRecipes}
                renderItem={renderFeaturedRecipeItem}
                keyExtractor={keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
                snapToInterval={width - 40}
                decelerationRate="fast"
                pagingEnabled
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={3}
              />
            ) : (
              <Text style={styles.noRecipesText}>No featured recipes available</Text>
            )}
          </View>
        )}

        <View style={styles.recipesContainer}>
          <Text style={styles.sectionTitle}>
            {isSearchingByIngredients
              ? 'Recipes with Your Ingredients'
              : selectedCategory
              ? `${CATEGORIES.find(c => c.id === selectedCategory)?.name} Recipes`
              : searchQuery
              ? 'Search Results'
              : 'All Recipes'}
          </Text>
          {loading ? (
            <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
          ) : recipes.length === 0 ? (
            <Text style={styles.noRecipesText}>
              {isSearchingByIngredients
                ? 'No recipes found with all selected ingredients'
                : selectedCategory
                ? `No recipes found for ${selectedCategory} cuisine`
                : 'No recipes found'}
            </Text>
          ) : (
            <FlatList
              data={recipes}
              renderItem={renderRecipeItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.recipesList}
              scrollEnabled={false}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  searchContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  ingredientsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.5,
    paddingHorizontal: 16,
  },
  ingredientInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  ingredientInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  addIngredientButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '600',
  },
  ingredientsList: {
    marginTop: 12,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  ingredientChipText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  removeIngredient: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  searchIngredientsButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIngredientsButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  categoriesContainer: {
    marginTop: 32,
    paddingBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryItem: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
    minWidth: 110,
    borderWidth: 2,
    borderColor: colors.gray[300],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryName: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  featuredContainer: {
    marginTop: 32,
    paddingBottom: 24,
  },
  featuredList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  featuredItem: {
    width: width - 64,
    height: 300,
    marginHorizontal: 16,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    borderRadius: 32,
  },
  featuredCuisineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cuisineIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  cuisineName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  featuredTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginRight: 48,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  featuredDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  vegBadge: {
    backgroundColor: colors.success + '20',
  },
  vegText: {
    color: colors.success,
  },
  caloriesBadge: {
    backgroundColor: colors.warning + '20',
  },
  caloriesText: {
    color: colors.warning,
  },
  stepsBadge: {
    backgroundColor: colors.info + '20',
  },
  stepsText: {
    color: colors.info,
  },
  viewStepsButton: {
    backgroundColor: colors.white + 'F2',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  viewStepsText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  featuredFavoriteButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  recipesContainer: {
    marginTop: 32,
    paddingBottom: 32,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  recipesList: {
    padding: 16,
    alignItems: 'center',
  },
  loader: {
    padding: 24,
  },
  noRecipesText: {
    textAlign: 'center',
    color: colors.gray[600],
    fontSize: 16,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterLabel: {
    marginRight: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
}); 