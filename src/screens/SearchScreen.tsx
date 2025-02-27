import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { TabNavigationProps } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { EmptyState } from '@/components/EmptyState';
import { useApp } from '@/context/AppContext';
import { Recipe } from '@/types/app';
import { searchRecipes } from '@/services/api';

export default function SearchScreen({ navigation }: TabNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useApp();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setRecipes([]);
      return;
    }

    try {
      setLoading(true);
      const results = await searchRecipes(query);
      setRecipes(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetails', { id: item.idMeal })}
      isFavorite={isFavorite(item.idMeal)}
      onFavoritePress={() => toggleFavorite(item.idMeal)}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search recipes..."
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery ? (
        <EmptyState
          icon="search-off"
          title="No recipes found"
          message="Try different keywords or ingredients"
        />
      ) : (
        <EmptyState
          icon="search"
          title="Search recipes"
          message="Enter ingredients or recipe names to search"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: spacing.medium,
    gap: spacing.medium,
  },
}); 