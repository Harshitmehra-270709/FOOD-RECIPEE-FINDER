export class User {
  userId: string;
  name: string;
  email: string;
  savedRecipes: string[];

  constructor(userId: string, name: string, email: string) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.savedRecipes = [];
  }

  viewRecommendedRecipes(recipes: Recipe[]): void {
    console.log('Recommended Recipes:', recipes);
  }

  viewRecommendedRecipe(recipe: Recipe): void {
    recipe.displayRecipeDetails();
  }

  saveRecipe(recipeId: string): void {
    if (!this.savedRecipes.includes(recipeId)) {
      this.savedRecipes.push(recipeId);
    }
  }
} 