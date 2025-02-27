export class Recipe {
  recipeId: string;
  name: string;
  ingredients: string[];
  instructions: string;
  cookTime: number;
  calories: number;
  rating: number;

  constructor(
    recipeId: string,
    name: string,
    ingredients: string[],
    instructions: string,
    cookTime: number,
    calories: number,
    rating: number = 0
  ) {
    this.recipeId = recipeId;
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.cookTime = cookTime;
    this.calories = calories;
    this.rating = rating;
  }

  displayRecipeDetails(): void {
    console.log({
      recipeId: this.recipeId,
      name: this.name,
      ingredients: this.ingredients,
      instructions: this.instructions,
      cookTime: this.cookTime,
      calories: this.calories,
      rating: this.rating
    });
  }
} 