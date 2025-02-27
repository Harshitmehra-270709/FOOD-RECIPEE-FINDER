export class IngredientProcessingModule {
  attributeValidateIngredients(ingredients: string[]): boolean {
    return ingredients.every(ingredient => {
      // Basic validation rules
      return (
        ingredient &&
        ingredient.trim().length > 0 &&
        !/[0-9]/.test(ingredient) // No numbers in ingredient names
      );
    });
  }

  processIngredients(ingredients: string[]): string[] {
    return ingredients
      .map(ingredient => ingredient.trim().toLowerCase())
      .filter(ingredient => ingredient.length > 0)
      .sort();
  }
} 