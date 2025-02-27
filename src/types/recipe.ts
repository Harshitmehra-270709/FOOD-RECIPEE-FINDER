export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  cookingTime?: string;
  calories?: number;
  isVegetarian?: boolean;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
  [key: string]: any;
}

export interface RecipeIngredient {
  ingredient: string;
  measure: string;
}

export function getRecipeIngredients(recipe: Recipe): RecipeIngredient[] {
  const ingredients: RecipeIngredient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
    const measure = recipe[`strMeasure${i}` as keyof Recipe];
    
    if (ingredient && measure && ingredient.trim() !== '' && measure.trim() !== '') {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure.trim(),
      });
    }
  }
  
  return ingredients;
}

// Helper function to determine if a recipe is vegetarian based on ingredients
export function isVegetarian(recipe: Recipe): boolean {
  const nonVegIngredients = [
    'chicken', 'beef', 'pork', 'lamb', 'fish', 'shrimp', 'prawn', 'meat',
    'bacon', 'ham', 'turkey', 'duck', 'veal', 'anchovy', 'gelatin'
  ];

  const ingredients = getRecipeIngredients(recipe).map(i => i.ingredient.toLowerCase());
  return !ingredients.some(ingredient => 
    nonVegIngredients.some(nonVeg => ingredient.includes(nonVeg))
  );
}

// Helper function to estimate calories (rough estimation)
export function estimateCalories(recipe: Recipe): number {
  const caloriesPerIngredient: { [key: string]: number } = {
    'rice': 130,
    'potato': 77,
    'chicken': 165,
    'beef': 250,
    'pork': 242,
    'fish': 206,
    'egg': 78,
    'milk': 42,
    'cheese': 113,
    'butter': 102,
    'oil': 120,
    'flour': 364,
    'sugar': 387,
    'bread': 265,
    'pasta': 131,
  };

  let totalCalories = 0;
  const ingredients = getRecipeIngredients(recipe);

  ingredients.forEach(({ ingredient, measure }) => {
    const lowerIngredient = ingredient.toLowerCase();
    Object.entries(caloriesPerIngredient).forEach(([key, calories]) => {
      if (lowerIngredient.includes(key)) {
        // Rough estimation based on measure
        const quantity = parseFloat(measure) || 1;
        totalCalories += calories * quantity;
      }
    });
  });

  // Return rounded estimate, minimum 100 calories
  return Math.max(Math.round(totalCalories / 4), 100);
} 