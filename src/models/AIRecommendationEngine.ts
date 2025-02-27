import { Recipe } from './Recipe';

export class AIRecommendationEngine {
  rankRecipes(recipes: Recipe[], ingredients: string[], userPreferences: Map<string, string>): Recipe[] {
    return recipes.sort((a, b) => {
      // Calculate match score based on ingredients
      const aScore = this.calculateIngredientMatchScore(a, ingredients);
      const bScore = this.calculateIngredientMatchScore(b, ingredients);

      // Consider user preferences
      const aPreferenceScore = this.calculatePreferenceScore(a, userPreferences);
      const bPreferenceScore = this.calculatePreferenceScore(b, userPreferences);

      // Combine scores
      return (bScore + bPreferenceScore) - (aScore + aPreferenceScore);
    });
  }

  learnUserData(recipes: Recipe[]): void {
    // Implementation for learning from user data
    console.log('Learning from user data:', recipes.length, 'recipes');
  }

  applyRecommendationAlgorithm(recipes: Recipe[], recipeIngredients: string[]): Recipe[] {
    // Basic recommendation algorithm
    return this.rankRecipes(recipes, recipeIngredients, new Map());
  }

  private calculateIngredientMatchScore(recipe: Recipe, ingredients: string[]): number {
    const matchCount = ingredients.filter(ingredient =>
      recipe.ingredients.some(ri => ri.toLowerCase().includes(ingredient.toLowerCase()))
    ).length;
    return matchCount / ingredients.length;
  }

  private calculatePreferenceScore(recipe: Recipe, preferences: Map<string, string>): number {
    let score = 0;
    preferences.forEach((value, key) => {
      // Add preference-based scoring logic here
      if (key === 'cuisine' && recipe.name.toLowerCase().includes(value.toLowerCase())) {
        score += 0.5;
      }
      // Add more preference checks as needed
    });
    return score;
  }
} 