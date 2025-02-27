import { Recipe } from './Recipe';
import { IngredientProcessingModule } from './IngredientProcessingModule';
import { AIRecommendationEngine } from './AIRecommendationEngine';

export class UserInterface {
  private ingredientProcessor: IngredientProcessingModule;
  private recommendationEngine: AIRecommendationEngine;

  constructor() {
    this.ingredientProcessor = new IngredientProcessingModule();
    this.recommendationEngine = new AIRecommendationEngine();
  }

  displayInputFormat(): void {
    console.log(`
      Input Format Guidelines:
      - Enter ingredients separated by commas
      - Avoid numbers and special characters
      - Use common ingredient names
    `);
  }

  displayRecommendedRecipes(recipes: Recipe[]): void {
    console.log('Recommended Recipes:');
    recipes.forEach(recipe => recipe.displayRecipeDetails());
  }

  displaySavedConfirmation(recipeId: string): void {
    console.log(`Recipe ${recipeId} has been saved successfully!`);
  }

  sendIngredientsToSystem(ingredients: string[]): string[] {
    return this.ingredientProcessor.processIngredients(ingredients);
  }
} 