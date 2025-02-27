import { Recipe } from './Recipe';

export class RecipeDatabase {
  private recipes: Recipe[] = [];

  queryRecipesByIngredients(ingredients: string[]): Recipe[] {
    return this.recipes.filter(recipe => 
      ingredients.every(ingredient => 
        recipe.ingredients.some(ri => ri.toLowerCase().includes(ingredient.toLowerCase()))
      )
    );
  }

  saveRecipeForUser(userId: string, recipeId: string): void {
    // Implementation would involve database operations
    console.log(`Saving recipe ${recipeId} for user ${userId}`);
  }

  contains(recipe: Recipe): boolean {
    return this.recipes.some(r => r.recipeId === recipe.recipeId);
  }

  addRecipe(recipe: Recipe): void {
    if (!this.contains(recipe)) {
      this.recipes.push(recipe);
    }
  }
} 