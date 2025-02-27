import { supabase } from '@/lib/supabase'
import { Recipe } from '@/types/app'

export const recipeService = {
  async searchRecipes(query: string, filters: RecipeFilters = {}): Promise<Recipe[]> {
    let queryBuilder = supabase
      .from('recipes')
      .select('*')
      
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (filters.cookingTime) {
      queryBuilder = queryBuilder.lte('cooking_time', filters.cookingTime)
    }

    if (filters.servings) {
      queryBuilder = queryBuilder.eq('servings', filters.servings)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getUserRecipes(userId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

export interface RecipeFilters {
  cookingTime?: number
  servings?: number
} 