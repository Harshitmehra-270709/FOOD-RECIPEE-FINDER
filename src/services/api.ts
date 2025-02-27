import { Recipe } from '../types/recipe';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}

export async function searchByIngredient(ingredient: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching by ingredient:', error);
    return [];
  }
}

export async function searchByCuisine(cuisine: string): Promise<Recipe[]> {
  try {
    // Map cuisine names to match TheMealDB API format
    const cuisineMap: { [key: string]: string } = {
      'Korean': 'Korean',
      'Lebanese': 'Lebanese',
      'Chinese': 'Chinese',
      'British': 'British',
      'American': 'American',
      'French': 'French',
      'Greek': 'Greek',
      'Indian': 'Indian',
      'Italian': 'Italian',
      'Japanese': 'Japanese',
      'Mexican': 'Mexican',
      'Spanish': 'Spanish',
      'Thai': 'Thai',
      'Turkish': 'Turkish',
      'Vietnamese': 'Vietnamese'
    };

    // Convert cuisine name to lowercase for case-insensitive comparison
    const apiCuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1).toLowerCase();
    const response = await fetch(`${API_BASE_URL}/filter.php?a=${apiCuisine}`);
    const data = await response.json();
    
    if (!data.meals) {
      console.warn(`No recipes found for cuisine: ${cuisine}`);
      return [];
    }

    // Filter out recipes without valid images
    const validRecipes = data.meals.filter((recipe: Recipe) => 
      recipe.strMealThumb && 
      recipe.strMealThumb.startsWith('http') &&
      !recipe.strMeal.toLowerCase().includes('migas')
    );

    return validRecipes;
  } catch (error) {
    console.error('Error searching by cuisine:', error);
    return [];
  }
}

export async function searchByIngredients(ingredients: string[]): Promise<Recipe[]> {
  try {
    // TheMealDB API only supports searching one ingredient at a time
    // We'll search for each ingredient and find common recipes
    const recipePromises = ingredients.map(ingredient =>
      fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
        .then(res => res.json())
        .then(data => data.meals || [])
    );

    const results = await Promise.all(recipePromises);
    
    // Find recipes that contain all ingredients
    const recipeMap = new Map<string, number>();
    results.flat().forEach((recipe: Recipe) => {
      const count = recipeMap.get(recipe.idMeal) || 0;
      recipeMap.set(recipe.idMeal, count + 1);
    });

    // Filter recipes that have all ingredients
    const matchingRecipeIds = Array.from(recipeMap.entries())
      .filter(([_, count]) => count === ingredients.length)
      .map(([id]) => id);

    // Get full recipe details for matching recipes
    const detailedRecipes = await Promise.all(
      matchingRecipeIds.map(id => getRecipeById(id))
    );

    return detailedRecipes.filter((recipe): recipe is Recipe => 
      recipe !== null && 
      recipe.strMealThumb && 
      recipe.strMealThumb.startsWith('http')
    );
  } catch (error) {
    console.error('Error searching by ingredients:', error);
    return [];
  }
} 